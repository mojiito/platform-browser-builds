/**
 * @license Mojiito v2.0.0-alpha.3-16baa53
 * (c) 2010-2017 Thomas Pink
 * License: MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('mojiito-core')) :
	typeof define === 'function' && define.amd ? define(['exports', 'mojiito-core'], factory) :
	(factory((global.mj = global.mj || {}, global.mj.platformBrowser = global.mj.platformBrowser || {}),global.mj.core));
}(this, (function (exports,mojiitoCore) { 'use strict';

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @license Mojiito v2.0.0-alpha.3-16baa53
 * (c) 2010-2017 Thomas Pink
 * License: MIT
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ListWrapper = (function () {
    function ListWrapper() {
    }
    /**
     * @template T
     * @param {?} arr
     * @param {?} condition
     * @return {?}
     */
    ListWrapper.findLast = function (arr, condition) {
        for (var /** @type {?} */ i = arr.length - 1; i >= 0; i--) {
            if (condition(arr[i])) {
                return arr[i];
            }
        }
        return null;
    };
    /**
     * @template T
     * @param {?} list
     * @param {?} items
     * @return {?}
     */
    ListWrapper.removeAll = function (list, items) {
        for (var /** @type {?} */ i = 0; i < items.length; ++i) {
            var /** @type {?} */ index = list.indexOf(items[i]);
            if (index > -1) {
                list.splice(index, 1);
            }
        }
    };
    /**
     * @template T
     * @param {?} list
     * @param {?} el
     * @return {?}
     */
    ListWrapper.remove = function (list, el) {
        var /** @type {?} */ index = list.indexOf(el);
        if (index > -1) {
            list.splice(index, 1);
            return true;
        }
        return false;
    };
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    ListWrapper.equals = function (a, b) {
        if (a.length != b.length)
            return false;
        for (var /** @type {?} */ i = 0; i < a.length; ++i) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    };
    /**
     * @template T
     * @param {?} list
     * @return {?}
     */
    ListWrapper.flatten = function (list) {
        return list.reduce(function (flat, item) {
            var /** @type {?} */ flatItem = Array.isArray(item) ? ListWrapper.flatten(item) : item;
            return ((flat)).concat(flatItem);
        }, []);
    };
    /**
     * @template T
     * @param {?} list
     * @param {?} callback
     * @return {?}
     */
    ListWrapper.forEach = function (list, callback) {
        for (var /** @type {?} */ i = 0, /** @type {?} */ max = list.length; i < max; i++) {
            callback.call(callback, list[i], i);
        }
    };
    return ListWrapper;
}());
var _SELECTOR_REGEXP = new RegExp('(\\:not\\()|' +
    '([-\\w]+)|' +
    '(?:\\.([-\\w]+))|' +
    // "-" should appear first in the regexp below as FF31 parses "[.-\w]" as a range
    '(?:\\[([-.\\w*]+)(?:=([^\\]]*))?\\])|' +
    '(\\))|' +
    '(\\s*,\\s*)', // ","
'g');
/**
 * A css selector contains an element name,
 * css classes and attribute/value pairs with the purpose
 * of selecting subsets out of them.
 */
var CssSelector = (function () {
    function CssSelector() {
        this.element = null;
        this.classNames = [];
        this.attrs = [];
        this.notSelectors = [];
    }
    /**
     * @param {?} element
     * @return {?}
     */
    CssSelector.fromElement = function (element) {
        var /** @type {?} */ selector = new CssSelector();
        selector.setElement(element.tagName.toLocaleLowerCase());
        ListWrapper.forEach(element.attributes, function (attr) {
            if (attr.name.toLocaleLowerCase() !== 'class') {
                selector.addAttribute(attr.name.trim(), attr.value.trim());
            }
        });
        ListWrapper.forEach(element.classList, function (c) { return selector.addClassName(c); });
        return selector;
    };
    /**
     * @param {?} selector
     * @return {?}
     */
    CssSelector.parse = function (selector) {
        var /** @type {?} */ results = [];
        var /** @type {?} */ _addResult = function (res, cssSel) {
            if (cssSel.notSelectors.length > 0 && !cssSel.element && cssSel.classNames.length == 0 &&
                cssSel.attrs.length == 0) {
                cssSel.element = '*';
            }
            res.push(cssSel);
        };
        var /** @type {?} */ cssSelector = new CssSelector();
        var /** @type {?} */ match;
        var /** @type {?} */ current = cssSelector;
        var /** @type {?} */ inNot = false;
        _SELECTOR_REGEXP.lastIndex = 0;
        while (match = _SELECTOR_REGEXP.exec(selector)) {
            if (match[1]) {
                if (inNot) {
                    throw new Error('Nesting :not is not allowed in a selector');
                }
                inNot = true;
                current = new CssSelector();
                cssSelector.notSelectors.push(current);
            }
            if (match[2]) {
                current.setElement(match[2]);
            }
            if (match[3]) {
                current.addClassName(match[3]);
            }
            if (match[4]) {
                current.addAttribute(match[4], match[5]);
            }
            if (match[6]) {
                inNot = false;
                current = cssSelector;
            }
            if (match[7]) {
                if (inNot) {
                    throw new Error('Multiple selectors in :not are not supported');
                }
                _addResult(results, cssSelector);
                cssSelector = current = new CssSelector();
            }
        }
        _addResult(results, cssSelector);
        return results;
    };
    /**
     * @return {?}
     */
    CssSelector.prototype.isElementSelector = function () {
        return this.hasElementSelector() && this.classNames.length == 0 && this.attrs.length == 0 &&
            this.notSelectors.length === 0;
    };
    /**
     * @return {?}
     */
    CssSelector.prototype.hasElementSelector = function () { return !!this.element; };
    /**
     * @param {?=} element
     * @return {?}
     */
    CssSelector.prototype.setElement = function (element) {
        if (element === void 0) { element = null; }
        this.element = element;
    };
    /**
     * @param {?} name
     * @param {?=} value
     * @return {?}
     */
    CssSelector.prototype.addAttribute = function (name, value) {
        if (value === void 0) { value = ''; }
        this.attrs.push(name, value && value.toLowerCase() || '');
    };
    /**
     * @param {?} name
     * @return {?}
     */
    CssSelector.prototype.addClassName = function (name) { this.classNames.push(name.toLowerCase()); };
    /**
     * @return {?}
     */
    CssSelector.prototype.toString = function () {
        var /** @type {?} */ res = this.element || '';
        if (this.classNames) {
            this.classNames.forEach(function (klass) { return res += "." + klass; });
        }
        if (this.attrs) {
            for (var /** @type {?} */ i = 0; i < this.attrs.length; i += 2) {
                var /** @type {?} */ name = this.attrs[i];
                var /** @type {?} */ value = this.attrs[i + 1];
                res += "[" + name + (value ? '=' + value : '') + "]";
            }
        }
        this.notSelectors.forEach(function (notSelector) { return res += ":not(" + notSelector + ")"; });
        return res;
    };
    return CssSelector;
}());
/**
 * Reads a list of CssSelectors and allows to calculate which ones
 * are contained in a given CssSelector.
 */
