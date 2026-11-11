import { rollCategory } from "./mechanic.js";

console.log(rollCategory(1, 4, 3)); // expect bust
console.log(rollCategory(6, 4, 3)); // expect bust
console.log(rollCategory(4, 4, 3)); // expect double
console.log(rollCategory(3, 4, 3)); // expect negative
console.log(rollCategory(2, 4, 3)); // expect normal
console.log(rollCategory(5, 4, 3)); // expect normal