# 🏗️ WorkNear Architecture - Visual Diagram

## 🎯 High-Level Architecture (உயர்நிலை கட்டமைப்பு)

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                     (பயனர் Browser)                         │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            REACT FRONTEND (முன்பகுதி)                │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  Components: LoginPage, Dashboard, Navbar       │ │  │
│  │  │  Context: AuthContext (Global State)            │ │  │
│  │  │  Routing: React Router                          │ │  │
│  │  │  Styling: Tailwind CSS + Motion                 │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                         ↕                             │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  Supabase Client Library                        │ │  │
│  │  │  (Database & Auth Helper Functions)             │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│                    Port: 3000                                │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/HTTPS
        ┌──────────────────────────────────────────┐
        │     API Calls & WebSocket Connections     │
        └──────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   NODE.JS BACKEND SERVER                     │
│                    (பின்பகுதி Server)                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            EXPRESS.JS SERVER                          │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  Routes:                                         │ │  │
│  │  │  • /api/chat         → Gemini AI               │ │  │
│  │  │  • /api/match        → Job matching            │ │  │
│  │  │  • /api/user         → User info               │ │  │
│  │  │  • /auth/google      → OAuth login             │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  │                         ↕                             │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  Middleware:                                     │ │  │
│  │  │  • Passport.js      → OAuth handling           │ │  │
│  │  │  • Express Session  → Session management        │ │  │
│  │  │  • Vite Middleware  → Dev hot reload           │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│                    Port: 3000                                │
└─────────────────────────────────────────────────────────────┘
                            ↕
        ┌──────────────────────────────────────────┐
        │        Database Queries (SQL)             │
        │      Authentication Requests              │
        └──────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (CLOUD)                          │
│                (Cloud-hosted Database)                       │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         POSTGRESQL DATABASE                           │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  Tables:                                         │ │  │
│  │  │  • auth.users       → User accounts            │ │  │
│  │  │  • profiles         → User profiles            │ │  │
│  │  │  • jobs             → Job postings             │ │  │
│  │  │  • candidates       → Candidate data           │ │  │
│  │  │  • applications     → Job applications         │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         AUTHENTICATION SERVICE                        │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  • Email/Password Auth                          │ │  │
│  │  │  • Google OAuth 2.0                             │ │  │
│  │  │  • Session Management                           │ │  │
│  │  │  • JWT Token Generation                         │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         REALTIME SERVICE                              │  │
│  │  ┌─────────────────────────────────────────────────┐ │  │
│  │  │  • WebSocket Connections                        │ │  │
│  │  │  • Live Database Updates                        │ │  │
│  │  │  • Push Notifications                           │ │  │
│  │  └─────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│              Hosted: supabase.co Cloud                       │
└─────────────────────────────────────────────────────────────┘
                            ↕
        ┌──────────────────────────────────────────┐
        │      External API Calls                   │
        └──────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│                   (வெளி சேவைகள்)                           │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         GOOGLE GEMINI AI                              │  │
│  │  • Chat responses                                     │  │
│  │  • Job-candidate matching                             │  │
│  │  • Resume analysis                                    │  │
│  │  • SEO optimization                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         GOOGLE OAUTH                                  │  │
│  │  • User authentication                                │  │
│  │  • Profile information                                │  │
│  │  • Secure login                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         GOOGLE MAPS (Optional)                        │  │
│  │  • Location services                                  │  │
│  │  • Map visualization                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Example: User Login with Google

```
┌────────────┐
│   USER     │  1. Clicks "Continue with Google"
└──────┬─────┘
       ↓
┌────────────────────┐
│  REACT FRONTEND    │  2. Calls signInWithGoogle()
└──────┬─────────────┘
       ↓
┌────────────────────┐
│  SUPABASE CLIENT   │  3. Initiates OAuth flow
└──────┬─────────────┘
       ↓
┌────────────────────┐
│  GOOGLE OAUTH      │  4. Shows Google login page
└──────┬─────────────┘
       ↓
┌────────────────────┐
│  USER              │  5. Selects Google account
└──────┬─────────────┘
       ↓
┌────────────────────┐
│  GOOGLE OAUTH      │  6. Validates & sends auth code
└──────┬─────────────┘
       ↓
┌────────────────────┐
│  SUPABASE AUTH     │  7. Exchanges code for user data
└──────┬─────────────┘
       ↓
┌────────────────────┐
│  SUPABASE DB       │  8. Creates/updates user record
└──────┬─────────────┘
       ↓
┌────────────────────┐
│  SUPABASE AUTH     │  9. Creates session token
└──────┬─────────────┘
       ↓
┌────────────────────┐
│  REACT FRONTEND    │  10. Receives user data & token
└──────┬─────────────┘
       ↓
┌────────────────────┐
│  AUTH CONTEXT      │  11. Stores user in global state
└──────┬─────────────┘
       ↓
┌────────────────────┐
│  UI COMPONENTS     │  12. Re-renders with logged-in UI
└────────────────────┘
       ↓
   ✅ User Logged In!
```

