export interface OverlayOptions {
    enabled: boolean;
    mode: 'auto' | 'on' | 'off';
}
export declare class ArabicOverlayRenderer {
    private xterm;
    private hostElement;
    private overlayContainer;
    private disposables;
    private animationFrameId;
    private isDestroyed;
    private alternateScreenActive;
    private options;
    constructor(xterm: any, hostElement: HTMLElement);
    setOptions(options: Partial<OverlayOptions>): void;
    setAlternateScreen(active: boolean): void;
    private init;
    private ensureOverlayContainer;
    private injectStyles;
    private bindXtermEvents;
    scheduleRender(): void;
    private clearOverlay;
    private getCellDims;
    private getCellColor;
    private getCellBgColor;
    private render;
    destroy(): void;
}
