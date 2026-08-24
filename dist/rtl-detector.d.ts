/**
 * RTL Character Detector
 *
 * Detects Right-To-Left characters using Unicode ranges covering:
 * Hebrew, Arabic, Syriac, Arabic Supplement, Thaana, NKo,
 * Arabic Extended-A, Hebrew Presentation Forms,
 * Arabic Presentation Forms-A and -B.
 */
/**
 * Returns true if the string contains at least one RTL character.
 */
export declare function containsRTL(text: string): boolean;
/**
 * Returns the ratio of RTL characters to total non-whitespace characters.
 * Returns 0 for empty strings or strings with no non-whitespace characters.
 */
export declare function getRTLRatio(text: string): number;
