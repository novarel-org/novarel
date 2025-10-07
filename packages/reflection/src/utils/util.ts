import { InjectionMetadata } from "../types/index.js";

export const ServiceKey = Symbol.for("novarel:service");

/**
 * Utility function to create custom class decorator.
 * @param metadata 
 * @returns {ClassDecorator}
 */
export function createClassDecorator<T extends string = string>(metadata: InjectionMetadata<T> = { type: "service" }): ClassDecorator {
    return (object: Function) => {
        Reflect.defineMetadata(ServiceKey, metadata, object);
    };
};

