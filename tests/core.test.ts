import "reflect-metadata";
import { Container } from "../src/core/container/index.js";
import { injectable } from "../src/core/decorators/injectable.deco.js";
import type { Concrete } from "../src/core.js";

@injectable()
class FooService {
    public called: string[] = [];
    sayHello() {
        return "hello";
    }
}

@injectable()
class BarService {
    constructor (public foo: FooService) { }
}

describe("Container", () => {
    let container: Container;

    beforeEach(() => {
        container = new Container();
    });

    test("binds and resolves a class", () => {
        container.bind(FooService, FooService);
        const foo = container.make(FooService);

        expect(foo).toBeInstanceOf(FooService);
        expect(foo.sayHello()).toBe("hello");
    });

    test("resolves a singleton", () => {
        container.singleton(FooService, FooService);

        const a = container.make(FooService);
        const b = container.make(FooService);

        expect(a).toBe(b); // same instance
    });

    test("resolves a directly registered instance", () => {
        const foo = new FooService();
        container.instance(FooService, foo);

        const resolved = container.make(FooService);
        expect(resolved).toBe(foo);
    });

    test("throws if binding is missing", () => {
        expect(() => container.make(FooService)).toThrow();
    });

    test("supports aliasing", () => {
        container.alias("foo", FooService);
        container.bind(FooService, FooService);

        const resolved = container.make("foo");
        expect(resolved).toBeInstanceOf(FooService);
    });

    test("runs extender before returning instance", () => {
        container.bind(FooService, FooService);

        container.extend(FooService, (_, instance) => {
            instance.called.push("extended");
            return instance;
        });

        const foo = container.make(FooService);
        expect(foo.called).toContain("extended");
    });

    test("runs beforeResolving callback", () => {
        const calls: string[] = [];
        container.bind(FooService, FooService);

        container.beforeResolving(FooService, () => {
            calls.push("before");
        });

        container.make(FooService);
        expect(calls).toContain("before");
    });

    test("runs resolving callback", () => {
        const calls: string[] = [];
        container.bind(FooService, FooService);

        container.resolving(FooService, () => {
            calls.push("resolving");
        });

        container.make(FooService);
        expect(calls).toContain("resolving");
    });

    test("runs afterResolving callback", () => {
        const calls: string[] = [];
        container.bind(FooService, FooService);

        container.afterResolving(FooService, () => {
            calls.push("after");
        });

        container.make(FooService);
        expect(calls).toContain("after");
    });

    test("runs global callbacks", () => {
        const calls: string[] = [];
        container.bind(FooService, FooService);

        container.globalBeforeResolving(() => {
            calls.push("globalBefore");
        });
        container.globalResolving(() => {
            calls.push("globalResolving");
        });
        container.afterBeforeResolving(() => {
            calls.push("globalAfter");
        });

        container.make(FooService);
        expect(calls).toEqual(["globalBefore", "globalResolving", "globalAfter"]);
    });

    test("replaces binding with contextual binding if defined", () => {
        container.bind(FooService, FooService);
        container.bind(BarService, BarService);

        const mock = class A {
            sayHello() { 
                return "mock";
            }
        };
        container.when(BarService).needs(FooService).give(mock as Concrete<any>);

        const bar = container.make(BarService);
        expect(bar.foo.sayHello()).toBe("mock");
    });
});
