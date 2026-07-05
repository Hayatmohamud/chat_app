import { requireSession, unauthorizedResponse } from "@/lib/auth/server";
import { db } from "@/lib/db/drizzle";
import { chat } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await requireSession();

  if (!session) {
    return unauthorizedResponse();
  }

  try {
    const chats = await db
      .select()
      .from(chat)
      .where(eq(chat.userId, session.user.id))
      .orderBy(desc(chat.updatedAt));

    return Response.json({ chats });
  } catch (error) {
    console.error("Failed to load chats:", error);
    return Response.json({ chats: [] });
  }
}
