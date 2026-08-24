export interface ReshapeResult {
    reshaped: string;
    indexMap: Map<number, number>;
}
export declare class ArabicReshaper {
    /**
     * Reshape Arabic text, replacing base characters with their contextual
     * presentation forms and producing lam-alef ligatures.
     */
    reshape(text: string): string;
    /**
     * Reshape Arabic text and return a mapping from original codepoint indices
     * to reshaped string indices.
     */
    reshapeWithMap(text: string): ReshapeResult;
    /**
     * Find the next non-diacritic codepoint index after `index`.
     * Returns -1 if none found.
     */
    private findNextNonDiacritic;
    /**
     * Check if the previous base character (skipping diacritics) can join
     * to the right — i.e. has joining type D or C.
     */
    private prevCanJoinRight;
    /**
     * Check if the next base character (skipping diacritics) can join
     * to the left — i.e. has joining type R, D, or C.
     */
    private nextCanJoinLeft;
}
