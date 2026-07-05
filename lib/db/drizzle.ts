import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { schema } from "./schema";

config({ path: ".env" }); // or .env.local

function getNeonHttpUrl(databaseUrl: string) {
  const url = new URL(databaseUrl);
  url.hostname = url.hostname.replace("-pooler.", ".");
  return url.toString();
}

const sql = neon(getNeonHttpUrl(process.env.DATABASE_URL!), {
  fetchOptions: {
    cache: "no-store",
  },
});

export const db = drizzle({ client: sql, schema });
