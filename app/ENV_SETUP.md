# Environment Variable Setup Guide

## For GoDaddy Node.js Hosting

### Step 1: Log into GoDaddy Hosting Control Panel

1. Go to [godaddy.com](https://godaddy.com) and sign in
2. Navigate to **My Products** → **Web Hosting** (or **VPS/Dedicated** if applicable)
3. Click **Manage** next to your hosting plan
4. Look for **"Environment Variables"** or **"Node.js"** section in the control panel

### Step 2: Add All Required Environment Variables

Add each variable one by one in the control panel:

| Variable | Value Example | Required? | Purpose |
|----------|--------------|-----------|---------|
| `NODE_ENV` | `production` | **Yes** | Tells the app to run in production mode |
| `APP_ID` | `19ea3c1d-70f2-...` | **Yes** | Your Kimi application ID |
| `APP_SECRET` | `mTApcfdw9GRV...` | **Yes** | Your Kimi application secret |
| `DATABASE_URL` | `mysql://user:pass@host:3306/db` | **Yes** | MySQL connection string |
| `KIMI_AUTH_URL` | `https://auth.kimi.com` | **Yes** | Kimi auth endpoint |
| `KIMI_OPEN_URL` | `https://open.kimi.com` | **Yes** | Kimi API endpoint |
| `VITE_APP_ID` | `19ea3c1d-70f2-...` | **Yes* | Same as APP_ID (for frontend build) |
| `VITE_KIMI_AUTH_URL` | `https://auth.kimi.com` | **Yes* | Same as KIMI_AUTH_URL (for frontend build) |
| `ADMIN_PASSWORD` | `MiniYostore!b` | **Yes* | Admin login password (also used at build time) |
| `ADMIN_EMAIL` | `admin@miniyo.store` | Recommended | Admin account email |
| `OWNER_UNION_ID` | `d8as01gpe77...` | Recommended | Your Kimi Union ID for owner access |
| `PORT` | `3000` | Optional | Server port (GoDaddy may override this) |
| `ALLOWED_ORIGINS` | (leave empty) | Optional | CORS origins (empty = allow all) |

**\*** = Must be available during the **build** step (`npm run build`), not just at runtime.

### Step 3: Get Your Values

#### APP_ID & APP_SECRET & OWNER_UNION_ID
These come from your **Kimi Developer Console**:
1. Go to [Kimi Developer Console](https://open.kimi.com)
2. Find your app → copy **App ID** and **App Secret**
3. Your **Union ID** is in your Kimi account profile

#### DATABASE_URL
From your GoDaddy hosting panel:
1. Find **MySQL Database** details
2. Format: `mysql://username:password@hostname:3306/database_name`
3. Example: `mysql://miniyo_user:myPassword@127.0.0.1:3306/miniyo_db`

> **Note:** If GoDaddy provides separate host/user/pass/port fields, combine them into the URL format above.

### Step 4: Important - Build vs Runtime Variables

**Critical distinction for GoDaddy hosting:**

- **Runtime variables** (APP_ID, APP_SECRET, DATABASE_URL, etc.) are read when the server starts with `node dist/boot.js`
- **Build-time variables** (`VITE_` prefixed + `ADMIN_PASSWORD`) are read when `npm run build` runs

If GoDaddy only sets env vars at runtime (after build), the frontend will fail. You have two options:

#### Option A: Set env vars BEFORE build (preferred)
Configure env vars in the GoDaddy panel **before** clicking Deploy. Some platforms let you set this in "Build Environment" or "Build Settings."

#### Option B: Create a `.env` file in the project root
If the platform doesn't support build-time env vars, create a `.env` file at the project root (`/app/.env`) with all variables. The build process reads `.env` automatically via `dotenv`.

**`.env` file format:**
```
NODE_ENV=production
APP_ID=your-actual-app-id
APP_SECRET=your-actual-app-secret
DATABASE_URL=mysql://user:pass@host:3306/db
KIMI_AUTH_URL=https://auth.kimi.com
KIMI_OPEN_URL=https://open.kimi.com
VITE_APP_ID=your-actual-app-id
VITE_KIMI_AUTH_URL=https://auth.kimi.com
ADMIN_PASSWORD=your-secure-password
ADMIN_EMAIL=admin@miniyo.store
OWNER_UNION_ID=your-union-id
```

> **Security:** If you use Option B, add `.env` to your `.gitignore` so credentials aren't committed to GitHub.

### Step 5: Verify and Redeploy

After setting all variables:
1. Click **Save** in the environment variables section
2. Click **Redeploy** or **Restart** in the GoDaddy panel
3. Check the deployment logs for any "Missing required environment variable" errors
4. If you see errors, note which variable is missing and add it

### Quick Checklist

Before redeploying, verify you have set:

- [ ] `NODE_ENV` = `production`
- [ ] `APP_ID` = your Kimi app ID
- [ ] `APP_SECRET` = your Kimi app secret
- [ ] `DATABASE_URL` = your MySQL connection URL
- [ ] `KIMI_AUTH_URL` = `https://auth.kimi.com`
- [ ] `KIMI_OPEN_URL` = `https://open.kimi.com`
- [ ] `VITE_APP_ID` = same as APP_ID
- [ ] `VITE_KIMI_AUTH_URL` = `https://auth.kimi.com`
- [ ] `ADMIN_PASSWORD` = your chosen admin password
- [ ] `ADMIN_EMAIL` = admin email address
- [ ] `OWNER_UNION_ID` = your Kimi union ID

### Troubleshooting

**"Missing required environment variable: DATABASE_URL"**
→ You forgot to set the DATABASE_URL variable. Check the MySQL section in your GoDaddy panel.

**"Missing required environment variable: APP_ID"**
→ The APP_ID variable is not set. Copy it from the Kimi Developer Console.

**Frontend loads but login button doesn't work**
→ VITE_APP_ID or VITE_KIMI_AUTH_URL is missing. These must be set at build time.

**"Cannot connect to database" / connection timeout**
→ Check DATABASE_URL format. Ensure the MySQL host is accessible from your Node.js app (some hosts require whitelisting IPs).