---

## 📊 Data Flow: Create Job Posting

```
┌────────────────┐
│  USER          │
│  Fills form    │
└────────┬───────┘
         ↓
┌────────────────────────┐
│  FRONTEND              │
│  • Validates input     │
│  • Shows loading       │
└────────┬───────────────┘
         ↓ POST /api/jobs
┌────────────────────────┐
│  BACKEND (Optional)    │
│  • Additional logic    │
│  • Business rules      │
└────────┬───────────────┘
         ↓
┌────────────────────────┐
│  SUPABASE CLIENT       │
│  supabase              │
│    .from('jobs')       │
│    .insert(data)       │
└────────┬───────────────┘
         ↓
┌────────────────────────┐
│  SUPABASE DATABASE     │
│  • Validates schema    │
│  • Checks RLS policies │
│  • Inserts record      │
│  • Returns new ID      │
└────────┬───────────────┘
         ↓
┌────────────────────────┐
│  REALTIME SERVICE      │
│  • Broadcasts update   │
│  • Notifies subscribers│
└────────┬───────────────┘
         ↓
┌────────────────────────┐
│  ALL CONNECTED CLIENTS │
│  • Receive update      │
│  • Auto-refresh UI     │
└────────────────────────┘
         ↓
   ✅ Job Posted!
   (All users see it instantly)
```

---

## 🔐 Security Layers (பாதுகாப்பு அடுக்குகள்)

```
┌─────────────────────────────────────────────┐
│  LAYER 1: FRONTEND VALIDATION                │
│  • Form validation                           │
│  • Input sanitization                        │
│  • Client-side checks                        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  LAYER 2: HTTPS ENCRYPTION                   │
│  • All data encrypted in transit             │
│  • SSL/TLS certificates                      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  LAYER 3: AUTHENTICATION                     │
│  • Session tokens                            │
│  • JWT validation                            │
│  • OAuth verification                        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  LAYER 4: AUTHORIZATION (RLS)                │
│  • Row Level Security policies               │
│  • User can only access their data           │
│  • Database-level enforcement                │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  LAYER 5: DATABASE SECURITY                  │
│  • SQL injection prevention                  │
│  • Prepared statements                       │
│  • Automatic backups                         │
└─────────────────────────────────────────────┘
                    ↓
            ✅ SECURE!
```

---

## 🚀 Tech Stack Summary

```
┌───────────────────────────────────────────────────┐
│                    FRONTEND                        │
├───────────────────────────────────────────────────┤
│  Framework         React 19                       │
│  Language          TypeScript 5.8                 │
│  Build Tool        Vite 6.2                       │
│  Styling           Tailwind CSS 4.1               │
│  Animation         Motion 12.23                   │
│  State Management  React Context + Hooks          │
│  Routing           React Router (if used)         │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│                    BACKEND                         │
├───────────────────────────────────────────────────┤
│  Runtime           Node.js 22                     │
│  Framework         Express 4.21                   │
│  Language          TypeScript 5.8                 │
│  Dev Tool          tsx 4.21                       │
│  Authentication    Passport.js                    │
│  Session           Express Session                │
│  Build             esbuild 0.25                   │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│                   DATABASE                         │
├───────────────────────────────────────────────────┤
│  Database          PostgreSQL (via Supabase)      │
│  ORM               Supabase JS Client             │
│  Authentication    Supabase Auth                  │
│  Real-time         Supabase Realtime              │
│  Storage           Supabase Storage (optional)    │
└───────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────┐
│                EXTERNAL APIS                       │
├───────────────────────────────────────────────────┤
│  AI                Google Gemini 3.6 Flash        │
│  Maps              Google Maps Platform           │
│  OAuth             Google OAuth 2.0               │
└───────────────────────────────────────────────────┘
```

---

## 📁 File Structure (கோப்பு அமைப்பு)

