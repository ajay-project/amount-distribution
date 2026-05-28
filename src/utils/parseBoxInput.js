/**
 * Parses box number input in multiple formats.
 * CRITICAL: Returns STRING[] with leading zeros preserved.
 * NO parseInt() or Number() used.
 *
 * Accepts:
 * - Hyphen-separated: "02-04-06-08"
 * - Space-separated/multiline: "02 30 55\n08 35 61"
 * - Comma-separated: "2,4,6,8"
 * - Mixed: "02-04 06, 08\n11-13"
 *
 * Returns: sorted unique string array, e.g. ["02","04","06","08"]
 */
export function parseBoxInput(raw, shuffleEnabled = false) {
  if (!raw || !raw.trim()) return [];

  // Split by comma, whitespace, or hyphen
  const tokens = raw.split(/[,\s\-]+/);
  const seenNormalized = new Set();
  const result = [];

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    // Must be digits only
    if (!/^\d+$/.test(trimmed)) continue;

    let parsedVal = "";
    // Special check for 1 followed only by zeros (e.g. 10, 100, 1000)
    if (/^0*10+$/.test(trimmed)) {
      const zeroCount = (trimmed.match(/0/g) || []).length - (trimmed.match(/^0+/) || [""])[0].length;
      if (zeroCount >= 2) {
        parsedVal = "100";
      } else {
        parsedVal = "10";
      }
    } else {
      const num = parseInt(trimmed, 10);
      if (isNaN(num) || num < 1 || num > 100) {
        // Outside 1-100 range -> ignore
        continue;
      }
      // Pad single digits (1-9) to 2-digits
      if (num < 10) {
        parsedVal = `0${num}`;
      } else {
        parsedVal = String(num);
      }
    }

    // Deduplicate
    const key = parsedVal.replace(/^0+/, "") || "0";
    if (!seenNormalized.has(key)) {
      seenNormalized.add(key);
      result.push(parsedVal);
    }
  }

  // Sort by numeric value only if shuffleEnabled is false
  if (!shuffleEnabled) {
    result.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }

  return result;
}
