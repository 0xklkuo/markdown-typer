# Contributing

Thanks for your interest in contributing.

## Project Intent

This repository is primarily a self-educational playground focused on learning and teaching through a real but intentionally small full-stack application.

Please optimize contributions for:

- clarity
- minimalism
- maintainability
- readability for learners
- practical TypeScript / Node.js best practices

## Before Contributing

Please:

1. read the README
2. review the architecture and roadmap docs
3. keep changes small and focused where possible
4. avoid introducing unnecessary abstractions or dependencies

## Development Setup

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
pnpm --filter @markdown-typer/api prisma:migrate:dev
pnpm --filter @markdown-typer/api prisma:seed
pnpm dev
```

## Code Style

This project prefers:

- TypeScript-first, strict typing
- clear naming over clever abstractions
- arrow functions where they improve consistency and readability
- standard NestJS class method handlers for decorated controller methods
- small reusable utilities when they reduce duplication
- comments that explain **why**, not obvious **what**

## Testing Expectations

Before submitting a change, run:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
```

If your change does not affect e2e behavior, mention that clearly in the PR.

## Scope Guidance

Good contributions:

- bug fixes
- documentation improvements
- test improvements
- focused UX polish
- maintainability refactors with test coverage

Less ideal contributions:

- large architectural rewrites without discussion
- heavy dependencies for small problems
- speculative abstractions
- feature creep that makes the project harder to learn from

## Pull Request Guidance

A good PR should include:

- what changed
- why it changed
- how it was tested
- any tradeoffs or known limitations

## Questions / Proposals

For non-trivial changes, open an issue or discussion first so the implementation direction can stay aligned with the project’s educational goals.
