# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FocusFlow is a full-stack personal productivity dashboard (interview take-home). The codebase does not yet exist — this file guides implementation from scratch.

**No boilerplate generators or starter kits.** All architecture decisions must be intentional and explainable.

## Monorepo Structure

```
focusflow/
├── client/          # React 18 + Vite + Tailwind
│   └── src/
│       ├── components/   # Reusable UI (Button, Modal, Card, TagPill, etc.)
│       ├── pages/        # Route-level (Dashboard, TasksList, TaskDetail, Auth)
│       ├── hooks/        # useAuth, useTasks, useTags
│       ├── store/        # Zustand stores (UI state, filters, theme)
│       └── lib/          # api.js (axios instance), utils.js
└── server/          # Node.js + Express MVC
    └── src/
        ├── controllers/  # auth, tasks, comments, tags
        ├── models/       # User, Task, Comment, Tag (Mongoose)
        ├── routes/       # authRoutes, taskRoutes, commentRoutes, tagRoutes
        ├── middleware/   # auth (JWT verify), errorHandler, validate (Joi)
        ├── utils/        # jwt.js (sign/verify helpers)
        └── tests/        # unit/ and integration/ subdirectories
```

## Commands

### Server
```bash
cd server
npm run dev          # nodemon with --watch src
npm test             # vitest run
npm run test:watch   # vitest --watch
npm run test:unit    # vitest run src/tests/unit
npm run test:integration  # vitest run src/tests/integration
```

### Client
```bash
cd client
npm run dev          # vite dev server
npm run build        # vite build
npm run test         # vitest run
npm run lint         # eslint src
```

### Run a single test file
```bash
cd server && npx vitest run src/tests/unit/auth.test.js
cd client && npx vitest run src/hooks/useTasks.test.js
```

## Tech Stack & Key Decisions

| Layer | Choice | Notes |
|-------|--------|-------|
| Frontend | React 18 + Vite | Hooks only, no class components |
| Styling | Tailwind CSS v3 | Custom design tokens in `tailwind.config.js` |
| Server state | React Query | Caching, optimistic updates, background refetch |
| UI state | Zustand | Modal state, active filters, theme preference |
| Routing | React Router v6 | Nested routes; protected routes via `<Outlet>` |
| Backend | Express (MVC) | async/await throughout; no callbacks |
| Database | MongoDB + Mongoose | lean() on list endpoints; compound indexes |
| Auth | JWT + bcrypt | Access token 15m, refresh token 7d with rotation |
| Validation | Zod (FE) + Joi (BE) | Schema validation on both sides |
| Testing | Vitest + Supertest | Min 5 unit + 3 integration tests |
| Drag & Drop | @dnd-kit/core | Kanban column moves |

## Architecture Notes

### Authentication Flow
- Tokens stored in **httpOnly cookies only** — never localStorage
- Access token: 15m expiry; refresh token: 7d with rotation + reuse detection
- Server stores hashed refresh tokens in `User.refreshTokens[]`
- Client axios instance (`lib/api.js`) sends `withCredentials: true`; silent refresh via interceptor on 401
- Both client routes (React Router outlet) and server routes (auth middleware) enforce protection

### State Architecture
- **React Query** owns all server-derived state (tasks, tags, comments) — do not duplicate in Zustand
- **Zustand** owns ephemeral UI state: open modals, selected tag filter, active board column filter, dark mode preference
- Kanban drag uses **optimistic updates**: update React Query cache immediately on drag end, issue `PATCH /api/tasks/:id/status`, roll back cache + show toast on error

### Task Data Model (Mongoose)
Key fields: `title`, `description` (Markdown), `priority` (High/Medium/Low enum), `status` (todo/in_progress/done enum), `dueDate`, `tags []` (ObjectId refs), `categoryId`, `isDeleted` (default false), `createdBy`, `assignedTo`, `commentsCount`

Indexes: `isDeleted`, `dueDate`, `createdBy`, `status` — all list queries must filter `isDeleted: false`.

### API Conventions
- All endpoints under `/api/` prefix
- Standardized error shape: `{ error: true, message: "...", code: "...", details?: {} }`
- List endpoints return: `{ data: [], meta: { page, limit, totalPages, totalItems } }`
- `GET /api/tasks` accepts: `page`, `limit`, `sort` (e.g. `dueDate:asc`), `status`, `tags` (comma-separated), `category`, `priority`, `search`
- `PATCH /api/tasks/:id/status` is the dedicated drag-and-drop endpoint — minimal payload `{ status }`
- Tag deletion must `updateMany` tasks to `$pull` the tag from their `tags` array

### Due Date Classification
The utility classifying tasks as `overdue` / `due-soon` (within 48h) / `normal` is shared logic — implement in `server/src/utils/dateUtils.js` and mirror in `client/src/lib/utils.js`. Tests must cover all three branches.

### Markdown & XSS
Descriptions and comments accept Markdown. Render with a sanitizer (DOMPurify) on the client — never render raw HTML from the server.

### Comments Threading
`Comment` model has `parentCommentId` (nullable ObjectId) for one level of threading. `task.commentsCount` is incremented/decremented atomically via `$inc` on the Task document when comments are added/removed — do not recount via aggregation on every request.

## Evaluation Weight (for prioritization)
1. **Code Quality & Architecture (40%)** — MVC separation, no god components, consistent error handling
2. **Feature Completeness (25%)** — all 6 features working including edge cases (empty states, loading, errors)
3. **UI/UX Polish (15%)** — Tailwind spacing, typography, responsive, hover/focus states
4. **API Design (10%)** — RESTful, validated, paginated correctly
5. **Testing (10%)** — 5 unit + 3 integration, happy path + error cases