var SelectorMatcher = (function () {
    function SelectorMatcher() {
        this._elementMap = new Map();
        this._elementPartialMap = new Map();
        this._classMap = new Map();
        this._classPartialMap = new Map();
        this._attrValueMap = new Map();
        this._attrValuePartialMap = new Map();
        this._listContexts = [];
    }
    /**
     * @param {?} notSelectors
     * @return {?}
     */
    SelectorMatcher.createNotMatcher = function (notSelectors) {
        var /** @type {?} */ notMatcher = new SelectorMatcher();
        notMatcher.addSelectables(notSelectors, null);
        return notMatcher;
    };
    /**
     * @param {?} cssSelectors
     * @param {?=} callbackCtxt
     * @return {?}
     */
    SelectorMatcher.prototype.addSelectables = function (cssSelectors, callbackCtxt) {
        var /** @type {?} */ listContext = null;
        if (cssSelectors.length > 1) {
            listContext = new SelectorListContext(cssSelectors);
            this._listContexts.push(listContext);
        }
        for (var /** @type {?} */ i = 0; i < cssSelectors.length; i++) {
            this._addSelectable(cssSelectors[i], callbackCtxt, listContext);
        }
    };
    /**
     * Add an object that can be found later on by calling `match`.
     * @param {?} cssSelector A css selector
     * @param {?} callbackCtxt An opaque object that will be given to the callback of the `match` function
     * @param {?} listContext
     * @return {?}
     */
    SelectorMatcher.prototype._addSelectable = function (cssSelector, callbackCtxt, listContext) {
        var /** @type {?} */ matcher = this;
        var /** @type {?} */ element = cssSelector.element;
        var /** @type {?} */ classNames = cssSelector.classNames;
        var /** @type {?} */ attrs = cssSelector.attrs;
        var /** @type {?} */ selectable = new SelectorContext(cssSelector, callbackCtxt, listContext);
        if (element) {
            var /** @type {?} */ isTerminal = attrs.length === 0 && classNames.length === 0;
            if (isTerminal) {
                this._addTerminal(matcher._elementMap, element, selectable);
            }
            else {
                matcher = this._addPartial(matcher._elementPartialMap, element);
            }
        }
        if (classNames) {
            for (var /** @type {?} */ i = 0; i < classNames.length; i++) {
                var /** @type {?} */ isTerminal = attrs.length === 0 && i === classNames.length - 1;
                var /** @type {?} */ className = classNames[i];
                if (isTerminal) {
                    this._addTerminal(matcher._classMap, className, selectable);
                }
                else {
                    matcher = this._addPartial(matcher._classPartialMap, className);
                }
            }
        }
        if (attrs) {
            for (var /** @type {?} */ i = 0; i < attrs.length; i += 2) {
                var /** @type {?} */ isTerminal = i === attrs.length - 2;
                var /** @type {?} */ name = attrs[i];
                var /** @type {?} */ value = attrs[i + 1];
                if (isTerminal) {
                    var /** @type {?} */ terminalMap = matcher._attrValueMap;
                    var /** @type {?} */ terminalValuesMap = terminalMap.get(name);
                    if (!terminalValuesMap) {
                        terminalValuesMap = new Map();
                        terminalMap.set(name, terminalValuesMap);
                    }
                    this._addTerminal(terminalValuesMap, value, selectable);
                }
                else {
                    var /** @type {?} */ partialMap = matcher._attrValuePartialMap;
                    var /** @type {?} */ partialValuesMap = partialMap.get(name);
                    if (!partialValuesMap) {
                        partialValuesMap = new Map();
                        partialMap.set(name, partialValuesMap);
                    }
                    matcher = this._addPartial(partialValuesMap, value);
                }
            }
        }
    };
    /**
     * @param {?} map
     * @param {?} name
     * @param {?} selectable
     * @return {?}
     */
    SelectorMatcher.prototype._addTerminal = function (map, name, selectable) {
        var /** @type {?} */ terminalList = map.get(name);
        if (!terminalList) {
            terminalList = [];
            map.set(name, terminalList);
        }
        terminalList.push(selectable);
    };
    /**
     * @param {?} map
     * @param {?} name
     * @return {?}
     */
    SelectorMatcher.prototype._addPartial = function (map, name) {
        var /** @type {?} */ matcher = map.get(name);
        if (!matcher) {
            matcher = new SelectorMatcher();
            map.set(name, matcher);
        }
        return matcher;
    };
    /**
     * Find the objects that have been added via `addSelectable`
     * whose css selector is contained in the given css selector.
     * @param {?} cssSelector A css selector
     * @param {?=} matchedCallback This callback will be called with the object handed into `addSelectable`
     * @return {?} boolean true if a match was found
     */
    SelectorMatcher.prototype.match = function (cssSelector, matchedCallback) {
        if (matchedCallback === void 0) { matchedCallback = function () { }; }
        var /** @type {?} */ result = false;
        var /** @type {?} */ element = cssSelector.element;
        var /** @type {?} */ classNames = cssSelector.classNames;
        var /** @type {?} */ attrs = cssSelector.attrs;
        for (var /** @type {?} */ i = 0; i < this._listContexts.length; i++) {
            this._listContexts[i].alreadyMatched = false;
        }
        result = this._matchTerminal(this._elementMap, element, cssSelector, matchedCallback) || result;
        result = this._matchPartial(this._elementPartialMap, element, cssSelector, matchedCallback) ||
            result;
        if (classNames) {
            for (var /** @type {?} */ i = 0; i < classNames.length; i++) {
                var /** @type {?} */ className = classNames[i];
                result =
                    this._matchTerminal(this._classMap, className, cssSelector, matchedCallback) || result;
                result =
                    this._matchPartial(this._classPartialMap, className, cssSelector, matchedCallback) ||
                        result;
            }
        }
        if (attrs) {
            for (var /** @type {?} */ i = 0; i < attrs.length; i += 2) {
                var /** @type {?} */ name = attrs[i];
                var /** @type {?} */ value = attrs[i + 1];
                var /** @type {?} */ terminalValuesMap = this._attrValueMap.get(name);
                if (value) {
                    result =
                        this._matchTerminal(terminalValuesMap, '', cssSelector, matchedCallback) || result;
                }
                result =
                    this._matchTerminal(terminalValuesMap, value, cssSelector, matchedCallback) || result;
                var /** @type {?} */ partialValuesMap = this._attrValuePartialMap.get(name);
                if (value) {
                    result = this._matchPartial(partialValuesMap, '', cssSelector, matchedCallback) || result;
                }
                result =
                    this._matchPartial(partialValuesMap, value, cssSelector, matchedCallback) || result;
            }
        }
        return result;
    };
    /**
     * \@internal
     * @param {?} map
     * @param {?} name
     * @param {?} cssSelector
     * @param {?} matchedCallback
     * @return {?}
     */
    SelectorMatcher.prototype._matchTerminal = function (map, name, cssSelector, matchedCallback) {
        if (!map || typeof name !== 'string') {
            return false;
        }
        var /** @type {?} */ selectables = map.get(name) || [];
        var /** @type {?} */ starSelectables = map.get('*');
        if (starSelectables) {
            selectables = selectables.concat(starSelectables);
        }
        if (selectables.length === 0) {
            return false;
        }
        var /** @type {?} */ selectable;
        var /** @type {?} */ result = false;
        for (var /** @type {?} */ i = 0; i < selectables.length; i++) {
            selectable = selectables[i];
            result = selectable.finalize(cssSelector, matchedCallback) || result;
        }
        return result;
    };
    /**
     * \@internal
     * @param {?} map
     * @param {?} name
     * @param {?} cssSelector
     * @param {?} matchedCallback
     * @return {?}
     */
    SelectorMatcher.prototype._matchPartial = function (map, name, cssSelector, matchedCallback) {
        if (!map || typeof name !== 'string') {
            return false;
        }
        var /** @type {?} */ nestedSelector = map.get(name);
        if (!nestedSelector) {
            return false;
        }
        // TODO(perf): get rid of recursion and measure again
        // TODO(perf): don't pass the whole selector into the recursion,
        // but only the not processed parts
        return nestedSelector.match(cssSelector, matchedCallback);
    };
    return SelectorMatcher;
}());
var SelectorListContext = (function () {
    /**
     * @param {?} selectors
     */
    function SelectorListContext(selectors) {
        this.selectors = selectors;
        this.alreadyMatched = false;
    }
    return SelectorListContext;
}());
var SelectorContext = (function () {
    /**
     * @param {?} selector
     * @param {?} cbContext
     * @param {?} listContext
     */
    function SelectorContext(selector, cbContext, listContext) {
        this.selector = selector;
        this.cbContext = cbContext;
        this.listContext = listContext;
        this.notSelectors = selector.notSelectors;
    }
    /**
     * @param {?} cssSelector
     * @param {?} callback
     * @return {?}
     */
    SelectorContext.prototype.finalize = function (cssSelector, callback) {
        var /** @type {?} */ result = true;
        if (this.notSelectors.length > 0 && (!this.listContext || !this.listContext.alreadyMatched)) {
            var /** @type {?} */ notMatcher = SelectorMatcher.createNotMatcher(this.notSelectors);
            result = !notMatcher.match(cssSelector, null);
        }
        if (result && callback && (!this.listContext || !this.listContext.alreadyMatched)) {
            if (this.listContext) {
                this.listContext.alreadyMatched = true;
            }
            callback(this.selector, this.cbContext);
        }
        return result;
    };
    return SelectorContext;
}());
/**
 * Convenience to throw an Error with 'unimplemented' as the message.
 * @return {?}
 */
