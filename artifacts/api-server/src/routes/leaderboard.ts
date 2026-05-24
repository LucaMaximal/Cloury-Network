import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { playersTable } from "@workspace/db";
import { desc, asc } from "drizzle-orm";
import { GetLeaderboardQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/leaderboard", async (req, res) => {
  try {
    const parsed = GetLeaderboardQueryParams.safeParse(req.query);
    const category = parsed.success ? (parsed.data.category ?? "kills") : "kills";
    const limit = parsed.success ? (parsed.data.limit ?? 20) : 20;

    const ALLOWED_CATEGORIES = ["kills", "coins", "playtime"] as const;
    type Category = typeof ALLOWED_CATEGORIES[number];
    const safeCategory: Category = ALLOWED_CATEGORIES.includes(category as Category)
      ? (category as Category)
      : "kills";

    const columnMap: Record<Category, typeof playersTable.kills> = {
      kills: playersTable.kills,
      coins: playersTable.coins,
      playtime: playersTable.playtime,
    };

    const col = columnMap[safeCategory];

    const players = await db
      .select()
      .from(playersTable)
      .orderBy(desc(col))
      .limit(limit);

    const entries = players.map((p, i) => ({
      rank: i + 1,
      username: p.username,
      uuid: p.uuid,
      value: p[safeCategory],
      category: safeCategory,
    }));

    res.json(entries);
  } catch (err) {
    req.log.error({ err }, "Failed to get leaderboard");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
