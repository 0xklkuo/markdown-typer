# Contributing

Thanks for your interest in contributing.

## Project Intent

This repository is primarily a self-educational playground focused on learning through a real but intentionally small full-stack application.

Please optimize contributions for:

- clarity
- minimalism
- maintainability
- readability for learners
- practical TypeScript and Node.js best practices

## Before Contributing

Please:

1. read the README
2. review `docs/architecture.md` and `docs/roadmap.md`
3. keep changes small and focused where possible
4. avoid introducing abstractions or dependencies that do not clearly earn their cost
5. update documentation in the same change when behavior, support status, or setup changes

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
- small reusable utilities when they reduce meaningful duplication
- comments that explain **why**, not obvious **what**
- platform-specific code that stays explicit and easy to follow

## Testing Expectations

Before submitting a change, run the smallest useful validation first, then broaden if needed.

Common commands:

```bash
pnpm check
pnpm test
pnpm build:ci
pnpm test:e2e
```

Notes:

- if your change is docs-only, say so clearly in the PR
- if your change affects runtime or build configuration, include the relevant build command in your validation notes
- if your change does not affect e2e behavior, mention that clearly in the PR

## Scope Guidance

Good contributions:

- bug fixes
- documentation improvements
- focused UX polish
- maintainability refactors with test coverage
- developer-experience improvements that keep the project simpler to run or understand

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
