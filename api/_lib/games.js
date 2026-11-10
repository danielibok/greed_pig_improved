// Reading a game from the database in the shape the frontend needs.

import { sql } from "./db.js";

// Returns the full game (with its players), or null if it doesn't exist.
export async function getGameState(gameId) {
  const games = await sql`SELECT * FROM games WHERE id = ${gameId}`;
  if (games.length === 0) return null;
  const game = games[0];

  const players = await sql`
    SELECT seat, name, avatar, is_bot, score
    FROM players
    WHERE game_id = ${gameId}
    ORDER BY seat
  `;

  // Convert database column names (snake_case) to JavaScript style (camelCase).
  return {
    id: game.id,
    mode: game.mode,
    difficulty: game.difficulty,
    targetScore: game.target_score,
    status: game.status,
    currentSeat: game.current_seat,
    turnTotal: game.turn_total,
    winnerSeat: game.winner_seat,
    players: players.map((p) => ({
      seat: p.seat,
      name: p.name,
      avatar: p.avatar,
      isBot: p.is_bot,
      score: p.score,
    })),
  };
}

// Postgres UUIDs look like 8-4-4-4-12 hex characters.
// Checking the format first avoids sending junk to the database.
export function isValidGameId(id) {
  return (
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  );
}
