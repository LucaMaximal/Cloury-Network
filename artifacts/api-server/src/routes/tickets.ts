import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ticketsTable, usersTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireTeam } from "../middleware/auth";

const router: IRouter = Router();

// Create ticket (auth required)
router.post("/tickets", requireAuth, async (req, res) => {
  try {
    const { type, title, content } = req.body as { type?: string; title?: string; content?: string };

    if (!type || !title || !content) {
      res.status(400).json({ error: "Typ, Titel und Inhalt sind erforderlich" });
      return;
    }

    const VALID_TYPES = ["Support", "Bug", "Report"];
    if (!VALID_TYPES.includes(type)) {
      res.status(400).json({ error: "Ungültiger Ticket-Typ" });
      return;
    }

    const [ticket] = await db.insert(ticketsTable).values({
      userId: req.session.userId!,
      type,
      title,
      content,
      status: "open",
    }).returning();

    res.status(201).json(ticket);
  } catch (err) {
    req.log.error({ err }, "Failed to create ticket");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

// Get ticket by ID (owner or team)
router.get("/tickets/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Ungültige ID" });
      return;
    }

    const [ticket] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, id));
    if (!ticket) {
      res.status(404).json({ error: "Ticket nicht gefunden" });
      return;
    }

    const isOwner = ticket.userId === req.session.userId;
    const isTeamMember = req.session.userRole && req.session.userRole !== "Player";

    if (!isOwner && !isTeamMember) {
      res.status(403).json({ error: "Keine Berechtigung" });
      return;
    }

    res.json(ticket);
  } catch (err) {
    req.log.error({ err }, "Failed to get ticket");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

// Update ticket status (team only)
router.patch("/tickets/:id/status", requireTeam, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body as { status?: string };

    const VALID_STATUSES = ["open", "in_progress", "resolved", "closed"];
    if (!status || !VALID_STATUSES.includes(status)) {
      res.status(400).json({ error: "Ungültiger Status" });
      return;
    }

    const [ticket] = await db.update(ticketsTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(ticketsTable.id, id))
      .returning();

    if (!ticket) {
      res.status(404).json({ error: "Ticket nicht gefunden" });
      return;
    }

    res.json(ticket);
  } catch (err) {
    req.log.error({ err }, "Failed to update ticket status");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

// List all tickets (team only, for dashboard)
router.get("/tickets", requireTeam, async (req, res) => {
  try {
    const allTickets = await db.select({
      id: ticketsTable.id,
      userId: ticketsTable.userId,
      type: ticketsTable.type,
      title: ticketsTable.title,
      content: ticketsTable.content,
      status: ticketsTable.status,
      createdAt: ticketsTable.createdAt,
      updatedAt: ticketsTable.updatedAt,
      username: usersTable.username,
    })
    .from(ticketsTable)
    .leftJoin(usersTable, eq(ticketsTable.userId, usersTable.id))
    .orderBy(desc(ticketsTable.createdAt));

    res.json(allTickets);
  } catch (err) {
    req.log.error({ err }, "Failed to list tickets");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

export default router;
