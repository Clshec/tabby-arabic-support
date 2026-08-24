export interface ReorderResult {
    reordered: string;
    indexMap: Map<number, number>;
}
export declare class BidiEngine {
    private bidi;
    reorder(text: string, baseDir?: 'ltr' | 'rtl' | 'auto'): string;
    reorderWithMap(text: string, baseDir?: 'ltr' | 'rtl' | 'auto'): ReorderResult;
}
