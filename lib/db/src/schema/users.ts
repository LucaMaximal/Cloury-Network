import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  minecraftUsername: text("minecraft_username"),
  uuid: text("uuid"),
  role: text("role").notNull().default("Player"),
  bio: text("bio"),
  playtime: text("playtime").notNull().default("0"),
  kills: text("kills").notNull().default("0"),
  deaths: text("deaths").notNull().default("0"),
  coins: text("coins").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

export const TEAM_ROLES = [
  "JrSup", "Sup", "SrSup",
  "JrMod", "Mod", "SrMod",
  "JrDev", "Dev", "SrDev",
  "JrContent", "Content", "SrContent",
  "JrBuilder", "Builder", "SrBuilder",
  "Admin", "Owner",
] as const;

export function isTeamRole(role: string): boolean {
  return TEAM_ROLES.includes(role as typeof TEAM_ROLES[number]);
}
