const chars = `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstu`;

/** @param {Uint8Array} ui8a */
export function encode(ui8a) {
    let res = [];

    function encode4Bytes(buffer, index) {
        let num = new DataView(buffer).getUint32(4 * index);
        let x = [];
        for (let i = 0; i < 5; i++) {
            x.unshift(num % 85);
            num = Math.trunc(num / 85);
        }
        res.push(x.map(num => chars.charAt(num)).join(""));
    }

    const pad = 4 - ui8a.byteLength % 4;
    console.log("pad", pad);

    let i = 0;
    for (; i < ui8a.length / 4 - (pad === 4 ? 0 : 1); i++) {
        encode4Bytes(ui8a.buffer, i);
    }

    if (pad && pad !== 4) {
        const zeros = "0".repeat(pad).split("").map(ch => parseInt(ch));
        const lastUi8aPart = Uint8Array.from([...ui8a.slice(4 * i), ...zeros]);
        encode4Bytes(lastUi8aPart.buffer, 0);

        const last = res[res.length - 1];
        let charsToRemove;
        if (pad === 1) {charsToRemove = 1}
        if (pad === 2) {charsToRemove = 2}
        if (pad === 3) {charsToRemove = 3}
        res[res.length - 1] = last.slice(0, -charsToRemove);
    }

    return res.join("");
}

export function decode(base85) {
    const ints = [];
    let i = 0;
    for (; i < base85.length / 5  - 1; i++) {
        const c1 = chars.indexOf(base85[i*5 + 4]);
        const c2 = chars.indexOf(base85[i*5 + 3]) * 85;
        const c3 = chars.indexOf(base85[i*5 + 2]) * 85 * 85;
        const c4 = chars.indexOf(base85[i*5 + 1]) * 85 * 85 * 85;
        const c5 = chars.indexOf(base85[i*5    ]) * 85 * 85 * 85 * 85;
        ints.push(c1+c2+c3+c4+c5);
    }

    const pad = (5 - (base85.length % 5)) % 5;
    console.log("pad", pad, "length", base85.length);
    let lastPart = base85.slice(i * 5).padEnd(5, chars[chars.length - 1]);
    const c1 = chars.indexOf(lastPart[4]);
    const c2 = chars.indexOf(lastPart[3]) * 85;
    const c3 = chars.indexOf(lastPart[2]) * 85 * 85;
    const c4 = chars.indexOf(lastPart[1]) * 85 * 85 * 85;
    const c5 = chars.indexOf(lastPart[0]) * 85 * 85 * 85 * 85;
    ints.push(c1+c2+c3+c4+c5);

    const ab = new ArrayBuffer(ints.length * 4 );
    const dw = new DataView(ab);
    for (let i = 0; i < ints.length; i++) {
        dw.setUint32(i * 4, ints[i]);
    }

    return new Uint8Array(ab.slice(0, ab.byteLength - pad));
}
