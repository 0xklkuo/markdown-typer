# Roadmap

## Purpose

This roadmap keeps the project focused while it grows from a web-first learning app into a small multi-client learning platform.

The goal is to expand carefully without losing the repository's core values:

- clarity
- minimalism
- maintainability
- testability
- incremental learning
- avoiding over-engineering

This roadmap is intentionally conservative.
It favors a stable foundation over fast feature expansion.

## Current State

The project currently includes:

- NestJS backend
- Next.js frontend
- PostgreSQL + Prisma
- notes create / edit / search / pin / delete / restore
- markdown preview
- keyboard shortcuts
- backend and frontend tests
- one happy-path e2e flow

## Guiding Rule

New features should only be added if they improve learning value without significantly increasing architectural complexity.

## Multi-Client Direction

The repository will evolve in phases.

The intended long-term shape is:

```/dev/null/roadmap-target.txt#L1-10
apps/
  api/
  web/
  desktop/
  mobile/

packages/
  config-eslint/
  config-typescript/
  shared-types/
  shared-notes/
```

This target structure is a direction, not a promise.
Some package names or boundaries may change during implementation if a simpler structure proves better.

## Principles for Expansion

As the repository grows, new work should follow these rules:

- keep the API as the main source of truth
- share domain types and pure logic before sharing UI
- prefer thin client shells over heavy platform-specific abstractions
- keep platform-specific code small and explicit
- add tests around shared logic before broadening client support
- document proven behavior separately from planned behavior
- avoid introducing complexity only for theoretical reuse

## Phased Plan

## Phase 0 — Shared Boundaries and Architecture

Goal:

- define the minimum architecture needed for multi-client support
- clarify what should be shared and what should stay platform-specific
- establish goals and non-goals before implementation

Planned outcomes:

- shared package boundaries for types and pure note logic
- a client capability matrix
- a phased implementation plan for web, desktop, and mobile
- updated architecture and roadmap documentation

Why this phase exists:

- the current repository is intentionally web-first
- desktop and mobile support should not be added until the boundaries are clear
- this reduces rework and keeps the project educational

## Phase 1 — Web Foundation Hardening

Goal:

- make the web app the stable reference client for future platform work

Planned work:

- add `tailwindcss-typography` for markdown preview
- improve responsive layout for smaller screens
- refine reusable component boundaries inside the web app
- extract reusable types from web-specific code
- keep existing tests green and add focused tests where needed

Expected result:

- the web app remains the clearest implementation of the product
- responsive behavior improves
- markdown preview styling becomes simpler and more maintainable
- shared contracts begin to move out of app-local code

## Phase 2 — Shared Packages

Goal:

- create a small shared foundation for multiple clients

Planned work:

- add a shared types package for note and API contract types
- add a shared pure-logic package for note-related utilities where useful
- move reusable tests for pure logic closer to shared packages
- keep framework-specific UI code inside each app

Expected result:

- web, desktop, and mobile clients can depend on the same domain contracts
- duplication is reduced without forcing premature abstraction
- shared code remains small, explicit, and easy to understand

## Phase 3 — Desktop App (Electron, macOS-first)

Goal:

- add a minimal desktop client for macOS using Electron

Planned work:

- create a thin Electron shell
- load the existing web app during development
- keep Electron-specific code limited to app lifecycle and shell concerns
- preserve secure defaults such as context isolation
- document local development workflow for desktop support

Expected result:

- the project gains a desktop entry point without duplicating product logic
- the desktop app stays intentionally thin
- the web app continues to provide most of the UI behavior

Initial scope:

- browse notes
- open notes
- edit notes
- preview markdown
- use the existing backend API

## Phase 4 — Mobile App (NativeScript, iOS-first)

Goal:

- add a minimal iOS client using NativeScript

Planned work:

