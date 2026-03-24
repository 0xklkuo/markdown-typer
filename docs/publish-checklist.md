# Publish Checklist

Use this checklist before publicly sharing the repository.

## Repository Identity

- [ ] README accurately reflects the current project
- [ ] project is clearly framed as a self-educational playground
- [ ] roadmap and architecture docs are up to date
- [ ] license is present

## Developer Experience

- [ ] local setup instructions work from a clean machine
- [ ] environment files are documented
- [ ] `pnpm dev` works
- [ ] migrations and seed instructions are correct

## Code Quality

- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
- [ ] `pnpm test:e2e` passes

## CI / Workflow

- [ ] GitHub Actions CI passes
- [ ] issue templates exist
- [ ] PR template exists

## Product Quality

- [ ] core note flows work:
  - [ ] create
  - [ ] browse
  - [ ] search
  - [ ] edit with autosave
  - [ ] pin / unpin
  - [ ] soft delete / restore
  - [ ] markdown preview
  - [ ] keyboard shortcuts

## Final Review

- [ ] no obvious secrets or local-only files are committed
- [ ] docs use consistent wording
- [ ] known limitations are acceptable
- [ ] repository is understandable to a new contributor
