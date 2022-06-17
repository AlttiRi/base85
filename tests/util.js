export function binaryStringToArrayBuffer(binaryString) {
    const u8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        u8Array[i] = binaryString.charCodeAt(i);
    }
    return u8Array;
}
export function arrayBufferToBinaryString(arrayBuffer) {
    return arrayBuffer.reduce((accumulator, byte) => accumulator + String.fromCharCode(byte), "");
}
