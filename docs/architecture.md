# Architecture

## Purpose

Markdown Typer is a lightweight full-stack learning project designed to teach modern TypeScript and Node.js ecosystem fundamentals through a small but realistic application.

The project now aims to grow from a web-first app into a small **multi-client learning platform** while keeping the same core values:

- keep the system small
- prefer explicitness over abstraction
- optimize for learning and maintainability
- defer complexity until it is clearly needed
- use real-world tools, but in minimal ways

This document defines the current architecture, the intended multi-client boundaries, and the goals and non-goals that should guide future implementation.

---

## Current State

The repository currently includes:

- `apps/api` for the backend API
- `apps/web` for the web client
- shared tooling packages for TypeScript and ESLint
- PostgreSQL persistence through Prisma
- a single-user local note-taking workflow

The current product is intentionally simple:

- create, browse, search, edit, pin, delete, and restore notes
- preview markdown
- auto-save note content
- use route-driven UI state
- run backend, frontend, and basic end-to-end tests

---

## Architecture Goals

The architecture should support gradual expansion to desktop and mobile without losing readability.

### Primary Goals

- keep the repository understandable for learners
- preserve a clean monorepo structure
- share domain types and pure logic where it clearly helps
- avoid premature abstraction
- keep each client independently understandable
- allow the web app to remain the reference implementation
- support desktop and mobile clients through the same backend API
- keep testing focused, bounded, and useful

### Secondary Goals

- improve responsive behavior for smaller screens
- improve markdown preview styling with a simpler and more maintainable approach
- create a foundation for future client diversification
- refine documentation so the repository remains easy to navigate

---

## Non-Goals

The following are explicitly out of scope for this phase:

- authentication
- sync across devices
- offline-first architecture
- collaborative editing
- multi-user workspaces
- rich text editing
- advanced markdown plugin pipelines
- a large shared UI system across web and mobile
- enterprise-style layering for its own sake
- packaging, signing, and store distribution as a first milestone
- full feature parity across all clients on day one

These are not rejected forever. They are simply deferred to protect clarity and learning value.

---

## Design Principles

### 1. Web remains the reference client

The web app should remain the clearest and most complete reference for the product behavior.

That means:

- new product behavior should usually be proven in the web app first
- desktop can initially reuse the web experience through a thin shell
- mobile can implement a smaller, native-feeling subset first

### 2. Share domain logic, not forced UI abstractions

Shared code is valuable when it reduces duplication without hiding intent.

Good candidates for sharing:

- note-related TypeScript types
- API request and response contracts
- pure utility functions
- validation helpers that are not framework-specific
- test fixtures for shared domain behavior

Poor candidates for sharing too early:

- React UI components across web and NativeScript
- client-specific state management patterns
- framework-specific rendering logic
- abstractions created only to make the folder tree look symmetrical

### 3. Prefer thin clients over duplicated business rules

Business rules should stay close to the backend unless there is a clear reason to duplicate them.

Examples:

- persistence rules belong in the API
- note title derivation rules should have one clear source of truth
- clients may format and present data differently, but should not drift in core behavior

### 4. Add complexity in layers

The intended order of change is:

1. strengthen the web foundation
2. extract shared domain boundaries
3. add desktop support
4. add mobile support
5. refine docs and tests around the new shape

This keeps the repository stable while it grows.

---

## Applications

## `apps/api`

NestJS backend responsible for:

- notes API
- validation
- persistence
- business logic
- stable contracts for all clients

### Backend Responsibilities

- accept and validate note-related requests
- apply note business rules
- persist note data through Prisma
- expose a simple HTTP API for all clients
- remain the main source of truth for note behavior

### Backend Boundaries

The API should not contain:

- client-specific presentation logic
- desktop-only behavior
- mobile-only behavior
- unnecessary transport variants before they are needed

For now, a single HTTP API is the intended integration point for web, desktop, and mobile.

---

## `apps/web`