- create a NativeScript app with a small note workflow
- reuse shared types and pure logic where practical
- keep mobile UI native to the platform instead of forcing web UI reuse
- implement a minimal note list and note detail flow
- document local development workflow for mobile support
- distinguish code validation scripts from native iOS runtime scripts

Expected result:

- the repository demonstrates how one backend can support multiple client types
- mobile support remains intentionally narrow and educational
- shared logic is reused where it helps, not where it harms clarity
- contributors can tell whether a failure is caused by app code or missing Apple tooling

Initial scope:

- list notes
- open a note
- create a note
- edit content
- preview markdown in a minimal way

## Phase 5 — Documentation and Developer Experience

Goal:

- make the expanded repository understandable and runnable

Planned work:

- update root documentation to reflect the new client apps
- update architecture documentation with shared boundaries
- document local setup for web, desktop, and mobile
- clarify what is stable, experimental, or intentionally limited
- refine scripts and contributor guidance where needed

Expected result:

- contributors can understand the repository shape
- local development remains approachable
- the educational purpose of the project stays intact

## Phase 6 — Validation and Polish

Goal:

- confirm the repository still meets its quality bar after expansion

Planned work:

- run linting, type-checking, and tests across the workspace
- add focused tests for shared logic and critical client behavior
- verify the desktop app starts correctly
- verify the mobile app can complete its minimal note flow
- document known limitations and tradeoffs

Expected result:

- the repository remains stable enough to study and extend
- quality checks continue to support maintainability
- platform additions do not silently weaken the original project

## What Will Be Shared

The following are good candidates for sharing across clients:

- note domain types
- API request and response types
- pure note utilities
- small API client helpers where they remain framework-agnostic
- testable business rules that do not depend on UI frameworks

## What Will Not Be Shared Aggressively

The following should remain platform-specific unless a very clear need appears:

- React web components
- NativeScript UI components
- Electron shell code
- routing implementations
- platform-specific state and lifecycle code
- styling systems beyond shared design intent

The project should prefer duplication over harmful abstraction when the duplicated code is small and easier to understand.

## Non-Goals

The following are not goals of this roadmap right now:

- authentication
- sync across devices
- multi-user workspaces
- collaborative editing
- offline-first architecture
- rich text editing
- advanced markdown plugin stacks
- cross-platform desktop packaging beyond the initial macOS focus
- Android support in the first mobile phase
- a fully shared UI layer across web and mobile
- enterprise-style architecture layers added only for scale assumptions

These are intentionally excluded to protect simplicity and learning value.

## Known Uncertainties

Some details are intentionally left open until implementation proves the simplest path.

Examples:

- exact shared package names
- exact Electron packaging strategy beyond local development
- exact NativeScript markdown preview approach
- how much API client code should be shared versus duplicated
- whether some current web utilities belong in shared packages

These should be resolved during implementation based on proven need, not speculation.

## Near-Term Priority Order

The recommended implementation order is:

1. define shared boundaries and documentation
2. strengthen the web app foundation
3. extract shared types and pure logic
4. add the Electron desktop shell
5. add the NativeScript mobile app
6. refine documentation and validation

This order reduces rework and keeps the repository stable while it expands.

## Success Criteria

The roadmap is succeeding if:

- the web app remains simple and maintainable
- shared code is small and clearly justified
- desktop support works without major architectural distortion
- mobile support demonstrates the same backend serving another client type
- documentation stays aligned with the actual repository state
- contributors can still understand the project without reading excessive abstraction layers

## Deferred Items

These remain intentionally deferred unless the project proves a clear need for them later:

- auth
- sync
- multi-user workspaces
- advanced markdown tooling
- rich text editing
- broad platform packaging and distribution workflows
- large e2e suites for every client
- deep design system abstraction across all platforms

## Final Note

This roadmap is a planning document, not a guarantee.

If implementation shows that a simpler path is better, the simpler path should win.
The repository should continue to optimize for being a clean learning reference first, and a multi-client product second.
