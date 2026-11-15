// Checks that both game modes go through shared/rules.js correctly.
// Run with: npm run test:rules
import assert from "node:assert/strict";
import { roll, hold, canHold, describeRoll } from "./rules.js";

const players = [{ seat: 0, score: 0 }, { seat: 1, score: 0 }];
const classicGame = { rules: "classic", status: "playing", targetScore: 50, currentSeat: 0, turnTotal: 0, winnerSeat: null, players };
const oddsGame = { ...classicGame, rules: "even-odds", specialEven: 4, specialOdd: 3 };

// Classic: a 6 scores 6, a 1 busts.
assert.equal(roll(classicGame, 6).turnTotal, 6);
assert.equal(roll(classicGame, 1).bust, true);

// Even out the Odds: the special even scores double...
assert.equal(roll(oddsGame, 4).turnTotal, 8);
assert.equal(describeRoll(oddsGame, 4), "double");
// ...the special odd takes points away (and can go below 0)...
assert.equal(roll(oddsGame, 3).turnTotal, -3);
assert.equal(canHold(roll(oddsGame, 3)), false);
// ...and both 1 and 6 bust, passing the turn.
for (const dice of [1, 6]) {
  const s = roll({ ...oddsGame, turnTotal: 10 }, dice);
  assert.equal(s.bust, true);
  assert.equal(s.turnTotal, 0);
  assert.equal(s.currentSeat, 1);
}
// Other numbers score normally.
assert.equal(roll(oddsGame, 2).turnTotal, 2);
assert.equal(roll(oddsGame, 5).bust, false);

// Holding banks the points and passes the turn.
let s = hold({ ...oddsGame, turnTotal: 12 });
assert.equal(s.players[0].score, 12);
assert.equal(s.currentSeat, 1);
assert.equal(s.status, "playing");

// Reaching the target in even-odds wins the game.
s = hold({ ...oddsGame, turnTotal: 50 });
assert.equal(s.status, "finished");
assert.equal(s.winnerSeat, 0);

console.log("All rules checks passed.");
