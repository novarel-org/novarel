import { isResolvable, Stringify } from '../utils/index.js';
import {
  Abstract,
  Abstracts,
  Binding,
  Concrete,
  Constructor,
  Factory,
} from '../types/index.js';
import { NOVAREL_INJECTION_KEY } from '../constants.js';
import { service } from '../decorators/decorators.js';

/**
 * `Container` is a simple dependency injection container that allows you to register and resolve dependencies.
 * @export
 * @class Container
 * @license MIT
 * @author Novarel
 */
@service()
export class Container {
  /**
   * The version of the Container.
   * @protected
   * @static
   * @memberof Container
   */
  protected static version = '0.0.1';

  /**
   * The static instance of the Container.
   * @protected
   * @static
   * @type {Container}
   * @memberof Container
   */
  protected static instance: Container;

  /**
   * The bindings (dependencies) registered in the container.
   * @protected
   * @type {Binding}
   * @memberof Container
   */
  protected bindings: Binding = new Map();

  /**
   * The build stack, used to detect circular dependencies.
   * @protected
   * @type {Abstracts}
   * @memberof Container
   */
  protected buildStack: Abstracts = [];

  /**
   * The singletons registered in the container.
   * @protected
   * @type {Abstracts}
   * @memberof Container
   */
  protected singletons: Abstracts = [];

  /**
   * The resolved dependencies, used to store singletons.
   * @protected
   * @type {Abstracts}
   * @memberof Container
   */
  protected resolved: Abstracts = [];

  /**
   * The resolved dependencies, used to store singletons.
   * @protected
   * @type {Map<Abstract<any>, any>}
   * @memberof Container
   */
  protected instances: Map<Abstract<any>, any> = new Map();

  /**
   * Determines if the given abstract type has been resolved.
   * @template T
   * @param {Abstract<T>} abstract
   * @return {*}  {boolean}
   * @memberof Container
   */
  hasBeenResolved<T>(abstract: Abstract<T>): boolean {
    return this.resolved.includes(abstract);
  }

  /**
   * Determines if the given abstract type has a binding.
   * @template T
   * @param {Abstract<T>} abstract
   * @return {*}  {boolean}
   * @memberof Container
   */
  hasBinding<T>(abstract: Abstract<T>): boolean {
    return this.bindings.has(abstract);
  }

  /**
   * Determines if the given abstract type has a singleton binding.
   * @template T
   * @param {Abstract<T>} abstract
   * @return {*}  {boolean}
   * @memberof Container
   */
  hasSingletonBinding<T>(abstract: Abstract<T>): boolean {
    return this.singletons.includes(abstract);
  }

  /**
   * Determines if the given abstract type is currently being built.
   * @template T
   * @param {Abstract<T>} abstract
   * @return {*}  {boolean}
   * @memberof Container
   */
  isCurrentlyBuilding<T>(abstract: Abstract<T>): boolean {
    return this.buildStack.includes(abstract);
  }

  /**
   * Binds an abstract type to a concrete type.
   * @protected
   * @template T
   * @param {Abstract<T>} abstract
   * @param {Concrete<T>} concrete
   * @param {boolean} [shared=false]
   * @memberof Container
   */
  protected registerBinding<T>(
    abstract: Abstract<T>,
    concrete?: Concrete<T>,
    shared: boolean = false
  ): void {
    if (!concrete) {
      concrete = abstract;
    }
    this.bindings.set(abstract, concrete);
    if (shared) {
      this.singletons.push(abstract);
    }
  }

  /**
   * Binds an abstract type to a concrete type.
   * @protected
   * @template T
   * @param {Abstract<T>} abstract
   * @param {Concrete<T>} concrete
   * @param {boolean} [shared=false]
   * @memberof Container
   */
  bind<T>(
    abstract: Abstract<T>,
    concrete?: Concrete<T>,
    shared: boolean = false
  ): void {
    this.registerBinding<T>(abstract, concrete, shared);
  }

  /**
   * Binds an abstract type to a concrete type only if it has not already been bound.
   * @protected
   * @template T
   * @param {Abstract<T>} abstract
   * @param {Concrete<T>} concrete
   * @param {boolean} [shared=false]
   * @memberof Container
   */
  bindIf<T>(
    abstract: Abstract<T>,
    concrete?: Concrete<T>,
    shared: boolean = false
  ): void {
    if (!this.hasBinding<T>(abstract)) {
      this.bind<T>(abstract, concrete, shared);
    }
  }

  /**
   * Binds an abstract type to a concrete type as a singleton.
   * @template T
   * @param {Abstract<T>} abstract
   * @param {Concrete<T>} [concrete]
   * @memberof Container
   */
  singleton<T>(abstract: Abstract<T>, concrete?: Concrete<T>): void {
    this.bind<T>(abstract, concrete, true);
  }