var BaseError = (function (_super) {
    __extends(BaseError, _super);
    /**
     * @param {?} message
     */
    function BaseError(message) {
        var _this = _super.call(this, message) || this;
        // Errors don't use current this, instead they create a new instance.
        // We have to do forward all of our api to the nativeInstance.
        var nativeError = new Error(message);
        _this._nativeError = nativeError;
        return _this;
    }
    Object.defineProperty(BaseError.prototype, "message", {
        /**
         * @return {?}
         */
        get: function () { return this._nativeError.message; },
        /**
         * @param {?} message
         * @return {?}
         */
        set: function (message) { this._nativeError.message = message; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseError.prototype, "name", {
        /**
         * @return {?}
         */
        get: function () { return this._nativeError.name; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseError.prototype, "stack", {
        /**
         * @return {?}
         */
        get: function () { return ((this._nativeError)).stack; },
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) { ((this._nativeError)).stack = value; },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    BaseError.prototype.toString = function () { return this._nativeError.toString(); };
    return BaseError;
}(Error));
var WrappedError = (function (_super) {
    __extends(WrappedError, _super);
    /**
     * @param {?} message
     * @param {?} error
     */
    function WrappedError(message, error) {
        var _this = _super.call(this, message + " caused by: " + (error instanceof Error ? error.message : error)) || this;
        _this.originalError = error;
        return _this;
    }
    Object.defineProperty(WrappedError.prototype, "stack", {
        /**
         * @return {?}
         */
        get: function () {
            return (((this.originalError instanceof Error ? this.originalError : this._nativeError)))
                .stack;
        },
        enumerable: true,
        configurable: true
    });
    return WrappedError;
}(BaseError));
/**
 * Returns the class name of a type.
 *
 * @export
 * @template T
 * @param {?} klass
 * @return {?}
 */
function getClassName(klass) {
    return ((klass)).name ? ((klass)).name :
        /^function\s+([\w\$]+)\s*\(/.exec(this.toString())[1];
}
/**
 * Tries to stringify a token. A token can be any type.
 *
 * @export
 * @param {?} token
 * @return {?}
 */
function stringify(token) {
    if (typeof token === 'string') {
        return token;
    }
    if (token === undefined || token === null) {
        return '' + token;
    }
    if (token.name) {
        return token.name;
    }
    if (token.overriddenName) {
        return token.overriddenName;
    }
    if (typeof token === 'function') {
        return getClassName(token);
    }
    if (token instanceof HTMLElement) {
        var /** @type {?} */ parts = token.toString().match(/\w+/g);
        if (parts && parts.length) {
            return parts[parts.length - 1];
        }
    }
    var /** @type {?} */ res = token.toString();
    var /** @type {?} */ newLineIndex = res.indexOf('\n');
    return (newLineIndex === -1) ? res : res.substring(0, newLineIndex);
}
var globalScope;
if (typeof window === 'undefined') {
    if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
        // TODO: Replace any with WorkerGlobalScope from lib.webworker.d.ts #3492
        globalScope = (self);
    }
    else {
        globalScope = (global);
    }
}
else {
    globalScope = (window);
}
/**
 * @param {?} obj
 * @return {?}
 */
function isPresent(obj) {
    return obj != null;
}
/**
 * @param {?} obj
 * @return {?}
 */
var NumberWrapper = (function () {
    function NumberWrapper() {
    }
    /**
     * @param {?} text
     * @return {?}
     */
    NumberWrapper.parseIntAutoRadix = function (text) {
        var /** @type {?} */ result = parseInt(text);
        if (isNaN(result)) {
            throw new Error('Invalid integer literal when parsing ' + text);
        }
        return result;
    };
    /**
     * @param {?} value
     * @return {?}
     */
    NumberWrapper.isNumeric = function (value) { return !isNaN(value - parseFloat(value)); };
    return NumberWrapper;
}());
var DomVisitor = (function () {
    /**
     * @param {?} components
     */
    function DomVisitor(components) {
        var _this = this;
        this._selectorMatcher = new SelectorMatcher();
        this._componentsIndex = new Map();
        components.forEach(function (component, index) {
            var selector = CssSelector.parse(component.selector);
            _this._selectorMatcher.addSelectables(selector, component);
            _this._componentsIndex.set(component, index);
        });
    }
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    DomVisitor.prototype.visitElement = function (element, context) {
        var /** @type {?} */ elementCssSelector = CssSelector.fromElement(element);
        var /** @type {?} */ matchingComponent;
        this._selectorMatcher.match(elementCssSelector, function (selector, component) {
            if (matchingComponent) {
                throw new MultipleComponentsOnElementError([matchingComponent.type, component.type]);
            }
            matchingComponent = component;
        });
        // if no matching component return current context
        if (!matchingComponent) {
            return context;
        }
        // console.log(`Found ${stringify(matchingComponent.type)} on element:`, element);
        var /** @type {?} */ viewDef = matchingComponent.viewDefinitionFactory();
        var /** @type {?} */ view = mojiitoCore.createView(context.root, context, element, viewDef);
        // console.log(`Created ${stringify(matchingComponent.type)} ` +
        //   `with parent ${stringify(context.component.constructor)}`);
        ListWrapper.forEach(element.attributes, function (attr) {
        });
        return view;
    };
    /**
     * @param {?} element
     * @param {?} attr
     * @param {?} context
     * @return {?}
     */
    DomVisitor.prototype.visitAttribute = function (element, attr, context) { };
    /**
     * @param {?} text
     * @param {?} context
     * @return {?}
     */
    DomVisitor.prototype.visitText = function (text, context) { };
    /**
     * @param {?} comment
     * @param {?} context
     * @return {?}
     */
    DomVisitor.prototype.visitComment = function (comment, context) { };
    return DomVisitor;
}());
var ParseError = (function (_super) {
    __extends(ParseError, _super);
    /**
     * @param {?} error
     */
    function ParseError(error) {
        return _super.call(this, "Parse Error", error) || this;
    }
    return ParseError;
}(WrappedError));
var MultipleComponentsOnElementError = (function (_super) {
    __extends(MultipleComponentsOnElementError, _super);
    /**
     * @param {?} components
     */
    function MultipleComponentsOnElementError(components) {
        var _this = this;
        var names = components.map(function (c) { return stringify(c); }).join(', ');
        _this = _super.call(this, "The selectors of the components " + names + " are matching the same DOM Element. " +
            "Only one component per element is allowed.") || this;
        return _this;
    }
    return MultipleComponentsOnElementError;
}(ParseError));
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var $EOF = 0;
var $TAB = 9;
var $LF = 10;
var $VTAB = 11;
var $FF = 12;
var $CR = 13;
var $SPACE = 32;
var $BANG = 33;
var $DQ = 34;
var $HASH = 35;
var $$ = 36;
var $PERCENT = 37;
var $AMPERSAND = 38;
var $SQ = 39;
var $LPAREN = 40;
var $RPAREN = 41;
var $STAR = 42;
var $PLUS = 43;
var $COMMA = 44;
var $MINUS = 45;
var $PERIOD = 46;
var $SLASH = 47;
var $COLON = 58;
var $SEMICOLON = 59;
var $LT = 60;
var $EQ = 61;
var $GT = 62;
var $QUESTION = 63;
var $0 = 48;
var $9 = 57;
var $A = 65;
var $E = 69;
var $Z = 90;
var $LBRACKET = 91;
var $BACKSLASH = 92;
var $RBRACKET = 93;
var $CARET = 94;
var $_ = 95;
var $a = 97;
var $e = 101;
var $f = 102;
var $n = 110;
var $r = 114;
var $t = 116;
var $u = 117;
var $v = 118;
var $z = 122;
var $LBRACE = 123;
var $BAR = 124;
var $RBRACE = 125;
var $NBSP = 160;
/**
 * @param {?} code
 * @return {?}
 */
function isWhitespace(code) {
    return (code >= $TAB && code <= $SPACE) || (code == $NBSP);
}
/**
 * @param {?} code
 * @return {?}
 */
function isDigit(code) {
    return $0 <= code && code <= $9;
}
/**
 * @param {?} code
 * @return {?}
 */
function isAsciiLetter(code) {
    return code >= $a && code <= $z || code >= $A && code <= $Z;
}
/**
 * @param {?} code
 * @return {?}
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var TokenType = {};
TokenType.Character = 0;
TokenType.Identifier = 1;
TokenType.Keyword = 2;
TokenType.String = 3;
TokenType.Operator = 4;
TokenType.Number = 5;
TokenType.Error = 6;
TokenType[TokenType.Character] = "Character";
TokenType[TokenType.Identifier] = "Identifier";
TokenType[TokenType.Keyword] = "Keyword";
TokenType[TokenType.String] = "String";
TokenType[TokenType.Operator] = "Operator";
TokenType[TokenType.Number] = "Number";
TokenType[TokenType.Error] = "Error";
var KEYWORDS = ['var', 'let', 'null', 'undefined', 'true', 'false', 'if', 'else', 'this'];
var ExpressionParser$$1 = (function () {
    function ExpressionParser$$1() {
    }
    /**
     * @param {?} text
     * @return {?}
     */
    ExpressionParser$$1.prototype.tokenize = function (text) {
        var /** @type {?} */ scanner = new Scanner(text);
        var /** @type {?} */ tokens = [];
        var /** @type {?} */ token = scanner.scanToken();
        while (token != null) {
            tokens.push(token);
            token = scanner.scanToken();
        }
        return tokens;
    };
    /**
     * @param {?} text
     * @return {?}
     */
    ExpressionParser$$1.prototype.parse = function (text) {
        return new Expression(this.tokenize(text));
    };
    return ExpressionParser$$1;
}());
ExpressionParser$$1.decorators = [
    { type: mojiitoCore.Injectable },
];
/**
 * @nocollapse
 */
ExpressionParser$$1.ctorParameters = function () { return []; };
var Token$$1 = (function () {
    /**
     * @param {?} index
     * @param {?} type
     * @param {?} numValue
     * @param {?} strValue
     */
    function Token$$1(index, type, numValue, strValue) {
        this.index = index;
        this.type = type;
        this.numValue = numValue;
        this.strValue = strValue;
    }
    /**
     * @param {?} code
     * @return {?}
     */
    Token$$1.prototype.isCharacter = function (code) {
        return this.type == TokenType.Character && this.numValue == code;
    };
    /**
     * @return {?}
     */
    Token$$1.prototype.isNumber = function () { return this.type == TokenType.Number; };
    /**
     * @return {?}
     */
    Token$$1.prototype.isString = function () { return this.type == TokenType.String; };
    /**
     * @param {?} operater
     * @return {?}
     */
    Token$$1.prototype.isOperator = function (operater) {
        return this.type == TokenType.Operator && this.strValue == operater;
    };
    /**
     * @return {?}
     */
    Token$$1.prototype.isIdentifier = function () { return this.type == TokenType.Identifier; };
    /**
     * @return {?}
     */
    Token$$1.prototype.isKeyword = function () { return this.type == TokenType.Keyword; };
    /**
     * @return {?}
     */
    Token$$1.prototype.isKeywordLet = function () { return this.type == TokenType.Keyword && this.strValue == 'let'; };
    /**
     * @return {?}
     */
    Token$$1.prototype.isKeywordNull = function () { return this.type == TokenType.Keyword && this.strValue == 'null'; };
    /**
     * @return {?}
     */
    Token$$1.prototype.isKeywordUndefined = function () {
        return this.type == TokenType.Keyword && this.strValue == 'undefined';
    };
    /**
     * @return {?}
     */
    Token$$1.prototype.isKeywordTrue = function () { return this.type == TokenType.Keyword && this.strValue == 'true'; };
    /**
     * @return {?}
     */
    Token$$1.prototype.isKeywordFalse = function () { return this.type == TokenType.Keyword && this.strValue == 'false'; };
    /**
     * @return {?}
     */
    Token$$1.prototype.isKeywordThis = function () { return this.type == TokenType.Keyword && this.strValue == 'this'; };
    /**
     * @return {?}
     */
    Token$$1.prototype.isError = function () { return this.type == TokenType.Error; };
    /**
     * @return {?}
     */
    Token$$1.prototype.toNumber = function () { return this.type == TokenType.Number ? this.numValue : -1; };
    /**
     * @return {?}
     */
    Token$$1.prototype.toString = function () {
        switch (this.type) {
            case TokenType.Character:
            case TokenType.Identifier:
            case TokenType.Keyword:
            case TokenType.Operator:
            case TokenType.String:
            case TokenType.Error:
                return this.strValue;
            case TokenType.Number:
                return this.numValue.toString();
            default:
                return null;
        }
    };
    return Token$$1;
}());
/**
 * @param {?} index
 * @param {?} code
 * @return {?}
 */
function newCharacterToken(index, code) {
    return new Token$$1(index, TokenType.Character, code, String.fromCharCode(code));
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newIdentifierToken(index, text) {
    return new Token$$1(index, TokenType.Identifier, 0, text);
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newKeywordToken(index, text) {
    return new Token$$1(index, TokenType.Keyword, 0, text);
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newOperatorToken(index, text) {
    return new Token$$1(index, TokenType.Operator, 0, text);
}
/**
 * @param {?} index
 * @param {?} text
 * @return {?}
 */
function newStringToken(index, text) {
    return new Token$$1(index, TokenType.String, 0, text);
}
/**
 * @param {?} index
 * @param {?} n
 * @return {?}
 */
function newNumberToken(index, n) {
    return new Token$$1(index, TokenType.Number, n, '');
}
/**
 * @param {?} index
 * @param {?} message
 * @return {?}
 */
function newErrorToken(index, message) {
    return new Token$$1(index, TokenType.Error, 0, message);
}
var EOF = new Token$$1(-1, TokenType.Character, 0, '');
var Scanner = (function () {
    /**
     * @param {?} input
     */
    function Scanner(input) {
        this.input = input;
        this.peek = 0;
        this.index = -1;
        this.length = input.length;
        this.advance();
    }
    /**
     * @return {?}
     */
    Scanner.prototype.advance = function () {
        this.peek = ++this.index >= this.length ? $EOF : this.input.charCodeAt(this.index);
    };
    /**
     * @return {?}
     */
    Scanner.prototype.scanToken = function () {
        var /** @type {?} */ input = this.input, /** @type {?} */ length = this.length;
        var /** @type {?} */ peek = this.peek, /** @type {?} */ index = this.index;
        // Skip whitespace.
        while (peek <= $SPACE) {
            if (++index >= length) {
                peek = $EOF;
                break;
            }
            else {
                peek = input.charCodeAt(index);
            }
        }
        this.peek = peek;
        this.index = index;
        if (index >= length) {
            return null;
        }
        // Handle identifiers and numbers.
        if (isIdentifierStart(peek))
            return this.scanIdentifier();
        if (isDigit(peek))
            return this.scanNumber(index);
        var /** @type {?} */ start = index;
        switch (peek) {
            case $PERIOD:
                this.advance();
                return isDigit(this.peek) ? this.scanNumber(start) :
                    newCharacterToken(start, $PERIOD);
            case $LPAREN:
            case $RPAREN:
            case $LBRACE:
            case $RBRACE:
            case $LBRACKET:
            case $RBRACKET:
            case $COMMA:
            case $COLON:
            case $SEMICOLON:
                return this.scanCharacter(start, peek);
            case $SQ:
            case $DQ:
                return this.scanString();
            case $HASH:
            case $PLUS:
            case $MINUS:
            case $STAR:
            case $SLASH:
            case $PERCENT:
            case $CARET:
                return this.scanOperator(start, String.fromCharCode(peek));
            case $QUESTION:
                return this.scanComplexOperator(start, '?', $PERIOD, '.');
            case $LT:
            case $GT:
                return this.scanComplexOperator(start, String.fromCharCode(peek), $EQ, '=');
            case $BANG:
            case $EQ:
                return this.scanComplexOperator(start, String.fromCharCode(peek), $EQ, '=', $EQ, '=');
            case $AMPERSAND:
                return this.scanComplexOperator(start, '&', $AMPERSAND, '&');
            case $BAR:
                return this.scanComplexOperator(start, '|', $BAR, '|');
            case $NBSP:
                while (isWhitespace(this.peek))
                    this.advance();
                return this.scanToken();
        }
        this.advance();
        return this.error("Unexpected character [" + String.fromCharCode(peek) + "]", 0);
    };
    /**
     * @param {?} start
     * @param {?} code
     * @return {?}
     */
    Scanner.prototype.scanCharacter = function (start, code) {
        this.advance();
        return newCharacterToken(start, code);
    };
    /**
     * @param {?} start
     * @param {?} str
     * @return {?}
     */
    Scanner.prototype.scanOperator = function (start, str) {
        this.advance();
        return newOperatorToken(start, str);
    };
    /**
     * Tokenize a 2/3 char long operator
     *
     * @param {?} start start index in the expression
     * @param {?} one first symbol (always part of the operator)
     * @param {?} twoCode code point for the second symbol
     * @param {?} two second symbol (part of the operator when the second code point matches)
     * @param {?=} threeCode code point for the third symbol
     * @param {?=} three third symbol (part of the operator when provided and matches source expression)
     * @return {?}
     */
    Scanner.prototype.scanComplexOperator = function (start, one, twoCode, two, threeCode, three) {
        this.advance();
        var /** @type {?} */ str = one;
        if (this.peek == twoCode) {
            this.advance();
            str += two;
        }
        if (threeCode != null && this.peek == threeCode) {
            this.advance();
            str += three;
        }
        return newOperatorToken(start, str);
    };
    /**
     * @return {?}
     */
    Scanner.prototype.scanIdentifier = function () {
        var /** @type {?} */ start = this.index;
        this.advance();
        while (isIdentifierPart(this.peek))
            this.advance();
        var /** @type {?} */ str = this.input.substring(start, this.index);
        return KEYWORDS.indexOf(str) > -1 ? newKeywordToken(start, str) :
            newIdentifierToken(start, str);
    };
    /**
     * @param {?} start
     * @return {?}
     */
    Scanner.prototype.scanNumber = function (start) {
        var /** @type {?} */ simple = (this.index === start);
        this.advance(); // Skip initial digit.
        while (true) {
            if (isDigit(this.peek)) {
                // Do nothing.
            }
            else if (this.peek == $PERIOD) {
                simple = false;
            }
            else if (isExponentStart(this.peek)) {
                this.advance();
                if (isExponentSign(this.peek))
                    this.advance();
                if (!isDigit(this.peek))
                    return this.error('Invalid exponent', -1);
                simple = false;
            }
            else {
                break;
            }
            this.advance();
        }
        var /** @type {?} */ str = this.input.substring(start, this.index);
        var /** @type {?} */ value = simple ? NumberWrapper.parseIntAutoRadix(str) : parseFloat(str);
        return newNumberToken(start, value);
    };
    /**
     * @return {?}
     */
    Scanner.prototype.scanString = function () {
        var /** @type {?} */ start = this.index;
        var /** @type {?} */ quote = this.peek;
        this.advance(); // Skip initial quote.
        var /** @type {?} */ buffer = '';
        var /** @type {?} */ marker = this.index;
        var /** @type {?} */ input = this.input;
        while (this.peek != quote) {
            if (this.peek == $BACKSLASH) {
                buffer += input.substring(marker, this.index);
                this.advance();
                var /** @type {?} */ unescapedCode = void 0;
                // Workaround for TS2.1-introduced type strictness
                this.peek = this.peek;
                if (this.peek == $u) {
                    // 4 character hex code for unicode character.
                    var /** @type {?} */ hex = input.substring(this.index + 1, this.index + 5);
                    if (/^[0-9a-f]+$/i.test(hex)) {
                        unescapedCode = parseInt(hex, 16);
                    }
                    else {
                        return this.error("Invalid unicode escape [\\u" + hex + "]", 0);
                    }
                    for (var /** @type {?} */ i = 0; i < 5; i++) {
                        this.advance();
                    }
                }
                else {
                    unescapedCode = unescape(this.peek);
                    this.advance();
                }
                buffer += String.fromCharCode(unescapedCode);
                marker = this.index;
            }
            else if (this.peek == $EOF) {
                return this.error('Unterminated quote', 0);
            }
            else {
                this.advance();
            }
        }
        var /** @type {?} */ last = input.substring(marker, this.index);
        this.advance(); // Skip terminating quote.
        return newStringToken(start, buffer + last);
    };
    /**
     * @param {?} message
     * @param {?} offset
     * @return {?}
     */
    Scanner.prototype.error = function (message, offset) {
        var /** @type {?} */ position = this.index + offset;
        return newErrorToken(position, "Lexer Error: " + message + " at column " + position + " in expression [" + this.input + "]");
    };
    return Scanner;
}());
/**
 * @param {?} code
 * @return {?}
 */
function isIdentifierStart(code) {
    return ($a <= code && code <= $z) || ($A <= code && code <= $Z) ||
        (code == $_) || (code == $$);
}
/**
 * @param {?} input
 * @return {?}
 */
/**
 * @param {?} code
 * @return {?}
 */
function isIdentifierPart(code) {
    return isAsciiLetter(code) || isDigit(code) || (code == $_) ||
        (code == $$);
}
/**
 * @param {?} code
 * @return {?}
 */
function isExponentStart(code) {
    return code == $e || code == $E;
}
/**
 * @param {?} code
 * @return {?}
 */
function isExponentSign(code) {
    return code == $MINUS || code == $PLUS;
}
/**
 * @param {?} code
 * @return {?}
 */
/**
 * @param {?} code
 * @return {?}
 */
function unescape(code) {
    switch (code) {
        case $n:
            return $LF;
        case $f:
            return $FF;
        case $r:
            return $CR;
        case $t:
            return $TAB;
        case $v:
            return $VTAB;
        default:
            return code;
    }
}
var Expression = (function () {
    /**
     * @param {?} tokens
     */
    function Expression(tokens) {
        this.tokens = tokens;
    }
    return Expression;
}());
// tslint:disable-next-line:max-line-length
var BIND_NAME_REGEXP = /^(?:(?:(?:(bind-)|(let-)|(ref-|#)|(on-)|(bindon-)|(@))(.+))|\[\(([^\)]+)\)\]|\[([^\]]+)\]|\(([^\)]+)\))$/;
// Group 1 = "bind-"
var KW_BIND_IDX = 1;
// Group 3 = "ref-/#"
var KW_REF_IDX = 3;
// Group 4 = "on-"
var KW_ON_IDX = 4;
// Group 5 = "bindon-"
var KW_BINDON_IDX = 5;
// Group 6 = "@"
var KW_AT_IDX = 6;
// Group 7 = the identifier after "bind-", "let-", "ref-/#", "on-", "bindon-" or "@"
var IDENT_KW_IDX = 7;
// Group 8 = identifier inside [()]
var IDENT_BANANA_BOX_IDX = 8;
// Group 9 = identifier inside []
var IDENT_PROPERTY_IDX = 9;
// Group 10 = identifier inside ()
var IDENT_EVENT_IDX = 10;
var BindingParser = (function () {
    /**
     * @param {?} _exprParser
     */
    function BindingParser(_exprParser) {
        this._exprParser = _exprParser;
    }
    /**
     * @param {?} name
     * @param {?} expression
     * @return {?}
     */
    BindingParser.prototype.parse = function (name, expression) {
        var /** @type {?} */ bindParts = name.match(BIND_NAME_REGEXP);
        var /** @type {?} */ expr = this._exprParser.parse(expression);
        var /** @type {?} */ key;
        if (isPresent(bindParts[KW_BIND_IDX])) {
            unsupported('Property binding', name, expression);
        }
        else if (bindParts[KW_REF_IDX]) {
            unsupported('Variable declaration', name, expression);
        }
        else if (bindParts[KW_ON_IDX]) {
            return new EventBindingParseResult(bindParts[IDENT_KW_IDX], expr);
        }
        else if (bindParts[KW_BINDON_IDX]) {
            unsupported('Two way binding', name, expression);
        }
        else if (bindParts[KW_AT_IDX]) {
            unsupported('Animations', name, expression);
        }
        else if (bindParts[IDENT_BANANA_BOX_IDX]) {
            unsupported('Two way binding', name, expression);
        }
        else if (bindParts[IDENT_PROPERTY_IDX]) {
            unsupported('Property binding', name, expression);
        }
        else if (bindParts[IDENT_EVENT_IDX]) {
            return new EventBindingParseResult(bindParts[IDENT_EVENT_IDX], expr);
        }
        else {
            throw new Error("Unknown binding name: " + name);
        }
    };
    return BindingParser;
}());
BindingParser.decorators = [
    { type: mojiitoCore.Injectable },
];
/**
 * @nocollapse
 */
BindingParser.ctorParameters = function () { return [
    { type: ExpressionParser$$1, },
]; };
var BindingParseResult = (function () {
    /**
     * @param {?} expression
     */
    function BindingParseResult(expression) {
        this.expression = expression;
    }
    return BindingParseResult;
}());
var EventBindingParseResult = (function (_super) {
    __extends(EventBindingParseResult, _super);
    /**
     * @param {?} eventName
     * @param {?} expression
     */
    function EventBindingParseResult(eventName, expression) {
        var _this = _super.call(this, expression) || this;
        _this.eventName = eventName;
        return _this;
    }
    return EventBindingParseResult;
}(BindingParseResult));
/**
 * @param {?} type
 * @param {?} name
 * @param {?} expression
 * @return {?}
 */
function unsupported(type, name, expression) {
    throw new Error(type + " is not yet supported: " + name + "=\"" + expression + "\"");
}
var Compiler = (function () {
    /**
     * @param {?} _resolver
     * @param {?} _bindParser
     */
    function Compiler(_resolver, _bindParser) {
        this._resolver = _resolver;
        this._bindParser = _bindParser;
        this._compileResults = new Map();
    }
    /**
     * @return {?}
     */
    Compiler.prototype.createComponentFactoryResolver = function () {
        var /** @type {?} */ factories = [];
        this._compileResults.forEach(function (summary) {
            factories.push(summary.componentFactory);
        });
        return new mojiitoCore.ComponentFactoryResolver(factories);
    };
    /**
     * @param {?} components
     * @return {?}
     */
    Compiler.prototype.compileComponents = function (components) {
        var _this = this;
        return components.map(function (c) { return _this.compileComponent(c); });
    };
    /**
     * @template C
     * @param {?} component
     * @return {?}
     */
    Compiler.prototype.compileComponent = function (component) {
        var /** @type {?} */ compileSummary = this._compileResults.get(component);
        if (compileSummary) {
            return compileSummary;
        }
        // grab component metadata
        var /** @type {?} */ metadata = this._resolver.resolve(component);
        // compile child components
        var /** @type {?} */ childComponents;
        var /** @type {?} */ rendererType;
        if (metadata.components) {
            childComponents = this.compileComponents(ListWrapper.flatten(metadata.components));
            // create a renderer type with a visitor for this component with all
            // sub components
            rendererType = this._createComponentRendererType(new DomVisitor(childComponents));
        }
        // create a view definition factory for this component type
        var /** @type {?} */ viewDefinitionFactory = this._createComponentViewDef(component, metadata.providers, rendererType);
        // create a component factory for this component type
        var /** @type {?} */ componentFactory = mojiitoCore.createComponentFactory(metadata.selector, component, viewDefinitionFactory);
        compileSummary = {
            type: component,
            selector: metadata.selector,
            hostListeners: metadata.host,
            childListeners: metadata.childs,
            componentFactory: componentFactory,
            viewDefinitionFactory: viewDefinitionFactory,
            components: childComponents
        };
        this._compileResults.set(component, compileSummary);
        return compileSummary;
    };
    /**
     * @param {?} providers
     * @param {?} nodes
     * @param {?} nodeType
     * @return {?}
     */
    Compiler.prototype._createProviderNodes = function (providers, nodes, nodeType) {
        var /** @type {?} */ nodeDefs = mojiitoCore.resolveReflectiveProviders(ListWrapper.flatten(providers))
            .map(function (provider, index) {
            var /** @type {?} */ factory = provider.resolvedFactories[0];
            var /** @type {?} */ node = ({
                flags: nodeType,
                index: nodes.length + index,
                provider: /** @type {?} */ ({
                    token: provider.key.token,
                    tokenKey: provider.key.displayName,
                    factory: factory.factory,
                    deps: factory.dependencies.map(function (dep) {
                        var /** @type {?} */ flags = 0;
                        if (dep.optional) {
                            flags += 2 /* Optional */;
                        }
                        if (dep.visibility instanceof mojiitoCore.SkipSelf) {
                            flags += 1 /* SkipSelf */;
                        }
                        return ({
                            flags: flags,
                            token: dep.key.token,
                            tokenKey: dep.key.displayName
                        });
                    })
                })
            });
            return node;
        });
        nodes.push.apply(nodes, nodeDefs);
        return nodeDefs;
    };
    /**
     * @param {?} visitor
     * @return {?}
     */
    Compiler.prototype._createComponentRendererType = function (visitor) {
        return {
            visitor: visitor,
            data: null
        };
    };
    /**
     * @param {?} component
     * @param {?} providers
     * @param {?} componentRendererType
     * @return {?}
     */
    Compiler.prototype._createComponentViewDef = function (component, providers, componentRendererType) {
        var _this = this;
        var /** @type {?} */ viewDefinitionFactory = function () {
            var /** @type {?} */ nodes = [];
            var /** @type {?} */ nodeFlags = 16777216;
            // Create public provider instances and add to nodes
            var /** @type {?} */ publicProviders = {};
            if (providers) {
                _this._createProviderNodes(providers, nodes, 128 /* TypeProvider */).forEach(function (node) {
                    publicProviders[node.provider.tokenKey] = node;
                });
                nodeFlags |= 128 /* TypeProvider */;
            }
            // Create component instance and add to nodes
            _this._createProviderNodes([component], nodes, 16384 /* TypeComponent */);
            var /** @type {?} */ componentProvider = nodes[nodes.length - 1];
            nodeFlags |= 16384 /* TypeComponent */;
            // Set allProviders to publicProviders plus private providers (componentProvider)
            var /** @type {?} */ allProviders = publicProviders;
            allProviders[componentProvider.provider.tokenKey] = componentProvider;
            return ({
                factory: viewDefinitionFactory,
                nodeFlags: nodeFlags,
                nodes: nodes,
                componentProvider: componentProvider,
                publicProviders: publicProviders,
                allProviders: allProviders,
                componentRendererType: componentRendererType
            });
        };
        return viewDefinitionFactory;
    };
    return Compiler;
}());
Compiler.decorators = [
    { type: mojiitoCore.Injectable },
];
/**
 * @nocollapse
 */
Compiler.ctorParameters = function () { return [
    { type: mojiitoCore.ComponentResolver, },
    { type: BindingParser, },
]; };
var BrowserPlatformRef = (function (_super) {
    __extends(BrowserPlatformRef, _super);
    /**
     * @param {?} _injector
     * @param {?} _resolver
     * @param {?} _compiler
     */
    function BrowserPlatformRef(_injector, _resolver, _compiler) {
        var _this = _super.call(this) || this;
        _this._injector = _injector;
        _this._resolver = _resolver;
        _this._compiler = _compiler;
        _this._destroyed = false;
        _this._destroyListeners = [];
        return _this;
    }
    Object.defineProperty(BrowserPlatformRef.prototype, "injector", {
        /**
         * @return {?}
         */
        get: function () { return this._injector; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserPlatformRef.prototype, "destroyed", {
        /**
         * @return {?}
         */
        get: function () { return this._destroyed; },
        enumerable: true,
        configurable: true
    });
    /**
     * @template C
     * @param {?} component
     * @return {?}
     */
    BrowserPlatformRef.prototype.bootstrapComponent = function (component) {
        var _this = this;
        this._compiler.compileComponents([component]);
        var /** @type {?} */ appInjector = mojiitoCore.ReflectiveInjector.resolveAndCreate([
            {
                provide: mojiitoCore.ComponentFactoryResolver,
                useFactory: function () { return _this._compiler.createComponentFactoryResolver(); }
            },
            mojiitoCore.ApplicationRef
        ], this._injector);
        var /** @type {?} */ app = (appInjector.get(mojiitoCore.ApplicationRef));
        app.bootstrap(component);
    };
    /**
     * @param {?} callback
     * @return {?}
     */
    BrowserPlatformRef.prototype.onDestroy = function (callback) {
        this._destroyListeners.push(callback);
    };
    /**
     * @return {?}
     */
    BrowserPlatformRef.prototype.destroy = function () {
        if (this._destroyed) {
            throw new Error('The platform has already been destroyed!');
        }
        // TODO: destroy all se stuff
        this._destroyListeners.forEach(function (listener) { return listener(); });
        this._destroyed = true;
    };
    return BrowserPlatformRef;
}(mojiitoCore.PlatformRef));
BrowserPlatformRef.decorators = [
    { type: mojiitoCore.Injectable },
];
/**
 * @nocollapse
 */
BrowserPlatformRef.ctorParameters = function () { return [
    { type: mojiitoCore.Injector, },
    { type: mojiitoCore.ComponentResolver, },
    { type: Compiler, },
]; };
var DOCUMENT = new mojiitoCore.InjectionToken('DocumentToken');
var DomTraverser = (function () {
    function DomTraverser() {
        this._nodeCount = 0;
        this._elementCount = 0;
        this._attributeCount = 0;
        this._textCount = 0;
        this._commentCount = 0;
    }
    /**
     * @param {?} node
     * @param {?} visitor
     * @param {?=} context
     * @return {?}
     */
    DomTraverser.prototype.traverse = function (node, visitor, context) {
        if (context === void 0) { context = null; }
        var /** @type {?} */ lclCntxt = context;
        this._nodeCount++;
        if (node instanceof Element) {
            lclCntxt = visitor.visitElement(node, lclCntxt) || lclCntxt;
            this._elementCount++;
        }
        else if (node instanceof Text) {
            lclCntxt = visitor.visitText(node, lclCntxt) || lclCntxt;
            this._textCount++;
        }
        else if (node instanceof Comment) {
            lclCntxt = visitor.visitComment(node, lclCntxt) || lclCntxt;
            this._commentCount++;
        }
        // Check if context has changed and look up the corresponding
        // NodeVisitor if available
        if (!!lclCntxt && lclCntxt !== context) {
            var /** @type {?} */ rendererType = lclCntxt.def.componentRendererType;
            if (rendererType) {
                visitor = rendererType.visitor;
            }
        }
        else {
            // Traverse through all the attributes of the node
            // if it is type of Element
            if (node instanceof Element && node.attributes.length) {
                for (var /** @type {?} */ i = 0, /** @type {?} */ max = node.attributes.length; i < max; i++) {
                    lclCntxt = visitor.visitAttribute(node, node.attributes[i], lclCntxt) || lclCntxt;
                    this._attributeCount++;
                }
            }
        }
        // Start traversing the child nodes
        var /** @type {?} */ childNode = node.firstChild;
        if (childNode) {
            this.traverse(childNode, visitor, lclCntxt);
            while (childNode = childNode.nextSibling) {
                this.traverse(childNode, visitor, lclCntxt);
            }
        }
    };
    return DomTraverser;
}());
var NAMESPACE_URIS = {
    'xlink': 'http://www.w3.org/1999/xlink',
    'svg': 'http://www.w3.org/2000/svg',
    'xhtml': 'http://www.w3.org/1999/xhtml',
    'xml': 'http://www.w3.org/XML/1998/namespace'
};
/**
 * @param {?} target
 * @return {?}
 */
function getGlobalEventTarget(target) {
    if (target === 'window') {
        return window;
    }
    if (target === 'document') {
        return this.document;
    }
    if (target === 'body') {
        return this.document.body;
    }
    return undefined;
}
var DomRendererFactory = (function () {
    function DomRendererFactory() {
        this.rendererByCompId = new Map();
        this.defaultRenderer = new DefaultDomRenderer();
    }
    
    /**
     * @param {?} element
     * @param {?} type
     * @return {?}
     */
    DomRendererFactory.prototype.createRenderer = function (element, type) {
        if (!element || !type) {
            return this.defaultRenderer;
        }
        return new ParseableDomRenderer(type.visitor, element);
    };
    return DomRendererFactory;
}());
DomRendererFactory.decorators = [
    { type: mojiitoCore.Injectable },
];
/**
 * @nocollapse
 */
DomRendererFactory.ctorParameters = function () { return []; };
var DefaultDomRenderer = (function () {
    function DefaultDomRenderer() {
    }
    /**
     * @param {?} context
     * @return {?}
     */
    DefaultDomRenderer.prototype.parse = function (context) {
        throw new Error("Parse is not allowed on the DefaultDomRenderer!");
    };
    /**
     * @return {?}
     */
    DefaultDomRenderer.prototype.destroy = function () { };
    /**
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    DefaultDomRenderer.prototype.createElement = function (name, namespace) {
        if (namespace) {
            return document.createElementNS(NAMESPACE_URIS[namespace], name);
        }
        return document.createElement(name);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    DefaultDomRenderer.prototype.createComment = function (value) { return document.createComment(value); };
    /**
     * @param {?} value
     * @return {?}
     */
    DefaultDomRenderer.prototype.createText = function (value) { return document.createTextNode(value); };
    /**
     * @param {?} node
     * @return {?}
     */
    DefaultDomRenderer.prototype.destroyNode = function (node) { };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @return {?}
     */
    DefaultDomRenderer.prototype.appendChild = function (parent, newChild) { parent.appendChild(newChild); };
    /**
     * @param {?} parent
     * @param {?} newChild
     * @param {?} refChild
     * @return {?}
     */
    DefaultDomRenderer.prototype.insertBefore = function (parent, newChild, refChild) {
        if (parent) {
            parent.insertBefore(newChild, refChild);
        }
    };
    /**
     * @param {?} parent
     * @param {?} oldChild
     * @return {?}
     */
    DefaultDomRenderer.prototype.removeChild = function (parent, oldChild) {
        if (parent) {
            parent.removeChild(oldChild);
        }
    };
    /**
     * @param {?} selectorOrNode
     * @return {?}
     */
    DefaultDomRenderer.prototype.selectRootElement = function (selectorOrNode) {
        var /** @type {?} */ el = selectorOrNode;
        if (typeof selectorOrNode === 'string') {
            el = document.querySelector(selectorOrNode);
        }
        if (!el) {
            throw new Error("The selector \"" + selectorOrNode + "\" did not match any elements");
        }
        return el;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    DefaultDomRenderer.prototype.parentNode = function (node) { return node.parentNode; };
    /**
     * @param {?} node
     * @return {?}
     */
    DefaultDomRenderer.prototype.nextSibling = function (node) { return node.nextSibling; };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @param {?=} namespace
     * @return {?}
     */
    DefaultDomRenderer.prototype.setAttribute = function (el, name, value, namespace) {
        if (namespace) {
            el.setAttributeNS(NAMESPACE_URIS[namespace], namespace + ':' + name, value);
        }
        else {
            el.setAttribute(name, value);
        }
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?=} namespace
     * @return {?}
     */
    DefaultDomRenderer.prototype.removeAttribute = function (el, name, namespace) {
        if (namespace) {
            el.removeAttributeNS(NAMESPACE_URIS[namespace], name);
        }
        else {
            el.removeAttribute(name);
        }
    };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    DefaultDomRenderer.prototype.addClass = function (el, name) { el.classList.add(name); };
    /**
     * @param {?} el
     * @param {?} name
     * @return {?}
     */
    DefaultDomRenderer.prototype.removeClass = function (el, name) { el.classList.remove(name); };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} value
     * @param {?} hasVendorPrefix
     * @param {?} hasImportant
     * @return {?}
     */
    DefaultDomRenderer.prototype.setStyle = function (el, style, value, hasVendorPrefix, hasImportant) {
        if (hasVendorPrefix || hasImportant) {
            el.style.setProperty(style, value, hasImportant ? 'important' : '');
        }
        else {
            el.style[style] = value;
        }
    };
    /**
     * @param {?} el
     * @param {?} style
     * @param {?} hasVendorPrefix
     * @return {?}
     */
    DefaultDomRenderer.prototype.removeStyle = function (el, style, hasVendorPrefix) {
        if (hasVendorPrefix) {
            el.style.removeProperty(style);
        }
        else {
            // IE requires '' instead of null
            el.style[style] = '';
        }
    };
    /**
     * @param {?} el
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    DefaultDomRenderer.prototype.setProperty = function (el, name, value) { el[name] = value; };
    /**
     * @param {?} node
     * @param {?} value
     * @return {?}
     */
    DefaultDomRenderer.prototype.setValue = function (node, value) { node.nodeValue = value; };
    /**
     * @param {?} target
     * @param {?} event
     * @param {?} callback
     * @return {?}
     */
    DefaultDomRenderer.prototype.listen = function (target, event, callback) {
        if (typeof target === 'string') {
            target = getGlobalEventTarget(target);
            if (!target) {
                throw new Error("Unsupported event target " + target + " for event " + event);
            }
        }
        target.addEventListener(event, /** @type {?} */ (callback), false);
        return function () { return target.removeEventListener(event, /** @type {?} */ (callback), false); };
    };
    return DefaultDomRenderer;
}());
var ParseableDomRenderer = (function (_super) {
    __extends(ParseableDomRenderer, _super);
    /**
     * @param {?} _visitor
     * @param {?} hostElement
     */
    function ParseableDomRenderer(_visitor, hostElement) {
        var _this = _super.call(this) || this;
        _this._visitor = _visitor;
        _this.hostElement = hostElement;
        return _this;
    }
    /**
     * @param {?} context
     * @return {?}
     */
    ParseableDomRenderer.prototype.parse = function (context) {
        var /** @type {?} */ traverser = new DomTraverser();
        traverser.traverse(this.hostElement, this._visitor, context);
    };
    /**
     * @param {?} node
     * @return {?}
     */
    ParseableDomRenderer.prototype.destroyNode = function (node) {
        if (node instanceof Node) {
            this.removeChild(node.parentNode, node);
        }
    };
    return ParseableDomRenderer;
}(DefaultDomRenderer));
var PLATFORM_PROVIDERS = [
    { provide: mojiitoCore.PlatformRef, useClass: BrowserPlatformRef },
    { provide: DOCUMENT, useValue: document },
    { provide: mojiitoCore.RendererFactory, useClass: DomRendererFactory },
    Compiler,
    ExpressionParser$$1,
    BindingParser
];
var platformBrowser = mojiitoCore.createPlatformFactory([PLATFORM_PROVIDERS, mojiitoCore.CORE_PROVIDERS]);

exports.DOCUMENT = DOCUMENT;
exports.DomRendererFactory = DomRendererFactory;
exports.BrowserPlatformRef = BrowserPlatformRef;
exports.ExpressionParser = ExpressionParser$$1;
exports.PLATFORM_PROVIDERS = PLATFORM_PROVIDERS;
exports.platformBrowser = platformBrowser;
exports.ɵb = BindingParser;
exports.ɵa = Compiler;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=platform-browser.umd.js.map
