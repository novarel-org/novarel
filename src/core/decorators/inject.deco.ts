import { INJECT } from '../constants/index.js';
import type { Abstract } from '../types/index.js';

export function inject<T = any>(key: Abstract<T>): ParameterDecorator {
    return (
        target: Object,
        _propertyKey: string | symbol | undefined,
        parameterIndex: number,
    ) => {
        const existing: Map<number, Abstract<any>> = Reflect.getMetadata(
            INJECT,
            target,
        ) ?? new Map();
        existing.set(parameterIndex, key);
        Reflect.defineMetadata(INJECT, existing, target);
    };
}
