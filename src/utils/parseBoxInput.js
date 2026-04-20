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
export function parseBoxInput(raw) {
  if (!raw || !raw.trim()) return [];

  // Normalize all separators to commas
  const normalized = raw
    .replace(/[\n\r\t]+/g, ",")
    .replace(/\s+/g, ",")
    .replace(/-/g, ",")
    .replace(/,+/g, ",")
    .replace(/^,|,$/g, "");

  const tokens = normalized.split(",");
  const seenNormalized = new Set();
  const result = [];

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    // Must be digits only
    if (!/^\d+$/.test(trimmed)) continue;

    // Normalize for dedup: strip leading zeros (no parseInt)
    const key = trimmed.replace(/^0+/, "") || "0";

    if (!seenNormalized.has(key)) {
      seenNormalized.add(key);
      result.push(trimmed); // Keep original format with leading zeros
    }
  }

  // Sort by numeric value, preserve string format (no parseInt)
  result.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return result;
}
