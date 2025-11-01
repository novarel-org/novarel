import { Container, get, service } from '../index.js';

describe('Container', () => {
  const container = Container.getInstance();
  afterEach(() => {
    container.flush();
  });

  test('should be a singleton', () => {
    const instance1 = Container.getInstance();
    const instance2 = Container.getInstance();
    expect(instance1).toBe(instance2);
  });

  test(`should bind a value and resolve it`, () => {
    container.bind('test', 'test value');
    expect(container.get('test')).toBe('test value');
  });

  test(`should bind a class and resolve it`, () => {
    @service()
    class Test {}
    container.bind(Test, Test);
    expect(container.get(Test)).toBeInstanceOf(Test);
  });

  test(`should bind a class and resolve it as a singleton`, () => {
    @service()
    class TestSingleton {}
    container.singleton(TestSingleton, TestSingleton);
    const instance1 = container.get(TestSingleton);
    const instance2 = container.get(TestSingleton);
    expect(instance1).toBeInstanceOf(TestSingleton);
    expect(instance1).toBe(instance2);
  });

  test(`should bind a class and resolve it as a singleton using singletonIf`, () => {
    @service()
    class TestSingletonIf {}
    container.singletonIf(TestSingletonIf, TestSingletonIf);
    const instance1 = container.get(TestSingletonIf);
    container.singletonIf(TestSingletonIf, TestSingletonIf);
    const instance2 = container.get(TestSingletonIf);
    expect(instance1).toBeInstanceOf(TestSingletonIf);
    expect(instance1).toBe(instance2);
  });

  test(`should bind a class and resolve it as a singleton using bind and shared`, () => {
    @service()
    class TestBindShared {}
    container.bind(TestBindShared, TestBindShared, true);
    const instance1 = container.get(TestBindShared);
    const instance2 = container.get(TestBindShared);
    expect(instance1).toBeInstanceOf(TestBindShared);
    expect(instance1).toBe(instance2);
  });

  test(`should bind a class and resolve it using bindIf`, () => {
    @service()
    class TestBindIf {}
    container.bindIf(TestBindIf, TestBindIf);
    expect(container.get(TestBindIf)).toBeInstanceOf(TestBindIf);

    const instance1 = container.get(TestBindIf);
    container.bindIf(TestBindIf, TestBindIf);
    const instance2 = container.get(TestBindIf);
    expect(instance1).toBeInstanceOf(TestBindIf);
    expect(instance1).not.toBe(instance2);
  });

  test(`should bind a factory function and resolve it`, () => {
    class TestFactory {
      constructor(public value: string) {}
    }
    container.bind(TestFactory, (container) => new TestFactory('test value'));
    expect(container.get(TestFactory).value).toBe('test value');
  });

  test(`should bind a factory function and resolve it as a singleton`, () => {
    class TestFactorySingleton {
      constructor(public value: string) {}
    }
    container.singleton(
      TestFactorySingleton,
      (container) => new TestFactorySingleton('test value')
    );
    const instance1 = container.get(TestFactorySingleton);
    const instance2 = container.get(TestFactorySingleton);
    expect(instance1.value).toBe('test value');
    expect(instance1).toBe(instance2);
  });

  test(`should resolve dependencies automatically`, () => {
    @service()
    class Dependency {}

    @service()
    class Dependent {
      constructor(public dependency: Dependency) {}
    }
    container.bind(Dependency, Dependency);
    container.bind(Dependent, Dependent);
    const dependent = container.get(Dependent);
    expect(dependent).toBeInstanceOf(Dependent);
    expect(dependent.dependency).toBeInstanceOf(Dependency);
  });

  test(`should resolve nested dependencies automatically`, () => {
    @service()
    class NestedDependency {}

    @service()
    class Dependency {
      constructor(public nested: NestedDependency) {}
    }

    @service()
    class Dependent {
      constructor(public dependency: Dependency) {}
    }
    container.bind(NestedDependency, NestedDependency);
    container.bind(Dependency, Dependency);
    container.bind(Dependent, Dependent);
    const dependent = container.get(Dependent);
    expect(dependent).toBeInstanceOf(Dependent);
    expect(dependent.dependency).toBeInstanceOf(Dependency);
    expect(dependent.dependency.nested).toBeInstanceOf(NestedDependency);
  });

  test(`should throw an error if a binding is not found`, () => {
    @service()
    class NotFound {}
    expect(() => container.get(NotFound)).toThrow(
      `Target class [NotFound] is not found`
    );
  });

  test(`should return the same instance for singletons`, () => {
    @service()
    class MyService {}
    container.singleton(MyService);
    const instance1 = container.get(MyService);
    const instance2 = container.get(MyService);
    expect(instance1).toBe(instance2);
  });
  test(`should throw an error for circular dependencies`, () => {
    @service()
    class CircularA {
      constructor(@get(()=> CircularB) public b: any) {}
    }

    @service()
    class CircularB {
      constructor(@get(()=> CircularA) public a: any) {}
    }
    container.bind(CircularA, CircularA);
    container.bind(CircularB, CircularB);
    expect(() => container.get(CircularA)).toThrow();
  
  });
});
