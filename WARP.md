# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common commands

- Install deps
  ```bash path=null start=null
  npm install
  ```
- Start dev server (ESM + watch)
  ```bash path=null start=null
  npm run dev
  ```
- Lint / fix
  ```bash path=null start=null
  npm run lint
  npm run lint:fix
  ```
- Format / check
  ```bash path=null start=null
  npm run format
  npm run format:check
  ```
- Database (Drizzle + Neon)
  ```bash path=null start=null
  # Generate SQL from schema in src/models/*.js -> drizzle/*.sql
  npm run db:generate
  # Apply migrations using DATABASE_URL
  npm run db:migrate
  # Visualize schema/data
  npm run db:studio
  ```

Environment

- Copy `.env.example` to `.env` and set at minimum `DATABASE_URL`. Optional: `PORT`, `NODE_ENV`, `LOG_LEVEL`, `ARCJET_KEY`, `JWT_SECRET`, `JWT_EXPIRES_IN`.

Tests

- No test script/config is present. If tests are added later, expose them via an npm script (e.g., `test`) so agents can run them.

## Architecture overview

Runtime and entrypoints

- ESM Node.js service. Entry is `src/index.js` → `src/server.js` (HTTP listen) → `src/app.js` (Express app configuration).

HTTP layer

- `src/app.js` wires middleware: CORS, Helmet, JSON/urlencoded parsers, Cookie Parser, and request logging via Morgan → Winston. Health endpoints at `/` and `/health`; API root at `/api`.
- Routes are mounted under `/api/auth` via `src/routes/auth.routes.js`.

Modular boundaries

- Controllers: request validation and response shaping (e.g., `src/controllers/auth.controller.js` uses Zod schemas, formats errors, sets auth cookie, issues JWTs).
- Services: application logic and DB access (e.g., `src/services/auth.service.js` handles user existence checks, password hashing, inserts, returns selected fields).
- Models: Drizzle schema definitions (e.g., `src/models/user.model.js`).
- Validations: Zod schemas per domain (e.g., `src/validations/auth.validation.js`).
- Utils: cohesive helpers (cookies options, JWT sign/verify with safe defaults, validation error formatting).

Data layer

- Database client via Neon HTTP driver + Drizzle (`src/config/database.js`). Migrations configured in `drizzle.config.js` with outputs to `drizzle/`. The repo includes an initial `users` table migration.

Logging

- Centralized Winston logger (`src/config/logger.js`) with JSON formatting and file outputs (`logs/error.log`, `logs/combined.log`), plus console in non-production. HTTP access logs are funneled from Morgan into Winston.

Imports and module resolution

- Path aliases are defined via `package.json` `imports` using `#` prefixes (e.g., `#config/logger.js`). Use explicit `.js` extensions in imports (ESM requirement).

API surface (current)

- Auth: `POST /api/auth/sign-up` (create user, sets `token` cookie). Sign-in/sign-out routes are stubbed.

## Notes for future agents

- Before running DB commands, ensure `DATABASE_URL` points to a reachable Postgres instance (e.g., Neon). Drizzle CLI reads it from the environment.
- Logging writes to `logs/`; ensure the directory is writable in your environment.
