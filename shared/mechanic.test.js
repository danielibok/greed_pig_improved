import {
  applyRoll
} from "./mechanic.js";

const rollTest = {
  players: [{ seat: 1, score: 0 }, { seat: 2, score: 0 }],
  currentSeat: 1,
  turnTotal: 5,
  specialEven: 4,
  specialOdd: 3
};
console.log(applyRoll(rollTest, 4)); // expect turnTotal 13 (5 + 8)
console.log(applyRoll(rollTest, 3)); // expect turnTotal 2  (5 - 3)
console.log(applyRoll(rollTest, 2)); // expect turnTotal 7  (5 + 2)
console.log(applyRoll(rollTest, 1)); // expect turnTotal 0, currentSeat 2