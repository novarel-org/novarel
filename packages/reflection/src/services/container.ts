import "reflect-metadata";
import { isService } from "../decorators/service.js";
import { Abstract, ClassicalBinding, Concrete, Constructor, Factory } from "../types/index.js";

/**
 * @author Muhammad Sulman <whomaderules@gmail.com>
 * @license MIT
 * @class Container
 * @remarks
 * The Container class handles the dependency injection, application lifecycle hooks.
 */
export class Container {
    /**
     * @description The version should be increased whenever a major update is made.
     * @version {0.0.1}
     * @type {string}
     */
    protected static __VERSION__ = "0.0.1";

    /**
     * The cached instance of `Container`.
     * @type {Container}
     */
    protected static __INSTANCE__: Container;

    /**
     * Bindings that are registered within container.
     * @type {Map<Abstract<any>, ClassicalBinding<any>>}
     */
    protected __BINDINGS__: Map<Abstract<any>, ClassicalBinding<any>> = new Map();

    /**
     * Bindings that are currently being building.
     * @type {Abstract<any>[]}
     */
    protected __BUILDSTACK__: Abstract<any>[] = [];

    /**
     * Bindings that are registered as singleton.
     * @type {Abstract<any>[]}
     */
    protected __SINGLETONS__: Abstract<any>[] = [];

    /**
     * Instances that are registered within container.
     * @type {Map<Abstract<any>, any>}
     */
    protected __INSTANCES__: Map<Abstract<any>, any> = new Map();

    /**
     * Determines weather an abstract is in build stack.
     * @param {Abstract<T>} abstract 
     * @returns {boolean}
     */
    hasInBuildStack<T>(abstract: Abstract<T>): boolean {
        return this.__BUILDSTACK__.includes(abstract);
    }

    /**
     * Determines whether an abstract type is registered in classic bindings.
     * @param {Abstract<T>} abstract The abstract identifier to check.
     * @returns {boolean} True if the abstract type exists in classic bindings; otherwise, false.
     */
    hasClassicBinding<T>(abstract: Abstract<T>): boolean {
        return this.__BINDINGS__.has(abstract);
    }

    /**
     * Determines whether an abstract type is registered in singleton bindings.
     * @param {Abstract<T>} abstract The abstract identifier to check.
     * @returns {boolean} True if the abstract type exists in singleton bindings; otherwise, false.
     */
    hasSingletonBinding<T>(abstract: Abstract<T>): boolean {
        return this.__SINGLETONS__.includes(abstract);
    }

    /**
     * Determines whether an abstract type is registered in instance bindings.
     * @param {Abstract<T>} abstract The abstract identifier to check.
     * @returns {boolean} True if the abstract type exists in instance bindings; otherwise, false.
     */
    hasInstance<T>(abstract: Abstract<T>): boolean {
        return this.__INSTANCES__.has(abstract);
    }

    /**
     * Register a classical binding within container.
     * @param {Abstract<T>} abstract 
     * @param {Concrete<T>} concrete 
     * @param {boolean} shared 
     */
    protected registerBinding<T>(abstract: Abstract<T>, concrete?: Concrete<T>, shared: boolean = false) {
        if (!concrete) {
            concrete = abstract;
        };
        this.__BINDINGS__.set(abstract, {
            concrete,
            shared,
        });
        if (shared) {
            this.__SINGLETONS__.push(abstract);
        };
    };

    /**
     * Register a classical binding or overwrite within container.
     * @param {Abstract<T>} abstract 
     * @param {Concrete<T>} concrete 
     * @param {boolean} shared 
     */
    bind<T>(abstract: Abstract<T>, concrete?: Concrete<T>, shared: boolean = false): void {
        this.registerBinding(abstract, concrete, shared);
    }

    /**
     * Register a classical binding within container if already not exist.
     * @param {Abstract<T>} abstract 
     * @param {Concrete<T>} concrete 
     * @param {boolean} shared 
     */
    bindIf<T>(abstract: Abstract<T>, concrete?: Concrete<T>, shared: boolean = false): void {
        if (!this.hasClassicBinding<T>(abstract)) {
            this.registerBinding(abstract, concrete, shared);
        };
    }

    /**
     * Register a singleton binding or overwrite within container.
     * @param {Abstract<T>} abstract 
     * @param {Concrete<T>} concrete 
     */
    singleton<T>(abstract: Abstract<T>, concrete?: Concrete<T>): void {
        this.registerBinding(abstract, concrete, true);
    }

    /**
     * Register a singleton binding within container if already not exist.
     * @param {Abstract<T>} abstract 
     * @param {Concrete<T>} concrete 
     */
    singletonIf<T>(abstract: Abstract<T>, concrete?: Concrete<T>): void {
        if (!this.hasSingletonBinding<T>(abstract)) {
            this.registerBinding(abstract, concrete, true);
        };
    }