Next.js frontend responsible for:

- browsing notes
- editing notes
- auto-save
- search
- pin / delete / restore
- markdown preview
- responsive browser experience

### Web Responsibilities

- remain the clearest implementation of the product
- prove UX and interaction patterns before other clients adopt them
- provide the baseline markdown editing and preview experience
- evolve toward better responsive behavior for smaller screens

### Web Boundaries

The web app should not become the home for logic that should be shared across clients.

As the repository evolves, reusable domain types and pure note utilities should move out of `apps/web` into shared packages when that improves clarity.

---

## Planned `apps/desktop`

The desktop app is planned as a macOS-focused Electron client.

### Desktop Goals

- provide a minimal desktop entry point for the existing product
- reuse the existing web experience where practical
- keep Electron-specific code small and easy to understand
- avoid introducing desktop-only complexity unless it clearly improves learning value

### Desktop first-step strategy

The first desktop milestone should be a **thin shell**:

- Electron main process creates the application window
- the renderer loads the existing web app
- the desktop app uses the same backend API as the web app

This approach is intentionally conservative. It reduces duplication and keeps the desktop layer small.

### Desktop Boundaries

The desktop app should not initially include:

- deep native OS integrations
- background sync
- complex IPC bridges
- custom local persistence separate from the API
- packaging and distribution complexity beyond what is needed for local development

Those may be explored later if they add clear educational value.

---

## Planned `apps/mobile`

The mobile app is planned as an iOS-focused NativeScript client.

### Mobile Goals

- provide a minimal native mobile client for the same note workflow
- reuse shared domain contracts and pure logic where appropriate
- keep the UI native to the mobile framework
- avoid forcing web UI patterns into a mobile app where they do not fit

### Mobile First-Step Strategy

The first mobile milestone should target a minimal viable feature set:

- list notes
- open a note
- edit note content
- create a note
- preview markdown in a simple way

Other features such as pin, delete, restore, and richer navigation can follow after the basic flow is stable.

### Mobile Boundaries

The mobile app should not initially include:

- full parity with the web app
- a shared cross-platform UI component system
- offline sync
- advanced local caching
- complex navigation abstractions
- platform-specific features that are not needed for the core note workflow

---

## Shared Packages

The repository currently contains shared tooling packages:

- `packages/config-eslint`
- `packages/config-typescript`

To support multiple clients, the next likely additions are small shared domain packages.

### Planned Shared Package Direction

Possible packages include:

- `packages/shared-types`
  - note DTOs
  - API contract types
  - shared domain-facing TypeScript types

- `packages/shared-notes`
  - pure note utilities
  - note sorting helpers
  - shared test fixtures for note domain behavior

The exact package names may change during implementation. The important part is the boundary, not the naming.

### Shared Package Rules

A shared package should exist only if it does at least one of these well:

- removes meaningful duplication
- clarifies ownership of domain logic
- improves testability of pure logic
- helps multiple clients consume the same contracts safely

A shared package should not exist just to make the architecture look more advanced.

---

## Data Flow

## Current Data Flow

```txt
Browser UI
  -> Next.js app
  -> HTTP requests to NestJS API
  -> Prisma
  -> PostgreSQL
```

## Intended Multi-Client Data Flow

```txt
Web client
Desktop client
Mobile client
  -> HTTP requests
  -> NestJS API
  -> Prisma
  -> PostgreSQL
```

This keeps the system conceptually simple:

- one backend
- one database
- multiple clients
- shared contracts where useful

---

## Domain Model Boundaries

The core domain remains intentionally small.

### Current Core Entity

#### Note

A note currently includes behavior and data around:

- identifier
- content
- derived title
- pin state
- soft delete state
- timestamps

### Domain Rules

Important current rules include:

- title is derived from note content
- delete is soft delete
- restore is supported
- single-user local mode is the current model

These rules should remain consistent across clients.

### Ownership

