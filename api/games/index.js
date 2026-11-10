// POST /api/games
// Starts a new game and saves it in the database.
//
// Example request body:
// {
//   "mode": "friends",                 // "friends" or "computer"
//   "difficulty": null,                // "easy" | "medium" | "hard" (computer games only)
//   "targetScore": 100,                // points needed to win (25 to 1000)
//   "players": [
//     { "name": "Daniel", "pigIndex": 0 },
//     { "name": "Tobi",   "pigIndex": 3 }
//   ]
// }

import { randomUUID } from "node:crypto";
import { sql } from "../_lib/db.js";
import { getGameState } from "../_lib/games.js";
import { rejectMethod, sendError } from "../_lib/http.js";

const MODES = ["friends", "computer"];
const DIFFICULTIES = ["easy", "medium", "hard"];
const MAX_PLAYERS = 6;
const MAX_NAME_LENGTH = 20;
const PIG_COUNT = 29; // pig-0.png to pig-28.png in src/assets

// Checks the request body. Returns an error message, or null if it's valid.
function validate(body) {
  if (!body || typeof body !== "object") return "Request body must be JSON.";

  const { mode, difficulty, targetScore, players } = body;

  if (!MODES.includes(mode)) return `mode must be one of: ${MODES.join(", ")}.`;

  if (mode === "computer" && !DIFFICULTIES.includes(difficulty)) {
    return `difficulty must be one of: ${DIFFICULTIES.join(", ")}.`;
  }

  if (!Number.isInteger(targetScore) || targetScore < 25 || targetScore > 1000) {
    return "targetScore must be a whole number between 25 and 1000.";
  }

  if (!Array.isArray(players)) return "players must be a list.";

  // Against the computer there is exactly one human; the bot is added for you.
  if (mode === "computer" && players.length !== 1) {
    return "A computer game needs exactly 1 human player.";
  }
  if (mode === "friends" && (players.length < 2 || players.length > MAX_PLAYERS)) {
    return `A friends game needs between 2 and ${MAX_PLAYERS} players.`;
  }

  for (const [i, p] of players.entries()) {
    const name = typeof p?.name === "string" ? p.name.trim() : "";
    if (name.length === 0 || name.length > MAX_NAME_LENGTH) {
      return `Player ${i + 1} needs a name between 1 and ${MAX_NAME_LENGTH} characters.`;
    }
    if (
      p.pigIndex !== undefined &&
      (!Number.isInteger(p.pigIndex) || p.pigIndex < 0 || p.pigIndex >= PIG_COUNT)
    ) {
      return `Player ${i + 1} has an invalid pig picture.`;
    }
  }

  return null;
}

export default async function handler(req, res) {
  if (rejectMethod(req, res, ["POST"])) return;

  const problem = validate(req.body);
  if (problem) return sendError(res, 400, problem);

  const { mode, targetScore } = req.body;
  const difficulty = mode === "computer" ? req.body.difficulty : null;

  // Build the player list. In a computer game, the bot always sits in seat 1.
  const players = req.body.players.map((p, seat) => ({
    seat,
    name: p.name.trim(),
    avatar: p.pigIndex === undefined ? null : String(p.pigIndex),
    isBot: false,
  }));
  if (mode === "computer") {
    players.push({ seat: 1, name: "Computer", avatar: null, isBot: true });
  }

  const gameId = randomUUID();

  try {
    // A transaction saves the game and all its players together:
    // either everything is saved, or nothing is.
    await sql.transaction([
      sql`
        INSERT INTO games (id, mode, difficulty, target_score)
        VALUES (${gameId}, ${mode}, ${difficulty}, ${targetScore})
      `,
      ...players.map(
        (p) => sql`
          INSERT INTO players (game_id, seat, name, avatar, is_bot)
          VALUES (${gameId}, ${p.seat}, ${p.name}, ${p.avatar}, ${p.isBot})
        `
      ),
    ]);

    const game = await getGameState(gameId);
    return res.status(201).json(game);
  } catch (err) {
    console.error("Failed to create game:", err);
    return sendError(res, 500, "Could not start the game. Please try again.");
  }
}
