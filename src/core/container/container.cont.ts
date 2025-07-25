import { injectable } from '../decorators/injectable.deco.js';
import {
    DependencyInjectionException,
    convertAbstractToString,
} from '../index.js';
import {
    type Abstract,
    type Binding,
    type Concrete,
    type ContainerCallback,
    type ExtenderCallback,
    type GlobalContainerCallback,
} from '../types/index.js';
import { ContextualContextBuilder } from './contextual-context-builder.cont.js';

@injectable()
export class Container {
    protected _instance: Container;

    protected _resolved: Map<Abstract<any>, boolean> = new Map();
    protected _bindings: Map<Abstract<any>, Binding<any>> = new Map();
    protected _instances: Map<Abstract<any>, any> = new Map();
    protected _scopedInstances: Map<Abstract<any>, any> = new Map();
    protected _contextualBinding: Map<
        Abstract<any>,
        Map<Abstract<any>, Concrete<any>>
    > = new Map();

    protected _buildStack: Abstract<any>[] = [];

    protected _aliases: Map<string, Abstract<any>> = new Map();

    protected _globalBeforeResolvingCallback: GlobalContainerCallback[] = [];
    protected _globalResolvingCallback: GlobalContainerCallback[] = [];
    protected _globalAfterResolvingCallback: GlobalContainerCallback[] = [];

    protected _beforeResolvingCallback: Map<
        Abstract<any>,
        ContainerCallback<any>[]
    > = new Map();
    protected _resolvingCallback: Map<Abstract<any>, ContainerCallback<any>[]> =
        new Map();
    protected _afterResolvingCallback: Map<
        Abstract<any>,
        ContainerCallback<any>[]
    > = new Map();

    protected _extenders: Map<Abstract<any>, ExtenderCallback<any>[]> =
        new Map();

    constructor() {
        this._instance = this;
    }

    when<T>(abstract: Abstract<T>): ContextualContextBuilder {
        return new ContextualContextBuilder(this, abstract);
    }

    alias<T>(name: string, abstract: Abstract<T>): void {
        if (name === abstract) {
            throw new DependencyInjectionException(
                `Can't register [${convertAbstractToString(name)}] to itself.`,
            );
        }
        this._aliases.set(name, abstract);
    }

    protected isAlias(alias: string): boolean {
        return this._aliases.has(alias);
    }

    protected resolveAlias<T>(abstract: string | Abstract<T>): Abstract<T> {
        if (typeof abstract === 'string' && this._aliases.has(abstract)) {
            return this.resolveAlias(this._aliases.get(abstract)!);
        }

        return abstract;
    }

    protected resolve<T>(
        abstract: Abstract<T>,
        raiseEvents: boolean = true,
    ): T {
        abstract = this.resolveAlias(abstract);
        if (this._instances.has(abstract)) {
            return this._instances.get(abstract);
        }

        if (this._scopedInstances.has(abstract)) {
            return this._scopedInstances.get(abstract);
        }

        const binding = this._bindings.get(abstract);
        if (!binding) {
            throw new DependencyInjectionException(
                `Cannot resolve [${convertAbstractToString(abstract)}]: not bound.`,
            );
        }

        if (raiseEvents) {
            this.fireGlobalEvents(this._globalBeforeResolvingCallback);
            const before = this._beforeResolvingCallback.get(abstract) ?? [];
            this.fireEvents(abstract, before);
        }

        let concrete = binding.concrete;

        this.fireGlobalEvents(this._globalResolvingCallback);
        const parent = this._buildStack.at(-1);
        if (parent && this._contextualBinding.has(parent)) {
            const ctxMap = this._contextualBinding.get(parent)!;
            if (ctxMap.has(abstract)) {
                concrete = ctxMap.get(abstract)!;
            }
        }

        this._buildStack.push(abstract);

        const instance = this.fireExtenders(
            abstract,
            this.resolveDependencies(concrete),
        );

        this._buildStack.pop();

        if (binding.shared) {
            this._instances.set(abstract, instance);
        }

        this._resolved.set(abstract, true);

        if (raiseEvents) {
            const resolving = this._resolvingCallback.get(abstract) ?? [];
            const after = this._afterResolvingCallback.get(abstract) ?? [];
            this.fireEvents(abstract, resolving);
            this.fireEvents(abstract, after);
            this.fireGlobalEvents(this._globalAfterResolvingCallback);
        }

        return instance;
    }

