const ascii58 = `!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_\`abcdefghijklmnopqrstu`;
const z85     = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#`;

function getMap(charset = ascii58) {
    if (charset === "z85") {charset = z85;}
    if (charset?.length && charset.length !== 85) {charset = ascii58;}

    const ui8a = new Uint8Array(85);
    for (let i = 0; i < ascii58.length; i++) {
        ui8a[i] = charset.charAt(i).charCodeAt(0);
    }
    return ui8a;
}

/** @param {Uint8Array} ui8a
 *  @param {"ascii58"|"z85"|String} [charset="ascii58"] */
export function encode(ui8a, charset) {
    console.time("encode");
    const chars = getMap(charset);
    const remain = ui8a.length % 4;
    const last5Length = remain ? remain + 1 : 0;
    const length = Math.ceil(ui8a.length * 5/4);
    const target = new Uint8Array(length);

    const dw = new DataView(ui8a.buffer);
    const to = Math.trunc(ui8a.length / 4);
    for (let i = 0; i < to; i++) {
        let num = dw.getUint32(4 * i);
        for (let k = 4; k >= 0; k--) {
            target[k + i*5] = chars[num % 85];
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
            const value = chars[num % 85];
            num = Math.trunc(num / 85);
            if (i < last5Length) {
                const index = offset + i + 1;
                target[index] = value;
            }
        }
    }
    console.timeEnd("encode");

    console.time("join");
    const result = new TextDecoder().decode(target);
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
