export interface AnsiCode {
    position: number;
    code: string;
}
export interface StripResult {
    cleanText: string;
    codes: AnsiCode[];
}
export declare class AnsiParser {
    /**
     * Strips ANSI escape sequences from `input`, returning the clean text and
     * a list of codes with their positions in the clean text.
     */
    strip(input: string): StripResult;
    /**
     * Re-inserts ANSI codes into `text` at their recorded positions.
     */
    restore(text: string, codes: AnsiCode[]): string;
    /**
     * Like `restore`, but remaps each code's position through `indexMap` first.
     * Used when Arabic reshaping has shifted character positions.
     */
    restoreWithMapping(text: string, codes: AnsiCode[], indexMap: Map<number, number>): string;
}
