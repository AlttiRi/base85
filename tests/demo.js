import {arrayBufferToBinaryString, binaryStringToArrayBuffer} from "./util.js";
import {decode, encode} from "../index.js";

const dataUrl = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA+SURBVEhL7dIxCgAwCMVQ739pu/yh0JYgXfNWlSxWv9UhgwkDyAAygAygXEo/8k032dhkMGEAGUAGkAHQvQC3veR+Ql0lAQAAAABJRU5ErkJggg==`;
const base64 = dataUrl.slice("data:image/png;base64,".length);
const imageAb = binaryStringToArrayBuffer(atob(base64));

console.log("-----------------");
console.log("base64.length :" , base64.length);
console.log("imageAb.length:", imageAb.length);
// console.log("imageAb", imageAb);

const base85Str = encode(imageAb);
console.log(base85Str);
console.log("base85.length:", base85Str.length);


console.log("-----------------");
const decodedAb = decode(base85Str);
const bString = arrayBufferToBinaryString(decodedAb);
const base64Encoded = btoa(bString);
console.log("base64Encoded === base64", base64Encoded === base64);


console.log("-----------------");
const wikiTextAb = new TextEncoder().encode("Man is distinguished, not only by his reason, but by this singular passion from other animals, which is a lust of the mind, that by a perseverance of delight in the continued and indefatigable generation of knowledge, exceeds the short vehemence of any carnal pleasure.");
const encodedWikiText = encode(wikiTextAb);
console.log(encodedWikiText);
/*
9jqo^BlbD-BleB1DJ+*+F(f,q/0JhKF<GL>Cj@.4Gp$d7F!,L7@<6@)/0JDEF<G%<+EV:2F!,O<DJ+*.@<*K0@<6L(Df-\0Ec5e;DffZ(EZee.Bl.9pF"AGX
BPCsi+DGm>@3BB/F*&OCAfu2/AKYi(DIb:@FD,*)+C]U=@3BN#EcYf8ATD3s@q?d$AftVqCh[NqF<G:8+EV:.+Cf>-FD5W8ARlolDIal(DId<j@<?3r@:F%a
+D58'ATD4$Bl@l3De:,-DJs`8ARoFb/0JMK@qB4^F!,R<AKZ&-DfTqBG%G>uD.RTpAKYo'+CT/5+Cei#DII?(E,9)oF*2M7/c
 */

console.log(wikiTextAb.toString() === decode(encodedWikiText).toString());
// true


