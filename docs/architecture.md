# Architecture

## Purpose

Markdown Typer is a lightweight full-stack learning project designed to teach modern TypeScript and Node.js ecosystem fundamentals through a small but realistic application.

## Design Principles

- keep the system small
- prefer explicitness over abstraction
- optimize for learning and maintainability
- defer complexity until it is clearly needed
- use real-world tools, but in minimal ways

## Applications

### `apps/api`

NestJS backend responsible for:

- notes API
- validation
- persistence
- business logic

### `apps/web`

Next.js frontend responsible for:

- browsing notes
- editing notes
- autosave
- search
- pin / delete / restore
- markdown preview

## Data Flow

```txt
Browser UI
  -> Next.js app
  -> HTTP requests to NestJS API
  -> Prisma
  -> PostgreSQL
```

## Backend Structure

Key backend concerns:

- `notes.controller.ts`
  - request handling
  - schema parsing
- `notes.service.ts`
  - business logic
- `notes.schemas.ts`
  - Zod input schemas
- `prisma.service.ts`
  - database access

### Validation Strategy

Validation uses Zod schemas and a small helper to convert schema failures into `400 Bad Request` responses.

### Persistence Strategy

Notes are stored in PostgreSQL via Prisma.

Important note design decisions:

- title is derived from note content
- delete is soft delete
- restore is supported
- single-user local mode is the current model

## Frontend Structure

Key frontend concerns:

- route-based note navigation
- client-side autosave
- minimal local UI state
- no heavy global state library

### Current UI Pattern

- server-rendered route data
- client components for interactive editing
- local state updates from API responses
- URL-driven search state

## Testing Strategy

### Backend

- utility tests
- controller tests
- service tests

### Frontend

- component smoke tests

### E2E

- one happy-path Playwright test

## Deferred Complexity

The following are intentionally postponed:

- desktop shell
- mobile app
- authentication
- sync
- collaborative editing
- rich text editing
- advanced command system
- enterprise-style architecture layers
