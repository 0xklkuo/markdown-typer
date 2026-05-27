# Architecture

## Purpose

Markdown Typer is a small full-stack TypeScript learning project built to stay useful as both:

- a lightweight markdown note-taking app
- a clean reference for monorepo, API, web, desktop, and mobile fundamentals

The project intentionally prioritizes:

- clarity
- minimalism
- maintainability
- explicit boundaries
- bounded testing
- avoiding speculative abstraction

This document describes the current architecture, ownership boundaries, and decision rules that should guide future changes.

---

## Current Snapshot

The repository currently includes:

- `apps/api` — NestJS backend with Prisma and PostgreSQL
- `apps/web` — primary Next.js reference client
- `apps/desktop` — thin Electron shell over the web app
- `apps/mobile` — iOS-first NativeScript client
- `packages/shared-types` — shared note and API contract types
- `packages/shared-notes` — shared note helpers and reusable notes API client
- shared ESLint and TypeScript workspace config packages

The current product scope is intentionally small:

- create notes
- browse and search notes
- edit notes with autosave
- derive note titles on the backend
- pin and unpin notes
- soft delete and restore notes
- render markdown preview on the web client
- support bounded unit, component, and e2e validation

---

## Architecture Principles

### 1. The web app is the reference client

`apps/web` is the clearest and most complete implementation of product behavior.

That means:

- new product behavior should usually be proven on the web first
- desktop should stay close to the web experience unless native behavior adds clear value
- mobile can remain intentionally smaller than web when that keeps the codebase clearer

### 2. Share domain logic, not UI for symmetry

Shared code should exist only when it clearly improves one of these:

- consistency
- readability
- testability
- multi-client reuse

Good candidates for sharing:

- note DTOs and API contract types
- pure note utilities
- reusable API client helpers
- small framework-agnostic helpers

Poor candidates for aggressive sharing:

- React and NativeScript UI components
- platform-specific lifecycle code
- routing abstractions
- abstractions created only to make folders look symmetrical

### 3. Keep the backend as the source of truth

The backend owns:

- persistence
- request validation
- note business rules
- canonical note title derivation

Clients may format and present data differently, but they should not redefine core note behavior.

### 4. Prefer thin platform layers

Desktop and mobile support should stay understandable in isolation.

Current philosophy:

- desktop is a thin shell, not a second full product surface
- mobile is intentionally narrower than web
- platform-specific code should stay small and explicit

---

## System Overview

```txt
Web client
Desktop shell
Mobile client
  -> HTTP
  -> NestJS API
  -> Prisma ORM
  -> PostgreSQL
```

This keeps the project conceptually simple:

- one backend
- one database
- multiple clients
- shared contracts where useful

---

## Support Matrix

| Surface        | Role                     | Current status        | Notes                                                        |
| -------------- | ------------------------ | --------------------- | ------------------------------------------------------------ |
| `apps/api`     | backend source of truth  | proven                | owns validation, persistence, and note rules                 |
| `apps/web`     | primary reference client | proven                | most complete UX and markdown preview                        |
| `apps/desktop` | Electron shell           | intentionally limited | loads the local web app and keeps Electron code small        |
| `apps/mobile`  | NativeScript client      | intentionally limited | iOS-first list/create/open/edit flow; smaller scope than web |

---

## Application Boundaries

## `apps/api`

Responsibilities:

- validate note-related requests
- apply note business rules
- persist note data through Prisma
- expose a single HTTP API for all clients

The API should not absorb:

- client-specific presentation logic
- desktop-only UX behavior
- mobile-only UX behavior
- extra transport complexity without a demonstrated need

## `apps/web`

Responsibilities:

- remain the clearest implementation of the product
- prove note editing and browsing behavior first
- provide the baseline markdown editing and preview experience
- act as the main behavior reference for other clients

The web app should not become the long-term home for domain logic that is clearly reusable across clients.

## `apps/desktop`

Responsibilities:

- provide a minimal desktop entry point for the project
- reuse the web experience where that keeps the codebase simpler
- keep Electron-specific concerns explicit and small

Current limits:

- no deep native integrations
- no separate desktop-only persistence model
- no packaging or distribution complexity beyond local development needs

## `apps/mobile`

Responsibilities:

- provide a minimal native client for the same backend
- keep the mobile workflow simple and readable
- reuse shared contracts and pure logic where it helps

Current limits:

- iOS-first only
- narrower feature set than web
- no markdown preview yet
- no forced cross-platform UI abstraction

---

## Shared Packages

### `packages/shared-types`

Owns shared TypeScript contracts such as:

- `Note`
- list and detail query types
- note input payload types

When an app or test needs the same note-facing contract shape, it should prefer these shared types instead of redefining an app-local duplicate.

### `packages/shared-notes`

Owns small framework-agnostic note helpers such as:

- note sorting helpers
- note list query param helpers used by web note routing
- reusable notes API client factory

### Shared package rule

A shared package should exist only if it does at least one job clearly:

- removes meaningful duplication
- clarifies ownership of domain logic
- improves testability
- helps multiple clients consume the same behavior safely

If duplication is small and easier to understand than an abstraction, duplication is acceptable.

---

## Domain Model

The core domain is intentionally small.

### Note

A note currently includes:

- `id`
- `title`
- `content`
- `isPinned`
- `createdAt`
- `updatedAt`
- `deletedAt`

### Current domain rules

- note titles are derived from note content on the backend
- delete is soft delete
- restore is supported
- the current product model is single-user local mode

These rules should remain consistent across clients.

---

## Validation and Testing

### Validation

The backend uses explicit Zod schemas for request validation.

Guiding rule:

- shared TypeScript types improve consistency
- backend validation remains authoritative

### Testing

Current validation strategy is intentionally bounded:

- backend utility, controller, and service tests
- shared package unit tests
- web component tests
- one happy-path Playwright e2e flow
- workspace lint, typecheck, format, and build validation

The goal is useful feedback, not a large test matrix.

---

## Non-Goals

The following are intentionally out of scope for the current project shape:

- authentication
- sync across devices
- offline-first architecture
- collaborative editing
- multi-user workspaces
- rich text editing
- advanced markdown plugin pipelines
- a large shared UI system across web and mobile
- enterprise-style layering for its own sake
- full feature parity across every client
- packaging and store distribution workflows as a priority

These items are deferred to protect the project’s learning value and clarity.

---

## Runtime Configuration

Runtime configuration should stay explicit and close to the app that consumes it.

Current rule:

- `apps/web` reads its public API base URL from web-specific environment configuration
- `apps/desktop` reads its target web app URL from `apps/desktop/.env`
- `apps/mobile` reads its API base URL from `apps/mobile/.env`
- app runtime inputs should be documented in `README.md` and `docs/spec.md`

This keeps platform behavior visible and reduces reliance on hidden local defaults.

---

## Documentation Boundaries

The project documentation set should stay intentionally small and explicit.

Core project guidance should live in:

- `README.md`
- `docs/spec.md`
- `docs/architecture.md`
- `docs/roadmap.md`

If a standalone document becomes redundant with those core docs, its useful content should be folded back into them instead of leaving overlapping guidance behind.

---

## Change Rules

When changing the architecture, prefer the option that:

1. keeps the repository understandable to a new contributor
2. keeps the backend as the source of truth
3. shares only what clearly earns its place
4. avoids platform-specific complexity until it is needed
5. keeps docs aligned with the actual repository state

If a simpler path works, the simpler path should win.
