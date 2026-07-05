ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "two_factor_enabled" boolean DEFAULT false;

CREATE TABLE IF NOT EXISTS "twoFactor" (
  "id" text PRIMARY KEY NOT NULL,
  "secret" text NOT NULL,
  "backup_codes" text NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "verified" boolean DEFAULT true
);

CREATE INDEX IF NOT EXISTS "twoFactor_userId_idx" ON "twoFactor" ("user_id");
