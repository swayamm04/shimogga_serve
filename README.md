# Karnataka Local Services Directory (Multi-City & Shivamogga Network)

A modern, full-stack verified local business and service directory platform built for Karnataka cities (Shivamogga, Bengaluru, Mysuru, Hubballi-Dharwad, Mangaluru, Belagavi, Davanagere, Ballari, Tumakuru, Udupi, Hassan, Kalaburagi).

---

## Architecture Overview

```
Shimogga_service/
├── backend/                  # Node.js + Express + MongoDB REST API
│   ├── config/               # Database connection (MongoDB / In-memory fallback)
│   ├── controllers/          # Business, Admin, Auth, Review, Lead controllers
│   ├── middleware/           # JWT auth and role verification middleware
│   ├── models/               # Mongoose models (Business, User, Review, Lead, etc.)
│   ├── routes/               # API endpoints (/api/businesses, /api/admin, /api/auth, etc.)
│   ├── scripts/              # DB maintenance and cleaning scripts
│   ├── seed/                 # Pre-populated directory seed data
│   ├── server.js             # Express entry point (Port 5000)
│   └── .env.example          # Backend environment template
│
├── frontend/                 # Next.js 15 (App Router) + TypeScript + Tailwind CSS
│   ├── app/                  # App Router pages (Home, Services, Business details, Admin, Profile)
│   ├── components/           # Reusable UI components (Navbar, Footer, ServiceCard, CategoryIcon)
│   ├── context/              # React Contexts (CityContext, AuthContext)
│   ├── data/                 # Static data & configuration (cities.ts, services.ts)
│   └── lib/                  # Axios API client & utility functions
```

---

## Key Features

1. **Multi-City Support**:
   - Covers 12 major Karnataka cities with dynamic area selection.
   - City state maintained globally across pages with persistent selection.
   - Backend multi-city case-insensitive and alias matching (`Shimoga` / `Shivamogga`).

2. **WhatsApp Direct Onboarding**:
   - Zero-friction business listing flow: `+ Add Business` buttons and pricing cards route directly to WhatsApp with pre-filled inquiry text.
   - Preserves complete legacy multi-step registration form for future online self-service onboarding.

3. **Admin Business Management**:
   - Dedicated administrative portal with secure business creation (`POST /api/admin/businesses`).
   - Direct tier assignment (Basic, Standard, Premium), verification badge toggles, and contact management.

4. **Clean, Premium Aesthetic**:
   - High-contrast, accessibility-compliant typography and layout.
   - Minimalist, smooth fading quote rotator in the top announcement bar.
   - Completely free of informal emojis and neon shadow glows.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT_SECRET
npm run seed     # (Optional) Seed initial verified businesses
npm run dev      # Starts on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts on http://localhost:3000
```

### 3. Build for Production
```bash
cd frontend
npm run build
```

---

## License
Private & Confidential — Freelancing / Client Project.
