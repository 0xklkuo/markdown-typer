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
- [ ] `pnpm dev:desktop` works
- [ ] `pnpm dev:mobile` works on a correctly configured macOS iOS environment
- [ ] migrations and seed instructions are correct

## Code Quality

- [ ] `pnpm check` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` passes
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
- [ ] proven support and intentional limitations are clearly documented
- [ ] known limitations are acceptable
- [ ] repository is understandable to a new contributor
