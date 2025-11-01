import { Abstract } from '../types/index.js';
import { createClassDecorator } from './createClassDecorator.js';
import { createParamDecorator } from './createParamDecorator.js';

/**
 * `service` is a class decorator that marks a class as a service.
 * It can be used to register a class with the dependency injection container.
 * @export
 * @template T
 * @return {*}  {ClassDecorator}
 */
export function service(): ClassDecorator {
  return createClassDecorator({ type: 'service', data: undefined });
}

/**
 * `get` is a parameter decorator that injects a dependency into a constructor parameter.
 * @export
 * @template T
 * @param {Abstract<T>} abstract
 * @return {*}  {ParameterDecorator}
 */
export function get<T>(abstract: Abstract<T> | (() => Abstract<T>)): ParameterDecorator {
  return createParamDecorator(abstract);
}
