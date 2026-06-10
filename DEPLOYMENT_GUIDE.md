# Miniyo Deployment Guide

## Why GoDaddy (and similar shared hosting) Does NOT Work

Your Miniyo project is a **full-stack Node.js application**, not a static HTML website. Here's what it requires:

| Requirement | GoDaddy Shared Hosting | What You Need |
|-------------|------------------------|---------------|
| `npm install` (install dependencies) | Not supported | Node.js 20+ hosting |
| `npm run build` (compile TypeScript/React) | Not supported | Build environment |
| `node dist/boot.js` (run backend server) | Not supported | Node.js runtime |
| MySQL database connection | PHP MySQL only | Native MySQL/TCP |
| Environment variables | Limited | Full env var support |

**GoDaddy shared hosting only supports PHP/static files.** Your app needs a platform that runs Node.js.

---

## Environment Variables (CRITICAL - Do This First!)

Before deploying, you MUST set all environment variables. See **ENV_SETUP.md** in this folder for:
- Complete list of all required variables
- Where each value comes from
- How to set them in your hosting control panel
- The difference between build-time and runtime variables

**Quick reference of required variables:**

| Variable | Purpose |
|----------|---------|
| `NODE_ENV` | Set to `production` |
| `APP_ID` | Your Kimi application ID |
| `APP_SECRET` | Your Kimi application secret |
| `DATABASE_URL` | MySQL connection URL |
| `KIMI_AUTH_URL` | `https://auth.kimi.com` |
| `KIMI_OPEN_URL` | `https://open.kimi.com` |
| `VITE_APP_ID` | Same as APP_ID (for frontend) |
| `VITE_KIMI_AUTH_URL` | Same as KIMI_AUTH_URL (for frontend) |
| `ADMIN_PASSWORD` | Your admin login password |
| `ADMIN_EMAIL` | Admin email address |
| `OWNER_UNION_ID` | Your Kimi Union ID |

> **IMPORTANT:** Variables prefixed with `VITE_` and `ADMIN_PASSWORD` must be available **during the build step** (`npm run build`), not just at runtime. If your hosting platform only sets env vars at runtime, create a `.env` file in the project root before building.

---

## Recommended Platform: Railway (Best for This Project)

**Railway** is the best choice because:
- Native Node.js 20+ support
- One-click MySQL database provisioning
- Auto-deploy from GitHub
- Free $5/month credit (enough for starter)
- Custom domain support
- Environment variables UI

