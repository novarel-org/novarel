export function isFnConstructor(value: any): boolean {
    return (
        typeof value === 'function' &&
        (!value.prototype ||
            Object.getOwnPropertyNames(value.prototype).length === 1)
    );
}
