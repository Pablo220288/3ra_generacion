const moneyFormatter = new Intl.NumberFormat("es-AR");

/**
 * Formats a number with Argentine thousand separators (e.g. 1000000 → "1.000.000").
 * @param {number|string|null|undefined} value
 * @returns {string}
 */
export function formatMoney(value) {
  if (value === null || value === undefined || value === "") return "";
  const num = typeof value === "number" ? value : Number(String(value).replace(",", "."));
  if (Number.isNaN(num)) return "";
  return moneyFormatter.format(num);
}

/**
 * Parses a formatted money string back to a number (e.g. "1.000.000" → 1000000).
 * @param {string|number} value
 * @returns {number}
 */
export function parseMoney(value) {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value;
  const cleaned = String(value)
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");
  const num = Number(cleaned);
  return Number.isNaN(num) ? 0 : num;
}
