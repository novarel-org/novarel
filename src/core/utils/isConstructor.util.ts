import { isClassConstructor } from './isClassConstructor.util.js';
import { isFnConstructor } from './isFnConstructor.util.js';

export function isConstructor(value: any): boolean {
    return Boolean(isClassConstructor(value) || isFnConstructor(value));
}
