import { containsRTL } from './rtl-detector';

export interface OverlayOptions {
  enabled: boolean;
  mode: 'auto' | 'on' | 'off';
}

const PALETTE_16 = [
  '#000000', '#cd3131', '#0dbc79', '#e5e510',
  '#2472c8', '#bc3fbc', '#11a8cd', '#e5e5e5',
  '#666666', '#f14c4c', '#23d18b', '#f5f543',
  '#3b8eea', '#d670d6', '#29b8db', '#ffffff',
];

function palette256(index: number): string {
  if (index < 16) return PALETTE_16[index];
  if (index < 232) {
    const i = index - 16;
    const r = Math.floor(i / 36) * 51;
    const g = Math.floor((i % 36) / 6) * 51;
    const b = (i % 6) * 51;
    return `rgb(${r},${g},${b})`;
  }
  const gray = (index - 232) * 10 + 8;
  return `rgb(${gray},${gray},${gray})`;
}

interface LineCacheEntry {
  rawText: string;
  cursorX: number;
  topPx: number;
  el: HTMLElement;
}

export class ArabicOverlayRenderer {
  private overlayContainer: HTMLElement | null = null;
  private disposables: (() => void)[] = [];
  private animationFrameId: number | null = null;
  private isRenderScheduled = false;
  private isDestroyed = false;
  private alternateScreenActive = false;
  private options: OverlayOptions = { enabled: true, mode: 'auto' };

  // Cache rendered DOM lines to prevent layout thrashing and GC pauses
  private lineCache = new Map<number, LineCacheEntry>();

  constructor(
    private xterm: any,
    private hostElement: HTMLElement
  ) {
    this.init();
  }

  setOptions(options: Partial<OverlayOptions>): void {
    this.options = { ...this.options, ...options };
    this.clearAll();
    this.scheduleRender();
  }

  setAlternateScreen(active: boolean): void {
    this.alternateScreenActive = active;
    this.clearAll();
    this.scheduleRender();
  }

  private init(): void {
    this.injectStyles();
    this.bindXtermEvents();
    this.scheduleRender();
  }

  private ensureOverlayContainer(): HTMLElement | null {
    if (this.isDestroyed) return null;

    const xtermScreen =
      (this.hostElement.querySelector('.xterm-screen') as HTMLElement) ||
      (this.hostElement.querySelector('.xterm') as HTMLElement);

    if (!xtermScreen) return null;

    if (window.getComputedStyle(xtermScreen).position === 'static') {
      xtermScreen.style.position = 'relative';
    }

    if (!this.overlayContainer || this.overlayContainer.parentElement !== xtermScreen) {
      if (this.overlayContainer && this.overlayContainer.parentElement) {
        this.overlayContainer.parentElement.removeChild(this.overlayContainer);
      }
      this.lineCache.clear();

      const overlay = document.createElement('div');
      overlay.className = 'tabby-arabic-overlay';
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.right = '0';
      overlay.style.bottom = '0';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '4';
      overlay.style.overflow = 'hidden';

      xtermScreen.appendChild(overlay);
      this.overlayContainer = overlay;
    }

    return this.overlayContainer;
  }

