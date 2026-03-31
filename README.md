# Markdown Typer

[![CI](https://github.com/OWNER/REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D22-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-API-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-Web-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1)](https://zod.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Tests-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-45BA4B?logo=playwright&logoColor=white)](https://playwright.dev/)

A lightweight markdown note-taking app and **self-educational full-stack TypeScript playground** inspired by Raycast Notes.

## Background

This is an open-source self-educational playground for any developer who wants to master the fundamentals, essentials, and cores of the TypeScript and Node.js ecosystem, as well as modern full-stack web app development, using real-world best practices by building a lightweight markdown note-taking app.

The repository intentionally optimizes for:

- **clarity**
- **minimalism**
- **maintainability**
- **testability**
- **incremental learning**
- **avoiding over-engineering**

This project is not trying to be the most feature-rich notes app.
It is trying to be a **clean learning reference**.

---

## What You Can Learn Here

This repository is designed to help developers practice and understand:

- TypeScript in a real monorepo
- Node.js ecosystem fundamentals
- NestJS API structure
- Prisma + PostgreSQL data modeling
- Zod schema validation
- Next.js app architecture
- autosave UX patterns
- route-driven UI state
- frontend + backend testing
- e2e testing with cleanup
- open-source-friendly project organization

---

## Current Features

### Notes
- create note
- browse notes
- search notes
- edit notes
- auto-save
- first meaningful line becomes the title
- pin / unpin notes
- soft delete / restore notes
- markdown preview
- basic keyboard shortcuts

### UX
- route-based note selection
- persistent search query while browsing
- deleted-note visibility toggle
- save status feedback
- lightweight editor-first workflow

### Quality
- backend unit/controller/service tests
- frontend component smoke tests
- one happy-path Playwright e2e test
- CI workflow
- contributor docs and templates

---

## Tech Stack

### Backend
- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Zod](https://zod.dev/)

### Frontend
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Tooling
- [pnpm workspace](https://pnpm.io/workspaces)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

---

## Repository Structure

```txt
apps/
  api/                  # NestJS backend
  web/                  # Next.js frontend

packages/
  config-eslint/        # shared ESLint config
  config-typescript/    # shared TypeScript config

docs/
  architecture.md
  roadmap.md
  publish-checklist.md

.github/
  workflows/
  ISSUE_TEMPLATE/
```

---

## Architecture Overview

```txt
Browser
  -> Next.js web app
  -> HTTP requests
  -> NestJS API
  -> Prisma ORM
  -> PostgreSQL
```

Key design choices:

- **single-user local mode** for simplicity
- **database-first** persistence
- **soft delete + restore**
- **plain textarea editing**
- **minimal markdown preview**
- **no auth / sync / desktop complexity yet**

For more detail, see:

- [`docs/architecture.md`](./docs/architecture.md)
- [`docs/roadmap.md`](./docs/roadmap.md)

---

## Getting Started

### Prerequisites

- **Node.js 22+**
- **pnpm**
- **PostgreSQL**

### 1) Install dependencies

```bash
pnpm install
```

### 2) Configure environment files

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### 3) Run database migration

```bash
pnpm --filter @markdown-typer/api prisma:migrate:dev
```

### 4) Seed local data

```bash
pnpm --filter @markdown-typer/api prisma:seed
```

### 5) Start the apps

```bash
pnpm dev
```

---

## Local URLs

- Web: `http://localhost:3000`
- API: `http://localhost:3210/api`
- API health: `http://localhost:3210/api/health`

---

## Environment Variables

### API (`apps/api/.env`)
Example:

```env
PORT=3210
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/markdown_typer?schema=app
DEFAULT_USER_NAME=Local User
DEFAULT_USER_EMAIL=local@example.com
WEB_APP_ORIGIN=http://localhost:3000
```

### Web (`apps/web/.env.local`)
Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3210/api
```

---

## Available Scripts

### Workspace

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm format
pnpm format:check
pnpm test
pnpm test:e2e
pnpm build
pnpm check
```

### API

```bash
pnpm --filter @markdown-typer/api dev
pnpm --filter @markdown-typer/api test
pnpm --filter @markdown-typer/api prisma:generate
pnpm --filter @markdown-typer/api prisma:migrate:dev
pnpm --filter @markdown-typer/api prisma:seed
```

### Web

```bash
pnpm --filter @markdown-typer/web dev
pnpm --filter @markdown-typer/web test
```

---

## Testing

### Backend
Includes:
- utility tests
- controller tests
- service tests

### Frontend
Includes:
- component smoke tests

### End-to-End
Includes:
- one happy-path Playwright test:
  - create note
  - edit note
  - autosave
  - search note

### Run tests

```bash
pnpm test
pnpm test:e2e
```

---

## Keyboard Shortcuts

Current shortcut set is intentionally small:

- `Ctrl/Cmd + N` → create note
- `/` → focus search
- `Esc` → blur search
- `Ctrl/Cmd + Shift + P` → pin / unpin current note

This is intentionally limited to keep the UX simple and avoid browser conflicts.

---

## Markdown Preview

The app includes a lightweight **Edit / Preview** toggle.

It is intentionally minimal:
- no syntax highlighting yet
- no rich text editing
- no complex markdown plugin stack

The goal is clarity over feature breadth.

---

## Project Philosophy

This project intentionally avoids adding complexity too early.

Examples of things currently **deferred**:

- authentication
- multi-user workspaces
- sync across devices
- desktop app
- mobile app
- collaborative editing
- rich text editor
- command palette
- advanced note organization systems

The core rule is:

> Add complexity only when it clearly improves learning value without significantly harming readability.

---

## Documentation

- [Architecture](./docs/architecture.md)
- [Roadmap](./docs/roadmap.md)
- [Publish Checklist](./docs/publish-checklist.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Changelog](./CHANGELOG.md)

---

## Contributing

Contributions are welcome, especially if they improve:

- documentation
- readability
- maintainability
- testing
- focused UX polish

Before contributing, please read:

- [`CONTRIBUTING.md`](./CONTRIBUTING.md)

Please keep changes:
- focused
- minimal
- well-tested
- aligned with the educational purpose of the repository

---

## Known Limitations

Current intentional limitations include:

- single-user local mode
- no auth
- no sync
- no desktop app
- no mobile app
- no advanced markdown rendering
- no dedicated trash page
- one happy-path e2e instead of a large e2e suite

These are deliberate tradeoffs for simplicity and learning value.

---

## Release Status

This repository is currently suitable as an **educational MVP** and reference project.

It is intended to be:
- useful to study
- easy to run locally
- approachable to contributors
- realistic without being overwhelming

---

## License

[MIT](./LICENSE)
