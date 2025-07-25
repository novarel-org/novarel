export function isSymbol(token: any): boolean {
    return Boolean(token && typeof token === 'symbol');
}
