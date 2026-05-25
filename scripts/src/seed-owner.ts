import bcrypt from "bcrypt";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

async function seedOwner() {
  const username = "LucaMaximal";
  const email = "luca@cloury.net";
  const password = "Cloury2024!";

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.username, username));
  if (existing) {
    console.log(`Owner account ${username} already exists (role: ${existing.role}). Ensuring Owner role...`);
    await db.update(usersTable).set({ role: "Owner" }).where(eq(usersTable.username, username));
    console.log("Role set to Owner.");
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db.insert(usersTable).values({
    username,
    email,
    passwordHash,
    role: "Owner",
    bio: "Gründer und Owner von Cloury Network. Above the Limits.",
  }).returning();

  console.log(`Owner account created: ${user.username} (${user.email}) — Role: ${user.role}`);
  process.exit(0);
}

seedOwner().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
