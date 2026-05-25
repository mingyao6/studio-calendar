# Studio Calendar

A personal studio booking calendar powered by Airtable and Open-Meteo weather.

## Project Structure

```
studio-calendar/
├── index.html          ← The app (no secrets)
├── api/
│   └── bookings.js     ← Vercel serverless function (reads AIRTABLE_TOKEN from env)
├── vercel.json         ← Vercel routing config
└── .gitignore
```

## Setup

### 1. Add your Airtable token to Vercel
1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name:** `AIRTABLE_TOKEN`
   - **Value:** your Airtable personal access token
3. Click **Save** — Vercel will redeploy automatically

### 2. Rotate your old token
Since the old token was exposed, create a new one:
1. Go to [airtable.com/account](https://airtable.com/account) → **Developer Hub** → **Personal access tokens**
2. Delete the old token
3. Create a new one with `data.records:read` scope on your base
4. Paste the new token into Vercel (step 1 above)

### 3. Deploy to Vercel
```bash
# Install Vercel CLI (one time)
npm install -g vercel

# From the project folder
vercel

# Follow the prompts — it will detect the project automatically
```

Or connect via GitHub:
1. Push this repo to GitHub (private is fine)
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
3. Deploy — done

## How the token stays hidden
- `index.html` calls `/api/bookings?start=...&end=...` (your own server)
- `api/bookings.js` runs on Vercel's servers and uses `process.env.AIRTABLE_TOKEN`
- The token never appears in the browser or in your code