  /**
   * Binds an abstract type to a concrete type as a singleton only if it has not already been bound.
   * @template T
   * @param {Abstract<T>} abstract
   * @param {Concrete<T>} [concrete]
   * @memberof Container
   */
  singletonIf<T>(abstract: Abstract<T>, concrete?: Concrete<T>): void {
    if (!this.hasSingletonBinding<T>(abstract)) {
      this.singleton(abstract, concrete);
    }
  }

  /**
   * Builds the instance of given abstract type.
   * @protected
   * @template T
   * @param {Constructor<T>} constructor
   * @return {*}  {any[]}
   * @memberof Container
   */
  protected getReflectionDependencies<T>(constructor: Constructor<T>): any[] {
    if (!isResolvable(constructor)) {
      throw new Error(
        `Target class [${Stringify(constructor)}] is not resolvable.`
      );
    }
    return Reflect.getMetadata('design:paramtypes', constructor) || [];
  }

  /**
   * Resolves the dependencies for a given constructor.
   * @protected
   * @template T
   * @param {Abstract<T>} abstract
   * @return {*}  {any[]}
   * @memberof Container
   */
  protected getInjectionDependencies<T>(abstract: Abstract<T>): any[] {
    return Reflect.getMetadata(NOVAREL_INJECTION_KEY, abstract) || [];
  }

  /**
   * Resolves all of the dependencies for a given class.
   * @protected
   * @template T
   * @param {Constructor<T>} constructor
   * @return {*}  {any[]}
   * @memberof Container
   */
  protected resolveDependencies<T>(constructor: Constructor<T>): any[] {
    const rawDeps = this.getReflectionDependencies(constructor);
    const injections = this.getInjectionDependencies(constructor);
    const filtered = rawDeps.map((dep, index) => injections[index] ?? dep);
    return filtered.map((e) => {
      if (typeof e === 'function' && !('prototype' in e)) {
        return this.resolve(e?.());
      } else {
        return this.resolve(e);
      }
    });
  }

  /**
   * Resolves the given abstract type from the container.
   * @template T
   * @param {Abstract<T>} abstract
   * @return {*}  {T}
   * @memberof Container
   */
  protected resolve<T>(abstract: Abstract<T>): T {
    if (this.isCurrentlyBuilding(abstract)) {
      throw new Error(
        `Circular dependency detected while building [${Stringify(
          abstract
        )}]: ${this.buildStack.join(' -> ')}`
      );
    }
    if (
      this.hasSingletonBinding<T>(abstract) &&
      this.hasBeenResolved<T>(abstract)
    ) {
      return this.instances.get(abstract) as T;
    }

    const concrete = this.bindings.get(abstract);
    if (!concrete) {
      throw new Error(`Target class [${Stringify(abstract)}] is not found`);
    }
    const isSingleton = this.singletons.includes(abstract);
    let instance: T;

    this.buildStack.push(abstract);

    if (typeof concrete === 'function' && 'prototype' in concrete) {
      const dependencies = this.resolveDependencies(concrete) || [];
      instance = new (concrete as Constructor<T>)(...dependencies);
    } else if (typeof concrete === 'function' && !('prototype' in concrete)) {
      instance = (concrete as Factory<T>)(this);
    } else {
      instance = concrete as T;
    }
    this.buildStack.pop();
    if (isSingleton) {
      this.instances.set(abstract, instance);
    }
    this.resolved.push(abstract);
    return instance;
  }

  /**
   * Resolves the given abstract type from the container.
   * @template T
   * @param {Abstract<T>} abstract
   * @return {*}  {T}
   * @memberof Container
   */
  get<T>(abstract: Abstract<T>): T {
    return this.resolve<T>(abstract) as T;
  }

  /**
   * Resolves the given abstract type from the container.
   * @template T
   * @param {Abstract<T>} abstract
   * @return {*}  {T}
   * @memberof Container
   */
  make<T>(abstract: Abstract<T>): T {
    return this.resolve<T>(abstract) as T;
  }

  /**
   * Flushes the container, removing all bindings, singletons, and resolved instances.
   * @memberof Container
   */
  flush() {
    this.bindings.clear();
    this.buildStack = [];
    this.singletons = [];
    this.resolved = [];
    this.instances.clear();
  }

  /**
   * Returns the version of the Container.
   * @static
   * @return {string}
   * @memberof Container
   */
  static getVersion(): string {
    return this.version;
  }

  /**
   * Returns the static instance of the Container.
   * @static
   * @return {*}  {Container}
   * @memberof Container
   */
  static getInstance(): Container {
    if (!this.instance) {
      this.instance = new Container();
    }
    return this.instance;
  }
}
