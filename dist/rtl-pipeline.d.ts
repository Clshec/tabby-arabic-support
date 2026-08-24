export type RtlMode = 'auto' | 'on' | 'off';
export declare class RtlPipeline {
    private ansiParser;
    private reshaper;
    private bidiEngine;
    private arabicWordBuffer;
    process(raw: string, mode: RtlMode): string;
    reset(): void;
    private isSingleArabicChar;
    private handleInteractiveEcho;
}
