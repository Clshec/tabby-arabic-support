import { Injectable } from '@angular/core';
import { HotkeyDescription, HotkeyProvider } from 'tabby-core';

@Injectable()
export class ArabicHotkeyProvider extends HotkeyProvider {
  async provide(): Promise<HotkeyDescription[]> {
    return [
      {
        id: 'toggle-arabic-rtl',
        name: 'Toggle Arabic / RTL Support',
      },
    ];
  }
}
