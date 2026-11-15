import assert from "node:assert/strict";
import { decideMove } from "./bot.js";


function make(changes) {
  const base = {
    turnTotal: 10,
    myScore: 0,
    opponentScore: 0,
    targetScore: 100,
    difficulty: "medium",
  };
  return { ...base, ...changes };
}

const levels = ["easy", "medium", "hard"];

for (const level of levels) {
  
  assert.equal(decideMove(make({ difficulty: level, turnTotal: 0 })), "roll");

 
  assert.equal(decideMove(make({ difficulty: level, turnTotal: -3 })), "roll");

 
  assert.equal(
    decideMove(make({ difficulty: level, myScore: 95, turnTotal: 6 })),
    "hold"
  );
}


assert.equal(decideMove(make({ difficulty: "medium", turnTotal: 19 })), "roll");


assert.equal(decideMove(make({ difficulty: "medium", turnTotal: 20 })), "hold");


assert.equal(
  decideMove(make({ difficulty: "easy", turnTotal: 5 }), () => 0),
  "hold"
);


assert.equal(
  decideMove(make({ difficulty: "easy", turnTotal: 14 }), () => 0.99),
  "roll"
);


assert.equal(
  decideMove(make({ difficulty: "easy", turnTotal: 15 }), () => 0.99),
  "hold"
);


assert.equal(
  decideMove(
    make({ difficulty: "hard", myScore: 50, opponentScore: 0, turnTotal: 15 })
  ),
  "hold"
);


assert.equal(
  decideMove(
    make({ difficulty: "hard", myScore: 0, opponentScore: 50, turnTotal: 24 })
  ),
  "roll"
);


assert.equal(
  decideMove(
    make({ difficulty: "hard", myScore: 40, opponentScore: 85, turnTotal: 30 })
  ),
  "roll"
);


assert.equal(
  decideMove(make({ difficulty: "banana", turnTotal: 19 })),
  "roll"
);


assert.equal(
  decideMove(make({ difficulty: "banana", turnTotal: 20 })),
  "hold"
);

console.log("All bot tests passed");