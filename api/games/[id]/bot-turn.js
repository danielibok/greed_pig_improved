// POST /api/games/:id/bot-turn
// Plays the computer's whole turn ON THE SERVER, so the bot can't be tampered with
// from the browser either. The bot's brain (shared/bot.js) decides "roll" or "hold";
// the server rolls the real dice and applies the game's rules after every step.
//
// Returns { steps, game }. steps lists every move in order, e.g.
//   [{ action: "roll", dice: 4, turnTotal: 4 }, { action: "roll", dice: 6, turnTotal: 10 },
//    { action: "hold", banked: 10, score: 42 }]
// so the game screen can replay the turn slowly for the players to follow.

import { randomInt } from "node:crypto";
import { decideMove } from "../../../shared/bot.js";
import { roll, hold, canHold } from "../../../shared/rules.js";
import { loadGameForMove, saveMove } from "../../_lib/moves.js";
import { rejectMethod, sendError } from "../../_lib/http.js";

// A safety net: no real turn gets close to this, but it guarantees the loop always ends.
const MAX_STEPS = 50;

export default async function handler(req, res) {
  if (rejectMethod(req, res, ["POST"])) return;

  try {
    const loaded = await loadGameForMove(req.query.id, { forComputer: true });
    if (loaded.error) return sendError(res, loaded.status, loaded.error);

    let game = loaded.game;
    const botSeat = game.currentSeat;
    const steps = [];

    while (steps.length < MAX_STEPS) {
      const me = game.players.find((p) => p.seat === botSeat);
      const others = game.players.filter((p) => p.seat !== botSeat);

      let move = decideMove({
        turnTotal: game.turnTotal,
        myScore: me.score,
        opponentScore: Math.max(...others.map((p) => p.score)),
        targetScore: game.targetScore,
        difficulty: game.difficulty,
      });
      // The rules always win over the bot: it can't hold without points to bank.
      if (move === "hold" && !canHold(game)) move = "roll";

      if (move === "hold") {
        const next = hold(game);
        const saved = await saveMove(game, next, { action: "hold" });
        if (!saved) return sendError(res, 409, "The game changed during the computer's turn.");
        steps.push({
          action: "hold",
          banked: game.turnTotal,
          score: saved.players.find((p) => p.seat === botSeat).score,
        });
        game = saved;
        break;
      }

      const dice = randomInt(1, 7);
      const next = roll(game, dice);
      const saved = await saveMove(game, next, { action: "roll", dice });
      if (!saved) return sendError(res, 409, "The game changed during the computer's turn.");
      steps.push({
        action: "roll",
        dice,
        bust: next.bust,
        category: next.category ?? null,
        turnTotal: next.bust ? 0 : saved.turnTotal,
      });
      game = saved;
      if (next.bust) break; // a bust ends the turn
    }

    return res.status(200).json({ steps, game });
  } catch (err) {
    console.error("Computer turn failed:", err);
    return sendError(res, 500, "The computer couldn't take its turn. Please try again.");
  }
}
