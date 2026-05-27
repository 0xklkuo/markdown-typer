# Specification

## Purpose

Markdown Typer is a lightweight markdown note-taking app and a self-educational full-stack TypeScript reference project.

This specification defines the current scope, product intent, refactor decisions, and acceptance criteria that should guide implementation.

---

## Product Intent

The project should stay:

- simple
- clean
- clear
- readable
- viable
- maintainable
- scalable in a measured way
- performance-conscious

The repository is intentionally optimized for learning value over feature breadth.

---

## Current Product Scope

The current note workflow includes:

- create note
- browse notes
- search notes
- edit notes
- autosave changes
- derive note titles on the backend
- pin and unpin notes
- soft delete and restore notes
- markdown preview on web
- basic keyboard shortcuts on web

Current clients:

- `apps/api` — backend source of truth
- `apps/web` — primary reference client
- `apps/desktop` — thin Electron shell over the web app
- `apps/mobile` — intentionally smaller iOS-first NativeScript client

---

## Core Principles

### 1. Preserve the educational positioning

Markdown Typer should remain a self-educational playground and a clean learning reference.

### 2. Keep the repository understandable

Changes should favor explicitness, small boundaries, and low conceptual overhead.

### 3. Prefer real improvements over architectural theater

Refactors should remove confusion, duplication, or tooling friction.
They should not add structure only to appear more advanced.

### 4. Keep the backend as the source of truth

Business rules, validation, and persistence belong primarily in the API.

### 5. Keep docs small and high-signal

Documentation should stay centered on a small core set of documents with clear roles.

---

## Core Documentation Set

The repository should keep its core documentation set intentionally small:

- `README.md` — project overview, setup, validation commands, support status, and contributor-facing quick guidance
- `docs/spec.md` — scope, goals, refactor decisions, constraints, and acceptance criteria
- `docs/architecture.md` — system boundaries and ownership rules
- `docs/roadmap.md` — prioritized next work and deferred items

Supporting files such as `CHANGELOG.md`, `LICENSE`, and GitHub templates may remain when they serve a distinct purpose, but the main project guidance should live in the four core docs above.

---

## Refactor Decisions Confirmed

These decisions have already been made for the current refactor direction:

1. **Preserve the self-educational playground positioning.**
2. **Consolidate documentation around the four core docs** instead of spreading guidance across redundant standalone documents.
3. **Keep Milestone 1 moderate and low-risk**, focusing on documentation alignment and tooling correctness before structural code cleanup.
4. **Use environment-driven runtime configuration for desktop and mobile** as the next implementation direction.
5. **Prefer warning-free, framework-correct tooling** when a small dev-only change can solve a real integration gap.

---

## Non-Goals

These are intentionally out of scope for the current project shape:

- authentication
- sync across devices
- offline-first architecture
- collaborative editing
- multi-user workspaces
- rich text editing
- advanced markdown plugin stacks
- a shared cross-platform UI system
- full feature parity across all clients
- packaging and store distribution workflows as a near-term priority

---

## Constraints

- keep interactions and implementation clear and concise
- respect the repository’s existing coding style and patterns
- remove unnecessary complexity rather than relocating it
- avoid broad rewrites unless they clearly earn their cost
- keep documentation aligned with the actual repository state
- prefer bounded validation over excessive test sprawl

---

## Near-Term Acceptance Criteria

The current refactor direction is succeeding if:

- the documentation is centered on the four core docs
- redundant project guidance has been folded into those docs or removed
- support status and intentional limitations are clear
- major tooling warnings are removed
- the next milestone can focus on environment-driven runtime configuration without documentation ambiguity

---

## Validation Expectations

For repository-level changes, prefer these validation commands when relevant:

```bash
pnpm check
pnpm test
pnpm build:ci
pnpm test:e2e
```

Use the smallest useful validation for the change, then broaden when necessary.
