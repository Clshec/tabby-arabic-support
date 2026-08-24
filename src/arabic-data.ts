/**
 * Arabic character joining types.
 * R = Right-joining, D = Dual-joining, U = Non-joining, C = Join-causing, T = Transparent
 */
export type JoiningType = 'R' | 'D' | 'U' | 'C' | 'T';

/**
 * Maps each Arabic character codepoint (U+0621–U+064A) to its presentation forms:
 * [isolated, final, initial, medial]. 0 means the form does not exist.
 */
export const ARABIC_FORMS: Record<number, [number, number, number, number]> = {
  0x0621: [0xfe80, 0, 0, 0], // Hamza
  0x0622: [0xfe81, 0xfe82, 0, 0], // Alef-Madda
  0x0623: [0xfe83, 0xfe84, 0, 0], // Alef-Hamza-Above
  0x0624: [0xfe85, 0xfe86, 0, 0], // Waw-Hamza
  0x0625: [0xfe87, 0xfe88, 0, 0], // Alef-Hamza-Below
  0x0626: [0xfe89, 0xfe8a, 0xfe8b, 0xfe8c], // Yaa-Hamza
  0x0627: [0xfe8d, 0xfe8e, 0, 0], // Alef
  0x0628: [0xfe8f, 0xfe90, 0xfe91, 0xfe92], // Baa
  0x0629: [0xfe93, 0xfe94, 0, 0], // Taa-Marbuta
  0x062a: [0xfe95, 0xfe96, 0xfe97, 0xfe98], // Taa
  0x062b: [0xfe99, 0xfe9a, 0xfe9b, 0xfe9c], // Thaa
  0x062c: [0xfe9d, 0xfe9e, 0xfe9f, 0xfea0], // Jeem
  0x062d: [0xfea1, 0xfea2, 0xfea3, 0xfea4], // Haa
  0x062e: [0xfea5, 0xfea6, 0xfea7, 0xfea8], // Khaa
  0x062f: [0xfea9, 0xfeaa, 0, 0], // Dal
  0x0630: [0xfeab, 0xfeac, 0, 0], // Thal
  0x0631: [0xfead, 0xfeae, 0, 0], // Raa
  0x0632: [0xfeaf, 0xfeb0, 0, 0], // Zain
  0x0633: [0xfeb1, 0xfeb2, 0xfeb3, 0xfeb4], // Seen
  0x0634: [0xfeb5, 0xfeb6, 0xfeb7, 0xfeb8], // Sheen
  0x0635: [0xfeb9, 0xfeba, 0xfebb, 0xfebc], // Sad
  0x0636: [0xfebd, 0xfebe, 0xfebf, 0xfec0], // Dad
  0x0637: [0xfec1, 0xfec2, 0xfec3, 0xfec4], // Tah
  0x0638: [0xfec5, 0xfec6, 0xfec7, 0xfec8], // Dhah
  0x0639: [0xfec9, 0xfeca, 0xfecb, 0xfecc], // Ain
  0x063a: [0xfecd, 0xfece, 0xfecf, 0xfed0], // Ghain
  0x0640: [0x0640, 0, 0, 0], // Tatweel
  0x0641: [0xfed1, 0xfed2, 0xfed3, 0xfed4], // Faa
  0x0642: [0xfed5, 0xfed6, 0xfed7, 0xfed8], // Qaf
  0x0643: [0xfed9, 0xfeda, 0xfedb, 0xfedc], // Kaf
  0x0644: [0xfedd, 0xfede, 0xfedf, 0xfee0], // Lam
  0x0645: [0xfee1, 0xfee2, 0xfee3, 0xfee4], // Meem
  0x0646: [0xfee5, 0xfee6, 0xfee7, 0xfee8], // Noon
  0x0647: [0xfee9, 0xfeea, 0xfeeb, 0xfeec], // Heh
  0x0648: [0xfeed, 0xfeee, 0, 0], // Waw
  0x0649: [0xfeef, 0xfef0, 0, 0], // Alef-Maksura
  0x064a: [0xfef1, 0xfef2, 0xfef3, 0xfef4], // Yaa
};

