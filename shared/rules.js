// Picks the right set of rules for a game.
//
// "classic"   = the normal Greedy Pig rules (shared/game-rules.js).
// "even-odds" = Richard's "Even out the Odds" mode (shared/mechanic.js):
//               a special even number scores double, a special odd number
//               takes points away, and both 1 and 6 are busts.
//
// Both return a new state in the SAME shape, so the server endpoints and the
// computer player don't need to know which mode they're playing.

import * as classic from "./game-rules.js";
import * as evenOdds from "./mechanic.js";

export const RULES = ["classic", "even-odds"];

// What kind of roll was it? Used for the captions ("double!", "minus 3!").
export function describeRoll(state, dice) {
  if (state.rules === "even-odds") {
    return evenOdds.rollCategory(dice, state.specialEven, state.specialOdd);
  }
  return dice === 1 ? "bust" : "normal";
}

// A player rolled `dice`. Returns the new state, with bust: true if the turn was lost.
export function roll(state, dice) {
  if (state.rules !== "even-odds") return classic.applyRoll(state, dice);

  const category = describeRoll(state, dice);
  const next = evenOdds.applyRoll(state, dice);
  return { ...next, lastRoll: dice, bust: category === "bust", category };
}

// The player banks their turn total. Returns the new state, and ends the
// game if they've reached the target score.
export function hold(state) {
  if (state.rules !== "even-odds") return classic.applyHold(state);

  // Richard's functions call the target "maxScore", ours call it "targetScore".
  const banked = evenOdds.addToScore(state);
  const winner = evenOdds.checkWinner({ ...banked, maxScore: state.targetScore });
  if (winner !== null) {
    return { ...banked, turnTotal: 0, status: "finished", winnerSeat: winner };
  }
  return evenOdds.passTurn(banked);
}

// Holding is only allowed with points to bank (in even-odds the total can go below 0).
export function canHold(state) {
  return state.turnTotal > 0;
}

// Picks the special numbers for a new even-odds game.
export function pickSpecialNumbers(random) {
  return evenOdds.pickSpecialNumbers({}, random);
}
