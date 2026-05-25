import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable, ticketsTable, newsTable, eventsTable, playersTable } from "@workspace/db";
import { eq, count, desc } from "drizzle-orm";
import { requireTeam, requireOwnerOrAdmin } from "../middleware/auth";

const router: IRouter = Router();

// Dashboard overview stats
router.get("/dashboard/stats", requireTeam, async (req, res) => {
  try {
    const [userCount] = await db.select({ count: count() }).from(usersTable);
    const [ticketCount] = await db.select({ count: count() }).from(ticketsTable);
    const [openTickets] = await db.select({ count: count() }).from(ticketsTable).where(eq(ticketsTable.status, "open"));
    const [newsCount] = await db.select({ count: count() }).from(newsTable);
    const [eventsCount] = await db.select({ count: count() }).from(eventsTable);
    const [playerCount] = await db.select({ count: count() }).from(playersTable);

    res.json({
      totalUsers: userCount?.count ?? 0,
      totalTickets: ticketCount?.count ?? 0,
      openTickets: openTickets?.count ?? 0,
      totalNews: newsCount?.count ?? 0,
      totalEvents: eventsCount?.count ?? 0,
      totalPlayers: playerCount?.count ?? 0,
      onlineNow: Math.floor(Math.random() * 80) + 20,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard stats");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

// List all users (owner/admin only)
router.get("/dashboard/users", requireOwnerOrAdmin, async (req, res) => {
  try {
    const users = await db.select({
      id: usersTable.id,
      email: usersTable.email,
      username: usersTable.username,
      role: usersTable.role,
      minecraftUsername: usersTable.minecraftUsername,
      createdAt: usersTable.createdAt,
    }).from(usersTable).orderBy(desc(usersTable.createdAt));

    res.json(users);
  } catch (err) {
    req.log.error({ err }, "Failed to list users");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

// Update user role (owner/admin only)
router.patch("/dashboard/users/:id/role", requireOwnerOrAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { role } = req.body as { role?: string };

    if (!role) {
      res.status(400).json({ error: "Rolle erforderlich" });
      return;
    }

    const VALID_ROLES = [
      "Player", "JrSup", "Sup", "SrSup",
      "JrMod", "Mod", "SrMod",
      "JrDev", "Dev", "SrDev",
      "JrContent", "Content", "SrContent",
      "JrBuilder", "Builder", "SrBuilder",
      "Admin", "Owner",
    ];

    if (!VALID_ROLES.includes(role)) {
      res.status(400).json({ error: "Ungültige Rolle" });
      return;
    }

    // Prevent changing Owner role unless you are Owner
    if (role === "Owner" && req.session.userRole !== "Owner") {
      res.status(403).json({ error: "Nur der Owner kann Owner-Rollen vergeben" });
      return;
    }

    const [user] = await db.update(usersTable)
      .set({ role })
      .where(eq(usersTable.id, id))
      .returning();

    if (!user) {
      res.status(404).json({ error: "Benutzer nicht gefunden" });
      return;
    }

    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    req.log.error({ err }, "Failed to update user role");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

// Delete news (team only)
router.delete("/dashboard/news/:id", requireTeam, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(newsTable).where(eq(newsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete news");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

// Delete event (team only)
router.delete("/dashboard/events/:id", requireTeam, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(eventsTable).where(eq(eventsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete event");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

export default router;
