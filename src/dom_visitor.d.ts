import { ClassType, Visitor, ViewData } from 'mojiito-core';
import { WrappedError } from './facade/error';
import { CompileComponentSummary } from './compiler/compile_result';
export declare class DomVisitor implements Visitor {
    private _selectorMatcher;
    private _componentsIndex;
    constructor(components: CompileComponentSummary[]);
    visitElement(element: Element, context: ViewData): any;
    visitAttribute(element: Element, attr: Attr, context: any): void;
    visitText(text: Text, context: any): void;
    visitComment(comment: Comment, context: any): void;
}
export declare class ParseError extends WrappedError {
    constructor(error: any);
}
export declare class MultipleComponentsOnElementError extends ParseError {
    constructor(components: ClassType<any>[]);
}
