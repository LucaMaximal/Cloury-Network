import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { newsTable, insertNewsSchema } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { ListNewsQueryParams, CreateNewsBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/news", async (req, res) => {
  try {
    const parsed = ListNewsQueryParams.safeParse(req.query);
    const limit = parsed.success ? (parsed.data.limit ?? 10) : 10;
    const offset = parsed.success ? (parsed.data.offset ?? 0) : 0;

    const articles = await db
      .select()
      .from(newsTable)
      .orderBy(desc(newsTable.createdAt))
      .limit(limit)
      .offset(offset);

    res.json(articles);
  } catch (err) {
    req.log.error({ err }, "Failed to list news");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/news/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [article] = await db
      .select()
      .from(newsTable)
      .where(eq(newsTable.id, id));

    if (!article) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    res.json(article);
  } catch (err) {
    req.log.error({ err }, "Failed to get news");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/news", async (req, res) => {
  try {
    const parsed = CreateNewsBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const insert = insertNewsSchema.parse(parsed.data);
    const [article] = await db.insert(newsTable).values(insert).returning();

    res.status(201).json(article);
  } catch (err) {
    req.log.error({ err }, "Failed to create news");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
