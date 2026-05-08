# Markdown Typer

[![CI](https://github.com/0xklkuo/markdown-typer/actions/workflows/ci.yml/badge.svg)](https://github.com/0xklkuo/markdown-typer/actions/workflows/ci.yml)
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
- backend-derived note titles
- pin / unpin notes
- soft delete / restore notes
- web markdown preview
- basic keyboard shortcuts

### UX

- route-based note selection
- persistent search query while browsing
- deleted-note visibility toggle
- save status feedback
- lightweight editor-first workflow

### Quality

- backend unit/controller/service tests
- shared package unit tests
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
- [Electron](https://www.electronjs.org/)
- [NativeScript](https://nativescript.org/)

### Tooling

- [pnpm workspace](https://pnpm.io/workspaces)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)

---

## Support Status

### Proven current support

- `apps/api` — NestJS notes API
- `apps/web` — primary reference client
- `apps/desktop` — thin Electron shell over the web client
- `apps/mobile` — iOS-first NativeScript client with list/create/open/edit flow
- shared note domain types, utilities, and reusable notes API client through workspace packages

### Experimental or intentionally limited support

- desktop remains a thin shell and does not add deep native integrations yet
- mobile support is currently iOS-first only
- mobile markdown preview is intentionally deferred for now
- Android support is not included yet
- packaging and store distribution workflows are not part of the current milestone scope

## Repository Structure

```txt
apps/
  api/                  # NestJS backend
  web/                  # Next.js frontend
  desktop/              # Electron desktop shell
  mobile/               # NativeScript iOS client

packages/
  config-eslint/        # shared ESLint config
  config-typescript/    # shared TypeScript config
  shared-types/         # shared domain and API types
  shared-notes/         # shared pure note utilities

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
- **web-first reference client**
- **desktop as a thin shell over web**
- **mobile as an intentionally smaller native client**
- **shared domain contracts and reusable notes API client**

For more detail, see:

- [`docs/architecture.md`](./docs/architecture.md)
- [`docs/roadmap.md`](./docs/roadmap.md)

---

## Getting Started

### Prerequisites

- **Node.js 22+**
- **pnpm**
- **PostgreSQL**

Additional platform prerequisites:

- **Desktop (Electron):** no extra platform tooling required for local development beyond the web stack
- **Mobile (NativeScript iOS):** requires macOS with Xcode and related iOS tooling installed for native builds

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
- Desktop shell: loads the local web app at `http://localhost:3000`

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

### Desktop

```bash
pnpm dev:desktop
pnpm desktop:build
pnpm desktop:start
```

### Mobile

```bash
pnpm mobile:check
pnpm mobile:doctor
pnpm mobile:build
pnpm dev:mobile
```

---

## Mobile Development Notes

The mobile app is currently an **iOS-first NativeScript client**.

Current mobile scope includes:

- list notes
- open a note
- create a note
- edit note content
- autosave changes
- mobile-first list/detail navigation

Current intentional mobile limitation:

- markdown preview is deferred for now

Use these commands depending on what you need:

- `pnpm mobile:check` — run mobile linting and TypeScript validation without requiring Xcode
- `pnpm mobile:doctor` — inspect whether the NativeScript environment is configured correctly
- `pnpm dev:mobile` — start the API and run the NativeScript iOS app locally
- `pnpm mobile:build` — build the NativeScript iOS app

### iOS prerequisites for local mobile runtime

To run `pnpm dev:mobile` or `pnpm mobile:build`, your machine must have a working iOS toolchain.

At minimum:

1. install **Xcode**
2. open Xcode once and complete first-run setup
3. ensure Xcode command line tools are selected
4. ensure **CocoaPods** is available
5. verify the setup with `pnpm mobile:doctor`

If the environment is incomplete, mobile code validation can still continue through `pnpm mobile:check`, but native iOS execution will fail.

For NativeScript environment setup details, see:

- <https://docs.nativescript.org/setup/macos#setting-up-macos-for-ios>

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

Current markdown preview support is intentionally split by client:

- **web:** lightweight Edit / Preview toggle
- **desktop:** inherits the web markdown preview through the Electron shell
- **mobile:** markdown preview is intentionally deferred for now

The goal is clarity over feature breadth.

---

## Project Philosophy

This project intentionally avoids adding complexity too early.

Examples of things currently **deferred**:

- authentication
- multi-user workspaces
- sync across devices
- deep desktop integrations beyond the current Electron shell
- Android support
- mobile markdown preview
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
- desktop support is intentionally thin and web-backed
- mobile support is currently iOS-first and depends on local Xcode setup for native runtime
- mobile markdown preview is intentionally deferred
- no advanced markdown rendering beyond the web client’s lightweight preview
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
