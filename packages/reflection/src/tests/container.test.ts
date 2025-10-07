import "reflect-metadata";
import { Container, Give } from "../index.js";
import { Service } from "../decorators/service.js";

@Service
class ServiceA { };

describe("Container", () => {
    let container: Container;
    beforeAll(() => {
        container = Container.Constructor();
    });

    afterEach(() => {
        container.reset();
    });

    test("register a classic binding", () => {
        container.bind(ServiceA);
        expect(container.get(ServiceA)).toBeInstanceOf(ServiceA);
    });

    test("resolves a singleton binding.", () => {
        container.singleton(ServiceA);
        const instanceA = container.get(ServiceA);
        const instanceB = container.get(ServiceA);
        expect(instanceA === instanceB).toBe(true);
    });


    test("resolves a instance binding.", () => {
        const instance = new ServiceA();
        container.instance(ServiceA, instance);
        expect(instance).toBe(container.get(ServiceA));
    });

    test("resolves the service with auto discovery", () => {
        @Service
        class ServiceB {
            constructor(
                readonly serviceA: ServiceA
            ) { }
        };

        container.bind(ServiceA);
        container.bind(ServiceB);
        expect(container.get(ServiceB)).toBeInstanceOf(ServiceB);
        expect(container.get(ServiceB).serviceA).toBeInstanceOf(ServiceA);
    });

    test("resolves injected dependencies", () => {
        @Service
        class ServiceB {
            constructor(
                @Give(ServiceA) readonly serviceA: ServiceA
            ) { }
        };

        container.bind(ServiceA);
        container.bind(ServiceB);
        expect(container.get(ServiceB)).toBeInstanceOf(ServiceB);
        expect(container.get(ServiceB).serviceA).toBeInstanceOf(ServiceA);
    })


})