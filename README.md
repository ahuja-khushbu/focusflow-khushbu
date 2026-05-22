# FocusFlow

A full-stack personal productivity dashboard built with React 18 + Express + MongoDB.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + Tailwind CSS v3 |
| Server state | TanStack React Query v5 |
| UI state | Zustand |
| Routing | React Router v6 |
| Backend | Express 4 (MVC, ESM) |
| Database | MongoDB + Mongoose |
| Auth | JWT (httpOnly cookies) + bcrypt |
| Drag & Drop | @dnd-kit/core |
| Testing | Vitest + Supertest |

## Quick Start — Docker (recommended)

```bash
# 1. Set your JWT secrets in server/.env.docker (already has defaults for local use)
docker compose up --build
```

- App: http://localhost
- API: http://localhost/api (proxied via nginx)
- MongoDB data is persisted in a named Docker volume

## Local Development Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (or Atlas URI)

### Server

```bash
cd server
cp .env.example .env   # fill in your secrets
npm install
npm run dev            # starts on :5000
```

### Client

```bash
cd client
npm install
npm run dev            # starts on :5173
```

The Vite dev server proxies `/api/*` to `localhost:5001`.

## Environment Variables (server/.env)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Secret for access tokens (min 32 chars) |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens (min 32 chars) |
| `CLIENT_ORIGIN` | Exact client URL for CORS (e.g. `http://localhost:5173`) |
| `NODE_ENV` | `development` or `production` |

## Running Tests

```bash
# All server tests
cd server && npm test

# Unit tests only
cd server && npm run test:unit

# Integration tests only
cd server && npm run test:integration

# Single file
cd server && npx vitest run src/tests/unit/auth.test.js
```

Tests use `mongodb-memory-server` — no external MongoDB needed.

## Features

1. **Kanban Board** — drag & drop tasks between To Do / In Progress / Done columns with optimistic updates
2. **Task List** — filterable list view with search, status, priority, and tag filters
3. **Task Detail** — full Markdown description, edit/delete, threaded comments
4. **Comments** — create, edit, delete own comments; one level of threading; `commentsCount` atomic updates
5. **Tags** — create colored tags, filter board/list by tag, cascade delete
6. **Auth** — register/login with httpOnly JWT cookies, silent token refresh, token rotation with reuse detection

## Design System

Custom warm copper palette (`#D97757` primary) defined as Tailwind tokens in `client/tailwind.config.js`. Supports dark mode toggle.
