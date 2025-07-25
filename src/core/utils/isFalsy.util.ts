export function isFalsy(value: any): boolean {
    if (value === undefined || value === null) {
        return true;
    }

    if (typeof value === 'boolean') {
        return value === false;
    }

    if (typeof value === 'string') {
        return value.trim().length === 0;
    }

    if (typeof value === 'number') {
        return value === 0 || Number.isNaN(value);
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    if (
        typeof value === 'object' &&
        Object.getPrototypeOf(value) === Object.prototype
    ) {
        return Object.keys(value).length === 0;
    }

    if (value instanceof Set || value instanceof Map) {
        return value.size === 0;
    }

    return false;
}
