function fromHex(hexStr) {
  var _a;
  const normalized = hexStr.startsWith("0x") ? hexStr.slice(2) : hexStr;
  const padded = normalized.length % 2 === 0 ? normalized : `0${normalized}}`;
  const intArr = ((_a = padded.match(/.{2}/g)) == null ? void 0 : _a.map((byte) => parseInt(byte, 16))) ?? [];
  return Uint8Array.from(intArr);
}
function toHex(bytes) {
  return bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");
}
const toHEX = toHex;
const fromHEX = fromHex;
export {
  toHex as a,
  fromHex as b,
  fromHEX as f,
  toHEX as t
};
