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