  private injectStyles(): void {
    const styleId = 'tabby-arabic-overlay-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        .tabby-arabic-overlay .arabic-line {
          position: absolute;
          left: 0;
          right: 0;
          width: 100%;
          white-space: pre;
          direction: ltr;
          unicode-bidi: embed;
          text-align: left;
          pointer-events: none;
          box-sizing: border-box;
          font-feature-settings: "liga" 1, "calt" 1;
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }
        .tabby-arabic-overlay .overlay-cursor {
          display: inline-block;
          width: 2px;
          background: currentColor;
          animation: tabbyArabicBlink 1s step-end infinite;
          vertical-align: text-bottom;
          position: absolute;
        }
        @keyframes tabbyArabicBlink {
          50% { opacity: 0; }
        }
        .tabby-arabic-overlay .overlay-selected {
          background: rgba(38, 79, 120, 0.6) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  private bindXtermEvents(): void {
    if (!this.xterm) return;

    // Only subscribe to core render & layout events to avoid event floods
    const events = [
      this.xterm.onRender?.(() => this.scheduleRender()),
      this.xterm.onScroll?.(() => {
        this.clearAll();
        this.scheduleRender();
      }),
      this.xterm.onResize?.(() => {
        this.clearAll();
        this.scheduleRender();
      }),
      this.xterm.onSelectionChange?.(() => this.scheduleRender()),
    ];

    for (const ev of events) {
      if (ev && typeof ev.dispose === 'function') {
        this.disposables.push(() => ev.dispose());
      }
    }
  }

  scheduleRender(): void {
    if (this.isDestroyed || this.isRenderScheduled) return;

    this.isRenderScheduled = true;
    this.animationFrameId = requestAnimationFrame(() => {
      this.isRenderScheduled = false;
      this.render();
    });
  }

  private clearAll(): void {
    if (this.overlayContainer) {
      while (this.overlayContainer.firstChild) {
        this.overlayContainer.removeChild(this.overlayContainer.firstChild);
      }
    }
    this.lineCache.clear();
  }

  private getCellDims() {
    const core = (this.xterm as any)?._core;
    if (core && core._renderService && core._renderService.dimensions) {
      const d = core._renderService.dimensions;
      return {
        cellW: d.css?.cell?.width || 10,
        cellH: d.css?.cell?.height || 22,
        canvasTop: d.css?.canvas?.top || 0,
        canvasLeft: d.css?.canvas?.left || 0,
      };
    }

    const fontSize = this.xterm?.options?.fontSize || 16;
    return {
      cellW: fontSize * 0.6,
      cellH: fontSize * 1.3,
      canvasTop: 0,
      canvasLeft: 0,
    };
  }

  private getCellColor(cell: any): string {
    const defaultFg = this.xterm?.options?.theme?.foreground || '#d4d4d4';
    try {
      if (cell.isFgPalette && cell.isFgPalette()) {
        const idx = cell.getFgColor();
        return idx < 16 ? PALETTE_16[idx] : palette256(idx);
      } else if (cell.isFgRGB && cell.isFgRGB()) {
        const rgb = cell.getFgColor();
        return `rgb(${(rgb >> 16) & 0xff},${(rgb >> 8) & 0xff},${rgb & 0xff})`;
      }
    } catch {
      // ignore
    }
    return defaultFg;
  }

  private getCellBgColor(cell: any): string | null {
    try {
      if (cell.isBgPalette && cell.isBgPalette()) {
        const idx = cell.getBgColor();
        return idx < 16 ? PALETTE_16[idx] : palette256(idx);
      } else if (cell.isBgRGB && cell.isBgRGB()) {
        const rgb = cell.getBgColor();
        return `rgb(${(rgb >> 16) & 0xff},${(rgb >> 8) & 0xff},${rgb & 0xff})`;
      }
    } catch {
      // ignore
    }
    return null;
  }

  private render(): void {
    if (this.isDestroyed || !this.xterm) return;

    if (!this.options.enabled || this.options.mode === 'off') {
      this.clearAll();
      return;
    }

    const container = this.ensureOverlayContainer();
    if (!container) return;

    const buf = this.xterm.buffer?.active;
    if (!buf) return;

    const dims = this.getCellDims();
    const viewportY = buf.viewportY;
    const rows = this.xterm.rows || 24;
    const fontSize = this.xterm.options?.fontSize ? `${this.xterm.options.fontSize}px` : '16px';
    const themeBg = this.xterm.options?.theme?.background || '#171717';
    const configuredFont = this.xterm.options?.fontFamily || '';
    const fontFamily = configuredFont
      ? `${configuredFont}, 'Cascadia Mono', 'Cascadia Code', 'Consolas', 'Segoe UI', monospace`
      : `'Cascadia Mono', 'Cascadia Code', 'Consolas', 'Segoe UI', monospace`;

    const activeRows = new Set<number>();

    for (let y = 0; y < rows; y++) {
      const bufLine = buf.getLine(viewportY + y);
      if (!bufLine) {
        this.removeCachedLine(y);
        continue;
      }

      const trimmedStr = bufLine.translateToString(true);
      if (!trimmedStr || !containsRTL(trimmedStr)) {
        this.removeCachedLine(y);
        continue;
      }

      activeRows.add(y);
      const isCursorRow = y === buf.cursorY;
      const cursorX = isCursorRow ? buf.cursorX : -1;
      const topPx = dims.canvasTop + y * dims.cellH;

      // Check if line is already rendered identically in cache (Diffing)
      const cached = this.lineCache.get(y);
      if (
        cached &&
        cached.rawText === trimmedStr &&
        cached.cursorX === cursorX &&
        cached.topPx === topPx
      ) {
        // Line content and cursor have not changed — skip DOM manipulation entirely
        continue;
      }

      // Rebuild only this specific line
      const lineDiv = this.buildLineElement(
        bufLine,
        dims,
        topPx,
        fontSize,
        fontFamily,
        themeBg,
        cursorX
      );

      if (cached && cached.el.parentNode === container) {
        container.replaceChild(lineDiv, cached.el);
      } else {
        container.appendChild(lineDiv);
      }

      this.lineCache.set(y, {
        rawText: trimmedStr,
        cursorX,
        topPx,
        el: lineDiv,
      });
    }

    // Clean up any stale rows that are no longer active
    for (const cachedY of Array.from(this.lineCache.keys())) {
      if (!activeRows.has(cachedY)) {
        this.removeCachedLine(cachedY);
      }
    }
  }

  private removeCachedLine(y: number): void {
    const entry = this.lineCache.get(y);
    if (entry) {
      if (entry.el.parentNode) {
        entry.el.parentNode.removeChild(entry.el);
      }
      this.lineCache.delete(y);
    }
  }

  private buildLineElement(
    bufLine: any,
    dims: any,
    topPx: number,
    fontSize: string,
    fontFamily: string,
    themeBg: string,
    cursorX: number
  ): HTMLElement {
    const lineDiv = document.createElement('div');
    lineDiv.className = 'arabic-line';
    lineDiv.style.top = `${topPx}px`;
    lineDiv.style.height = `${dims.cellH}px`;
    lineDiv.style.lineHeight = `${dims.cellH}px`;
    lineDiv.style.fontSize = fontSize;
    lineDiv.style.fontFamily = fontFamily;
    lineDiv.style.backgroundColor = themeBg;

    const lineLen = bufLine.length;
    let currentSpan: HTMLSpanElement | null = null;
    let currentKey = '';

    for (let x = 0; x < lineLen; x++) {
      const cell = bufLine.getCell(x);
      if (!cell) continue;

      const ch = cell.getChars();
      const width = cell.getWidth();
      if (width === 0) continue;

      const fgColor = this.getCellColor(cell);
      const bgColor = this.getCellBgColor(cell);

      let bold = false;
      let dim = false;
      let italic = false;
      let underline = false;

      try {
        bold = !!(cell.isBold && cell.isBold());
        dim = !!(cell.isDim && cell.isDim());
        italic = !!(cell.isItalic && cell.isItalic());
        underline = !!(cell.isUnderline && cell.isUnderline());
      } catch {
        // ignore
      }

      const key = `${fgColor}|${bgColor || ''}|${bold ? 'b' : ''}${dim ? 'd' : ''}${italic ? 'i' : ''}${underline ? 'u' : ''}`;

      if (key !== currentKey || !currentSpan) {
        currentSpan = document.createElement('span');
        currentSpan.style.color = fgColor;
        if (bgColor) currentSpan.style.backgroundColor = bgColor;
        if (bold) currentSpan.style.fontWeight = 'bold';
        if (dim) currentSpan.style.opacity = '0.6';
        if (italic) currentSpan.style.fontStyle = 'italic';
        if (underline) currentSpan.style.textDecoration = 'underline';

        lineDiv.appendChild(currentSpan);
        currentKey = key;
      }

      currentSpan.textContent += ch || ' ';
    }

    // Draw cursor if on this visible line
    if (cursorX >= 0) {
      const cursorEl = document.createElement('span');
      cursorEl.className = 'overlay-cursor';
      cursorEl.style.left = `${dims.canvasLeft + cursorX * dims.cellW}px`;
      cursorEl.style.height = `${dims.cellH}px`;
      cursorEl.style.color = this.xterm.options?.theme?.cursor || '#d4d4d4';
      lineDiv.appendChild(cursorEl);
    }

    return lineDiv;
  }

  destroy(): void {
    this.isDestroyed = true;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.disposables.forEach((d) => d());
    this.disposables = [];
    this.clearAll();
    if (this.overlayContainer && this.overlayContainer.parentNode) {
      this.overlayContainer.parentNode.removeChild(this.overlayContainer);
    }
    this.overlayContainer = null;
  }
}
