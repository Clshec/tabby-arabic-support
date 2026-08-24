import bidiFactory from 'bidi-js';

export interface ReorderResult {
  reordered: string;
  indexMap: Map<number, number>;
}

export class BidiEngine {
  private bidi = bidiFactory();

  reorder(text: string, baseDir: 'ltr' | 'rtl' | 'auto' = 'ltr'): string {
    return this.reorderWithMap(text, baseDir).reordered;
  }

  reorderWithMap(
    text: string,
    baseDir: 'ltr' | 'rtl' | 'auto' = 'ltr'
  ): ReorderResult {
    if (text.length === 0) {
      return { reordered: '', indexMap: new Map() };
    }

    // Get embedding levels with LTR base direction so prompt symbols (> $ #) stay on the left
    const embeddingLevels = this.bidi.getEmbeddingLevels(text, baseDir);

    // Get reorder segments
    const flips = this.bidi.getReorderSegments(
      text,
      embeddingLevels,
      0,
      text.length - 1
    );

    // Get mirrored characters
    const mirroredMap = this.bidi.getMirroredCharactersMap(
      text,
      embeddingLevels
    );

    // Build character array with indices
    const chars = [...text];
    const indices = chars.map((_, i) => i);

    // Apply mirroring first
    mirroredMap.forEach((replacement: any, index: any) => {
      chars[index] = replacement;
    });

    // Apply reordering flips
    for (const [start, end] of flips) {
      let s = start;
      let e = end;
      while (s < e) {
        [chars[s], chars[e]] = [chars[e], chars[s]];
        [indices[s], indices[e]] = [indices[e], indices[s]];
        s++;
        e--;
      }
    }

    // Build index map: original index → new index
    const indexMap = new Map<number, number>();
    for (let i = 0; i < indices.length; i++) {
      indexMap.set(i, indices[i]);
    }

    return {
      reordered: chars.join(''),
      indexMap,
    };
  }
}
