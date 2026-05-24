import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { eventsTable, insertEventSchema } from "@workspace/db";
import { desc } from "drizzle-orm";
import { CreateEventBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/events", async (req, res) => {
  try {
    const events = await db
      .select()
      .from(eventsTable)
      .orderBy(desc(eventsTable.date));

    res.json(events);
  } catch (err) {
    req.log.error({ err }, "Failed to list events");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/events", async (req, res) => {
  try {
    const parsed = CreateEventBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const insert = insertEventSchema.parse({ ...parsed.data, active: true });
    const [event] = await db.insert(eventsTable).values(insert).returning();

    res.status(201).json(event);
  } catch (err) {
    req.log.error({ err }, "Failed to create event");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
