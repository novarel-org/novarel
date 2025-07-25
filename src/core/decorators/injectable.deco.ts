import { INJECTABLE } from '../constants/index.js';

export function injectable(): ClassDecorator {
    return (target: object) => {
        Reflect.defineMetadata(INJECTABLE, true, target);
    };
}
