import { Abstract, Abstracts } from '../types/index.js';
import { NOVAREL_INJECTION_KEY } from '../constants.js';

/**
 * `createParamDecorator` is a factory function that creates a parameter decorator.
 * @export
 * @return {*}  {ParameterDecorator}
 */
export function createParamDecorator<T>(
  abstract: Abstract<T> | (() => Abstract<T>)
): ParameterDecorator {
  return (target: object, _p: any, index: number) => {
    const injections: Abstracts =
      Reflect.getMetadata(NOVAREL_INJECTION_KEY, target) || [];
    injections[index] = abstract;
    Reflect.defineMetadata(NOVAREL_INJECTION_KEY, injections, target);
  };
}
