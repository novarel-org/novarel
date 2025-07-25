import { isString } from './isString.util.js';
import { isSymbol } from './isSymbol.util.js';

export function isStringOrSymbolToken(token: any): boolean {
    return Boolean(isString(token) || isSymbol(token));
}
