# Clawdi Status Dashboard

A small **secured dashboard** (Next.js on Vercel) that shows green/red health for OpenClaw skills/integrations.

## Security model

- **Google OAuth (NextAuth)**
- **Hard allowlist**: only `ALLOWED_EMAIL` (set to `gilad@bregman.in`) can sign in
- All pages are protected by middleware (except `/signin` and `/api/auth/*`)
- Status updates are written via `POST /api/update` protected by a shared secret header: `x-dashboard-secret`

## Storage

Uses `@vercel/kv` (recommended backing: **Upstash Redis** via Vercel Marketplace).

## Environment variables (Vercel Project → Settings → Environment Variables)

Set these for **Production + Preview**:

- `ALLOWED_EMAIL=gilad@bregman.in`
- `NEXTAUTH_URL=https://<your-vercel-domain>`
- `NEXTAUTH_SECRET=<openssl rand -base64 32>`
- `GOOGLE_CLIENT_ID=<from Google Cloud OAuth client>`
- `GOOGLE_CLIENT_SECRET=<from Google Cloud OAuth client>`
- `DASHBOARD_UPDATE_SECRET=<openssl rand -base64 32>`

Upstash/Vercel will also add:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

## Google OAuth redirect URI

In Google Cloud Console → OAuth Client → add:

- `https://<your-vercel-domain>/api/auth/callback/google`

(Optional for local dev)
- `http://localhost:3000/api/auth/callback/google`

## Posting an update

```bash
curl -X POST "https://<your-vercel-domain>/api/update" \
  -H "content-type: application/json" \
  -H "x-dashboard-secret: $DASHBOARD_UPDATE_SECRET" \
  -d '{
    "source": "openclaw",
    "checks": [
      {"key":"phone-agent","label":"phone-agent (:8080)","ok":true,"detail":"listening"},
      {"key":"ngrok","label":"ngrok tunnel","ok":true,"detail":"https://…"}
    ]
  }'
```

## Local development

```bash
cp .env.example .env.local
npm i
npm run dev
```

Open http://localhost:3000
