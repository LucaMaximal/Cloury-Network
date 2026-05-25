import { Router, type IRouter } from "express";
import bcrypt from "bcrypt";
import { db } from "@workspace/db";
import { usersTable, ticketsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";

const router: IRouter = Router();

// Get own profile (authenticated)
router.get("/profile/me", requireAuth, async (req, res) => {
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId!));
    if (!user) {
      res.status(404).json({ error: "Benutzer nicht gefunden" });
      return;
    }
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      bio: user.bio,
      minecraftUsername: user.minecraftUsername,
      uuid: user.uuid,
      playtime: Number(user.playtime),
      kills: Number(user.kills),
      deaths: Number(user.deaths),
      coins: Number(user.coins),
      createdAt: user.createdAt,
      achievements: [],
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get own profile");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

// Update profile info
router.patch("/profile/me", requireAuth, async (req, res) => {
  try {
    const { bio, minecraftUsername } = req.body as { bio?: string; minecraftUsername?: string };
    const updates: Record<string, string> = {};
    if (bio !== undefined) updates.bio = bio;
    if (minecraftUsername !== undefined) updates.minecraftUsername = minecraftUsername;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "Keine Änderungen angegeben" });
      return;
    }

    const [user] = await db.update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, req.session.userId!))
      .returning();

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      bio: user.bio,
      minecraftUsername: user.minecraftUsername,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update profile");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

// Change password
router.patch("/profile/password", requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string };

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Aktuelles und neues Passwort erforderlich" });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: "Neues Passwort muss mindestens 8 Zeichen lang sein" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId!));
    if (!user) {
      res.status(404).json({ error: "Benutzer nicht gefunden" });
      return;
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) {
      res.status(400).json({ error: "Aktuelles Passwort ist falsch" });
      return;
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await db.update(usersTable).set({ passwordHash: newHash }).where(eq(usersTable.id, user.id));

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to change password");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

// Get tickets for the authenticated user
router.get("/profile/tickets", requireAuth, async (req, res) => {
  try {
    const tickets = await db.select().from(ticketsTable).where(eq(ticketsTable.userId, req.session.userId!));
    res.json(tickets);
  } catch (err) {
    req.log.error({ err }, "Failed to get own tickets");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

export default router;
