/** 85 characters string */
type CharSet = string;

export function encode(ui8a: Uint8Array, charset: "ascii85" | "z85" | CharSet): string
export function decode(base85: string, charset: "ascii85" | "z85" | CharSet): Uint8Array

type base85 = {
    encode, decode
};
export default base85;
