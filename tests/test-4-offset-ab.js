import {Tester} from "@alttiri/util-node-js";
import {encode} from "../base85.js";

const {t} = new Tester().destructible();

const a = [0x00, 0x86, 0x4F, 0xD2, 0x6F, 0xB5, 0x59, 0xF7, 0x5B];
const newA1 = new Uint8Array(a).slice(1);
const newA2 = new Uint8Array(a).subarray(1);

// console.log(newA1);
// console.log(newA2);
// console.log(encode(newA1));
// console.log(encode(newA2));

// Uint8Array(8) [134, 79, 210, 111, 181, 89, 247, 91]
// HelloWorld

t({
    expect: true,
    result: encode(newA1) === encode(newA2),
});
