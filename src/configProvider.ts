import { Injectable } from '@angular/core';
import { ConfigProvider } from 'tabby-core';

@Injectable()
export class ArabicConfigProvider extends ConfigProvider {
  defaults = {
    arabicSupport: {
      enabled: true,
      mode: 'auto', // 'auto' | 'on' | 'off'
    },
  };
}
