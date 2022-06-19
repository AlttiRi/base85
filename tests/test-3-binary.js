import {arrayBufferToBinaryString, binaryStringToArrayBuffer} from "./util.js";
import {decode, encode} from "../index.js";

// 169 bytes image data URL
const dataUrl = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA+SURBVEhL7dIxCgAwCMVQ739pu/yh0JYgXfNWlSxWv9UhgwkDyAAygAygXEo/8k032dhkMGEAGUAGkAHQvQC3veR+Ql0lAQAAAABJRU5ErkJggg==`;
const base64 = dataUrl.slice("data:image/png;base64,".length);
const binaryString = atob(base64);
const imageBytes   = binaryStringToArrayBuffer(binaryString);

const base85 = encode(imageBytes);

console.log("base64.length", base64.length);
console.log("base85.length", base85.length);
console.log("base64.length > base85.length", base64.length > base85.length);

const imageBytes_2   = decode(base85);
const binaryString_2 = arrayBufferToBinaryString(imageBytes_2)
const base64_2       = btoa(binaryString_2);

console.log("base64 -> base85 -> base64 is fine:", base64 === base64_2);


// Just in case
const imageBytesAlternative = new Uint8Array([
    137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,32,0,0,0,32,8,2,0,0,0,252,24,237,163,0,0,0,1,115,82,71,
    66,0,174,206,28,233,0,0,0,4,103,65,77,65,0,0,177,143,11,252,97,5,0,0,0,9,112,72,89,115,0,0,14,195,0,0,14,195,
    1,199,111,168,100,0,0,0,62,73,68,65,84,72,75,237,210,49,10,0,48,8,197,80,239,127,105,187,252,161,208,150,32,
    93,243,86,149,44,86,191,213,33,131,9,3,200,0,50,128,12,160,92,74,63,242,77,55,217,216,100,48,97,0,25,64,6,144,
    1,208,189,0,183,189,228,126,66,93,37,1,0,0,0,0,73,69,78,68,174,66,96,130]);
console.log("Is bytes correct", imageBytes.toString() === imageBytesAlternative.toString());
