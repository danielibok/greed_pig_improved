// Quick checks for the game rules. Run with: npm run test:rules
import assert from "node:assert/strict";
import { applyRoll, applyHold } from "./game-rules.js";

const start = {
  status: "playing",
  targetScore: 20,
  currentSeat: 0,
  turnTotal: 0,
  winnerSeat: null,
  players: [{ seat: 0, score: 0 }, { seat: 1, score: 0 }],
};

// Rolling a 4 adds 4 to the turn total, same player keeps going.
let s = applyRoll(start, 4);
assert.equal(s.turnTotal, 4);
assert.equal(s.currentSeat, 0);

// Rolling a 1 wipes the turn total and passes the turn.
s = applyRoll(s, 1);
assert.equal(s.turnTotal, 0);
assert.equal(s.currentSeat, 1);
assert.equal(s.bust, true);

// Holding banks the points and passes the turn.
s = applyHold(applyRoll(applyRoll(s, 6), 5)); // player 1 banks 11
assert.equal(s.players[1].score, 11);
assert.equal(s.currentSeat, 0);

// Reaching the target score wins the game.
s = applyHold(applyRoll(applyRoll(applyRoll(s, 6), 6), 6)); // player 0 banks 18
s = applyHold(applyRoll(applyRoll(s, 5), 5)); // player 1 reaches 21
assert.equal(s.status, "finished");
assert.equal(s.winnerSeat, 1);

// The original state was never changed (the functions are pure).
assert.equal(start.turnTotal, 0);

console.log("All game rule checks passed.");
