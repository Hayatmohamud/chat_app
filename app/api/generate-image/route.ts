import { requireSession, unauthorizedResponse } from "@/lib/auth/server";
import { db } from "@/lib/db/drizzle";
import { generatedImage } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { generateImage } from "@/lib/ai/tools/image-gen";
import { z } from "zod";

const requestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(500),
});

export async function POST(req: Request) {
  const session = await requireSession();
  if (!session) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { prompt } = parsed.data;
  const result = await generateImage(prompt);

  if (result.success && result.imageUrl) {
    try {
      await db.insert(generatedImage).values({
        id: crypto.randomUUID(),
        prompt,
        imageUrl: result.imageUrl,
        model: "pollinations",
        userId: session.user.id,
      });
    } catch (err) {
      console.error("Failed to save image:", err);
    }
  }

  return Response.json(result);
}

export async function GET() {
  const session = await requireSession();
  if (!session) return unauthorizedResponse();

  try {
    const images = await db
      .select()
      .from(generatedImage)
      .where(eq(generatedImage.userId, session.user.id))
      .orderBy(desc(generatedImage.createdAt))
      .limit(50);

    return Response.json({ images });
  } catch {
    return Response.json({ images: [] });
  }
}
