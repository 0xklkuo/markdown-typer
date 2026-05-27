# Roadmap

## Purpose

This roadmap is a decision guide for improving Markdown Typer without losing the project’s main value: being a clean, self-educational full-stack reference.

It is intentionally conservative.
It should help contributors choose the next clear improvement, not justify unnecessary expansion.

---

## Current Baseline

The repository already includes:

- NestJS API
- Next.js web client
- Electron desktop shell
- NativeScript iOS-first mobile client
- PostgreSQL + Prisma persistence
- shared note contracts and note helpers
- workspace lint, typecheck, format, test, and build workflows
- one happy-path Playwright e2e flow

The current feature set already covers the core note workflow:

- create
- browse
- search
- edit with autosave
- pin / unpin
- soft delete / restore
- markdown preview on web
- keyboard shortcuts on web

---

## Guiding Rule

New work should be accepted only if it improves one or more of these without adding disproportionate complexity:

- learning value
- code clarity
- maintainability
- testability
- developer experience

---

## What Is Already Established

These foundations are already in place and should be treated as current reality, not future aspirations:

- web is the primary reference client
- desktop is a thin shell over the web app
- mobile is intentionally smaller and iOS-first
- the backend is the source of truth for note behavior
- shared packages exist for note contracts and pure note helpers
- the repository is already multi-client, but not feature-parity driven

---

## Current Priorities

### 1. Documentation and developer-experience alignment

Why it matters:

- the project should describe the repository as it exists today
- contributors should not need to infer which support is proven versus intentionally limited
- build and lint tooling should be warning-free where practical

Typical outcomes:

- accurate README and docs
- documentation consolidated around `README.md`, `docs/spec.md`, `docs/architecture.md`, and `docs/roadmap.md`
- architecture and roadmap wording aligned with reality
- contributor guidance aligned with current scripts and support limits
- avoidable framework-tooling warnings removed

### 2. Environment-driven runtime configuration

Why it matters:

- desktop and mobile currently depend on local development defaults
- configuration should become more explicit before the project grows further
- consistent runtime configuration improves clarity and portability

Typical outcomes:

- documented per-app runtime config inputs
- fewer hardcoded local URLs in clients
- clearer local-development and CI expectations
- desktop and mobile configuration behavior that is explicit instead of implicit

### 3. Contract and boundary cleanup

Why it matters:

- some types and configuration decisions are still duplicated across layers
- small cleanup now is cheaper than broad refactoring later
- shared code should reflect clear ownership boundaries

Typical outcomes:

- less duplication between API and client contracts
- clearer responsibility lines between app code and shared packages
- no forced abstraction beyond what is already justified

### 4. Web reference-client simplification

Why it matters:

- the web app remains the main place where product behavior is proven
- small simplifications here improve the whole repository’s readability
- responsive and editor-related flows benefit from steady cleanup

Typical outcomes:

- simpler state flow where possible
- focused component boundaries
- targeted tests around important user behavior

### 5. Validation and publish readiness

Why it matters:

- the project should remain easy to run, study, and verify
- release confidence comes from simple, repeatable checks
- support claims should stay grounded in proven behavior

Typical outcomes:

- green workspace checks
- stable build and e2e workflows
- an honest validation and known-limitations story

---

## Backlog Candidates

These are reasonable future improvements, but not automatic commitments:

- better desktop development ergonomics
- more explicit mobile environment and runtime setup
- focused tests around shared client behavior
- further cleanup of low-value duplication
- incremental responsive and editor UX polish on web

Each should be evaluated against the guiding rule before implementation.

---

## Explicitly Deferred

The following are intentionally not current priorities:

- authentication
- sync across devices
- offline-first architecture
- multi-user workspaces
- collaborative editing
- rich text editing
- advanced markdown plugin stacks
- large shared UI abstractions across platforms
- Android support in the first mobile phase
- packaging, signing, and store distribution workflows as a near-term goal
- broad e2e suites for every client surface

These are deferred to protect simplicity and learning value.

---

## Success Criteria

The roadmap is succeeding if:

- docs match the actual repository state
- the web app remains the clearest implementation of product behavior
- shared code stays small and justified
- desktop and mobile support remain understandable and intentionally scoped
- contributors can run the project without hidden assumptions
- validation stays practical and trustworthy

---

## Final Note

This roadmap is not a promise to expand the project indefinitely.

If implementation shows that a smaller or simpler path is better, the simpler path should win.
