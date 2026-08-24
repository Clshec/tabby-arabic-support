import {
  ARABIC_FORMS,
  JOINING_TYPES,
  LAM_ALEF_LIGATURES,
  isDiacritic,
  isArabicChar,
} from './arabic-data';

export interface ReshapeResult {
  reshaped: string;
  indexMap: Map<number, number>;
}

export class ArabicReshaper {
  /**
   * Reshape Arabic text, replacing base characters with their contextual
   * presentation forms and producing lam-alef ligatures.
   */
  reshape(text: string): string {
    return this.reshapeWithMap(text).reshaped;
  }

  /**
   * Reshape Arabic text and return a mapping from original codepoint indices
   * to reshaped string indices.
   */
  reshapeWithMap(text: string): ReshapeResult {
    if (text.length === 0) {
      return { reshaped: '', indexMap: new Map() };
    }

    // Collect codepoints (handling surrogate pairs)
    const cps: number[] = [];
    for (const ch of text) {
      cps.push(ch.codePointAt(0)!);
    }

    const out: number[] = [];
    const indexMap = new Map<number, number>();
    let i = 0;

    while (i < cps.length) {
      const cp = cps[i];

      // Check for lam-alef ligature
      if (cp === 0x0644) {
        const alefIdx = this.findNextNonDiacritic(cps, i);
        if (alefIdx !== -1 && LAM_ALEF_LIGATURES[cps[alefIdx]]) {
          const ligature = LAM_ALEF_LIGATURES[cps[alefIdx]];
          const prevJoins = this.prevCanJoinRight(cps, i);
          const form = prevJoins ? ligature[1] : ligature[0];

          indexMap.set(i, out.length);
          out.push(form);

          // Copy any diacritics between lam and alef
          for (let d = i + 1; d < alefIdx; d++) {
            indexMap.set(d, out.length);
            out.push(cps[d]);
          }
          indexMap.set(alefIdx, indexMap.get(i)!);

          // Copy any diacritics after alef
          i = alefIdx + 1;
          while (i < cps.length && isDiacritic(cps[i])) {
            indexMap.set(i, out.length);
            out.push(cps[i]);
            i++;
          }
          continue;
        }
      }

      // Non-Arabic: pass through
      if (!isArabicChar(cp)) {
        indexMap.set(i, out.length);
        out.push(cp);
        i++;
        continue;
      }

      // Diacritics: pass through
      if (isDiacritic(cp)) {
        indexMap.set(i, out.length);
        out.push(cp);
        i++;
        continue;
      }

      // Arabic base character — determine contextual form
      const forms = ARABIC_FORMS[cp];
      if (!forms) {
        // Unknown Arabic char, pass through
        indexMap.set(i, out.length);
        out.push(cp);
        i++;
        continue;
      }

      const joiningType = JOINING_TYPES[cp];
      const prevJoins = this.prevCanJoinRight(cps, i);
      const nextJoins = this.nextCanJoinLeft(cps, i);

      let formCp: number;

      if (joiningType === 'D') {
        if (prevJoins && nextJoins && forms[3] !== 0) {
          formCp = forms[3]; // medial
        } else if (prevJoins && forms[1] !== 0) {
          formCp = forms[1]; // final
        } else if (nextJoins && forms[2] !== 0) {
          formCp = forms[2]; // initial
        } else {
          formCp = forms[0]; // isolated
        }
      } else if (joiningType === 'R') {
        if (prevJoins && forms[1] !== 0) {
          formCp = forms[1]; // final
        } else {
          formCp = forms[0]; // isolated
        }
      } else if (joiningType === 'C') {
        // Tatweel — pass through
        formCp = forms[0];
      } else {
        // U (non-joining)
        formCp = forms[0]; // isolated
      }

      indexMap.set(i, out.length);
      out.push(formCp);
      i++;
    }

    return {
      reshaped: String.fromCodePoint(...out),
      indexMap,
    };
  }

  /**
   * Find the next non-diacritic codepoint index after `index`.
   * Returns -1 if none found.
   */
  private findNextNonDiacritic(cps: number[], index: number): number {
    let j = index + 1;
    while (j < cps.length && isDiacritic(cps[j])) {
      j++;
    }
    return j < cps.length ? j : -1;
  }

  /**
   * Check if the previous base character (skipping diacritics) can join
   * to the right — i.e. has joining type D or C.
   */
  private prevCanJoinRight(cps: number[], index: number): boolean {
    let j = index - 1;
    while (j >= 0 && isDiacritic(cps[j])) {
      j--;
    }
    if (j < 0) return false;
    const jt = JOINING_TYPES[cps[j]];
    return jt === 'D' || jt === 'C';
  }

  /**
   * Check if the next base character (skipping diacritics) can join
   * to the left — i.e. has joining type R, D, or C.
   */
  private nextCanJoinLeft(cps: number[], index: number): boolean {
    let j = index + 1;
    while (j < cps.length && isDiacritic(cps[j])) {
      j++;
    }
    if (j >= cps.length) return false;
    const jt = JOINING_TYPES[cps[j]];
    return jt === 'R' || jt === 'D' || jt === 'C';
  }
}
