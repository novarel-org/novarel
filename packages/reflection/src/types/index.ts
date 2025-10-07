import { Container } from "../services/container.js";

/**
 * A type represents a constructor function that
 * returns the instance of service.
 * @template T The type instance it returns.
 */
export type Constructor<T> = (new (...args: any[]) => T);

/**
 * A type represents a javascript callback that returns
 * a instance of service.
 * @template T The type of instance it returns.
 */
export type Factory<T> = (application: Container) => T;

/**
 * A type represents an abstraction used as an identifier 
 * to bind a service within a container.
 * @template T The type of instance it returns.
 */
export type Abstract<T> = Constructor<T> | Factory<T> | string | symbol;

/**
 * A concrete type represents an actual implementation that can be
 * bound or resolved from the container.
 * @template T The concrete value or the type of instance it represents.
 */
export type Concrete<T> = Abstract<T> | T;
