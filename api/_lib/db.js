// Shared database connection used by every API endpoint.
// Files and folders starting with "_" inside /api are NOT turned into
// endpoints by Vercel, so this is a safe place for helper code.

import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is missing. Run `npx vercel env pull .env.local` to download it."
  );
}

// `sql` lets us run queries like: await sql`SELECT * FROM games`
// Values put inside ${...} are sent separately from the query text,
// which protects us from SQL injection.
export const sql = neon(process.env.DATABASE_URL);
