import { DESIGN_PARAM } from "./constants.js";
import { Abstract, Concrete, Constructor, Factory, Reflection } from "./types.js";
import { isClass, isFunction, isService, stringify } from "./utils.js";

/**
 * The ReflectManager class ensures proper service resolution,
 * registration of service bindings, and management of scoped resolutions.
 *
 * @author Muhammad Sulman <whomaderules@gmail.com>
 * @license MIT
 * @class ReflectManager
 * @createdAt 10/02/2025
 * @updatedAt 10/02/2025
 */
export class ReflectManager<C extends ReflectManager<any> = ReflectManager<any>> {
    /**
     * The current version of manager.
     */
    protected static version = "1.0.0";

    /**
     * Cached instance of manager.
     * @type {ReflectManager}
     */
    protected static instance: ReflectManager;

    /**
     * All registered bindings to manager.
     * @type {Reflection}
     */
    protected _bindings: Reflection = new Map();

    /**
     * All the abstracts that are registered as singleton.
     * @type {Abstract<any>[]}
     */
    protected _singletons: Abstract<any>[] = [];

    /**
     * Instances that are directly bind to container 
     * or singleton instances.
     * @type { Map<Abstract<any>, any>}
     */
    protected _instances: Map<Abstract<any>, any> = new Map();

    /**
     * Abstracts that are currently building with manager.
     * @type {Abstract<any>[]}
     */
    protected _buildStack: Abstract<any>[] = [];

    /**
     * Returns true if the binding for specific abstract exists.
     * @param {Abstract<T>} abstract 
     * @returns {boolean}
     */
    hasBinding<T>(abstract: Abstract<T>): boolean {
        return this._bindings.has(abstract);
    }

    /**
     * Returns true if the singleton binding for specific abstract exists.
     * @param {Abstract<T>} abstract 
     * @returns {boolean}
     */
    hasSingleton<T>(abstract: Abstract<T>): boolean {
        return this._bindings.get(abstract)?.shared || this._singletons.includes(abstract);
    }

    /**
     * Returns true if the instance binding for specific abstract exists.
     * @param {Abstract<T>} abstract 
     * @returns {boolean}
     */
    hasInstance<T>(abstract: Abstract<T>): boolean {
        return this._instances.has(abstract);
    }

    /**
     * Register a binding to manager.
     * @param {Abstract<T>} abstract 
     * @param {Concrete<T>} concrete 
     * @param {boolean} shared 
     * @returns {void}
     */
    protected __registerBinding__<T>(abstract: Abstract<T>, concrete?: Concrete<T>, shared: boolean = false): void {
        if (!concrete) concrete = abstract;
        this._bindings.set(abstract, {
            concrete,
            shared,
        });
    };

    /**
     * Register a binding to manager.
     * @param {Abstract<T>} abstract 
     * @param {Concrete<T>} concrete 
     * @param {boolean} shared 
     * @returns {void}
     */
    bind<T>(abstract: Abstract<T>, concrete?: Concrete<T>, shared: boolean = false): void {
        this.__registerBinding__(abstract, concrete, shared);
    };

    /**
     * Register a binding to manager if not exists.
     * @param {Abstract<T>} abstract 
     * @param {Concrete<T>} concrete 
     * @param {boolean} shared 
     * @returns {void}
     */
    bindIf<T>(abstract: Abstract<T>, concrete?: Concrete<T>, shared: boolean = false): void {
        if (!this.hasBinding(abstract)) {
            this.__registerBinding__(abstract, concrete, shared);
        };
    };

    /**
     * Register singleton a binding to manager.
     * @param {Abstract<T>} abstract 
     * @param {Concrete<T>} concrete 
     * @returns {void}
     */
    singleton<T>(abstract: Abstract<T>, concrete?: Concrete<T>): void {
        this.bind(abstract, concrete, true);
    };

    /**
     * Register singleton a binding to manager.
     * @param {Abstract<T>} abstract 
     * @param {Concrete<T>} concrete 
     * @returns {void}
     */
    singletonIf<T>(abstract: Abstract<T>, concrete?: Concrete<T>): void {
        if (!this.hasSingleton(abstract)) {
            this.bind(abstract, concrete, true);
        };
    };

    /**
     * Register instance a binding to manager.
     * @param {Abstract<T>} abstract 
     * @param {Concrete<T>} concrete 
     * @returns {void}
     */
    instance<T>(abstract: Abstract<T>, concrete: T): void {
        this._singletons.push(abstract);
        this._instances.set(abstract, concrete);
    };

    /**
     * Register instance a binding to manager.
     * @param {Abstract<T>} abstract 
     * @param {Concrete<T>} concrete 
     * @returns {void}
     */
    instanceIf<T>(abstract: Abstract<T>, concrete: T): void {
        if (!this.hasInstance(abstract)) {
            this.instance(abstract, concrete);
        };
    };

