// The rules of Greedy Pig, written as small "pure" functions.
// Pure means: they take the current state and return a NEW state,
// without touching the database or the screen. That makes them easy
// to test, and the same rules can be reused by the bot and the mechanic.
//
// A state looks like:
// {
//   status: "playing" | "finished",
//   targetScore: 100,
//   currentSeat: 0,      // whose turn it is
//   turnTotal: 0,        // points at risk this turn
//   winnerSeat: null,
//   players: [{ seat: 0, score: 0 }, { seat: 1, score: 0 }]
// }

// Whose turn is next? Goes round the table: 0, 1, 2, ... then back to 0.
export function nextSeat(state) {
  return (state.currentSeat + 1) % state.players.length;
}

// A player rolled `dice` (1 to 6).
// Rolling a 1 = "bust": lose this turn's points and the turn passes on.
// Anything else is added to the turn total, and the same player carries on.
export function applyRoll(state, dice) {
  if (dice === 1) {
    return { ...state, turnTotal: 0, currentSeat: nextSeat(state), lastRoll: dice, bust: true };
  }
  return { ...state, turnTotal: state.turnTotal + dice, lastRoll: dice, bust: false };
}

// The player banks their turn total.
// If that reaches the target score, they win and the game ends.
export function applyHold(state) {
  const players = state.players.map((p) =>
    p.seat === state.currentSeat ? { ...p, score: p.score + state.turnTotal } : p
  );
  const me = players.find((p) => p.seat === state.currentSeat);

  if (me.score >= state.targetScore) {
    return { ...state, players, turnTotal: 0, status: "finished", winnerSeat: me.seat };
  }
  return { ...state, players, turnTotal: 0, currentSeat: nextSeat(state) };
}
