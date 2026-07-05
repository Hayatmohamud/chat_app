const { neon } = require("@neondatabase/serverless");
require("dotenv").config();

function getNeonHttpUrl(databaseUrl) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in environment!");
  }
  const url = new URL(databaseUrl);
  url.hostname = url.hostname.replace("-pooler.", ".");
  return url.toString();
}

const sql = neon(getNeonHttpUrl(process.env.DATABASE_URL), {
  fetchOptions: {
    cache: "no-store",
  },
});

async function main() {
  try {
    console.log("Running query...");
    const result = await sql(
      `select "id", "name", "email", "email_verified", "image", "two_factor_enabled", "created_at", "updated_at" from "user" where "user"."email" = $1`,
      ["hayadmohamudhassan@gmail.com"]
    );
    console.log("Success! Result:", result);
  } catch (error) {
    console.error("Query failed with error:");
    console.error(error);
  }
}

main();
