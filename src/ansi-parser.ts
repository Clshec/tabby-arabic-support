export interface AnsiCode {
  position: number;
  code: string;
}

export interface StripResult {
  cleanText: string;
  codes: AnsiCode[];
}

// Matches: CSI sequences (including private modes like ?25h), OSC sequences, DCS/PM/APC/SOS, charset designations, and single-byte/2-byte ESC codes
const ANSI_PATTERN =
  /\x1b(?:\[[\x30-\x3F]*[\x20-\x2F]*[\x40-\x7E]|\][^\x07\x1b]*(?:\x07|\x1b\\)|[P_^\x58][^\x1b]*\x1b\\|[\x20-\x2F][\x30-\x7E]|[\x30-\x7E])/g;

export class AnsiParser {
  /**
   * Strips ANSI escape sequences from `input`, returning the clean text and
   * a list of codes with their positions in the clean text.
   */
  strip(input: string): StripResult {
    const codes: AnsiCode[] = [];
    let cleanText = '';
    let lastIndex = 0;

    const re = new RegExp(ANSI_PATTERN.source, 'g');
    let match: RegExpExecArray | null;

    while ((match = re.exec(input)) !== null) {
      cleanText += input.slice(lastIndex, match.index);
      codes.push({ position: cleanText.length, code: match[0] });
      lastIndex = match.index + match[0].length;
    }

    cleanText += input.slice(lastIndex);
    return { cleanText, codes };
  }

  /**
   * Re-inserts ANSI codes into `text` at their recorded positions.
   */
  restore(text: string, codes: AnsiCode[]): string {
    if (codes.length === 0) return text;

    const sorted = [...codes].sort((a, b) => a.position - b.position);
    let result = '';
    let cursor = 0;

    for (const { position, code } of sorted) {
      // Clamp position to text length to prevent undefined/out-of-bounds slice
      const safePos = Math.min(position, text.length);
      result += text.slice(cursor, safePos) + code;
      cursor = safePos;
    }

    result += text.slice(cursor);
    return result;
  }

  /**
   * Like `restore`, but remaps each code's position through `indexMap` first.
   * Used when Arabic reshaping has shifted character positions.
   */
  restoreWithMapping(
    text: string,
    codes: AnsiCode[],
    indexMap: Map<number, number>
  ): string {
    const remapped: AnsiCode[] = codes.map(({ position, code }) => ({
      position: indexMap.has(position) ? (indexMap.get(position) as number) : position,
      code,
    }));
    return this.restore(text, remapped);
  }
}
