# Contributing Guide

Thank you for considering contributing to this project! We welcome all contributions — from bug fixes to feature suggestions.

---

## Setup Instructions

1. Fork this repository and clone your fork.
2. Run the following to install dependencies:
   npm install
3. Create a new branch for your work:
   git checkout -b feat/your-feature-name
4. Start development with:
   npm run dev
5. To build the project:
   npm run build

---

## Pull Request Requirements

Before submitting your pull request, ensure the following:

- [ ] Clear and scoped feature or fix
- [ ] All tests pass: npm run test
- [ ] Code is linted: npm run lint
- [ ] Code is formatted: npm run format
- [ ] Uses conventional commit message style (e.g. feat: add search filter)
- [ ] Documentation is updated (if applicable)

---

## Testing

We use Jest for testing. Run tests locally with:

    npm run test

---

## Lint & Format

Lint the code:

    npm run lint

Format the code:

    npm run format

---

## Code Standards

- Write in TypeScript using modern JavaScript syntax.
- Use the existing file/module structure (e.g., services/, modules/, DI).
- Keep pull requests small, focused, and readable.
- Include tests for all new features and bug fixes.

---

## Need Help?

Open an issue or join the discussions tab. We're happy to help!

---
