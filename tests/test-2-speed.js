import {decode, encode} from "../index.js";

const charset = "ascii58";
const long = "a".repeat(1_000_002*5);


console.time(`decode -> encode ${long.length} chars`);
const longAb = new TextEncoder().encode(long);
const longEnc = encode(longAb, charset);
const longDec = decode(longEnc, charset);
console.timeEnd(`decode -> encode ${long.length} chars`);

console.log(`decode -> encode ${long.length} chars:`, longAb.toString() === longDec.toString());