    /**
    * Creates the instance on the first call and returns the same instance
    * on subsequent calls (singleton pattern).
    *
    * @returns {ReflectManager} The shared ReflectManager instance.
    */
    static construct(): ReflectManager {
        if (!this.instance) {
            this.instance = new ReflectManager();
        }
        return this.instance;
    }

    /**
     * Resolves a binding from the container.
     *
     * - If the abstract is registered as a singleton and already has an instance,
     *   the cached instance is returned.
     * - If the abstract is bound to a class constructor, its dependencies are resolved
     *   (using {@link resolveDependencies}) and a new instance is created.
     * - If the abstract is bound to a factory function, the factory is executed
     *   with the current container instance.
     * - Otherwise, the concrete value is returned directly.
     * - If the binding does not exist, an error is thrown.
     *
     * @template T The type of the resolved service.
     * @param {Abstract<T>} abstract The abstract identifier of the service to resolve.
     * @returns {T} The resolved service instance.
     * @throws {Error} If the abstract is not registered in the container.
     */
    make<T>(abstract: Abstract<T>): T {
        return this.resolve<T>(abstract);
    }

    /**
     * Resolves a binding from the container.
     *
     * - If the abstract is registered as a singleton and already has an instance,
     *   the cached instance is returned.
     * - If the abstract is bound to a class constructor, its dependencies are resolved
     *   (using {@link resolveDependencies}) and a new instance is created.
     * - If the abstract is bound to a factory function, the factory is executed
     *   with the current container instance.
     * - Otherwise, the concrete value is returned directly.
     * - If the binding does not exist, an error is thrown.
     *
     * @template T The type of the resolved service.
     * @param {Abstract<T>} abstract The abstract identifier of the service to resolve.
     * @returns {T} The resolved service instance.
     * @throws {Error} If the abstract is not registered in the container.
     */
    protected resolve<T>(abstract: Abstract<T>): T {
        /**
         * Check weather provided abstract is singleton binding then
         * return cached instance.
         */
        if (this.hasSingleton(abstract) && this.hasInstance(abstract)) {
            return this._instances.get(abstract) as T;
        };

        /**
         * Find the binding if it is classical binding.
         */
        const binding = this._bindings.get(abstract);
        if (!binding) {
            throw new Error(`Target class [${stringify(abstract)}] not found.`);
        };
        /**
         * Check for circular dependency.
         */
        if (this._buildStack.includes(abstract)) {
            throw new Error(
                `Circular dependency detected while resolving [${stringify(abstract)}]. ` +
                `Build stack: ${this._buildStack.map(stringify).join(" -> ")}`
            );
        }

        /**
         * Building process.
         */
        this._buildStack.push(abstract);
        const { concrete, shared } = binding;
        let instance: T;
        if (isClass(concrete)) {
            const deps = this.resolveDependencies(concrete);
            instance = new (concrete as Constructor<T>)(...deps);
        } else if (isFunction(concrete)) {
            instance = (concrete as Factory<T>)(this);
        } else {
            instance = concrete as T;
        };
        if (shared) {
            this._singletons.push(abstract);
            this._instances.set(abstract, instance);
        };
        return instance;
    }

    /**
    * Resolves all constructor dependencies for a given service class
    * using metadata emitted by TypeScript (`design:paramtypes`).
    *
    * - Throws an error if the target class is not registered as a service.
    * - Reads the constructor parameter types via `Reflect.getMetadata`.
    * - Uses {@link resolve} to instantiate or retrieve each dependency.
    *
    * @template T The type of the service being resolved.
    * @param constructor The class constructor whose dependencies should be resolved.
    * @returns {any[]} An array of resolved dependency instances in the same order
    *                  as the constructor parameters.
    * @throws {Error} If the given constructor is not marked as a service.
    */
    protected resolveDependencies<T>(constructor: Constructor<T>): any[] {
        if (!isService(constructor)) {
            throw new Error(`Target class [${stringify(constructor)}] is not a service.`);
        };
        const metadata = Reflect.getMetadata(DESIGN_PARAM, constructor) as
            | Constructor<any>[]
            | undefined;

        if (!metadata || metadata.length === 0) {
            return [];
        };
        return metadata.map((param) => this.resolve(param));

    }
    /**
     * Resets the container state by clearing all bindings,
     * cached instances, singletons, and the build stack.
     * 
     * @returns {void}
     */
    reset(): void {
        this._bindings.clear();
        this._instances.clear();
        this._buildStack = [];
        this._singletons = [];
    }


    /**
     * Get the version of manager.
     * @returns {string}
     */
    static Version(): string {
        return this.version;
    }
}