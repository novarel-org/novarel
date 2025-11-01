import { NOVAREL_SERVICE_KEY } from '../constants.js';

/**
 * `isResolvable` is a utility function that checks if a given value is resolvable by the container.
 * @export
 * @param {*} value
 * @return {*}  {boolean}
 */
export function isResolvable(value: any): boolean {
  const metadata = Reflect.getMetadata(NOVAREL_SERVICE_KEY, value);
  if (!metadata) return false;
  return true;
}

/**
 * `Stringify` is a utility function that converts a given value to a string representation.
 * @export
 * @param {*} data
 * @return {string}
 */
export function Stringify(data: any): string {
  if (typeof data === 'string') {
    return data;
  } else if (typeof data === 'symbol') {
    return data.description || 'Unknown';
  } else if (typeof data === 'function') {
    return data.name || 'Unknown';
  }
  return 'Unknown';
}
