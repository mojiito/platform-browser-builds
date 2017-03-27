/**
 * Returns the class name of a type.
 *
 * @export
 * @template T
 * @param {Function} klass
 * @returns
 */
export declare function getClassName<T>(klass: Function): any;
/**
 * Tries to stringify a token. A token can be any type.
 *
 * @export
 * @param {*} token
 * @returns {string}
 */
export declare function stringify(token: any): string;
export interface BrowserNodeGlobal {
    Object: typeof Object;
    Array: typeof Array;
    Map: typeof Map;
    Set: typeof Set;
    Date: DateConstructor;
    RegExp: RegExpConstructor;
    JSON: typeof JSON;
    Math: any;
    assert(condition: any): void;
    Reflect: any;
    setTimeout: Function;
    clearTimeout: Function;
    setInterval: Function;
    clearInterval: Function;
    encodeURI: Function;
}
declare let globalScope: BrowserNodeGlobal;
export { globalScope as global };
export declare function isPresent(obj: any): boolean;
export declare function isBlank(obj: any): boolean;
export declare class NumberWrapper {
    static parseIntAutoRadix(text: string): number;
    static isNumeric(value: any): boolean;
}
