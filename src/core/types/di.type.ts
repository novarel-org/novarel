import type { Container } from '../container/container.cont.js';

export type Constructor<T> = new (...args: any[]) => T;
export type Token<T> = string | symbol | Constructor<T>;
export type Abstract<T> = Token<T>;
export type Concrete<T> = Abstract<T>;
export type Binding<T> = {
    shared: boolean;
    concrete: Concrete<T>;
};

export type GlobalContainerCallback = (container: Container) => void;
export type ContainerCallback<T> = (container: Container, instance: T) => void;
export type ExtenderCallback<T> = (container: Container, instance: T) => T;
