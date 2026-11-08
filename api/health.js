// GET /api/health
// A simple "is the server alive?" endpoint.
// Vercel turns every file inside the /api folder into its own endpoint,
// so this file automatically becomes /api/health.

import { sql } from "./_lib/db.js";

export default async function handler(req, res) {
  // Only allow GET requests. Anything else gets a clear error.
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  // Also check we can reach the database.
  let database = "ok";
  try {
    await sql`SELECT 1`;
  } catch (err) {
    console.error("Database check failed:", err);
    database = "unreachable";
  }

  return res.status(database === "ok" ? 200 : 503).json({
    status: database === "ok" ? "ok" : "degraded",
    message: "Greedy Pig server is running",
    database,
    time: new Date().toISOString(),
  });
}
