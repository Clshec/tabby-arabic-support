import { Injectable } from '@angular/core';
import { ConfigService, HotkeysService } from 'tabby-core';
import { TerminalDecorator, BaseTerminalTabComponent } from 'tabby-terminal';
import { Subscription } from 'rxjs';
import { ArabicOverlayRenderer } from './overlay-renderer';

@Injectable()
export class ArabicRtlDecorator extends TerminalDecorator {
  private renderers = new Map<BaseTerminalTabComponent<any>, ArabicOverlayRenderer>();
  private subscriptions = new Map<BaseTerminalTabComponent<any>, Subscription[]>();

  constructor(
    private config: ConfigService,
    private hotkeys: HotkeysService,
  ) {
    super();

    // Listen for global hotkey toggle
    this.hotkeys.hotkey$.subscribe((hotkey) => {
      if (hotkey === 'toggle-arabic-rtl') {
        const current = this.config.store.arabicSupport?.enabled ?? true;
        this.config.store.arabicSupport = {
          ...this.config.store.arabicSupport,
          enabled: !current,
        };
        this.config.save();
        this.updateAllRenderers();
      }
    });

    // Listen for config store changes
    this.config.changed$.subscribe(() => {
      this.updateAllRenderers();
    });
  }

  attach(terminal: BaseTerminalTabComponent<any>): void {
    const subs: Subscription[] = [];

    const hookTerminal = () => {
      const frontend = terminal.frontend as any;
      if (!frontend) return;

      const xterm = frontend.xterm;
      const hostElement = terminal.element?.nativeElement;

      if (xterm && hostElement && !this.renderers.has(terminal)) {
        const enabled = this.config.store.arabicSupport?.enabled ?? true;
        const mode = this.config.store.arabicSupport?.mode ?? 'auto';

        const renderer = new ArabicOverlayRenderer(xterm, hostElement);
        renderer.setOptions({ enabled, mode });
        this.renderers.set(terminal, renderer);

        // Track alternate screen status
        if (terminal.alternateScreenActive$) {
          const altSub = terminal.alternateScreenActive$.subscribe((active) => {
            renderer.setAlternateScreen(active);
          });
          subs.push(altSub);
        }
      }
    };

    if (terminal.frontendReady$) {
      const readySub = terminal.frontendReady$.subscribe(() => {
        hookTerminal();
      });
      subs.push(readySub);
    }

    if (terminal.frontend) {
      hookTerminal();
    }

    this.subscriptions.set(terminal, subs);
  }

  detach(terminal: BaseTerminalTabComponent<any>): void {
    const renderer = this.renderers.get(terminal);
    if (renderer) {
      renderer.destroy();
      this.renderers.delete(terminal);
    }

    const subs = this.subscriptions.get(terminal);
    if (subs) {
      subs.forEach((s) => s.unsubscribe());
      this.subscriptions.delete(terminal);
    }
  }

  private updateAllRenderers(): void {
    const enabled = this.config.store.arabicSupport?.enabled ?? true;
    const mode = this.config.store.arabicSupport?.mode ?? 'auto';

    this.renderers.forEach((renderer) => {
      renderer.setOptions({ enabled, mode });
    });
  }
}
