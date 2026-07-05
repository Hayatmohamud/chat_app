import { convertToModelMessages, streamText, stepCountIs, tool } from "ai";
import type { UIMessage } from "ai";
import { z } from "zod";

import { openrouter } from "@/lib/ai/provider";
import { DEFAULT_MODEL_ID, getModelById } from "@/lib/ai/models";
import { systemPrompt } from "@/lib/ai/system-prompt";
import {
  requireSession,
  unauthorizedResponse,
  validationErrorResponse,
} from "@/lib/auth/server";
import { db } from "@/lib/db/drizzle";
import { chat, message } from "@/lib/db/schema";
import { calculate } from "@/lib/tools/calculator";
import { getWeather } from "@/lib/tools/weather";
import { getJoke } from "@/lib/tools/joke";
import { getCurrentTime } from "@/lib/ai/tools/time";
import { webSearch } from "@/lib/ai/tools/web-search";
import { and, eq } from "drizzle-orm";

const chatRequestSchema = z.object({
  messages: z.array(z.unknown()).min(1, "Messages are required"),
  chatId: z.string().optional(),
  model: z.string().optional(),
});

function getLatestUserText(messages: UIMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return "";
  return lastUser.parts
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((p: any) => p.type === "text")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((p: any) => p.text ?? "")
    .join("\n")
    .trim();
}

export async function POST(req: Request) {
  const session = await requireSession();

  if (!session) {
    return unauthorizedResponse("Sign in to use chat.");
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return Response.json(
      { error: "OPENROUTER_API_KEY is missing." },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return validationErrorResponse("Invalid JSON body.");
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return validationErrorResponse("Invalid chat request.", parsed.error.flatten());
  }

  const { messages: rawMessages, chatId, model } = parsed.data;

  // Cast to UIMessage[] — useChat always sends valid UIMessages
  const uiMessages = rawMessages as UIMessage[];
  const latestUserText = getLatestUserText(uiMessages);
  const activeModel = getModelById(model ?? DEFAULT_MODEL_ID).id;
  const title =
    latestUserText.length > 80
      ? `${latestUserText.substring(0, 80)}...`
      : latestUserText || "New chat";
  const now = new Date();

  if (chatId) {
    try {
      await db
        .insert(chat)
        .values({
          id: chatId,
          title,
          model: activeModel,
          userId: session.user.id,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing();
    } catch (err) {
      console.error("[chat] Failed to create chat:", err);
      return Response.json(
        { error: "Unable to save chat history." },
        { status: 500 },
      );
    }
  }

  const weatherTool = tool({
    description: "Get current weather information for a city.",
    inputSchema: z.object({
      city: z.string().describe("The city name"),
    }),
    execute: async ({ city }) => getWeather(city),
  });

  const calculatorTool = tool({
    description: "Calculate simple arithmetic with two numbers.",
    inputSchema: z.object({
      a: z.number(),
      b: z.number(),
      operation: z.enum(["+", "-", "*", "/"]),
    }),
    execute: async ({ a, b, operation }) => ({
      expression: `${a} ${operation} ${b}`,
      result: calculate(a, b, operation),
    }),
  });

  const jokeTool = tool({
    description: "Get a short random joke.",
    inputSchema: z.object({}),
    execute: async () => getJoke(),
  });

  const timeTool = tool({
    description: "Get the current date and time.",
    inputSchema: z.object({}),
    execute: async () => getCurrentTime(),
  });

  const webSearchTool = tool({
    description: "Search the internet for information on any topic.",
    inputSchema: z.object({
      query: z.string().describe("The search query"),
    }),
    execute: async ({ query }) => webSearch(query),
  });

  console.log("[chat] Using model:", activeModel, "| chatId:", chatId);

  try {
    const result = streamText({
      model: openrouter(activeModel),
      system: systemPrompt,
      messages: await convertToModelMessages(uiMessages),
      maxOutputTokens: 4096,
      temperature: 0.7,
      stopWhen: stepCountIs(3),
      toolChoice: "auto",
      tools: {
        weather: weatherTool,
        calculator: calculatorTool,
        joke: jokeTool,
        currentTime: timeTool,
        webSearch: webSearchTool,
      },
      onError: (err) => {
        console.error("[chat] streamText onError:", JSON.stringify(err, null, 2));
      },
      onFinish: async ({ text }) => {
        if (chatId) {
          try {
            await db
              .update(chat)
              .set({ title, model: activeModel, updatedAt: new Date() })
              .where(and(eq(chat.id, chatId), eq(chat.userId, session.user.id)));

            await db.insert(message).values([
              {
                id: crypto.randomUUID(),
                chatId,
                role: "user",
                content: latestUserText,
              },
              {
                id: crypto.randomUUID(),
                chatId,
                role: "assistant",
                content: text,
              },
            ]);
          } catch (err) {
            console.error("[chat] Failed to save chat:", err);
          }
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("[chat] streamText threw:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
