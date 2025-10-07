import { Abstract } from "src/types/index.js";

/**
 * Parameter decorator that defines an explicit dependency injection token.
 * Used to override or specify which abstract binding should be injected
 * at a given constructor parameter position.
 * 
 * @template T
 * @param {Abstract<T>} abstract - The abstract or token to be injected.
 * @returns {ParameterDecorator} A parameter decorator function that stores injection metadata.
 */
export function Give<T>(abstract: Abstract<T>): ParameterDecorator {
    return (target: object, _: any, index: number) => {
        const existed = (Reflect.getMetadata("design:injections", target) ?? []) as Abstract<any>[];
        existed[index] = abstract;
        Reflect.defineMetadata("design:injections", existed, target);
    };
}
