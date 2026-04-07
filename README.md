# SEO Tag Analyzer

A full-stack web application that crawls websites and extracts SEO metadata, with JWT authentication and per-user scan history.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (via Supabase or Neon)
- **Auth**: JSON Web Tokens (JWT) + bcrypt

## Features

- User registration and login
- Protected scan endpoint (`GET /api/scan?url=...`) — requires Bearer token
- Extracts: title, meta description, og:title, og:description, og:image, canonical, robots, h1 count, image alt tag coverage, Twitter cards, hreflang, favicon
- Per-user scan history stored in the database
- Rate limiting: max **20 scans per user per day**, tracked in DB
- Brute-force protection on auth routes (20 attempts per 15 minutes)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Strong secret for signing JWTs (`openssl rand -hex 32`) |
| `ALLOWED_ORIGINS` | Comma-separated allowed CORS origins (production) |
| `NODE_ENV` | `development` or `production` |

### 3. Run database migrations

```bash
npm run db:push
```

### 4. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5000`.

### 5. Build for production

```bash
npm run build
npm start
```

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | No | Register with username, email, password |
| `POST` | `/api/auth/login` | No | Login, receive JWT |
| `GET` | `/api/auth/me` | Bearer | Get current user |

### Scan

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/scan?url=...` | Bearer | Analyze a URL's SEO tags |
| `GET` | `/api/scan/history` | Bearer | Get user's scan history (last 20) |

### Example: Scan a URL

```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"secret"}' | jq -r .token)

# Scan
curl "http://localhost:5000/api/scan?url=https://example.com" \
  -H "Authorization: Bearer $TOKEN"
```

## Project Structure

```
├── client/              # React frontend
│   └── src/
│       ├── context/     # AuthContext
│       ├── lib/         # auth helpers, queryClient
│       └── pages/       # AuthPage, Home
├── server/
│   ├── controllers/     # authController, scanController
│   ├── middleware/      # JWT auth middleware
│   ├── routes/          # auth.ts, scan.ts
│   ├── db.ts            # Database connection (Drizzle + Neon)
│   ├── routes.ts        # Route registration + CORS
│   └── index.ts         # Entry point
└── shared/
    └── schema.ts        # Drizzle schema (users, seo_results, daily_scan_counts)
```

## Author

- Yashasvi Khatri