- backend owns persistence and business rules
- clients own presentation and interaction details
- shared packages may own framework-agnostic types and pure helpers

---

## Validation Strategy

Validation currently uses Zod schemas and a small helper to convert schema failures into `400 Bad Request` responses.

This remains the preferred direction.

### Validation Goals

- keep request validation explicit
- keep API contracts understandable
- avoid duplicating complex validation logic in every client
- share types where useful, but keep server validation authoritative

### Boundary

Shared TypeScript types can improve consistency, but they do not replace backend validation.

---

## Frontend and Client UI Strategy

## Web

The web app should continue using:

- server-rendered route data where it helps
- client components for interactive editing
- local UI state for focused interactions
- URL-driven state where it improves clarity

## Desktop

The desktop app should initially reuse the web UI through Electron rather than inventing a separate desktop renderer.

## Mobile

The mobile app should use native mobile UI patterns through NativeScript.

This means the repository should aim for:

- shared domain contracts
- separate presentation layers
- minimal duplication of business intent
- no forced cross-platform UI abstraction too early

---

## Testing Strategy

Testing should stay practical and educational.

### Backend

Keep and expand:

- utility tests
- controller tests
- service tests

### Shared packages

Add focused unit tests for:

- pure note utilities
- shared domain helpers
- contract-shaping logic where appropriate

### Web

Keep and expand:

- component smoke tests
- focused interaction tests for responsive and markdown-related behavior

### Desktop

Prefer minimal validation first:

- startup smoke checks where practical
- small tests around Electron-specific code if the setup remains simple

### Mobile

Prefer bounded tests first:

- unit tests for mobile-specific pure logic
- limited integration-style checks only where they clearly validate important behavior

### End-to-end

Keep end-to-end coverage intentionally small.

The goal is not a large matrix of cross-client end-to-end tests in the first phase. The goal is to prove the core workflow with the smallest useful set of tests.

---

## Documentation Strategy

As the repository becomes multi-client, documentation must become more explicit.

Documentation should clearly answer:

- what exists today
- what is planned
- what is experimental
- what is shared
- what is client-specific
- how to run each app locally
- what is intentionally deferred

The architecture documentation should stay short enough to read in one sitting, but clear enough to guide implementation decisions.

---

## Proposed Repository Direction

The intended repository shape is:

```txt
apps/
  api/                  # NestJS backend
  web/                  # Next.js web client
  desktop/              # Electron desktop client
  mobile/               # NativeScript mobile client

packages/
  config-eslint/        # shared ESLint config
  config-typescript/    # shared TypeScript config
  shared-types/         # shared domain and API types
  shared-notes/         # shared pure note utilities

docs/
  architecture.md
  roadmap.md
  publish-checklist.md
```

This is a target direction, not a promise that every package must exist immediately.

---

## Milestone 0 Deliverables

This document defines the Milestone 0 architecture outcomes:

- shared boundaries are defined
- goals and non-goals are explicit
- the web app is established as the reference client
- desktop is defined as a thin-shell Electron first step
- mobile is defined as a minimal NativeScript first step
- shared packages are limited to domain contracts and pure logic
- the backend remains the main source of truth
- implementation details that are not yet proven remain intentionally flexible

---

## Known Unknowns

The following details are intentionally not locked down yet:

- exact shared package names
- exact Electron packaging strategy beyond local development
- exact NativeScript project structure and plugin choices
- exact markdown rendering approach on mobile
- exact level of feature parity for desktop and mobile after the first milestone
- exact test depth for new clients

These should be decided during implementation based on what stays simplest and clearest.

---

## Guiding Rule

New features should only be added if they improve learning value without significantly increasing architectural complexity.

When there is a tradeoff between:

- a clever abstraction and a clear one
- a highly reusable design and an understandable one
- a feature-rich first step and a stable first step

the project should prefer the simpler option.

That rule should continue to guide all desktop, mobile, and shared-package work.