/**
 * Joining type for each Arabic character.
 */
export const JOINING_TYPES: Record<number, JoiningType> = {
  0x0621: 'U', // Hamza
  0x0622: 'R', // Alef-Madda
  0x0623: 'R', // Alef-Hamza-Above
  0x0624: 'R', // Waw-Hamza
  0x0625: 'R', // Alef-Hamza-Below
  0x0626: 'D', // Yaa-Hamza
  0x0627: 'R', // Alef
  0x0628: 'D', // Baa
  0x0629: 'R', // Taa-Marbuta
  0x062a: 'D', // Taa
  0x062b: 'D', // Thaa
  0x062c: 'D', // Jeem
  0x062d: 'D', // Haa
  0x062e: 'D', // Khaa
  0x062f: 'R', // Dal
  0x0630: 'R', // Thal
  0x0631: 'R', // Raa
  0x0632: 'R', // Zain
  0x0633: 'D', // Seen
  0x0634: 'D', // Sheen
  0x0635: 'D', // Sad
  0x0636: 'D', // Dad
  0x0637: 'D', // Tah
  0x0638: 'D', // Dhah
  0x0639: 'D', // Ain
  0x063a: 'D', // Ghain
  0x0640: 'C', // Tatweel
  0x0641: 'D', // Faa
  0x0642: 'D', // Qaf
  0x0643: 'D', // Kaf
  0x0644: 'D', // Lam
  0x0645: 'D', // Meem
  0x0646: 'D', // Noon
  0x0647: 'D', // Heh
  0x0648: 'R', // Waw
  0x0649: 'R', // Alef-Maksura
  0x064a: 'D', // Yaa
};

/**
 * Lam-Alef ligatures. Maps alef variant codepoint to [isolated, final] ligature forms.
 */
export const LAM_ALEF_LIGATURES: Record<number, [number, number]> = {
  0x0622: [0xfef5, 0xfef6], // Lam + Alef-Madda
  0x0623: [0xfef7, 0xfef8], // Lam + Alef-Hamza-Above
  0x0625: [0xfef9, 0xfefa], // Lam + Alef-Hamza-Below
  0x0627: [0xfefb, 0xfefc], // Lam + Alef
};

const PRESENTATION_TO_LOGICAL = new Map<number, string>();

for (const [base, forms] of Object.entries(ARABIC_FORMS)) {
  const baseChar = String.fromCodePoint(parseInt(base, 10));
  for (const form of forms) {
    if (form !== 0) {
      PRESENTATION_TO_LOGICAL.set(form, baseChar);
    }
  }
}

for (const [alefCode, forms] of Object.entries(LAM_ALEF_LIGATURES)) {
  const alefChar = String.fromCodePoint(parseInt(alefCode, 10));
  const lamAlef = '\u0644' + alefChar;
  PRESENTATION_TO_LOGICAL.set(forms[0], lamAlef);
  PRESENTATION_TO_LOGICAL.set(forms[1], lamAlef);
}

/**
 * Converts Unicode Presentation Forms-B characters back to logical Arabic characters.
 */
export function toLogicalArabic(text: string): string {
  let result = '';
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    if (PRESENTATION_TO_LOGICAL.has(cp)) {
      result += PRESENTATION_TO_LOGICAL.get(cp)!;
    } else {
      result += ch;
    }
  }
  return result;
}

/**
 * Returns true if the codepoint is an Arabic diacritic (tashkeel).
 */
export function isDiacritic(cp: number): boolean {
  return (
    (cp >= 0x064b && cp <= 0x065f) ||
    cp === 0x0670 ||
    (cp >= 0x06d6 && cp <= 0x06dc) ||
    (cp >= 0x06df && cp <= 0x06e4) ||
    (cp >= 0x06e7 && cp <= 0x06e8) ||
    (cp >= 0x06ea && cp <= 0x06ed)
  );
}

/**
 * Returns true if the codepoint is a base Arabic character (U+0621–U+064A).
 */
export function isArabicChar(cp: number): boolean {
  return cp >= 0x0621 && cp <= 0x064a;
}
