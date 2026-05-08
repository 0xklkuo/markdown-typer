# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-05-08

### Added

- Electron desktop shell for macOS-first local desktop support
- NativeScript iOS-first mobile client foundation
- shared note-domain API client for reuse across web and mobile
- shared package unit tests for note-domain behavior
- clearer multi-client support, setup, and limitation documentation

### Changed

- aligned shared package boundaries around note-domain contracts, utilities, and reusable API logic
- moved note title derivation responsibility fully to the backend
- improved mobile UX with a list-first detail flow
- removed mobile preview for now to keep the iOS client simple and educational
- updated CI to align with workspace validation through `pnpm check`
- refreshed publish and release-readiness documentation for the multi-client repository state

### Notes

This release expands Markdown Typer from a web-first learning app into a small multi-client learning platform.

Current support in this release includes:

- `apps/api` as the backend source of truth
- `apps/web` as the primary reference client
- `apps/desktop` as a thin Electron shell over the web app
- `apps/mobile` as an iOS-first NativeScript client supporting:
  - list notes
  - open a note
  - create a note
  - edit note content
  - autosave
  - mobile-friendly list/detail flow

Intentional limitations remain:

- Android support is deferred
- mobile markdown preview is deferred for now
- desktop remains intentionally thin and web-backed
- packaging and store distribution workflows are outside the current scope
- auth, sync, and collaborative editing remain deferred

## [0.1.0] - 2026-03-24

### Added

- pnpm monorepo foundation
- NestJS backend with Prisma + PostgreSQL
- Next.js web client
- note creation, browsing, search, edit with autosave
- derived note titles from markdown content
- pin / unpin support
- soft delete / restore flow
- markdown preview
- basic keyboard shortcuts
- backend tests:
  - utility
  - controller
  - service
- frontend component smoke tests
- one happy-path Playwright e2e test
- CI workflow
- contributing docs, architecture docs, roadmap docs, publish checklist

### Notes

This release is intentionally positioned as a self-educational playground and lightweight learning reference for modern TypeScript, Node.js, NestJS, Prisma, Zod, and Next.js development.
