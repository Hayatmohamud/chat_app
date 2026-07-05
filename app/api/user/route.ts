import {
  requireSession,
  unauthorizedResponse,
} from "@/lib/auth/server";
import { db } from "@/lib/db/drizzle";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * DELETE /api/user
 * Permanently deletes the authenticated user and all cascade data
 * (chats, messages, generated images — handled by ON DELETE CASCADE in schema).
 */
export async function DELETE() {
  const session = await requireSession();
  if (!session) return unauthorizedResponse();

  try {
    await db.delete(user).where(eq(user.id, session.user.id));
    return Response.json({ success: true });
  } catch (err) {
    console.error("Failed to delete user:", err);
    return Response.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
