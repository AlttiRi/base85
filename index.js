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
    const res = new Array(Math.ceil(ui8a.length*5/4));

    let dw = new DataView(ui8a.buffer);

    function getGroupString(index) {
        let num = dw.getUint32(4 * index);
        for (let i = 0; i < 5; i++) {
            const k = index*5 + 4 - i;
            res[k] = chars.charAt(num % 85);
            num = Math.trunc(num / 85);
        }
    }
    const to = Math.trunc(ui8a.length / 4);
    for (let i = 0; i < to; i++) {
        getGroupString(i);
    }

    const zeroPadLength = (4 - (ui8a.length % 4)) % 4;
    let last = [];
    if (zeroPadLength) {
        const lastPartIndex = Math.trunc(ui8a.length / 4) * 4;
        dw = new DataView(Uint8Array.from([...ui8a.slice(lastPartIndex), 0,0,0]).buffer);

        let num = dw.getUint32(0);
        const x = new Array(5);
        for (let i = 0; i < 5; i++) {
            x[4 - i] = chars.charAt(num % 85);
            num = Math.trunc(num / 85);
        }
        console.log(last = x.slice(0, 5 - zeroPadLength));
    } else {
        console.log(res);
    }

    console.timeEnd("encode");

    console.time("join");
    const result = res.join("") + last.join("");
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
