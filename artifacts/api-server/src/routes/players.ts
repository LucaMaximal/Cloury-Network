import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { playersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { GetPlayerParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/players/:username", async (req, res) => {
  try {
    const parsed = GetPlayerParams.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid username" });
      return;
    }

    const [player] = await db
      .select()
      .from(playersTable)
      .where(eq(playersTable.username, parsed.data.username));

    if (!player) {
      res.status(404).json({ error: "Player not found" });
      return;
    }

    res.json({
      username: player.username,
      uuid: player.uuid,
      role: player.role,
      bio: player.bio,
      playtime: player.playtime,
      kills: player.kills,
      deaths: player.deaths,
      coins: player.coins,
      createdAt: player.createdAt,
      achievements: [],
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get player");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
