import { Router, type IRouter } from "express";
import { GetServerStatusResponse, GetNetworkStatsResponse } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { newsTable, eventsTable, playersTable } from "@workspace/db";
import { count, sum } from "drizzle-orm";

const router: IRouter = Router();

router.get("/server/status", async (req, res) => {
  try {
    const data = GetServerStatusResponse.parse({
      online: true,
      playerCount: Math.floor(Math.random() * 80) + 20,
      maxPlayers: 500,
      version: "1.21.4",
      ping: Math.floor(Math.random() * 15) + 8,
      motd: "Cloury Network — Above the Limits",
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to get server status");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats/summary", async (req, res) => {
  try {
    const [newsCount] = await db.select({ count: count() }).from(newsTable);
    const [eventsCount] = await db.select({ count: count() }).from(eventsTable);
    const [playerStats] = await db.select({
      totalPlayers: count(),
      totalKills: sum(playersTable.kills),
      totalPlaytime: sum(playersTable.playtime),
    }).from(playersTable);

    const data = GetNetworkStatsResponse.parse({
      totalPlayers: playerStats?.totalPlayers ?? 0,
      onlineNow: Math.floor(Math.random() * 80) + 20,
      totalKills: Number(playerStats?.totalKills ?? 0),
      totalPlaytime: Number(playerStats?.totalPlaytime ?? 0),
      newsCount: newsCount?.count ?? 0,
      eventsCount: eventsCount?.count ?? 0,
    });
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Failed to get network stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
