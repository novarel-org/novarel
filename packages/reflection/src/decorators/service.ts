import { InjectionMetadata } from "../types/index.js";
import { createClassDecorator, ServiceKey } from "../utils/util.js";

/**
 * Decorator to mark a service as constructable.
 * @param {Function} object 
 * @returns {void}
 */
export function Service(object: Function): void {
    createClassDecorator({ type: "service" })(object);
};

/**
 * Check weather a object is decorated with `@Service`.
 * @param {any} data 
 * @returns  {InjectionMetadata['type'] | null}
 */
export const isService = (data: any): InjectionMetadata['type'] | null => {
    return Reflect.getMetadata(ServiceKey, data)?.type || null;
}