import { Visitor, ViewData } from 'mojiito-core';
export interface Traverser {
    traverse(node: any, visitor: Visitor, context: ViewData): void;
}
export declare class DomTraverser implements Traverser {
    private _nodeCount;
    private _elementCount;
    private _attributeCount;
    private _textCount;
    private _commentCount;
    constructor();
    traverse(node: Node, visitor: Visitor, context?: ViewData): void;
}
