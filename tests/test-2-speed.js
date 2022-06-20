import {decode, encode} from "../index.js";

const input = "QWERTY1234".repeat(100_000*5);
console.log(`Input: ${input.length} chars string`);

// -----------------------------------
console.log("\n--- AlttiRi/base85 ---");

console.time("total");
console.time("encode");
const encodedAb = new TextEncoder().encode(input);
const encoded1 = encode(encodedAb);
console.timeEnd("encode");

console.time("decode");
const decodedAB = decode(encoded1);
const output1 = new TextDecoder().decode(decodedAB);
console.timeEnd("decode");
console.timeEnd("total");

console.log("input === output1:", input === output1);

/*
Input: 5000000 chars string

--- AlttiRi/base85 ---
encode: 51.036ms
decode: 28.376ms
total: 79.884ms
input === output1: true

--- noseglid/base85 ---
encode: 743.496ms
decode: 80.996ms
total: 825.063ms
input   === output2: true
output1 === output2: true

--- Sheep-y/Base85 ---
encode: 70.319ms
decode: 40.662ms
total: 111.481ms
input   === output3: true
output1 === output3: true
 */


// Uncomment and install "base85"
/*
// -----------------------------------
console.log("\n--- noseglid/base85 ---");
// https://github.com/noseglid/base85


import base85 from "base85";
console.time("total");
console.time("encode");
const encoded2 =  base85.encode(input).toString();
console.timeEnd("encode");

console.time("decode");
const output2 = base85.decode(encoded2).toString();
console.timeEnd("decode");
console.timeEnd("total");

console.log("input   === output2:", input === output2);
console.log("output1 === output2:", output1 === output2);
*/


// Uncomment and copy-paste the code from GitHub
/*
// -----------------------------------
console.log("\n--- Sheep-y/Base85 ---");

// put code here from
// https://github.com/Sheep-y/Base85/blob/master/javascript/base85.js
(function() {})(
    ...
);


console.time("total");
console.time("encode");
const encoded3 = Base85.Z85Encoder.encode(input);
console.timeEnd("encode");

console.time("decode");
const output3 = Base85.Z85Decoder.decode(encoded3);
console.timeEnd("decode");
console.timeEnd("total");

console.log("input   === output3:", input === output3);
console.log("output1 === output3:", output1 === output3);

*/
