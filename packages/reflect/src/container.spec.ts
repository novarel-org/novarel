import "reflect-metadata";
import { ReflectManager } from "./container.js";
import { Service } from "./decorator.js";

@Service
class ServiceA { };

@Service
class ServiceB {
    constructor(readonly a: ServiceA) { }
}

describe("ReflectManager", () => {
    let manager: ReflectManager;

    beforeEach(() => {
        manager = ReflectManager.construct();
    });

    afterEach(() => {
        manager.reset();
    });

    it("should bind and resolve a simple class", () => {
        manager.bindIf(ServiceA);
        expect(manager.make(ServiceA)).toBeInstanceOf(ServiceA);
    });

    it("should throw error", () => {
        class App { };
        manager.bindIf(App);
        expect(() => manager.make(App)).toThrow();
    });

    it("should auto resolve dependencies", () => {
        manager.bindIf(ServiceA);
        manager.bindIf(ServiceB);
        const b = manager.make(ServiceB);
        expect(b).toBeInstanceOf(ServiceB);
        expect(b.a).toBeInstanceOf(ServiceA);
    });

    it("should throw error for circular dependency", () => {
        @Service
        class App {
            constructor(readonly self: App) { }
        }
        manager.bindIf(App);
        expect(() => manager.make(App)).toThrow();
    });

    it("should resolve the same instance for singletons", () => {
        manager.singleton(ServiceA);
        const a1 = manager.make(ServiceA);
        const a2 = manager.make(ServiceA);
        expect(a1).toBeInstanceOf(ServiceA);
        expect(a2).toBeInstanceOf(ServiceA);
        expect(a1).toBe(a2); 
    });

    it("should resolve the exact provided instance for instance binding", () => {
        const a = new ServiceA();
        manager.instance(ServiceA, a);
        const resolved = manager.make(ServiceA);
        expect(resolved).toBe(a);
    });

    it("should resolve an instance bound to a string key", () => {
        type Config = { name: string }
        const config: Config = { name: "hello" };
        manager.instance("config", config);
        const resolved = manager.make<Config>("config");
        expect(resolved).toEqual(config);
        expect(resolved).toBe(config);
    });

});
