# Aguaa — Marriage Biodata Platform

> **Dil Se Rishta, Vishwas Se Shaadi**  
> India's trusted marriage biodata maker for Bihar, UP & Jharkhand families.

**Live:** https://aguaa.in &nbsp;|&nbsp; **Staging:** https://aguaa-taupe.vercel.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 5 + Tailwind CSS |
| Backend | Node.js + Express 4 |
| Database | MongoDB Atlas (Mongoose 8) |
| Auth | JWT (HttpOnly cookies) + Google OAuth |
| File Storage | Cloudinary |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |

---

## Project Structure

```
├── src/                  # React frontend
│   ├── api/              # API client (fetch wrapper)
│   ├── components/       # Reusable UI components
│   ├── context/          # React Context (Language)
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Route-level page components
│   └── utils/            # Utility functions
├── api/                  # Vercel serverless functions
│   ├── og.js             # Dynamic Open Graph tag injection for profile sharing
│   └── sitemap.xml.js    # Dynamic XML sitemap with public profile URLs
├── backend/              # Express API server (deployed to Render)
│   ├── config/           # DB + Cloudinary setup
│   ├── middleware/        # Auth middleware (JWT verify)
│   ├── models/           # Mongoose schemas (User, Biodata)
│   └── routes/           # API routes (auth, biodata)
├── public/               # Static assets served by Vite
├── render.yaml           # Render deployment blueprint
└── vercel.json           # Vercel routing + security headers
```

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- Google Cloud Console project with OAuth credentials

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Copy environment template and fill in values
cp .env.example .env
# Edit .env — set VITE_API_URL and VITE_GOOGLE_CLIENT_ID

# Start dev server (runs on http://localhost:5173)
npm run dev
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template and fill in values
cp .env.example .env
# Edit .env — set MONGO_URI, JWT_SECRET, Cloudinary keys

# Start dev server (runs on http://localhost:5006)
npm run dev
```

---

## Environment Variables

### Frontend (`.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5006/api` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `752932...apps.googleusercontent.com` |

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default: 5006) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random 64-byte hex string |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `CLIENT_URL` | Frontend URL for CORS |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## Deployment

### Frontend → Vercel

1. Import repo in Vercel dashboard
2. Set **Environment Variables** in Vercel project settings:
   - `VITE_API_URL` = `https://your-render-app.onrender.com/api`
   - `VITE_GOOGLE_CLIENT_ID` = your Google Client ID
   - `BACKEND_URL` = `https://your-render-app.onrender.com` *(for OG/sitemap functions)*
3. Vercel auto-deploys from `main` branch via `vercel.json` config

### Backend → Render

1. Connect repo in Render dashboard → New → Blueprint
2. Render reads `render.yaml` automatically
3. Set secret env vars manually in Render → your service → Environment:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET`
4. Set `CLIENT_URL=https://aguaa.in`

---

## API Routes

### Auth (`/api/auth`)
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/signup` | No | Register new user |
| POST | `/login` | No | Login with email/password |
| POST | `/google` | No | Login with Google token |
| POST | `/logout` | No | Clear auth cookie |
| GET | `/me` | Yes | Get current user |

### Biodata (`/api/biodata`)
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/public` | No | List all public profiles |
| GET | `/user/me` | Yes | Get current user's biodatas |
| GET | `/user/:id/private` | Yes | Get owned biodata (full data) |
| GET | `/:id` | No | Get single public profile |
| POST | `/` | Yes | Create biodata |
| PATCH | `/:id` | Yes | Update biodata |
| DELETE | `/:id` | Yes | Delete biodata |
| POST | `/upload-photo` | Yes | Upload profile photo to Cloudinary |

---

## Generate a Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## License

Private — © Aguaa 2025–2026
