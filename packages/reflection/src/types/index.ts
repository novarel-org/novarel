import { Container } from '../services/container.js';

/**
 * Represents a constructor function for a given type `T`.
 */
export type Constructor<T> = new (...args: any[]) => T;

/**
 * Represents a factory function that creates an instance of type `T`.
 */
export type Factory<T> = (application: Container) => T;

/**
 * Represents an abstract type that can be used as a token for dependency injection.
 */
export type Abstract<T> = Constructor<T> | Factory<T> | string | symbol;

/**
 * Represents a type that can be resolved from the container.
 */
export type Concrete<T> = Abstract<T> | T;

/**
 * Represents a list of abstract types.
 */
export type Abstracts = Abstract<any>[];

/**
 * Represents a binding of an abstract type to a concrete type.
 */
export type Binding = Map<Abstract<any>, Concrete<any>>;
