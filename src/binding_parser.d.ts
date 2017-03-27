import { Expression, ExpressionParser } from './expression/expression';
export declare class BindingParser {
    private _exprParser;
    constructor(_exprParser: ExpressionParser);
    parse(name: string, expression: string): EventBindingParseResult;
}
export declare class BindingParseResult {
    expression: Expression;
    constructor(expression: Expression);
}
export declare class EventBindingParseResult extends BindingParseResult {
    eventName: string;
    constructor(eventName: string, expression: Expression);
}
