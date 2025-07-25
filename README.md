# ⚡ Novarel

**An elegant, scalable, and modern TypeScript framework for building full-stack applications with ease.**  
Built with developer experience, progressive architecture, and flexibility in mind.

---

## 🚀 Features

- 📦 **ESM-only** — Modern, native JavaScript support without CommonJS legacy
- 🎯 **TypeScript-first** — Fully typed APIs, IntelliSense support, and strict mode friendly
- 🔗 **Dependency Injection** — Built-in container with decorators, scopes, and lifecycle support
- 🧩 **Modular Architecture** — Organize features into reusable, isolated modules and services
- 🧠 **Contextual Bindings** — Supports per-request scope, lazy resolution, and dynamic injections
- 🛠️ **Powerful CLI** — Generate modules, services, and config with fast scaffolding commands
- 🗂️ **MVC Structure** — Built-in support for controllers, views, services, and routing
- 🧬 **Integrated ORM** — Optional database layer with entities, migrations, and repositories
- ⚙️ **Configuration System** — Environment-based config loading with override support
- 🧱 **Middleware Pipeline** — Request lifecycle middleware for auth, logging, and more
- 🧪 **Testing-Ready** — Simple unit and integration testing with scoped mocks and injection
- 🚦 **Extensible Core** — Hooks, providers, and custom resolvers to extend and override behavior
- 🚀 **Zero Build Tools** — Runs with just `tsc` + `node` — no bundlers or custom runners required

---

## 📦 Installation

```bash
pnpm novarel init .
# or
pnpm add -g novarel
novarel init .
```

---

## ✨ Quick Start

```ts
// web.ts
import { Router } from 'novarel/routing';
import { HomeController } from "@controllers/HomeController";
import { AuthController } from "@controllers/AuthController";

Router.get("/", [HomeController,'index']).middleware(['auth']);
Router.prefix('/auth/').name('auth.').middleware(['guest']);.controller(AuthController).group(() => {
    Router.get('login','login').name("login.view");
});
```

## 🧱 Project Structure Example

## 📁 Directory Structure

```md
src/
├── main.ts                         # Application entry point
├── app/
│   ├── controllers/               # Route controllers
│   ├── providers/                 # App-level service providers (boot/register)
│   ├── requests/                  # Validation schemas and decorators
│   ├── middlewares/               # HTTP middleware, kernel, request handlers
├── routes/
│   ├── web.ts                     # Web routes (session-based, UI)
│   ├── api.ts                     # API routes (REST, stateless)
│   └── channels.ts                # Realtime events / sockets
│   └── console.ts                # Console commands (if CLI supports them)
├── database/
│   ├── models/                    # ORM models / entities
│   ├── factories/                 # Model factories for testing
│   └── seeders/                   # DB seeders
├── resources/
│   ├── views/                     # HTML templates (if using server-side rendering)
│   └── emails/                    # Email templates
├── storage/
│   ├── framework/                      # Log files
│   ├── app/                      # Temp storage or compiled views
├── public/                        # Static public assets (css, js, images)
└── config/                        # Application configuration files (env-based)
```

---

## 🧪 Running Tests

```bash
pnpm exec jest
```

---

## ⚙️ Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "esModuleInterop": true,
    "strict": true,
    "outDir": "dist"
  }
}
```

---

## 📚 Documentation

> Full documentation coming soon.  
Until then, check out the `examples/` directory or use `IntelliSense` for full API autocompletion.

---

## 🧩 Example Usage

```ts
import { Injectable } from 'novarel/core';

@Injectable()
export class UserService {
  findUser(id: string) {
    return { id, name: 'John Doe' };
  }
}
```

---

## 📄 License

[MIT](./LICENSE)

---

## 🙌 Contributing

Contributions, issues, and feature requests are welcome!  
Please open an issue or submit a pull request.

---

## 🧠 About

Built with ❤️ by Muhammad Sulman and other contributes (<https://github.com/SulmaneDev>)