    protected resolveDependencies<T>(concrete: Concrete<T>): T {
        if (typeof concrete === 'function') {
            const paramTypes: Abstract<any>[] =
                Reflect.getMetadata('design:paramtypes', concrete) ?? [];
            const dependencies = paramTypes.map((dep) => this.resolve(dep));
            return new concrete(...dependencies);
        }

        throw new DependencyInjectionException(
            `Cannot resolve concrete of type: ${typeof concrete}`,
        );
    }

    protected resolved<T>(abstract: Abstract<T>): boolean {
        return this._resolved.has(abstract);
    }

    addContextualBinding<T>(
        abstract: Abstract<any>,
        needs: Abstract<T>,
        implementations: Concrete<T>,
    ): void {
        const contextual = new Map();
        contextual.set(needs, implementations);
        this._contextualBinding.set(abstract, contextual);
    }
    make<T>(abstract: Abstract<T>): T {
        return this.resolve(abstract, true);
    }

    protected register<T>(
        abstract: Abstract<T>,
        concrete: Concrete<T>,
        shared: boolean = false,
    ): void {
        this._bindings.set(abstract, {
            concrete,
            shared,
        });
        this.dropStaleInstances<T>(abstract);
    }

    bind<T>(
        abstract: Abstract<T>,
        concrete: Concrete<T>,
        shared: boolean = false,
    ): void {
        this.register(abstract, concrete, shared);
    }

    singleton<T>(abstract: Abstract<T>, concrete: Concrete<T>): void {
        this.bind(abstract, concrete, true);
    }

    instance<T>(abstract: Abstract<T>, concrete: T): void {
        this._instances.set(abstract, concrete);
        this._resolved.set(abstract, true);
    }

    scopedInstance<T>(abstract: Abstract<T>, concrete: T): void {
        this._scopedInstances.set(abstract, concrete);
        this._resolved.set(abstract, true);
    }

    protected dropStaleInstances<T>(abstract: Abstract<T>): void {
        this._resolved.delete(abstract);
        this._instances.delete(abstract);
    }

    beforeResolving<T = any>(
        abstract: Abstract<any>,
        cb: ContainerCallback<T>,
    ): void {
        const callbacks: ContainerCallback<any>[] =
            this._beforeResolvingCallback.get(abstract) ?? [];
        callbacks.push(cb);
        this._beforeResolvingCallback.set(abstract, callbacks);
    }

    afterResolving<T = any>(
        abstract: Abstract<any>,
        cb: ContainerCallback<T>,
    ): void {
        const callbacks: ContainerCallback<any>[] =
            this._afterResolvingCallback.get(abstract) ?? [];
        callbacks.push(cb);
        this._afterResolvingCallback.set(abstract, callbacks);
    }

    resolving<T = any>(
        abstract: Abstract<any>,
        cb: ContainerCallback<T>,
    ): void {
        const callbacks: ContainerCallback<any>[] =
            this._resolvingCallback.get(abstract) ?? [];
        callbacks.push(cb);
        this._resolvingCallback.set(abstract, callbacks);
    }

    globalBeforeResolving(cb: GlobalContainerCallback): void {
        this._globalBeforeResolvingCallback.push(cb);
    }

    afterBeforeResolving(cb: GlobalContainerCallback): void {
        this._globalAfterResolvingCallback.push(cb);
    }

    globalResolving(cb: GlobalContainerCallback): void {
        this._globalResolvingCallback.push(cb);
    }

    extend<T>(abstract: Abstract<T>, extenderCb: ExtenderCallback<T>): void {
        const cbs = this._extenders.get(abstract) ?? [];
        cbs.push(extenderCb);
        this._extenders.set(abstract, cbs);
    }

    protected fireEvents<T>(
        abstract: Abstract<T>,
        cbs: ContainerCallback<any>[],
    ): void {
        for (const cb of cbs) {
            cb?.(this, abstract);
        }
    }

    protected fireGlobalEvents(cbs: GlobalContainerCallback[]): void {
        for (const cb of cbs) {
            cb?.(this);
        }
    }

    protected fireExtenders<T>(abstract: Abstract<T>, instance: T): T {
        const cbs = this._extenders.get(abstract) ?? [];

        for (const cb of cbs) {
            instance = cb(this, instance);
        }

        return instance;
    }

    flush(): void {
        this._bindings.clear();
        this._instances.clear();
        this._scopedInstances.clear();
        this._resolved.clear();
        this._contextualBinding.clear();
        this._beforeResolvingCallback.clear();
        this._resolvingCallback.clear();
        this._afterResolvingCallback.clear();
        this._globalBeforeResolvingCallback = [];
        this._globalResolvingCallback = [];
        this._globalAfterResolvingCallback = [];
    }
}
