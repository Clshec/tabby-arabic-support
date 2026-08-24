import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import TabbyCoreModule, { ConfigProvider, HotkeyProvider } from 'tabby-core';
import { TerminalDecorator } from 'tabby-terminal';

import { ArabicRtlDecorator } from './decorator';
import { ArabicConfigProvider } from './configProvider';
import { ArabicHotkeyProvider } from './hotkeyProvider';

export * from './arabic-reshaper';
export * from './arabic-data';
export * from './bidi-engine';
export * from './rtl-detector';
export * from './ansi-parser';
export * from './rtl-pipeline';
export * from './overlay-renderer';
export * from './decorator';
export * from './configProvider';
export * from './hotkeyProvider';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TabbyCoreModule,
  ],
  providers: [
    { provide: TerminalDecorator, useClass: ArabicRtlDecorator, multi: true },
    { provide: ConfigProvider, useClass: ArabicConfigProvider, multi: true },
    { provide: HotkeyProvider, useClass: ArabicHotkeyProvider, multi: true },
  ],
})
export default class ArabicSupportModule {}
