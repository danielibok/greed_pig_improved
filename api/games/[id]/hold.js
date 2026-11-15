// POST /api/games/:id/hold
// Banks the current turn total for the player whose turn it is.

import { hold, canHold } from "../../../shared/rules.js";
import { loadGameForMove, saveMove } from "../../_lib/moves.js";
import { rejectMethod, sendError } from "../../_lib/http.js";

export default async function handler(req, res) {
  if (rejectMethod(req, res, ["POST"])) return;

  try {
    const { game, error, status } = await loadGameForMove(req.query.id);
    if (error) return sendError(res, status, error);

    // You need points to bank. In "Even out the Odds" the turn total can even be below 0.
    if (!canHold(game)) {
      return sendError(res, 400, "You can only hold when your turn total is above 0. Roll first.");
    }

    const next = hold(game);

    const saved = await saveMove(game, next, { action: "hold" });
    if (!saved) return sendError(res, 409, "The game changed while you were holding. Please try again.");

    return res.status(200).json({ banked: game.turnTotal, game: saved });
  } catch (err) {
    console.error("Hold failed:", err);
    return sendError(res, 500, "Could not hold. Please try again.");
  }
}
