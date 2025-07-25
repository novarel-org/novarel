export function isClassConstructor(value: any): boolean {
    return (
        typeof value === 'function' &&
        /^class\s/.test(Function.prototype.toString.call(value))
    );
}
