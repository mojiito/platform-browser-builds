import { Renderer, RendererFactory, RendererType, Visitor } from 'mojiito-core';
export declare const NAMESPACE_URIS: {
    [ns: string]: string;
};
export declare class DomRendererFactory implements RendererFactory {
    private rendererByCompId;
    private defaultRenderer;
    constructor();
    createRenderer(element: any, type: RendererType): Renderer;
}
export declare class DefaultDomRenderer implements Renderer {
    parse(context: any): void;
    destroy(): void;
    createElement(name: string, namespace?: string): any;
    createComment(value: string): any;
    createText(value: string): any;
    destroyNode(node: any): void;
    appendChild(parent: any, newChild: any): void;
    insertBefore(parent: any, newChild: any, refChild: any): void;
    removeChild(parent: any, oldChild: any): void;
    selectRootElement(selectorOrNode: string | any): any;
    parentNode(node: any): any;
    nextSibling(node: any): any;
    setAttribute(el: any, name: string, value: string, namespace?: string): void;
    removeAttribute(el: any, name: string, namespace?: string): void;
    addClass(el: any, name: string): void;
    removeClass(el: any, name: string): void;
    setStyle(el: any, style: string, value: any, hasVendorPrefix: boolean, hasImportant: boolean): void;
    removeStyle(el: any, style: string, hasVendorPrefix: boolean): void;
    setProperty(el: any, name: string, value: any): void;
    setValue(node: any, value: string): void;
    listen(target: 'window' | 'document' | 'body' | any, event: string, callback: (event: any) => boolean | void): () => void;
}
export declare class ParseableDomRenderer extends DefaultDomRenderer {
    private _visitor;
    hostElement: Node;
    constructor(_visitor: Visitor, hostElement: Node);
    parse(context: any): void;
    destroyNode(node: any): void;
}
