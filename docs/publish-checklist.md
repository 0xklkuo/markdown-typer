# Publish Checklist

Use this checklist before publicly sharing the repository.

## Repository Identity

- [ ] README accurately reflects the current project
- [ ] project is clearly framed as a self-educational playground
- [ ] architecture and roadmap docs describe the current repository state
- [ ] docs clearly separate proven support from intentional limitations
- [ ] license is present

## Developer Experience

- [ ] local setup instructions work from a clean machine
- [ ] environment files and required runtime configuration are documented
- [ ] desktop and mobile setup instructions are explicit about platform limits
- [ ] migrations and seed instructions are correct
- [ ] `pnpm dev` works
- [ ] `pnpm dev:desktop` works
- [ ] `pnpm dev:mobile` works on a correctly configured macOS iOS environment

## Code Quality

- [ ] `pnpm check` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` passes
- [ ] `pnpm build:ci` passes without avoidable framework-tooling warnings
- [ ] `pnpm test:e2e` passes

## CI / Workflow

- [ ] GitHub Actions CI passes
- [ ] issue templates exist
- [ ] PR template exists

## Product Quality

- [ ] core note flows work in the web reference client:
  - [ ] create
  - [ ] browse
  - [ ] search
  - [ ] edit with autosave
  - [ ] pin / unpin
  - [ ] soft delete / restore
  - [ ] markdown preview
  - [ ] keyboard shortcuts
- [ ] desktop shell successfully mirrors the current web experience
- [ ] mobile iOS client successfully supports:
  - [ ] list notes
  - [ ] open a note
  - [ ] create a note
  - [ ] edit with autosave
  - [ ] mobile list/detail navigation

## Final Review

- [ ] no obvious secrets or local-only files are committed
- [ ] docs use consistent wording
- [ ] no stale future-tense language remains for features that already exist
- [ ] known limitations are acceptable and clearly documented
- [ ] repository is understandable to a new contributor
