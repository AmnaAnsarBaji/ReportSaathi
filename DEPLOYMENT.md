# ReportSaathi — Deployment Guide

> **Important:** The deployment steps below have **not** been executed and verified end-to-end. This guide documents the correct configuration for each platform. Actual deployment requires a connected GitHub repository and valid credentials.

---

## Overview

| Component | Platform | Status |
|-----------|----------|--------|
| Frontend (React SPA) | Cloudflare Pages | ⏳ Not yet deployed |
| Backend (FastAPI) | Render | ⏳ Not yet deployed |
| Database (optional) | Supabase | ⏳ Schema ready, not applied |

---

## 1. Backend → Render

### Prerequisites
- A [Render](https://render.com) account
- Repository pushed to GitHub

### Step 1 — Create a Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `reportsaathi-backend` |
| **Region** | Closest to your users |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3` |
| **Build Command** | `chmod +x render-build.sh && ./render-build.sh` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| **Health Check Path** | `/api/health` |

> **Why the custom build script?** Render's standard Python instances do not include Tesseract OCR. `render-build.sh` runs `apt-get install -y tesseract-ocr` before `pip install`. This requires the **Standard** plan or higher (not Free tier, which has build restrictions).

### Step 2 — Set Environment Variables

In Render → your service → **Environment**:

| Variable | Value |
|----------|-------|
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `GEMINI_MODEL` | `gemini-2.0-flash` |
| `TESSERACT_CMD` | `/usr/bin/tesseract` |
| `MAX_FILE_SIZE_MB` | `15` |
| `ALLOWED_ORIGINS` | `https://your-app.pages.dev,http://localhost:5173` |
| `SUPABASE_URL` | *(Optional)* Your Supabase project URL |
| `SUPABASE_KEY` | *(Optional)* Your Supabase service role key |
| `TELEGRAM_BOT_TOKEN` | *(Optional)* Your Telegram bot token |

> **Never** paste real secrets into this file. Use Render's environment variable UI.

### Step 3 — Deploy

Click **Create Web Service**. Render will:
1. Clone your repository
2. Run `render-build.sh` (installs Tesseract, then pip deps)
3. Start Uvicorn on `$PORT`

The backend URL will be: `https://reportsaathi-backend.onrender.com`

Verify with: `https://reportsaathi-backend.onrender.com/api/health`

### Step 4 — CORS Configuration

After the frontend is deployed, update `ALLOWED_ORIGINS` in Render to include your Cloudflare Pages URL:

```
https://your-actual-app.pages.dev,http://localhost:5173
```

### Render Free Tier Limitation

> ⚠️ Render Free tier instances **spin down** after 15 minutes of inactivity and take ~30s to cold-start. The build script also requires `apt-get` which may not be available on Free. Use the **Starter** plan (\$7/month) for reliable Tesseract support.

---

## 2. Frontend → Cloudflare Pages

### Prerequisites
- A [Cloudflare](https://cloudflare.com) account
- Repository pushed to GitHub

### Step 1 — Create a Pages Project

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Select your GitHub repository
4. Configure the build:

| Setting | Value |
|---------|-------|
| **Project name** | `reportsaathi` |
| **Production branch** | `main` |
| **Framework preset** | `Vite` |
| **Root directory** | `frontend` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |

### Step 2 — Set Environment Variables

In Cloudflare Pages → your project → **Settings** → **Environment Variables** → **Production**:

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://reportsaathi-backend.onrender.com` |
| `VITE_SUPABASE_URL` | *(Optional)* Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | *(Optional)* Your Supabase **anon** (public) key |

> `VITE_` variables are baked into the JavaScript bundle at build time. After changing them, trigger a new deployment.

### Step 3 — SPA Routing

The file `frontend/public/_redirects` is already included in the repository:

```
/* /index.html 200
```

This prevents 404 errors when users refresh or navigate directly to a URL like `/dashboard`.

### Step 4 — Deploy

Click **Save and Deploy**. Cloudflare will:
1. Install npm dependencies
2. Run `npm run build` (or `vite build`)
3. Deploy `dist/` to the global CDN

Your app will be live at: `https://reportsaathi.pages.dev` (or your custom domain).

---

## 3. Database → Supabase

### Step 1 — Create a Project

1. Go to [supabase.com](https://supabase.com) → **New project**
2. Choose region, set a strong database password

### Step 2 — Apply the Schema

1. In Supabase → **SQL Editor** → **New query**
2. Open `backend/supabase_schema.sql` and paste the contents
3. Click **Run**

The schema creates:
- `user_profiles` table (with RLS enabled)
- `saved_reports` table (with RLS enabled)
- Policies ensuring each user accesses only their own rows

### Step 3 — Get Credentials

From Supabase → **Settings** → **API**:

| Credential | Used where | Environment variable |
|-----------|-----------|---------------------|
| **Project URL** | Backend + Frontend | `SUPABASE_URL` / `VITE_SUPABASE_URL` |
| **`anon` public key** | Frontend only | `VITE_SUPABASE_ANON_KEY` |
| **`service_role` key** | Backend only (never expose to browser) | `SUPABASE_KEY` |

### Step 4 — Enable Email Auth

In Supabase → **Authentication** → **Providers** → enable **Email** (or any provider you need).

---

## 4. Post-Deployment Checklist

After completing the steps above, verify each item:

```
[ ] Backend health check returns 200: https://your-backend.onrender.com/api/health
[ ] Frontend loads without errors: https://your-app.pages.dev
[ ] File upload works (upload a small JPG and get a summary)
[ ] CORS is correctly set — no "Access-Control-Allow-Origin" errors in browser console
[ ] Supabase sign-up and sign-in works (if enabled)
[ ] Saved report history appears correctly per user
[ ] Mobile layout looks correct on a real phone
[ ] Medical disclaimer is visible on every page
[ ] Browser console has no exposed API keys or secrets
```

---

## 5. Environment Variable Summary (All Platforms)

| Variable | Backend (Render) | Frontend (Cloudflare) | Local (.env) |
|----------|-----------------|----------------------|-------------|
| `GEMINI_API_KEY` | ✅ Required | ❌ Never | ✅ Required |
| `GEMINI_MODEL` | Optional | ❌ Never | Optional |
| `TESSERACT_CMD` | Optional (`/usr/bin/tesseract`) | ❌ Never | ✅ Recommended |
| `ALLOWED_ORIGINS` | ✅ Required | ❌ Never | Optional |
| `SUPABASE_URL` | Optional | ❌ Never | Optional |
| `SUPABASE_KEY` *(service role)* | Optional | ❌ **Never ever** | Optional |
| `TELEGRAM_BOT_TOKEN` | Optional | ❌ Never | Optional |
| `VITE_API_URL` | ❌ N/A | ✅ Required | ✅ Required |
| `VITE_SUPABASE_URL` | ❌ N/A | Optional | Optional |
| `VITE_SUPABASE_ANON_KEY` | ❌ N/A | Optional | Optional |

> **Golden rule:** The Supabase `service_role` key has admin-level database access. It must **only** ever appear in backend environment variables — never in frontend code, never in git history.

---

## 6. Troubleshooting Deployment

### Build fails on Render: `apt-get: command not found`
- Ensure the build command is `chmod +x render-build.sh && ./render-build.sh`
- Render Free tier may restrict system-level commands. Upgrade to Starter plan.

### CORS error in browser after deploying
- Verify `ALLOWED_ORIGINS` on Render includes your exact Cloudflare Pages URL (no trailing slash)
- Example: `ALLOWED_ORIGINS=https://reportsaathi.pages.dev,http://localhost:5173`

### Frontend shows "Failed to fetch" / API not reachable
- Check `VITE_API_URL` is set to the correct Render URL in Cloudflare Pages env vars
- Remember: changing `VITE_API_URL` requires a new Cloudflare build to take effect

### Tesseract not found on Render
- The `render-build.sh` script sets it up automatically
- Fallback: set `TESSERACT_CMD=/usr/bin/tesseract` in Render env vars

### Gemini 503 during deployment test
- The grounded fallback activates automatically — this is expected behavior
- Retry after a few seconds; Gemini 503s are transient
