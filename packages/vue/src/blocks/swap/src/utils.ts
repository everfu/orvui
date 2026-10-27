export function isValidAddress(value: string) {
  return (
    /^0x[0-9a-fA-F]{40}$/.test(value) ||
    (value.length > 5 && /\.(eth|sol|bnb)$/.test(value))
  );
}
export function truncateAddress(value: string) {
  return value.length === 42 && value.startsWith("0x")
    ? [value.substring(0, 6), value.substring(38)].join("...")
    : value;
}
export function sanitizeAmount(value: string) {
  let result = "",
    decimal = false;
  for (const char of value) {
    if (char >= "0" && char <= "9") result += char;
    else if (char === "." && !decimal) {
      decimal = true;
      result += ".";
    }
  }
  return result;
}
export function formatAmount(value: number, max = 6) {
  return !Number.isFinite(value) || value === 0
    ? "0"
    : value.toLocaleString(undefined, {
        maximumFractionDigits: value >= 1000 ? 2 : max,
      });
}
