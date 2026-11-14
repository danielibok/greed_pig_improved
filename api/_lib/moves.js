// Shared code for endpoints that change a game (roll and hold).

import { sql } from "./db.js";
import { getGameState, isValidGameId } from "./games.js";

// Loads a game and checks a move is allowed right now.
// Returns { game } if it is, or { error, status } if it isn't.
export async function loadGameForMove(id) {
  if (!isValidGameId(id)) return { error: "That isn't a valid game id.", status: 400 };

  const game = await getGameState(id);
  if (!game) return { error: "Game not found.", status: 404 };
  if (game.status !== "playing") return { error: "This game is already over.", status: 409 };

  const current = game.players.find((p) => p.seat === game.currentSeat);
  if (current.isBot) return { error: "It's the computer's turn.", status: 409 };

  return { game };
}

// Saves the new state and records the move, all in ONE database statement,
// so it either fully happens or doesn't happen at all.
//
// The WHERE clause only updates the game if it still looks exactly like it
// did when we loaded it. If someone double-clicked and another request got
// there first, nothing is updated and we return null instead of saving twice.
export async function saveMove(before, after, { action, dice = null }) {
  const me = after.players.find((p) => p.seat === before.currentSeat);

  const rows = await sql`
    WITH updated_game AS (
      UPDATE games
      SET current_seat = ${after.currentSeat},
          turn_total   = ${after.turnTotal},
          status       = ${after.status},
          winner_seat  = ${after.winnerSeat},
          updated_at   = NOW()
      WHERE id = ${before.id}
        AND status = 'playing'
        AND current_seat = ${before.currentSeat}
        AND turn_total = ${before.turnTotal}
      RETURNING id
    ),
    updated_player AS (
      UPDATE players
      SET score = ${me.score}
      WHERE game_id IN (SELECT id FROM updated_game)
        AND seat = ${before.currentSeat}
      RETURNING id
    ),
    saved_move AS (
      INSERT INTO moves (game_id, seat, action, dice_value)
      SELECT id, ${before.currentSeat}, ${action}, ${dice} FROM updated_game
      RETURNING id
    )
    SELECT id FROM updated_game
  `;

  if (rows.length === 0) return null; // the game changed under us
  return getGameState(before.id);
}
