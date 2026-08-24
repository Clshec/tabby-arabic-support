import { ConfigService, HotkeysService } from 'tabby-core';
import { TerminalDecorator, BaseTerminalTabComponent } from 'tabby-terminal';
export declare class ArabicRtlDecorator extends TerminalDecorator {
    private config;
    private hotkeys;
    private renderers;
    private subscriptions;
    constructor(config: ConfigService, hotkeys: HotkeysService);
    attach(terminal: BaseTerminalTabComponent<any>): void;
    detach(terminal: BaseTerminalTabComponent<any>): void;
    private updateAllRenderers;
}
