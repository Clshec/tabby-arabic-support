import { AnsiParser } from './ansi-parser';
import { ArabicReshaper } from './arabic-reshaper';
import { BidiEngine } from './bidi-engine';
import { containsRTL } from './rtl-detector';

export type RtlMode = 'auto' | 'on' | 'off';

export class RtlPipeline {
  private ansiParser = new AnsiParser();
  private reshaper = new ArabicReshaper();
  private bidiEngine = new BidiEngine();

  // Track interactive Arabic typing echo on current line for raw single-char shells
  private arabicWordBuffer: string[] = [];

  process(raw: string, mode: RtlMode): string {
    if (mode === 'off') {
      return raw;
    }

    // Strip ANSI escape codes
    const { cleanText, codes } = this.ansiParser.strip(raw);

    // Reset buffer on newlines or carriage returns
    if (cleanText.includes('\n') || cleanText.includes('\r')) {
      this.arabicWordBuffer = [];
    }

    // Handle backspace
    if (raw === '\x7f' || raw === '\b' || cleanText === '\x7f' || cleanText === '\b') {
      if (this.arabicWordBuffer.length > 0) {
        this.arabicWordBuffer.pop();
      }
      return raw;
    }

    // Handle single Arabic character keystroke echo in raw Linux SSH / Bash
    if (this.isSingleArabicChar(cleanText) && codes.length === 0) {
      return this.handleInteractiveEcho(cleanText);
    }

    // If not a single Arabic char, reset typing word buffer
    if (!this.isSingleArabicChar(cleanText)) {
      this.arabicWordBuffer = [];
    }

    // If auto mode and no RTL characters, return raw untouched
    if (mode === 'auto' && !containsRTL(cleanText)) {
      return raw;
    }

    // Process line by line
    const lines = cleanText.split('\n');
    const processedLines: string[] = [];

    for (const line of lines) {
      if (line.length === 0 || !containsRTL(line)) {
        processedLines.push(line);
        continue;
      }

      // 1. Contextual Arabic reshaping (isolated -> initial/medial/final/ligatures)
      const { reshaped } = this.reshaper.reshapeWithMap(line);

      // 2. Unicode Bidirectional algorithm reordering with LTR base
      const { reordered } = this.bidiEngine.reorderWithMap(reshaped, 'ltr');

      processedLines.push(reordered);
    }

    const processedText = processedLines.join('\n');

    // Restore ANSI escape codes at their exact relative positions
    return this.ansiParser.restore(processedText, codes);
  }

  reset(): void {
    this.arabicWordBuffer = [];
  }

  private isSingleArabicChar(text: string): boolean {
    const chars = [...text];
    if (chars.length !== 1) return false;
    const cp = chars[0].codePointAt(0)!;
    return cp >= 0x0600 && cp <= 0x06ff;
  }

  private handleInteractiveEcho(char: string): string {
    this.arabicWordBuffer.push(char);

    // If first character, reshape and return
    if (this.arabicWordBuffer.length === 1) {
      const reshaped = this.reshaper.reshape(char);
      return this.bidiEngine.reorder(reshaped, 'ltr');
    }

    // Move cursor back by (length - 1) cells to replace previous characters with the updated reordered word
    const prevCount = this.arabicWordBuffer.length - 1;
    const moveBack = '\b'.repeat(prevCount);

    const fullWord = this.arabicWordBuffer.join('');
    const reshaped = this.reshaper.reshape(fullWord);
    const reordered = this.bidiEngine.reorder(reshaped, 'ltr');

    return moveBack + reordered;
  }
}
