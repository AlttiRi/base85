/** 85 unique characters string */
type CharSet = string;

/**
 * Returns Base85 string.
 * @param {Uint8Array} ui8a - input data to encode
 * @param {"ascii85" | "z85" | string} [charset="z85"] - 85 unique characters string
 * @return {string}
 * */
export function encode(ui8a: Uint8Array, charset?: "ascii85" | "z85" | CharSet): string

/**
 * Decodes Base85 string.
 * @param {string} base85 - base85 encoded string
 * @param {"ascii85" | "z85" | string} [charset="z85"] - 85 unique characters string
 * @return {Uint8Array}
 * */
export function decode(base85: string, charset?: "ascii85" | "z85" | CharSet): Uint8Array

type base85 = {
    encode, decode
};
export default base85;
