export function decideMove(situation, random = Math.random) {
  
  const turnTotal = situation.turnTotal;
  const myScore = situation.myScore;
  const opponentScore = situation.opponentScore;
  const targetScore = situation.targetScore;
  const difficulty = situation.difficulty;

  
  if (turnTotal <= 0) {
    return "roll";
  }

 
  if (myScore + turnTotal >= targetScore) {
    return "hold";
  }


  if (difficulty === "easy") {
    const holdAt = 5 + Math.floor(random() * 11);
    if (turnTotal >= holdAt) {
      return "hold";
    } else {
      return "roll";
    }
  }

  if (difficulty === "hard") {
    
    let holdAt = 20;

   
    const bigGap = targetScore * 0.3;
    const closeToWin = targetScore * 0.2;

    
    if (opponentScore - myScore > bigGap) {
      holdAt = 25;
    }

    
    if (myScore - opponentScore > bigGap) {
      holdAt = 15;
    }

  
    if (targetScore - opponentScore <= closeToWin) {
      return "roll";
    }

   
    if (turnTotal >= holdAt) {
      return "hold";
    } else {
      return "roll";
    }
  }

 
  if (turnTotal >= 20) {
    return "hold";
  } else {
    return "roll";
  }
}