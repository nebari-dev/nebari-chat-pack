# chat-plus-plus
More than just a chat app.

## Prerequisites

- [Node.js](https://nodejs.org/) v22+
- [npm](https://www.npmjs.com/) v10+
- [Docker](https://www.docker.com/) (for containerized builds)

## Environment variables

Copy the example env file and fill in values for your environment:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_MODE` | Set to `dev` for local development, `prod` for production |
| `VITE_DEV_AUTH_ENABLED` | Set to `true` to enforce authentication in dev mode |
| `VITE_PB_URL` | URL of your [PocketBase](https://pocketbase.io/) instance |
| `VITE_API_URL` | URL of the backend API (proxied via Vite in dev) |
| `VITE_ALLOWED_HOST` | Hostname allowed by the Vite dev server (dev only) |

## Local development

Install dependencies and start the Vite dev server:

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5173` by default. The dev server proxies `/api` requests to `VITE_API_URL`.

## Production build

Type-check and build optimized static assets to `dist/`:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Docker

Build the image:

```bash
docker build -t chat-ui .
```

Run the container, passing the backend API URL so nginx can proxy `/api` requests:

```bash
docker run -p 8080:8080 -e API_URL=http://host.docker.internal:8000 chat-ui
```

`API_URL` must be reachable **from inside the container** (e.g. use `host.docker.internal` instead of `localhost` on macOS/Windows, or the service name when using Docker Compose).

The Docker image uses a two-stage build — Node 22 Alpine compiles the app, and the resulting static files are served by Nginx Alpine on port 8080. At startup, nginx replaces `${API_URL}` in its config and proxies all `/api/` traffic to the backend.

## Instructions
