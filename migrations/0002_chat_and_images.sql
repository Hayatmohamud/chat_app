CREATE TABLE IF NOT EXISTS "chat" (
  "id" text PRIMARY KEY NOT NULL,
  "title" text DEFAULT 'New chat' NOT NULL,
  "model" text DEFAULT 'openai/gpt-oss-20b:free' NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "chat" ADD COLUMN IF NOT EXISTS "title" text DEFAULT 'New chat' NOT NULL;
ALTER TABLE "chat" ADD COLUMN IF NOT EXISTS "model" text DEFAULT 'openai/gpt-oss-20b:free' NOT NULL;
ALTER TABLE "chat" ADD COLUMN IF NOT EXISTS "user_id" text;
ALTER TABLE "chat" ADD COLUMN IF NOT EXISTS "created_at" timestamp DEFAULT now() NOT NULL;
ALTER TABLE "chat" ADD COLUMN IF NOT EXISTS "updated_at" timestamp DEFAULT now() NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chat_user_id_user_id_fk'
  ) THEN
    ALTER TABLE "chat"
      ADD CONSTRAINT "chat_user_id_user_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "chat_userId_idx" ON "chat" ("user_id");

CREATE TABLE IF NOT EXISTS "message" (
  "id" text PRIMARY KEY NOT NULL,
  "chat_id" text NOT NULL REFERENCES "chat"("id") ON DELETE CASCADE,
  "role" text NOT NULL,
  "content" text NOT NULL,
  "tool_invocations" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "message_chatId_idx" ON "message" ("chat_id");

CREATE TABLE IF NOT EXISTS "generated_image" (
  "id" text PRIMARY KEY NOT NULL,
  "prompt" text NOT NULL,
  "image_url" text NOT NULL,
  "model" text,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "generatedImage_userId_idx" ON "generated_image" ("user_id");
