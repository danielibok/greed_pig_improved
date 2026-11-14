import { pass, checkWinner, pickSpecialNumbers } from "./mechanic.js";

const passTest = {
  players: [
    { seat: 1, score: 10 },
    { seat: 2, score: 4 },
  ],
  currentSeat: 1,
  turnTotal: 6,
  specialEven: 4,
  specialOdd: 3,
  maxScore: 50,
};
console.log(pass(passTest));
// expect seat 1 score 16, currentSeat 2, turnTotal 0

try {
  pass({ ...passTest, turnTotal: 0 });
} catch (e) {
  console.log("Refused:", e.message);
}
// expect "Refused:" and the message

console.log(checkWinner(passTest)); // expect null
console.log(
  checkWinner({
    ...passTest,
    players: [
      { seat: 1, score: 10 },
      { seat: 2, score: 50 },
    ],
  }),
);
// expect 2

console.log(pickSpecialNumbers(passTest, () => 0)); // expect specialEven 2, specialOdd 3
console.log(pickSpecialNumbers(passTest, () => 0.99)); // expect specialEven 4, specialOdd 5
console.log(pickSpecialNumbers(passTest)); // random: even is 2 or 4, odd is 3 or 5
