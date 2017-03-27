import { PlatformRef, Injector, ClassType, ComponentResolver } from 'mojiito-core';
import { Compiler } from './compiler/compiler';
export declare class BrowserPlatformRef extends PlatformRef {
    private _injector;
    private _resolver;
    private _compiler;
    private _destroyed;
    private _destroyListeners;
    constructor(_injector: Injector, _resolver: ComponentResolver, _compiler: Compiler);
    readonly injector: Injector;
    readonly destroyed: boolean;
    bootstrapComponent<C>(component: ClassType<C>): void;
    onDestroy(callback: () => void): void;
    destroy(): void;
}
