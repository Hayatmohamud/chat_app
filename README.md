# Mentorship Chat

A Next.js 16 chat app built with AI SDK v6, OpenRouter, tool calling, and full authentication via Better Auth.

## Features

### Chat
- Streaming AI chat UI
- Calculator, weather, movie, and joke tools
- Per-user MongoDB chat history
- Tailwind CSS styling

### Authentication
- Register account
- Login account
- Email verification
- Forgot password
- Reset password
- Two-factor authentication (email OTP)
- Update profile
- Trusted devices (30-day trust cookie at 2FA sign-in)
- Session management (list/revoke sessions)
- Secure API routes with session checks
- Zod validation and structured error handling

## Tech stack

- **Next.js 16** — App Router
- **Better Auth** — Authentication, 2FA, sessions
- **Drizzle ORM + PostgreSQL (Neon)** — Auth database
- **MongoDB + Mongoose** — Chat history
- **Zod** — Request/form validation
- **AI SDK v6 + OpenRouter** — Chat

## Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Generate an auth secret:

```bash
openssl rand -base64 32
```

Add the keys you want to use:

```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your_generated_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENROUTER_API_KEY=your_openrouter_key
MONGODB_URI=your_mongodb_connection_string
```

Optional email delivery (Resend). Without it, emails are logged to the server console in development:

```bash
RESEND_API_KEY=your_resend_key
EMAIL_FROM="Mentorship Chat <noreply@yourdomain.com>"
```

Apply the auth database migration:

```bash
# Run migrations/0001_auth_features.sql against your PostgreSQL database
# Or use drizzle-kit:
npx drizzle-kit push
```

## Auth routes

| Route | Purpose |
| --- | --- |
| `/signup` | Create account |
| `/signin` | Sign in |
| `/verify-email` | Email verification help |
| `/forgot-password` | Request password reset |
| `/reset-password` | Set new password |
| `/two-factor` | Complete 2FA OTP challenge |
| `/settings` | Profile, 2FA, sessions |

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Verify

```bash
npm run lint
npm run build
```