**Alternative platforms** (if Railway doesn't work for you):
- **Render** (render.com) - Free tier, sleeps after inactivity
- **DigitalOcean App Platform** - $6/month, reliable
- **Fly.io** - Docker-based, more complex
- **AWS Elastic Beanstalk** - Enterprise-grade, complex setup

---

## Step-by-Step: Deploy to Railway

### Step 1: Prepare Your Project

1. **Push your code to GitHub** (if not already):
```bash
cd /path/to/your/app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/miniyo.git
git push -u origin main
```

2. **Verify these files exist** in your project root (`/mnt/agents/output/app/`):
```
app/
  package.json          (has "build" and "start" scripts)
  railway.json          (deployment config)
  .env.example          (template for env vars)
  vite.config.ts        (Vite config with root: __dirname)
  api/boot.ts           (Hono server entry)
  db/schema.ts          (Drizzle schema)
  src/providers/trpc.tsx (tRPC provider)
  .gitignore            (excludes .env and node_modules)
```

### Step 2: Create a Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (easiest method)
3. Verify your email

### Step 3: Create a New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your **miniyo** repository
4. Railway will auto-detect Node.js and set build/start commands

### Step 4: Provision MySQL Database

1. In your Railway project dashboard, click **"New"** -> **"Database"** -> **"MySQL"**
2. Railway will create a MySQL instance and auto-inject the `DATABASE_URL` environment variable
3. **Verify**: Click on your MySQL service -> "Connect" tab -> you should see a `mysql://...` URL

### Step 5: Add Environment Variables

Click on your **app service** (the web service) -> "Variables" tab, then add these:

```
# Required for Kimi OAuth (admin login)
APP_ID=your-app-id-from-kimi-dashboard
APP_SECRET=your-app-secret-from-kimi-dashboard

# Kimi URLs (usually pre-filled)
KIMI_AUTH_URL=https://auth.kimi.com
KIMI_OPEN_URL=https://open.kimi.com

# Your admin account
OWNER_UNION_ID=your-union-id
ADMIN_PASSWORD=your-secure-password-here
ADMIN_EMAIL=admin@yourdomain.com

# Frontend Kimi config
VITE_APP_ID=your-app-id-from-kimi-dashboard
VITE_KIMI_AUTH_URL=https://auth.kimi.com

# Database (Railway auto-provides this after Step 4)
# DATABASE_URL=mysql://railway:password@host:3306/railway
```

**Important**: After adding all variables, click **"Deploy"** to apply changes.

### Step 6: Deploy

Railway auto-deploys on every push to `main`, but for the first deployment:

1. Click **"Deploy"** in the top right
2. Watch the build logs (click on the deployment)
3. You should see:
```
> vite build && esbuild api/boot.ts...
vite v7.x building for production...
dist/public/                     0.50 kB | gzip: 0.32 kB
dist/boot.js                     148.2 kB
Server running on http://localhost:3000/
```

4. **Get your URL**: Click on the web service -> "Settings" -> "Public Domain"
   - Your URL will be something like: `https://miniyo-production.up.railway.app`

### Step 7: Initialize the Database (First Time Only)

After the app is running, you need to create the database tables:

1. Go to Railway dashboard -> your project
2. Click on your **web service** -> "Shell" tab
3. Run:
```bash
# Push the schema (create all tables)
npx tsx db/push-schema.ts

# Seed with initial data (admin user, categories, sample products)
npx tsx db/seed.ts
```

**OR** run locally against Railway's database:
```bash
# Copy the DATABASE_URL from Railway dashboard
# Set it in your local .env, then:
npm run db:push
npm run seed
```

### Step 8: Verify Deployment

1. Open your Railway URL in browser
2. You should see the Miniyo homepage
3. Try logging into admin: `/admin/login`
4. Test API health: `https://your-url.railway.app/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

---

## Custom Domain (Optional)

1. Railway dashboard -> your web service -> "Settings" -> "Public Domain"
2. Click **"Custom Domain"**
3. Enter your domain: `miniyo.store` (or `www.miniyo.store`)
4. Railway will give you a CNAME target
5. Go to your domain registrar (GoDaddy/Namecheap) and add a CNAME record:
   - Name: `www` (or `@` for root)
   - Value: `your-railway-cname-target.railway.app`
   - TTL: 600
6. Wait 5-10 minutes for DNS propagation
7. Click "Verify" in Railway

---

## Troubleshooting

### Build Fails with "trpc.tsx not found"
```
Ensure src/providers/trpc.tsx exists and is tracked in git:
git add src/providers/trpc.tsx
git commit -m "Add trpc provider"
git push origin main
```

### "Missing required environment variable: DATABASE_URL"
```
1. Go to Railway dashboard -> your project
2. Check if MySQL service is created and linked
3. If not, create a new MySQL database (Step 4)
4. Ensure the app service has the DATABASE_URL variable
```

### "Cannot connect to database"
```
1. Check DATABASE_URL format: mysql://user:pass@host:port/db
2. Verify MySQL service is running (green indicator in Railway)
3. Check if you need to whitelist Railway's IP (should not be needed)
```

### Frontend loads but API calls fail (404)
```
1. Check that the backend is running (see build logs)
2. Verify the health endpoint: /health
3. Check environment variables are set correctly
4. Ensure the start command is: NODE_ENV=production node dist/boot.js
```

### Admin login not working
```
1. Check ADMIN_PASSWORD is set in environment variables
2. Check ADMIN_EMAIL is set correctly
3. Try re-deploying after setting the variables
```

### "Port already in use" error
```
Railway sets PORT automatically. Don't hardcode port 3000.
Your code should use: const port = parseInt(process.env.PORT || "3000");
(This is already configured correctly in api/boot.ts)
```

---

## Railway Pricing

| Tier | Cost | Details |
|------|------|---------|
| Starter (free credit) | $5/month credit | Enough for 1 small app + MySQL |
| Hobby | $5/month | Includes $5 credit, no sleep |
| Pro | $20/month | Team features, more resources |

For a small e-commerce site, the **Starter** tier with the free credit is usually enough initially.

---

## Quick Reference

| Task | Command/Action |
|------|----------------|
| Deploy latest code | `git push origin main` (auto-deploys) |
| View logs | Railway dashboard -> service -> "Logs" tab |
| Restart service | Railway dashboard -> service -> "Restart" |
| Run database migration | Railway Shell -> `npx tsx db/push-schema.ts` |
| View env vars | Railway dashboard -> service -> "Variables" tab |
| Change custom domain | Settings -> Public Domain -> Custom Domain |

---

## Next Steps After Deployment

1. [ ] Set up a custom domain (miniyo.store)
2. [ ] Configure SSL (Railway provides this automatically)
3. [ ] Set up a CDN for images (Cloudflare or AWS S3)
4. [ ] Configure email service (SendGrid/Resend for order notifications)
5. [ ] Set up monitoring (Railway has basic logs)
6. [ ] Configure automated backups (Railway MySQL has this)

---

## Need Help?

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Check your Railway logs first** - they contain detailed error messages
