/**
 * All the type definition related to `@novarel/reflect` package 
 * should be define here.
 */

import { ReflectManager } from "./container.js";

/**
 * A type representing the constructor of a service class,
 * which can be resolved through the container.
 * 
 * @template T The instance type returned by the constructor.
 */
export type Constructor<T> = (new (...args: any[]) => T);

/**
 * A type representing the factory callback which
 * will resolved to a instance of the service.
 * 
 * @template T The instance type returned by the factory.
 */
export type Factory<TReturn, TContainer extends ReflectManager = ReflectManager> = (manager: TContainer) => TReturn;

/**
 * A type representing the abstract(identifier) for a service to resolve
 * within  container.
 * 
 * @template T The instance type returned by the builder.
 */
export type Abstract<T> = string | symbol | Factory<T> | Constructor<T>;


/**
 * A type representing the the actual service instance resolved
 * with the container.
 * 
 * @template T The instance type returned by the builder.
 */
export type Concrete<T> = Abstract<T> | T;

/**
 * A type representing for a `ReflectionManager` single
 * binding value.
 * 
 * @template T The instance type returned by the builder.
 */
export type ReflectionData<T> = {
    shared: boolean;
    concrete: Concrete<T>
}

/**
 * A type representing the the bindings stored in `ReflectionManager`.
 */
export type Reflection = Map<Abstract<any>, ReflectionData<any>>;


/**
 * A type that represents the parameters used when creating a custom decorator.
 * 
 * @template T    The type of the optional extra metadata (default: any).
 * @template Type A string literal type representing the decorator category (default: string).
 */
export type CreateDecoratorParams<
    T = any,
    Type extends string = string
> = {
    type: "service" | "controller" | "middleware" | Type;
    extra?: T;
};
