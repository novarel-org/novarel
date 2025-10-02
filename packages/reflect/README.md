# @novarel/reflect

A lightweight dependency injection container and service resolver for TypeScript/JavaScript, built with [Nx](https://nx.dev).  
It provides decorators and a reflection-based container system to easily manage bindings, singletons, and service lifecycles.

---

## ✨ Features
- `@Service` decorator for automatic binding
- Reflection-based dependency resolution
- Singleton and instance binding support
- Circular dependency detection
- Easy integration with any Node.js or browser project

---

## 📦 Installation

```bash
npm install @novarel/reflect
# or
yarn add @novarel/reflect
```

---

## 🚀 Usage

```ts
import "reflect-metadata";
import { ReflectManager } from "@novarel/reflect";
import { Service } from "@novarel/reflect";

@Service
class ServiceA {}

@Service
class ServiceB {
  constructor(readonly a: ServiceA) {}
}

const manager = ReflectManager.construct();

manager.bindIf(ServiceA);
manager.bindIf(ServiceB);

const b = manager.make(ServiceB);
console.log(b instanceof ServiceB); // true
console.log(b.a instanceof ServiceA); // true
```

---

## ⚡ API Highlights

- `manager.bindIf(token)` – Binds a class or token if not already bound  
- `manager.singleton(token, impl?)` – Registers a class or token as a singleton  
- `manager.instance(token, value)` – Binds a ready-made instance  
- `manager.make(token)` – Resolves and instantiates dependencies  

---

## 🛠 Development

### Building
Run the following to build the library:
```bash
nx build reflect
```

### Testing
Run the following to execute unit tests via [Jest](https://jestjs.io):
```bash
nx test reflect
```

---

## 📄 License
[MIT](./LICENSE)
