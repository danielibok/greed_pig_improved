// returns type of a roll : a bust (1 / 6),
// special odd number ( minus points)
// or special even number (double points)
export function rollCategory(roll, specialEven, specialOdd) {
  if (roll === 1 || roll === 6) {
    return "bust";
  } else if (roll === specialEven) {
    return "double";
  } else if (roll === specialOdd) {
    return "negative";
  } else {
    return "normal";
  }
}

//this function gets the multiplier value for each roll category
// and multiplies the roll to get the final roll points
export function getRollPoints(roll, category) {
  if (category === "bust") {
    return 0;
  } else if (category === "double") {
    let muliplier = 2;
    return roll * muliplier;
  } else if (category === "negative") {
    let muliplier = -1;
    return roll * muliplier;
  } else {
    return roll;
  }
}

//sumScore adds the rollpoints to the total rollpoints
// and returns a new state
export function sumScore(state, points) {
  const newState = { ...state, turnTotal: state.turnTotal + points };
  return newState;
}

//this is for the pass button / a bust
// it checks a player current position and uses that
// to move to the next player seat
export function passTurn(state) {
  const currentPosition = state.players.findIndex(
    (p) => p.seat === state.currentSeat,
  );
  let nextPosition = currentPosition + 1;
  if (nextPosition === state.players.length) {
    nextPosition = 0;
  }
  const nextSeat = state.players[nextPosition].seat;
  return { ...state, currentSeat: nextSeat, turnTotal: 0 };
}

// this checks if a player can pass their turn
// this way makes sure every player must roll before passing their turn
export function checkPass(state) {
  return state.turnTotal > 0;
}

export function addToScore(state) {
  const newPlayers = state.players.map((p) => {
    if (p.seat === state.currentSeat) {
      return { ...p, score: p.score + state.turnTotal };
    }
    return p;
  });
  return { ...state, players: newPlayers };
}

export function applyRoll(state, roll) {
  const category = rollCategory(roll, state.specialEven, state.specialOdd);
  if (category === "bust") {
    return passTurn(state);
  }
  const points = getRollPoints(roll, category);
  return sumScore(state, points);
}
