/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare class StringMapWrapper {
    static merge<V>(m1: {
        [key: string]: V;
    }, m2: {
        [key: string]: V;
    }): {
        [key: string]: V;
    };
    static equals<V>(m1: {
        [key: string]: V;
    }, m2: {
        [key: string]: V;
    }): boolean;
}
export declare class ListWrapper {
    static findLast<T>(arr: T[], condition: (value: T) => boolean): T;
    static removeAll<T>(list: T[], items: T[]): void;
    static remove<T>(list: T[], el: T): boolean;
    static equals(a: any[], b: any[]): boolean;
    static flatten<T>(list: Array<T | T[]>): T[];
    static forEach<T>(list: ArrayLike<T>, callback: (item: T, index: number) => void): void;
}
