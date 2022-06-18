const ascii58 = `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstu`;
const z85     = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#`;

function getMap(charset) {
    if (charset === "z85")      {return z85;}
    if (charset?.length === 85) {return charset;}
    return ascii58;
}

/** @param {Uint8Array} ui8a
 *  @param {"ascii58"|"z85"|String} [charset="ascii58"] */
export function encode(ui8a, charset) {
    console.time("encode");
    const chars = getMap(charset);
    const res = [];

    const dw = new DataView(ui8a.buffer);
    const x = new Array(5);
    function encode4Bytes(index) {
        let num = dw.getUint32(4 * index);

        for (let i = 0; i < 5; i++) {
            x[4 - i] = num % 85;
            num = Math.trunc(num / 85);
        }
        res.push(x.map(num => chars.charAt(num)).join(""));
    }

    const pad = 4 - ui8a.byteLength % 4;
    // console.log("pad", pad);

    let i = 0;
    const to = ui8a.length / 4 - (pad === 4 ? 0 : 1);
    for (; i < to; i++) {
        encode4Bytes(i);
    }
    if (pad && pad !== 4) {
        const lastUi8aPart = Uint8Array.from([...ui8a.slice(4 * i), 0, 0, 0]);
        const dw = new DataView(lastUi8aPart.buffer);

        let num = dw.getUint32(0);
        for (let i = 0; i < 5; i++) {
            x[4 - i] = num % 85;
            num = Math.trunc(num / 85);
        }
        const last = x.map(num => chars.charAt(num)).join("");
        res.push(last.slice(0, -pad));
    }
    console.timeEnd("encode");
    console.time("join");
    const result = res.join("");
    console.timeEnd("join");

    return result;
}
/** @param {String} base85
 *  @param {"ascii58"|"z85"|String} [charset="ascii58"]  */
export function decode(base85, charset) {
    const chars = getMap(charset);
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
    //console.log("pad", pad, "length", base85.length);
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
