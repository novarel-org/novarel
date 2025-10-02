/**
 * All the utility code will be define here.
 */

import { METADATA } from "./constants.js";
import { CreateDecoratorParams } from "./types.js";

/**
 * Converts a given value into a string representation.
 *
 * @param data The value to be stringified.
 * @returns {string} A string representation of the given value.
 */
export const stringify = (data: any): string => {
    if (typeof data === "string") return data;
    if (typeof data === "symbol") return data?.description || "unknown";
    if (typeof data === "function") return data.name;
    return "unknown";
};


/**
 * Determines weather a class is a novarel service class.
 * @param target 
 * @returns {CreateDecoratorParams | null}
 */
export const isService = (target: any): CreateDecoratorParams | null => Reflect.getMetadata(METADATA, target) ? Reflect.getMetadata(METADATA, target)?.type : null;

/**
 * Determines whether the given value is a JavaScript class constructor.
 *
 * @param provider The value to check.
 * @returns {boolean} True if the value is a class constructor, otherwise false.
 */
export const isClass = (provider: any): boolean => {
    return (
        typeof provider === "function" &&
        /^class\s/.test(Function.prototype.toString.call(provider))
    );
};

/**
 * Checks whether the given value is a plain JavaScript function
 * (named, anonymous, or arrow) and not a class/prototype constructor.
 *
 * @param provider The value to check.
 * @returns {boolean} True if it's a plain function, false otherwise.
 */
export const isFunction = (provider: any): boolean => {
    if (typeof provider !== "function") {
        return false;
    }

    const isClass = /^class\s/.test(Function.prototype.toString.call(provider));
    const isArrow = !provider.prototype;
    const isNormalFn = !isClass;
    return (isArrow || isNormalFn) && !isClass;
};
