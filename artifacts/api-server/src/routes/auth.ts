import { Router, type IRouter } from "express";
import bcrypt from "bcrypt";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/auth/register", async (req, res) => {
  try {
    const { email, username, password } = req.body as { email?: string; username?: string; password?: string };

    if (!email || !username || !password) {
      res.status(400).json({ error: "E-Mail, Benutzername und Passwort sind erforderlich" });
      return;
    }

    const emailLower = email.toLowerCase().trim();
    const usernameTrimmed = username.trim();

    if (password.length < 8) {
      res.status(400).json({ error: "Passwort muss mindestens 8 Zeichen lang sein" });
      return;
    }

    const [existingEmail] = await db.select().from(usersTable).where(eq(usersTable.email, emailLower));
    if (existingEmail) {
      res.status(409).json({ error: "E-Mail bereits registriert" });
      return;
    }

    const [existingUsername] = await db.select().from(usersTable).where(eq(usersTable.username, usernameTrimmed));
    if (existingUsername) {
      res.status(409).json({ error: "Benutzername bereits vergeben" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const [user] = await db.insert(usersTable).values({
      email: emailLower,
      username: usernameTrimmed,
      passwordHash,
      role: "Player",
    }).returning();

    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.username = user.username;

    res.status(201).json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    req.log.error({ err }, "Registration failed");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { login, password } = req.body as { login?: string; password?: string };

    if (!login || !password) {
      res.status(400).json({ error: "Benutzername/E-Mail und Passwort erforderlich" });
      return;
    }

    const loginLower = login.toLowerCase().trim();
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, loginLower));
    const userByUsername = !user
      ? (await db.select().from(usersTable).where(eq(usersTable.username, login.trim())))[0]
      : null;

    const foundUser = user ?? userByUsername;
    if (!foundUser) {
      res.status(401).json({ error: "Ungültige Anmeldedaten" });
      return;
    }

    const valid = await bcrypt.compare(password, foundUser.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Ungültige Anmeldedaten" });
      return;
    }

    req.session.userId = foundUser.id;
    req.session.userRole = foundUser.role;
    req.session.username = foundUser.username;

    res.json({
      id: foundUser.id,
      email: foundUser.email,
      username: foundUser.username,
      role: foundUser.role,
    });
  } catch (err) {
    req.log.error({ err }, "Login failed");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

router.post("/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) req.log.error({ err }, "Logout failed");
    res.clearCookie("cloury.sid");
    res.json({ ok: true });
  });
});

router.get("/auth/me", async (req, res) => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Nicht authentifiziert" });
    return;
  }
  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId));
    if (!user) {
      req.session.destroy(() => {});
      res.status(401).json({ error: "Benutzer nicht gefunden" });
      return;
    }
    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      bio: user.bio,
      minecraftUsername: user.minecraftUsername,
      createdAt: user.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get current user");
    res.status(500).json({ error: "Interner Serverfehler" });
  }
});

export default router;
