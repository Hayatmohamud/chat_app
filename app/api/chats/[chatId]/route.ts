import { requireSession, unauthorizedResponse } from "@/lib/auth/server";
import { db } from "@/lib/db/drizzle";
import { chat, message } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  const session = await requireSession();
  if (!session) return unauthorizedResponse();

  const { chatId } = await params;
  const body = await req.json();

  if (body.title) {
    await db
      .update(chat)
      .set({ title: body.title })
      .where(and(eq(chat.id, chatId), eq(chat.userId, session.user.id)));
  }

  if (body.model) {
    await db
      .update(chat)
      .set({ model: body.model })
      .where(and(eq(chat.id, chatId), eq(chat.userId, session.user.id)));
  }

  return Response.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ chatId: string }> },
) {
  const session = await requireSession();
  if (!session) return unauthorizedResponse();

  const { chatId } = await params;

  await db
    .delete(message)
    .where(eq(message.chatId, chatId));

  await db
    .delete(chat)
    .where(and(eq(chat.id, chatId), eq(chat.userId, session.user.id)));

  return Response.json({ success: true });
}
