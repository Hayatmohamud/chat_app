import { requireSession, unauthorizedResponse } from "@/lib/auth/server";
import { db } from "@/lib/db/drizzle";
import { message, chat } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  const session = await requireSession();
  if (!session) return unauthorizedResponse();

  const { chatId } = await params;

  const chatExists = await db
    .select({ id: chat.id })
    .from(chat)
    .where(and(eq(chat.id, chatId), eq(chat.userId, session.user.id)))
    .limit(1);

  if (chatExists.length === 0) {
    return Response.json({ messages: [] }, { status: 404 });
  }

  const messages = await db
    .select()
    .from(message)
    .where(eq(message.chatId, chatId))
    .orderBy(asc(message.createdAt));

  const uiMessages = messages.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.content,
    parts: [{ type: "text", text: m.content }],
  }));

  return Response.json({ messages: uiMessages });
}
