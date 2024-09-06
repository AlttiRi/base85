const ascii85 = charsetToMap(`!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstu`);
const z85 = charsetToMap(`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#`);
const pow2 = 7225; // 85 ** 2
const pow3 = 614125; // 85 ** 3
const pow4 = 52200625; // 85 ** 4
/** @param {"ascii85" | "z85" | string} [charset="z85"]
 *  @return {Uint8Array}  */
function getMap(charset = "z85") {
    if (charset === "ascii85") {
        return ascii85;
    }
    if (charset.length === 85) {
        return charsetToMap(charset);
    }
    return z85;
}
/** @param {string} charset - 85 characters ASCII string */
function charsetToMap(charset) {
    const ui8a = new Uint8Array(85);
    for (let i = 0; i < 85; i++) {
        ui8a[i] = charset.charAt(i).charCodeAt(0);
    }
    return ui8a;
}
/** @param {Uint8Array} mapOrig
 *  @return {Uint8Array}  */
function getReverseMap(mapOrig) {
    const revMap = new Uint8Array(128);
    for (const [num, charCode] of Object.entries(mapOrig)) {
        revMap[charCode] = parseInt(num);
    }
    return revMap;
}
/**
 * Returns Base85 string.
 * @param {Uint8Array} ui8a - input data to encode
 * @param {"ascii85" | "z85" | string} [charset="z85"] - 85 unique characters string
 * @return {string}
 * */
export function encode(ui8a, charset) {
    const charMap = getMap(charset);
    const remain = ui8a.length % 4;
    const last5Length = remain ? remain + 1 : 0;
    const length = Math.ceil(ui8a.length * 5 / 4);
    const target = new Uint8Array(length);
    const dw = new DataView(ui8a.buffer, ui8a.byteOffset, ui8a.byteLength);
    const to = Math.trunc(ui8a.length / 4);
    for (let i = 0; i < to; i++) {
        let num = dw.getUint32(4 * i);
        for (let k = 4; k >= 0; k--) {
            target[k + i * 5] = charMap[num % 85];
            num = Math.trunc(num / 85);
        }
    }
    if (remain) {
        const lastPartIndex = Math.trunc(ui8a.length / 4) * 4;
        const lastPart = Uint8Array.from([...ui8a.slice(lastPartIndex), 0, 0, 0]);
        const offset = target.length - last5Length - 1;
        const dw = new DataView(lastPart.buffer);
        let num = dw.getUint32(0);
        for (let i = 4; i >= 0; i--) {
            const value = charMap[num % 85];
            num = Math.trunc(num / 85);
            if (i < last5Length) {
                const index = offset + i + 1;
                target[index] = value;
            }
        }
    }
    return new TextDecoder().decode(target);
}
/**
 * Decodes Base85 string.
 * @param {string} base85 - base85 encoded string
 * @param {"ascii85" | "z85" | string} [charset="z85"] - 85 unique characters string
 * @return {Uint8Array}
 * */
export function decode(base85, charset) {
    const map = getMap(charset);
    const revMap = getReverseMap(map);
    const base85ab = new TextEncoder().encode(base85);
    const pad = (5 - (base85ab.length % 5)) % 5;
    const ints = new Uint8Array((Math.ceil(base85ab.length / 5) * 4) - pad);
    let dw = new DataView(ints.buffer);
    let i = 0;
    for (; i < base85ab.length / 5 - 1; i++) {
        const c1 = revMap[base85ab[i * 5 + 4]];
        const c2 = revMap[base85ab[i * 5 + 3]] * 85;
        const c3 = revMap[base85ab[i * 5 + 2]] * pow2;
        const c4 = revMap[base85ab[i * 5 + 1]] * pow3;
        const c5 = revMap[base85ab[i * 5]] * pow4;
        dw.setUint32(i * 4, c1 + c2 + c3 + c4 + c5);
    }
    const lCh = map[map.length - 1];
    const lastPart = new Uint8Array([...base85ab.slice(i * 5), lCh, lCh, lCh, lCh]);
    dw = new DataView(lastPart.buffer);
    const c1 = revMap[lastPart[4]];
    const c2 = revMap[lastPart[3]] * 85;
    const c3 = revMap[lastPart[2]] * pow2;
    const c4 = revMap[lastPart[1]] * pow3;
    const c5 = revMap[lastPart[0]] * pow4;
    dw.setUint32(0, c1 + c2 + c3 + c4 + c5);
    for (let j = 0; j < 4 - pad; j++) {
        ints[i * 4 + j] = lastPart[j];
    }
    return ints;
}
/** Alias to `encode`. */
export const encodeBase85 = encode;
/** Alias to `decode`. */
export const decodeBase85 = decode;
const base85 = { encode, decode, encodeBase85, decodeBase85 };
export default base85;
