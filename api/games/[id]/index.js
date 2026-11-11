// GET /api/games/:id
// Returns the current state of one game.
// The [id] in the folder name tells Vercel this part of the URL is a variable.

import { getGameState, isValidGameId } from "../../_lib/games.js";
import { rejectMethod, sendError } from "../../_lib/http.js";

export default async function handler(req, res) {
  if (rejectMethod(req, res, ["GET"])) return;

  const { id } = req.query;
  if (!isValidGameId(id)) return sendError(res, 400, "That isn't a valid game id.");

  try {
    const game = await getGameState(id);
    if (!game) return sendError(res, 404, "Game not found.");
    return res.status(200).json(game);
  } catch (err) {
    console.error("Failed to load game:", err);
    return sendError(res, 500, "Could not load the game. Please try again.");
  }
}