```
worknear-main/
│
├── 🎨 FRONTEND (Client-side)
│   └── src/
│       ├── components/         React UI components
│       │   ├── LoginPage.tsx
│       │   ├── Dashboard.tsx
│       │   ├── Navbar.tsx
│       │   └── ...
│       │
│       ├── contexts/           Global state management
│       │   └── AuthContext.tsx
│       │
│       ├── lib/                Helper functions
│       │   └── supabase.ts     Database & Auth
│       │
│       ├── data/               Mock/static data
│       │   └── mockData.ts
│       │
│       ├── assets/             Images, CSS
│       │   └── images/
│       │
│       ├── App.tsx             Main application
│       ├── main.tsx            Entry point
│       └── index.css           Global styles
│
├── 🔧 BACKEND (Server-side)
│   └── server.ts               Express server
│       ├── API Routes          /api/*
│       ├── Auth Routes         /auth/*
│       ├── Middleware          Passport, Session
│       └── Vite Dev Server     Hot reload
│
├── ⚙️ CONFIGURATION
│   ├── .env                    Environment variables
│   ├── .env.example            Template
│   ├── package.json            Dependencies
│   ├── tsconfig.json           TypeScript config
│   ├── vite.config.ts          Vite config
│   └── tailwind.config.js      Tailwind config
│
└── 📚 DOCUMENTATION
    ├── README.md
    ├── SUPABASE_SETUP.md
    ├── GOOGLE_OAUTH_SETUP.md
    └── ...
```

---

## 🌊 Component Hierarchy (Component படிநிலை)

```
App (Root)
├── AuthProvider (Global Auth State)
│   │
│   ├── Router
│   │   │
│   │   ├── LoginPage
│   │   │   ├── ThreeDConstellation
│   │   │   ├── Login Form
│   │   │   └── Google OAuth Button
│   │   │
│   │   ├── Dashboard (Protected)
│   │   │   ├── Navbar
│   │   │   ├── Stats Cards
│   │   │   ├── Job Listings
│   │   │   └── Charts
│   │   │
│   │   ├── WorkersPage
│   │   │   ├── Search Filters
│   │   │   ├── Candidate Cards
│   │   │   └── Map View
│   │   │
│   │   ├── EmployersPage
│   │   │   ├── Job Posting Form
│   │   │   ├── Active Jobs
│   │   │   └── Applications
│   │   │
│   │   └── ProfilePage
│   │       ├── User Info
│   │       ├── Edit Form
│   │       └── Settings
│   │
│   └── Footer
```

---

## 💾 Database Schema (தரவுத்தள Schema)

```sql
┌─────────────────────────────────────┐
│         auth.users                   │ (Supabase managed)
├─────────────────────────────────────┤
│ id (uuid, PK)                       │
│ email (text, unique)                │
│ encrypted_password (text)           │
│ created_at (timestamp)              │
│ last_sign_in_at (timestamp)         │
└─────────────────────────────────────┘
              ↓ (1:1)
┌─────────────────────────────────────┐
│         profiles                     │
├─────────────────────────────────────┤
│ id (uuid, PK, FK → auth.users)     │
│ full_name (text)                    │
│ company (text)                      │
│ role (text)                         │
│ avatar_url (text)                   │
│ updated_at (timestamp)              │
└─────────────────────────────────────┘
              ↓ (1:Many)
┌─────────────────────────────────────┐
│         jobs                         │
├─────────────────────────────────────┤
│ id (uuid, PK)                       │
│ title (text)                        │
│ description (text)                  │
│ category (text)                     │
│ location (text)                     │
│ salary_range (text)                 │
│ posted_by (uuid, FK → profiles)    │
│ created_at (timestamp)              │
└─────────────────────────────────────┘
              ↓ (Many:Many)
┌─────────────────────────────────────┐
│         candidates                   │
├─────────────────────────────────────┤
│ id (uuid, PK)                       │
│ user_id (uuid, FK → profiles)      │
│ name (text)                         │
│ email (text)                        │
│ skills (text[])                     │
│ experience (integer)                │
│ created_at (timestamp)              │
└─────────────────────────────────────┘
```

---

## 🎯 இந்த Architecture-ன் நன்மைகள்

✅ **Scalable** - Millions of users handle செய்யலாம்  
✅ **Real-time** - Instant updates  
✅ **Secure** - Multiple security layers  
✅ **Fast** - Optimized at every level  
✅ **Modern** - Latest tech stack  
✅ **Type-Safe** - TypeScript everywhere  
✅ **Maintainable** - Clean code structure  
✅ **Cloud-Ready** - Easy deployment  

---

**இதுதான் உங்கள் WorkNear Architecture! 🎉**

**Server Running:** ✅ http://localhost:3000  
**Full Stack:** ✅ Complete  
**Ready:** ✅ Production-ready architecture
