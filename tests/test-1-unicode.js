import {decode, encode} from "../index.js";
import {Tester} from "@alttiri/util-node-js";
import {arrayBufferToUtf8String, utf8StringToArrayBuffer} from "./util.js";


const {eq, report} = new Tester().destructible();

const wikiText =
    "Man is distinguished, not only by his reason, but by this singular passion from other animals, " +
    "which is a lust of the mind, that by a perseverance of delight in the continued and " +
    "indefatigable generation of knowledge, exceeds the short vehemence of any carnal pleasure.";

const wikiTextEncoded =
      "9jqo^BlbD-BleB1DJ+*+F(f,q/0JhKF<GL>Cj@.4Gp$d7F!,L7@<6@)/0JDEF<G%<+EV:2F!," +   // No <~
    "O<DJ+*.@<*K0@<6L(Df-\\0Ec5e;DffZ(EZee.Bl.9pF\"AGXBPCsi+DGm>@3BB/F*&OCAfu2/AKY" + // Contains \\ and \"
    "i(DIb:@FD,*)+C]U=@3BN#EcYf8ATD3s@q?d$AftVqCh[NqF<G:8+EV:.+Cf>-FD5W8ARlolDIa" +
    "l(DId<j@<?3r@:F%a+D58'ATD4$Bl@l3De:,-DJs`8ARoFb/0JMK@qB4^F!,R<AKZ&-DfTqBG%G" +
    ">uD.RTpAKYo'+CT/5+Cei#DII?(E,9)oF*2M7/c"                                         // No ~>

const ascii85_UnicodeMap = [
    ["Man is distinguished", "9jqo^BlbD-BleB1DJ+*+F(f,q"],
    [" carnal pleasure.",    "+Cei#DII?(E,9)oF*2M7/c"],
    [wikiText, wikiTextEncoded],
    ["",         ""],
    ["A",        "5l"],
    ["AB",       "5sb"],
    ["ABC",      "5sdp"],
    ["ABCD",     "5sdq,"],
    ["ABCDE",    "5sdq,70"],
    ["ABCDEF",   "5sdq,77I"],
    ["ABCDEFG",  "5sdq,77Kc"],
    ["ABCDEFGH", "5sdq,77Kd<"],
    ["\u0000\u0000\u0000\u0000", "!!!!!"], // "z" not supported
    ["    ",                     "+<VdL"], // "y" not supported
    ["!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
    "+X/-V,pjuf.4Qi!/M8\\10etOA2)[BQ3BB5a4[)(q5sdq,77Kd<8P2WL9hnJ\\;,U=l<E<1'=^#$7?!^lG@:E_WAS,RgBkhF\"D/O92EH6,BF`qtRH$XgbI=;"],
    ["測試中", "k.%MVWM\\adXT"],
    ["اختبارات", "fVdB)fW*T&fVdB,fVdB%"],
 // ["\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008", `!!*-'"9eu7#Q`], // just to no log this text in the console
];

const z85_UnicodeMap = [
    ["Man is distinguished", "o<}]Zx(+zcx(!xgzFa9aB7/b}"],
    [" carnal pleasure.",    "ay!&2zEEu7Abo8]B9hIme="],
    ["",         ""],
    ["A",        "k("],
    ["AB",       "k%+"],
    ["ABC",      "k%^{"],
    ["ABCD",     "k%^}b"],
    ["ABCDE",    "k%^}bmf"],
    ["ABCDEF",   "k%^}bmmE"],
    ["ABCDEFG",  "k%^}bmmG="],
    ["ABCDEFGH", "k%^}bmmG^r"],
    ["\u0000\u0000\u0000\u0000", "00000"],
    ["    ",                     "arR^H"],
    ["0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#",
    "fFLssg=mfIi5$zRv}od.xj#0]yIW<9z/xYpB98LFCx!yVk%^}bmmG^rnLhSHo?[FXqbQs(rArg6sZ0BfiX9v1aULrfcoKEudo*88ElY87bl"],
    ["測試中", ">d4IRSIX:^TP"],
    ["اختبارات", "/R^x8/S9P5/R^xb/R^x4"],
 // ["\u0000\u0001\u0002\u0003\u0004\u0005\u0006\u0007\u0008", `009c61o!#m2M`],
];


for (let i = 0; i < ascii85_UnicodeMap.length; i++) {
    const ab = utf8StringToArrayBuffer(ascii85_UnicodeMap[i][0])
    eq("ascii85-enc" + i, encode(ab, "ascii85"), ascii85_UnicodeMap[i][1]);
}
for (let i = 0; i < ascii85_UnicodeMap.length; i++) {
    const ab = utf8StringToArrayBuffer(ascii85_UnicodeMap[i][0])
    const result = arrayBufferToUtf8String(decode(encode(ab, "ascii85"), "ascii85"));
    eq("ascii85-enc-dec" + i, result, ascii85_UnicodeMap[i][0]);
}
for (let i = 0; i < z85_UnicodeMap.length; i++) {
    const ab = utf8StringToArrayBuffer(z85_UnicodeMap[i][0])
    eq("z85-enc" + i, encode(ab, "z85"), z85_UnicodeMap[i][1]);
}
for (let i = 0; i < z85_UnicodeMap.length; i++) {
    const ab = utf8StringToArrayBuffer(z85_UnicodeMap[i][0])
    const result = arrayBufferToUtf8String(decode(encode(ab, "z85"), "z85"));
    eq("z85-enc-dec" + i, result, z85_UnicodeMap[i][0]);
}

report();
