# Environment Setup Guide

## 🚨 500 Error Fix - Required Setup Steps

The signup/login 500 error occurs because the required environment variables and database are not configured. Follow these steps:

---

## Step 1: Create `.env` File

Create a `.env` file in the root of your project with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/project_dashboard?schema=public"

# JWT Secret (use a random strong string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Optional: Node Environment
NODE_ENV="development"
```

### Generate a Secure JWT Secret

You can generate a secure random string for JWT_SECRET using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use this online generator: https://www.uuidgenerator.net/

---

## Step 2: Database Setup

You have two options:

### Option A: PostgreSQL Database (Production-ready)

1. **Install PostgreSQL** locally or use a cloud service:
   - Local: Download from https://www.postgresql.org/download/
   - Cloud: Use [Supabase](https://supabase.com), [Neon](https://neon.tech), or [Railway](https://railway.app)

2. **Create a database**:
   ```sql
   CREATE DATABASE project_dashboard;
   ```

3. **Update DATABASE_URL** in `.env` with your connection string

### Option B: SQLite (Quick Testing - Easier Setup)

For quick testing, you can use SQLite instead:

1. **Update `prisma/schema.prisma`**:
   ```prisma
   datasource db {
     provider = "sqlite"  // Changed from "postgresql"
     url      = "file:./dev.db"  // Changed from env("DATABASE_URL")
   }
   ```

2. **No DATABASE_URL needed** in .env (SQLite uses a local file)

---

## Step 3: Set up PATH for npm/npx (Windows)

You already added node to PATH, but let's verify npm/npx work:

```powershell
# In PowerShell, verify npm is accessible
npm --version

# If not working, add npm explicitly:
$env:PATH = "D:\Mohaned\node-v22.16.0-win-x64;" + $env:PATH
```

---

## Step 4: Generate Prisma Client

Run this command to generate the Prisma client:

```bash
npx prisma generate
```

---

## Step 5: Run Database Migrations

Create the database tables:

```bash
npx prisma migrate dev --name init
```

Or if using SQLite, this will create the `dev.db` file automatically.

---

## Step 6: Restart Development Server

Stop the current dev server (Ctrl+C) and restart:

```bash
npm run dev
```

---

## Verification

After completing the setup:

1. ✅ `.env` file exists with `JWT_SECRET` and `DATABASE_URL`
2. ✅ Prisma client generated (`npx prisma generate`)
3. ✅ Database migrated (`npx prisma migrate dev`)
4. ✅ Dev server running without errors

---

## Quick SQLite Setup (Recommended for Testing)

If you want to get started quickly without setting up PostgreSQL:

1. Edit `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. Create `.env` with just JWT_SECRET:
   ```env
   JWT_SECRET="your-secret-key-here"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Restart server:
   ```bash
   npm run dev
   ```

5. Test signup at `http://localhost:3000/register`

---

## Troubleshooting

### Error: "npx is not recognized"
- Make sure Node.js bin folder is in PATH
- Run: `$env:PATH = "D:\Mohaned\node-v22.16.0-win-x64;" + $env:PATH`

### Error: "JWT_SECRET not set"
- Check that `.env` file exists in project root
- Ensure `JWT_SECRET=...` is in the file
- Restart dev server

### Error: "Database connection error"
- Verify `DATABASE_URL` is correct in `.env`
- For PostgreSQL: ensure database exists and is running
- For SQLite: no action needed, file created automatically

### Error: "Prisma Client not generated"
- Run: `npx prisma generate`
- Restart dev server

---

## Next Steps After Setup

Once the environment is configured:

1. Test signup: http://localhost:3000/register
2. Test login: http://localhost:3000/login
3. Check cookies in DevTools after successful auth
4. View dashboard: http://localhost:3000/dashboard
