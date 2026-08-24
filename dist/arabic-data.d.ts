/**
 * Arabic character joining types.
 * R = Right-joining, D = Dual-joining, U = Non-joining, C = Join-causing, T = Transparent
 */
export type JoiningType = 'R' | 'D' | 'U' | 'C' | 'T';
/**
 * Maps each Arabic character codepoint (U+0621–U+064A) to its presentation forms:
 * [isolated, final, initial, medial]. 0 means the form does not exist.
 */
export declare const ARABIC_FORMS: Record<number, [number, number, number, number]>;
/**
 * Joining type for each Arabic character.
 */
export declare const JOINING_TYPES: Record<number, JoiningType>;
/**
 * Lam-Alef ligatures. Maps alef variant codepoint to [isolated, final] ligature forms.
 */
export declare const LAM_ALEF_LIGATURES: Record<number, [number, number]>;
/**
 * Converts Unicode Presentation Forms-B characters back to logical Arabic characters.
 */
export declare function toLogicalArabic(text: string): string;
/**
 * Returns true if the codepoint is an Arabic diacritic (tashkeel).
 */
export declare function isDiacritic(cp: number): boolean;
/**
 * Returns true if the codepoint is a base Arabic character (U+0621–U+064A).
 */
export declare function isArabicChar(cp: number): boolean;
