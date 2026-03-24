# Markdown Typer

A lightweight markdown note-taking app and self-educational full-stack playground inspired by Raycast Notes.

## Background

This is an open-source self-educational playground for any developer who wants to master the fundamentals, essentials, and cores of the TypeScript and Node.js ecosystem, as well as modern full-stack web app development, using real-world best practices by building a lightweight markdown note-taking app.

The project intentionally prioritizes:

- minimalism
- clarity
- maintainability
- contributor friendliness
- practical real-world patterns without over-engineering

## Current Scope

This repository currently focuses on:

- a NestJS + Prisma + PostgreSQL backend
- a Next.js web client
- a minimal markdown note workflow:
  - create
  - browse
  - search
  - edit with autosave
  - pin / unpin
  - soft delete / restore
  - markdown preview
  - basic keyboard shortcuts

Desktop and mobile clients are intentionally deferred until the API and web foundations are stable.

## Tech Stack

### Backend

- NestJS
- Prisma
- PostgreSQL
- Zod

### Frontend

- Next.js
- React
- Tailwind CSS

### Tooling

- pnpm workspace
- TypeScript
- ESLint
- Prettier
- Vitest
- Playwright

## Repository Structure

```txt
apps/
  api/   # NestJS backend
  web/   # Next.js frontend

packages/
  config-eslint/
  config-typescript/

docs/
```

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm
- PostgreSQL

### Install

```bash
pnpm install
```

### Configure Environment

Copy and adjust environment files as needed:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### Run Database Migration

```bash
pnpm --filter @markdown-typer/api prisma:migrate:dev
pnpm --filter @markdown-typer/api prisma:seed
```

### Start the Apps

```bash
pnpm dev
```

## Local URLs

- Web: `http://localhost:3000`
- API: `http://localhost:3210/api`
- API health: `http://localhost:3210/api/health`

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
pnpm check
```

### API

```bash
pnpm --filter @markdown-typer/api dev
pnpm --filter @markdown-typer/api test
pnpm --filter @markdown-typer/api prisma:migrate:dev
pnpm --filter @markdown-typer/api prisma:seed
```

### Web

```bash
pnpm --filter @markdown-typer/web dev
pnpm --filter @markdown-typer/web test
```

## Testing

### Backend

- utility tests
- controller tests
- service tests

### Frontend

- component smoke tests

### End-to-End

- one happy-path Playwright test covering create, edit, autosave, and search

Run all current unit/component tests:

```bash
pnpm test
```

Run e2e:

```bash
pnpm test:e2e
```

## Project Philosophy

This repository is intentionally not trying to be the most feature-rich notes app.

Instead, it aims to be a clean learning resource for:

- TypeScript application structure
- Node.js ecosystem fundamentals
- NestJS API design
- Prisma data modeling
- Zod validation
- Next.js app architecture
- testing and incremental refactoring
- open-source-friendly project organization

## Roadmap

See:

- [`docs/architecture.md`](./docs/architecture.md)
- [`docs/roadmap.md`](./docs/roadmap.md)
- [`docs/publish-checklist.md`](./docs/publish-checklist.md)

## Contributing

Please read [`CONTRIBUTING.md`](./CONTRIBUTING.md) before opening large changes.

## License

MIT
