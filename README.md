# 🚀 Novarel Framework Guide

Novarel is a modern web application framework with elegant syntax.
It covers all configuration for you, while still being fully configurable and extendable.
Novarel is built around conventions, giving you structure and productivity without losing flexibility.

---

## Example Usage

routing/web.ts
```ts
Route.get('/home', [HomeController, 'index']).use('auth') 
// Attach auth middleware

// app/http/controllers/HomeController.ts
import { Controller } from "@novarel/http";

@Controller
class HomeController extends Controller {
  index(@User user: User, request: Request, response: Response) {
    return response.render('App', { user });
  }
}

// resources/views/App.tsx
const App: React.FC<PropsWithUser> = (props) => props.user.email
```
---

## Features
- Elegant, expressive syntax
- Intuitive routing with middleware support
- MVC architecture
- Database agnostic ORM with migrations & factories
- Fully configurable, works with any frontend framework
- SSR, SSG, CSR with React server-side routing
- Service providers, middlewares, and policies
- Built-in CLI commands

---

## Getting Started

1. Clone the repo
git clone https://github.com/your-username/novarel.git
cd novarel

2. Install dependencies
npm install

3. Run in development mode
npm run dev

4. Build for production
npm run build

---

## Testing
Run tests with:
npm test

---

## Contributing
1. Fork the repo
2. Create your feature branch (git checkout -b feature/your-feature)
3. Commit changes (git commit -m 'Add new feature')
4. Push to the branch (git push origin feature/your-feature)
5. Open a Pull Request

---

## License
This project is licensed under the MIT License — see the LICENSE file for details.
