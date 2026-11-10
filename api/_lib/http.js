// Small helpers shared by the API endpoints.

// Send a JSON error in the same shape every time: { error: "message" }
export function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

// Reject any HTTP method we don't support (e.g. a GET on a POST-only endpoint).
// Returns true if the request was rejected, so the caller can stop.
export function rejectMethod(req, res, allowed) {
  if (allowed.includes(req.method)) return false;
  res.setHeader("Allow", allowed.join(", "));
  sendError(res, 405, `Method not allowed. Use ${allowed.join(" or ")}.`);
  return true;
}
