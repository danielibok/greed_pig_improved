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
