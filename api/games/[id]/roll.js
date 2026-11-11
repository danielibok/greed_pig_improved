// POST /api/games/:id/roll
// Rolls the dice ON THE SERVER, so a player can't fake a roll from the browser.

import { randomInt } from "node:crypto";
import { applyRoll } from "../../../shared/game-rules.js";
import { loadGameForMove, saveMove } from "../../_lib/moves.js";
import { rejectMethod, sendError } from "../../_lib/http.js";

export default async function handler(req, res) {
  if (rejectMethod(req, res, ["POST"])) return;

  try {
    const { game, error, status } = await loadGameForMove(req.query.id);
    if (error) return sendError(res, status, error);

    // randomInt(1, 7) gives a whole number from 1 to 6. It uses the
    // operating system's secure random generator, not Math.random().
    const dice = randomInt(1, 7);
    const next = applyRoll(game, dice);

    const saved = await saveMove(game, next, { action: "roll", dice });
    if (!saved) return sendError(res, 409, "The game changed while you were rolling. Please try again.");

    return res.status(200).json({ dice, bust: next.bust, game: saved });
  } catch (err) {
    console.error("Roll failed:", err);
    return sendError(res, 500, "Could not roll the dice. Please try again.");
  }
}
