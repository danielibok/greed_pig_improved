// Functions the game screens use to talk to our server (the /api folder).
// Each one sends a request and returns the server's reply as an object.
// If anything goes wrong, it throws an Error with a message that is safe
// to show to the player.

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`/api${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    // fetch only throws when the request never reached the server.
    throw new Error("Can't reach the server. Check your internet connection and try again.");
  }

  // Some errors (e.g. a crashed server) may not send JSON back, so don't crash on that.
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

// POST /api/games: start a new game. Returns the new game.
export function createGame({ mode, difficulty, targetScore, players }) {
  return request("/games", {
    method: "POST",
    body: JSON.stringify({ mode, difficulty, targetScore, players }),
  });
}

// POST /api/games/:id/roll: the server rolls the dice. Returns { dice, bust, game }.
export function rollDice(gameId) {
  return request(`/games/${gameId}/roll`, { method: "POST" });
}

// POST /api/games/:id/hold: bank the turn total. Returns { banked, game }.
export function holdTurn(gameId) {
  return request(`/games/${gameId}/hold`, { method: "POST" });
}

// GET /api/games/:id: the current state of a game.
export function getGame(gameId) {
  return request(`/games/${gameId}`);
}
