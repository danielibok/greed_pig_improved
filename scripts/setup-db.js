// Creates the database tables from db/schema.sql.
// Run with: npm run db:setup

import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Run `npx vercel env pull .env.local` first.");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const schema = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");

// Remove comment lines, then split the file into separate statements on ";"
// because the database runs one statement at a time.
const statements = schema
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
  console.log("OK:", statement.split("\n")[0]);
}

console.log("Database is ready.");
