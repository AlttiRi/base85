/** @param {string} binaryString
 *  @return {Uint8Array}  */
export function binaryStringToArrayBuffer(binaryString) {
    const u8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        u8Array[i] = binaryString.charCodeAt(i);
    }
    return u8Array;
}

/** @param {Uint8Array} arrayBuffer
 *  @return {string}  */
export function arrayBufferToBinaryString(arrayBuffer) {
    return arrayBuffer.reduce((accumulator, byte) => accumulator + String.fromCharCode(byte), "");
}

const encoder = new TextEncoder();
/** @param {string} str
 *  @return {Uint8Array}  */
export function utf8StringToArrayBuffer(str) {
    return encoder.encode(str);
}

const decoder = new TextDecoder();
/** @param {Uint8Array} ab
 *  @return {string}  */
export function arrayBufferToUtf8String(ab) {
    return decoder.decode(ab);
}
