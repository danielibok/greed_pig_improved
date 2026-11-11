import { rollCategory, getRollPoints, sumScore, passTurn } from "./mechanic.js";

const s = {
  players: [
    { seat: 1, score: 0 },
    { seat: 2, score: 0 },
    { seat: 3, score: 0 },
  ],
  currentSeat: 2,
  turnTotal: 9,
};
console.log(passTurn(s)); // expect currentSeat 3, turnTotal 0
console.log(passTurn({ ...s, currentSeat: 3 })); // expect currentSeat 1 (wrap!)
