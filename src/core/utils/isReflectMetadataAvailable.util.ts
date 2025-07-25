import 'reflect-metadata';
import { isFalsy } from './isFalsy.util.js';

export function isReflectMetadataDefined() {
    if (isFalsy(Reflect) || isFalsy(Reflect.getMetadata)) {
        throw new Error('');
    }
}
