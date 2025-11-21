import { aO as IOTA_DECIMALS } from "/iota-utils/assets/index-BgEVLtK2.js";
function iotaToNano(iota) {
  const [intPart, decPart = ""] = iota.replace(/_/g, "").split(".");
  if (decPart.length > 9) {
    throw new Error("Decimal part exceeds 9 digits");
  }
  const paddedDec = (decPart + "0".repeat(IOTA_DECIMALS)).slice(0, 9);
  const combined = intPart + paddedDec;
  return BigInt(combined).toString();
}
function formatBigIntWithDecimal(bigint, decimalPlaces) {
  const str = bigint.toString();
  const len = str.length;
  if (len <= decimalPlaces) {
    const padded = str.padStart(decimalPlaces, "0");
    return `0.${padded}`;
  }
  const intPart = str.slice(0, len - decimalPlaces);
  const decimalPart = str.slice(len - decimalPlaces);
  return `${intPart}.${decimalPart}`;
}
const nanoToIota = (nano) => {
  return formatBigIntWithDecimal(BigInt(nano.replace(/_/g, "")), IOTA_DECIMALS);
};
function formatNumberWithUnderscores(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "_");
}
function formatNumbersWithUnderscores(obj) {
  function process(value) {
    if (Array.isArray(value)) {
      return value.map(process);
    } else if (value !== null && typeof value === "object") {
      const newObj = {};
      for (const key in value) {
        newObj[key] = process(value[key]);
      }
      return newObj;
    } else if (typeof value === "number" || typeof value === "string" && /^\d+$/.test(value)) {
      return formatNumberWithUnderscores(value);
    } else {
      return value;
    }
  }
  return process(obj);
}
export {
  formatNumberWithUnderscores as a,
  formatNumbersWithUnderscores as f,
  iotaToNano as i,
  nanoToIota as n
};
