# base85
[Pretty fast](https://github.com/AlttiRi/base85/blob/7a6edf4b9c0b16e0d63e35c0c102c1875f78ddb0/tests/test-2-speed.js#L23-L52) base85 JavaScript library (with TS support).

It is designed to encode binary data (`Uint8Array`) into a "base85" text string and vice versa.

```bash
npm install @alttiri/base85
```

## API

#### `function encode(ui8a: Uint8Array, charset?: "ascii85" | "z85" | string): string`

[`encode`](https://github.com/AlttiRi/base85/blob/42343e624f27ec68aa936a274c297ccd6c15c8cb/index.js#L42) encodes the input `Uint8Array` into base85 `string`.

#### `function decode(base85: string, charset?: "ascii85" | "z85" | string): Uint8Array`

[`decode`](https://github.com/AlttiRi/base85/blob/42343e624f27ec68aa936a274c297ccd6c15c8cb/index.js#L84) decodes the input base85 `string` into `Uint8Array`.

`charset` is "z85" by default.


## Examples


Binary data encoding example:
```js
// png image, 169 bytes
const imageBytes = new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,13,73,72,68,82,0,0,0,32,0,0,0,32,8,2,0,0,0,252,24,237,163,0,0,0,1,115,82,71,66,0,174,206,28,233,0,0,0,4,103,65,77,65,0,0,177,143,11,252,97,5,0,0,0,9,112,72,89,115,0,0,14,195,0,0,14,195,1,199,111,168,100,0,0,0,62,73,68,65,84,72,75,237,210,49,10,0,48,8,197,80,239,127,105,187,252,161,208,150,32,93,243,86,149,44,86,191,213,33,131,9,3,200,0,50,128,12,160,92,74,63,242,77,55,217,216,100,48,97,0,25,64,6,144,1,208,189,0,183,189,228,126,66,93,37,1,0,0,0,0,73,69,78,68,174,66,96,130]);
const base85 = encode(imageBytes);

console.log(base85);
console.log(base85.length);
// "Ibl@q4gj0X0000dnK#lE0000w0000w2M:#a0q)Y3Qw$n]0DRdeliagl9o^C600D}2o*F:VV5Yp<vfDSh010Qns-TMy4-nnD4-ns/z(vgD002hOl{T^yoypdZ3ih:=-zD2Mx$Kqp^3t!W]h.bcr>)fdG9.U305x6kPJ>8N[>z6@/KMWA02X3aKo9.w0jPV5ENmr^0rr9107/QOm6n<:F="
// 212
```

---

If you need to encode a text _(are you really need it?)_ [use `TextEncoder`/`TextDecoder`](https://github.com/AlttiRi/base85/blob/1b04256730cbbedcb6dbbd7e14fe4a6ac7575ce2/tests/util.js#L17-L29).

```js
const input = "Man is distinguished";
const inputBytes = utf8StringToArrayBuffer(input);
console.log(encode(inputBytes, "ascii85"));  // "9jqo^BlbD-BleB1DJ+*+F(f,q"
console.log(encode(inputBytes, "z85"));      // "o<}]Zx(+zcx(!xgzFa9aB7/b}"

const outputBytes = decode("9jqo^BlbD-BleB1DJ+*+F(f,q", "ascii85");
const output = arrayBufferToUtf8String(outputBytes);
console.log(output); // "Man is distinguished"
```

For more examples see [the tests](https://github.com/AlttiRi/base85/tree/master/tests).


---

You can test the lib online in the browser's console: https://alttiri.github.io/base85/online

All required things are already in the global scope. (`encode`, `decode`; util functions: `utf8StringToArrayBuffer` and others; `Tester` class too.)

---

Note.
The optimisation for `"ascii85"` by replacing `"\0\0\0\0"` by `"z"` instead of `"!!!!!"` and `"    "` (4 spaces) by `"y"` instead of `"+<VdL"` is not supported.

Anyway nobody forbids you to do something like `base85.replaceAll("!!!!!", "z")` as well as to add `"<~"`, `"~>"` manually if you need it.


---

## Installation

### From NPM

```bash
npm install @alttiri/base85
```

### From GitHub repository

```bash
npm install git+https://github.com/alttiri/base85.git
```

<details>

<summary>More ways</summary>

### From GitHub repository (a specific version):

- **Based on SemVer:**
    ```bash
    npm install git+https://github.com/alttiri/base85.git#semver:1.5.1
    ```
  Or add
    ```
    "@alttiri/base85": "github:alttiri/base85#semver:1.5.1"
    ```
  as `dependencies` in `package.json` file.

  See available [tags](https://github.com/AlttiRi/base85/tags).

- **Based on a commit hash:**
    ```bash
    npm install git+https://git@github.com/alttiri/base85.git#ca3217f3d1075b8ff0966e24437326a6c2537bbc
    ```
  Or add
    ```
    "@alttiri/base85": "github:alttiri/base85#ca3217f3d1075b8ff0966e24437326a6c2537bbc"
    ```
  as `dependencies` in `package.json` file.

  See available [commits hashes](https://github.com/AlttiRi/base85/commits/master).


### From GitHub Packages:
To install you need first to create `.npmrc` file with `@alttiri:registry=https://npm.pkg.github.com` content:
```bash
echo @alttiri:registry=https://npm.pkg.github.com >> .npmrc
```

only then run

```bash
npm install @alttiri/base85
```
Note, that GitHub Packages requires to have also `~/.npmrc` file (`.npmrc` in your home dir) with `//npm.pkg.github.com/:_authToken=TOKEN` content, where `TOKEN` is a token with the `read:packages` permission, take it here https://github.com/settings/tokens/new.

</details>
