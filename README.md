# School Controller

School Controller is a multiplatform academic management system for educational institutions.
This repository currently contains the technical base for the project: a shared Expo client,
a Node.js API, a shared TypeScript package, local PostgreSQL configuration, and monorepo tooling.

The initial academic database model covers users, roles, students, teachers, subjects, groups,
classrooms, periods, schedules, and schedule assignments. See
[`docs/database-model.md`](docs/database-model.md) for its ER diagram and relationship rules.

## Tech Stack

- Expo
- React Native
- React Native Web
- Expo Router
- TypeScript
- Node.js
- Express
- PostgreSQL
- Prisma
- npm Workspaces
- Turborepo
- ESLint
- Prettier
- Husky
- lint-staged

## Requirements

- Node.js 20.19 or newer
- npm
- Docker and Docker Compose
- Expo Go on a mobile device, optional for Android/iOS development

## Installation

```bash
git clone https://github.com/aurasdev/SchoolController.git
cd SchoolController
npm install
```

## Environment

Create a local environment file from the example:

```bash
cp .env.example .env
```

The example file contains local development values only:

- `DATABASE_URL`: PostgreSQL connection string used by Prisma.
- `POSTGRES_PORT`: host port exposed by the PostgreSQL container. It defaults to `5433` to avoid
  conflicts with locally installed PostgreSQL instances.
- `PORT`: API port. The default development value is `4000`.
- `EXPO_PUBLIC_API_URL`: public Expo variable used by the client.

Do not commit `.env` files.

## Database

Start PostgreSQL for local development:

```bash
npm run db:up
```

Stop it when needed:

```bash
npm run db:down
```

The Docker service creates a local `school_controller` database with a persistent volume.
PostgreSQL is exposed on host port `5433` by default so it can run alongside a local PostgreSQL
installation that uses the standard `5432` port.

Apply the pending Prisma migrations and generate the client:

```bash
npm run db:migrate
npm run db:generate
```

## API foundation

The Express API validates its environment before startup and establishes a PostgreSQL connection
through the Prisma 7 PostgreSQL driver adapter. Start it after the database and migrations are
ready:

```bash
npm run dev:api
```

The health endpoint verifies both the HTTP server and the live database connection:

```bash
curl http://localhost:4000/health
```

A healthy response has this shape:

```json
{
  "services": {
    "database": "up"
  },
  "status": "ok",
  "timestamp": "2026-10-09T05:21:27.052Z"
}
```

API errors use a consistent response structure. For example, an unavailable database returns HTTP
`503` with:

```json
{
  "error": {
    "code": "DATABASE_UNAVAILABLE",
    "message": "The database service is unavailable."
  }
}
```

Run the backend test suite with:

```bash
npm run test -w @school-controller/api
```

## Development

Run the Expo app and API together from the repository root:

```bash
npm run dev
```

Run only the Expo app:

```bash
npm run dev:app
```

Run only the API:

```bash
npm run dev:api
```

Run the web target:

```bash
npm run web
```

Run native targets through Expo:

```bash
npm run android
npm run ios
```

The Expo app can also be started directly from its workspace:

```bash
cd apps/app
npx expo start
```

## Quality Commands

```bash
npm run lint
npm run typecheck
npm run format
npm run format:check
```

## Project Structure

```text
apps/
  app/        Expo, React Native, Expo Router client for Android, iOS and Web
  api/        Node.js, Express and TypeScript API
packages/
  shared/     Shared TypeScript constants, types, schemas and utilities
```

## Git Workflow

The intended branch strategy is:

```text
main
develop
feature/*
bugfix/*
```

Feature work should be developed outside `main`, reviewed through pull requests, and linked to the
corresponding Jira issue.
