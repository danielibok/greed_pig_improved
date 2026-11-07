// GET /api/health
// A simple "is the server alive?" endpoint.
// Vercel turns every file inside the /api folder into its own endpoint,
// so this file automatically becomes /api/health.

export default function handler(req, res) {
  // Only allow GET requests. Anything else gets a clear error.
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  // Reply with a small JSON object so we can see the server is working.
  return res.status(200).json({
    status: "ok",
    message: "Greedy Pig server is running",
    time: new Date().toISOString(),
  });
}
