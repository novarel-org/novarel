import { isClassConstructor } from './isClassConstructor.util.js';
import { type Abstract } from '../types/index.js';
import { isString } from './isString.util.js';

export function convertAbstractToString<T>(abstract: Abstract<T>): string {
    if (isString(abstract)) {
        return String(abstract);
    }

    if (isClassConstructor(abstract)) {
        return (abstract as any).name || 'AnonymousClass';
    }

    if (typeof abstract === 'symbol') {
        return abstract.description ?? abstract.toString();
    }

    return 'AnonymousClass';
}
