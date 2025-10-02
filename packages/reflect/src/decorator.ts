/**
 * Decorators and there related metadata
 * will be define in this file.
 */

import { METADATA } from "./constants.js";
import { CreateDecoratorParams } from "./types.js";

/**
 * Use to create custom decorator for constructor services.
 * @param {CreateDecoratorParams<T, Type>}  data 
 * @returns {ClassDecorator}
 */
function createClassDecorator<T = any, Type extends string = any>(data: CreateDecoratorParams<T, Type> = { type: "service", extra: undefined }): ClassDecorator {
    return (target: object) => {
        Reflect.defineMetadata(METADATA, data, target);
    };
};

/**
 * Marks a class as classic resolvable service
 * in manager.
 * @param {Function} target 
 * @returns {void}
 */
export function Service(target: Function): void {
    createClassDecorator<undefined, "">({
        type: "service",
        extra: undefined,
    })(target);
};

