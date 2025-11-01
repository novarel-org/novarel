import { NOVAREL_SERVICE_KEY } from '../constants.js';

/**
 * Represents the type of a service.
 */
export type ServiceType = 'service' | 'controller' | 'middleware';

/**
 * Represents the type of a service.
 */
export type ServiceMetadata<T = any> = { type: ServiceType; data?: T };

/**
 * `createClassDecorator` is a factory function that creates a class decorator.
 * @export
 * @return {*}  {ClassDecorator}
 */
export function createClassDecorator<T>(
  metadata: ServiceMetadata<T> = { type: 'service' }
): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(NOVAREL_SERVICE_KEY, metadata, target);
  };
}
