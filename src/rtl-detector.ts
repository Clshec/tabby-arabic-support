/**
 * RTL Character Detector
 *
 * Detects Right-To-Left characters using Unicode ranges covering:
 * Hebrew, Arabic, Syriac, Arabic Supplement, Thaana, NKo,
 * Arabic Extended-A, Hebrew Presentation Forms,
 * Arabic Presentation Forms-A and -B.
 */

const RTL_RANGES: [number, number][] = [
  [0x0590, 0x05ff], // Hebrew
  [0x0600, 0x06ff], // Arabic
  [0x0700, 0x074f], // Syriac
  [0x0750, 0x077f], // Arabic Supplement
  [0x0780, 0x07bf], // Thaana
  [0x07c0, 0x07ff], // NKo
  [0x08a0, 0x08ff], // Arabic Extended-A
  [0xfb1d, 0xfb4f], // Hebrew Presentation Forms
  [0xfb50, 0xfdff], // Arabic Presentation Forms-A
  [0xfe70, 0xfeff], // Arabic Presentation Forms-B
];

function isRTLCodePoint(cp: number): boolean {
  for (const [start, end] of RTL_RANGES) {
    if (cp >= start && cp <= end) {
      return true;
    }
  }
  return false;
}

/**
 * Returns true if the string contains at least one RTL character.
 */
export function containsRTL(text: string): boolean {
  for (const char of text) {
    const cp = char.codePointAt(0)!;
    if (isRTLCodePoint(cp)) {
      return true;
    }
  }
  return false;
}

/**
 * Returns the ratio of RTL characters to total non-whitespace characters.
 * Returns 0 for empty strings or strings with no non-whitespace characters.
 */
export function getRTLRatio(text: string): number {
  let rtlCount = 0;
  let totalCount = 0;

  for (const char of text) {
    const cp = char.codePointAt(0)!;
    if (cp <= 0x20) {
      continue; // skip whitespace and control characters
    }
    totalCount++;
    if (isRTLCodePoint(cp)) {
      rtlCount++;
    }
  }

  if (totalCount === 0) {
    return 0;
  }

  return rtlCount / totalCount;
}