    /**
     * Register a instance binding directly or overwrite within container.
     * @param {Abstract<T>} abstract 
     * @param {Concrete<T>} concrete 
     */
    instance<T>(abstract: Abstract<T>, concrete: any): void {
        this.__INSTANCES__.set(abstract, concrete);
        this.__SINGLETONS__.push(abstract);
    }

    /**
     * Register a instance binding directly within container if already not exist.
     * @param {Abstract<T>} abstract 
     * @param {Concrete<T>} concrete 
     */
    instanceIf<T>(abstract: Abstract<T>, concrete: any): void {
        if (!this.hasInstance(abstract)) {
            this.instance(abstract, concrete);
        };
    }

    /**
     * Resolve and return the concrete instance for a given abstract binding.
     * 
     * @template T
     * @param {Abstract<T>} resolvable - The abstract or token to resolve.
     * @returns {T} The resolved instance of the requested dependency.
     */
    get<T>(resolvable: Abstract<T>): T {
        return this.resolve<T>(resolvable);
    }

    /**
     * Internal resolver that constructs or retrieves an instance bound to the given abstract.
     * Handles class constructors, factory functions, and direct instance bindings.
     * 
     * @template T
     * @param {Abstract<T>} abstract - The abstract token or class constructor to resolve.
     * @returns {T} The resolved dependency instance.
     * @throws {Error} When no binding is found for the provided abstract.
     */
    protected resolve<T>(abstract: Abstract<T>): T {
        if (this.hasInBuildStack(abstract)) {
            throw new Error(`Circular dependency detected for class [${abstract?.toString()}]`);
        };
        if (this.hasSingletonBinding(abstract) || this.hasInstance(abstract)) {
            return this.__INSTANCES__.get(abstract) as T;
        };
        const binding = this.__BINDINGS__.get(abstract);
        if (!binding) {
            throw new Error(`Target class binding [${abstract?.toString()}] not found`);
        };
        const { concrete, shared } = binding;
        let instance: T;
        this.__BUILDSTACK__.push(abstract);
        if (typeof (concrete) === "function" && "prototype" in concrete) {
            const deps = this.resolveDependencies(concrete);
            instance = new (concrete as Constructor<T>)(...deps);
        } else if (typeof (concrete) === "function") {
            instance = (concrete as Factory<T>)(this);
        } else {
            instance = concrete as T;
        };
        this.__BUILDSTACK__.pop();
        if (shared) {
            this.__SINGLETONS__.push(abstract)
            this.__INSTANCES__.set(abstract, instance);
        };
        return instance;
    };

    /**
     * Resolves the dependencies of a constructable.
     * @param {Constructor<T>} constructable 
     * @returns {any[]}
     */
    protected resolveDependencies<T>(constructable: Constructor<T>): any[] {
        if (!isService(constructable)) {
            return [];
        }
        const reflected = this.getReflectedParamTypes(constructable);
        const injected = this.getInjectedTokens(constructable);
        const tokens = reflected.map((type, i) => injected[i] ?? type);
        const resolved = tokens.map((token) => {
            if (!token) return undefined;
            try {
                return this.resolve<T>(token);
            } catch {
                return undefined;
            };
        });
        return resolved
    }

    /**
     * Get the constructor dependencies with `reflect-metadata`.
     * @param {Constructor<T>} constructor 
     * @returns {any[]}
     */
    protected getInjectedTokens<T>(constructor: Constructor<T>): any[] {
        if (!isService(constructor)) {
            return [];
        };
        const abstracts = Reflect.getMetadata("design:injections", constructor) || [];
        return abstracts;
    }

    /**
     * Get the constructor dependencies with `reflect-metadata`.
     * @param {Constructor<T>} constructor 
     * @returns {any[]}
     */
    protected getReflectedParamTypes<T>(constructor: Constructor<T>): any[] {
        if (!isService(constructor)) {
            return [];
        };
        const abstracts = Reflect.getMetadata('design:paramtypes', constructor) || [];
        return abstracts;
    }

    reset(): void {
        this.__BINDINGS__.clear();
        this.__BUILDSTACK__ = [];
        this.__INSTANCES__.clear();
        this.__SINGLETONS__ = [];
    }

    /**
     * Set the cached instance of current container lifecycle.
     * @param {Container} instance 
     * @returns {void}
     */
    static setInstance(instance: Container): void {
        this.__INSTANCE__ = instance;
    }

    /**
     * Determines weather cached instance 
     * of container exists.
     * @returns {boolean}
     */
    static hasInstance(): boolean {
        return !!this.__INSTANCE__;
    }

    /**
     * Returns the singleton container instance, creating it if necessary.
     * @returns {Container}
     */
    static Constructor(): Container {
        if (!this.hasInstance()) {
            this.setInstance(new Container());
        };
        return this.__INSTANCE__;
    }


    /**
     * Get the current version of `Container`.
     * @returns {string}
     */
    static Version(): string {
        return this.__VERSION__;
    }
};


