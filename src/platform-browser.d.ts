import { PlatformRef, Provider } from 'mojiito-core';
import { BrowserPlatformRef } from './platform_ref';
import { DOCUMENT } from './tokens';
import { DomRendererFactory } from './dom_renderer';
import { ExpressionParser } from './expression/expression';
export { DOCUMENT, DomRendererFactory, BrowserPlatformRef, ExpressionParser };
export declare const PLATFORM_PROVIDERS: Provider[];
export declare const platformBrowser: (extraProviders?: Provider[]) => PlatformRef;
