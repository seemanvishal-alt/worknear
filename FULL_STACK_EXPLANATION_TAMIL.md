# 🚀 WorkNear Full Stack - எப்படி வேலை செய்கிறது

## 📚 உங்கள் Application Stack

```
┌─────────────────────────────────────┐
│         FRONTEND (முன்பகுதி)         │
│         React + TypeScript          │
│            Port: 3000               │
└─────────────────────────────────────┘
              ↕ (API Calls)
┌─────────────────────────────────────┐
│         BACKEND (பின்பகுதி)          │
│      Node.js + Express + Vite       │
│            Port: 3000               │
└─────────────────────────────────────┘
              ↕ (Database Queries)
┌─────────────────────────────────────┐
│      DATABASE (தரவுத்தளம்)          │
│      Supabase (PostgreSQL)          │
│         Cloud Hosted                │
└─────────────────────────────────────┘
              ↕ (Authentication)
┌─────────────────────────────────────┐
│    AUTHENTICATION (அங்கீகாரம்)      │
│   Supabase Auth + Google OAuth      │
└─────────────────────────────────────┘
```

---

## 🎯 1. FRONTEND (முன்பகுதி)

### என்ன இருக்கு?

```
src/
├── components/          ← UI Components
│   ├── LoginPage.tsx   ← Login/Signup form
│   ├── Dashboard.tsx   ← User dashboard
│   ├── Navbar.tsx      ← Top navigation
│   └── ...
├── contexts/           ← React Context (Global State)
│   └── AuthContext.tsx ← User authentication state
├── lib/                ← Helper functions
│   └── supabase.ts     ← Database & Auth helpers
└── App.tsx             ← Main application
```

### எப்படி வேலை செய்கிறது?

**React Components:**
- User இடம் data collect செய்கிறது (forms)
- UI காட்டுகிறது (buttons, cards, etc.)
- User actions-ஐ handle செய்கிறது (clicks, typing)

**TypeScript:**
- Code-ஐ type-safe ஆக வைக்கிறது
- Errors early-யாக catch செய்கிறது
- Better IDE support தருகிறது

**Example: Login Button Click**
```typescript
// User clicks "Continue with Google"
const handleGoogleLogin = async () => {
  // 1. Frontend calls supabase helper
  const { data, error } = await signInWithGoogle();
  
  // 2. Redirects to Google OAuth
  // 3. User logs in
  // 4. Comes back with session
  // 5. UI updates with user info ✅
};
```

---

## 🔧 2. BACKEND (பின்பகுதி)

### என்ன இருக்கு?

```
server.ts               ← Main server file
├── Express Server      ← HTTP server
├── Vite Middleware     ← Dev server for React
├── Passport.js         ← OAuth authentication
├── Session Management  ← User sessions
└── API Routes          ← API endpoints
```

### API Endpoints (உங்கள் server-இல் இருக்கும்):

```typescript
GET  /api/health              ← Server status check
POST /api/chat                ← AI chat (Gemini)
POST /api/match               ← Job candidate matching
POST /api/analyze-resume      ← Resume analysis
POST /api/analyze-seo         ← SEO analysis

GET  /auth/google             ← Google login start
GET  /auth/google/callback    ← Google login return
GET  /auth/logout             ← Logout
GET  /api/user                ← Get current user
```

### எப்படி வேலை செய்கிறது?

**Request Flow:**
```
1. User clicks button in frontend
   ↓
2. Frontend sends HTTP request to backend
   ↓
3. Backend receives request
   ↓
4. Backend processes (database query, AI call, etc.)
   ↓
5. Backend sends response back
   ↓
6. Frontend receives data
   ↓
7. UI updates with new data ✅
```

**Example: Job Matching**
```typescript
// Frontend sends request
const response = await fetch('/api/match', {
  method: 'POST',
  body: JSON.stringify({
    jobTitle: 'Developer',
    skills: ['React', 'Node.js']
  })
});

// Backend processes
app.post('/api/match', async (req, res) => {
  const { jobTitle, skills } = req.body;
  
  // 1. Call Gemini AI
  // 2. Match candidates
  // 3. Calculate scores
  
  res.json({ matches: [...] });
});

// Frontend receives response
const data = await response.json();
// Display matches in UI ✅
```

---

## 🗄️ 3. DATABASE (தரவுத்தளம்)

### Supabase (PostgreSQL)

**என்ன store ஆகிறது?**

```sql
Tables:
├── auth.users          ← User accounts
├── profiles            ← User profiles
├── jobs                ← Job postings
├── candidates          ← Candidate profiles
├── applications        ← Job applications
└── messages            ← Chat messages
```

### எப்படி வேலை செய்கிறது?

**Database Operations:**

**1. Create (புதிது சேர்)**
```typescript
// New job posting create
const { data, error } = await supabase
  .from('jobs')
  .insert({
    title: 'Senior Developer',
    location: 'Mumbai',
    salary: '10-15 LPA'
  });
```

**2. Read (படிக்க)**
```typescript
// All jobs get
const { data: jobs, error } = await supabase
  .from('jobs')
  .select('*');

// Filtered jobs get
const { data: techJobs } = await supabase
  .from('jobs')
  .select('*')
  .eq('category', 'technology');
```

**3. Update (மாற்று)**
```typescript
// Job update
const { data, error } = await supabase
  .from('jobs')
  .update({ salary: '15-20 LPA' })
  .eq('id', jobId);
```

**4. Delete (அழி)**
```typescript
// Job delete
const { data, error } = await supabase
  .from('jobs')
  .delete()
  .eq('id', jobId);
```

---

## 🔐 4. AUTHENTICATION (அங்கீகாரம்)

### Supabase Auth + Google OAuth

**எப்படி வேலை செய்கிறது?**

### Flow 1: Email/Password Login

```
1. User enters email & password
   ↓
2. Frontend → signInWithEmail(email, password)
   ↓
3. Supabase validates credentials
   ↓
4. If valid:
   - Creates session token
   - Stores in browser (localStorage)
   - Returns user data
   ↓
5. Frontend stores user in AuthContext
   ↓
6. UI updates - User logged in! ✅
```

### Flow 2: Google OAuth Login

```
1. User clicks "Continue with Google"
   ↓
2. Frontend → signInWithGoogle()
   ↓
3. Redirects to Google login page
   ↓
4. User selects Google account
   ↓
5. Google validates user
   ↓
6. Google redirects back with auth code
   ↓
7. Supabase exchanges code for user data
   ↓
8. Creates session
   ↓
9. Frontend stores user in AuthContext
   ↓
10. UI updates - User logged in! ✅
```

### Session Management

```typescript
// Check if user is logged in
const { user } = useAuth();

if (user) {
  // User logged in
  console.log('Welcome', user.email);
} else {
  // User not logged in
  // Show login page
}
```

**Session Duration:**
- 24 hours auto-refresh
- Stored in browser localStorage
- Automatically sent with every request

---

## 🔄 5. FULL REQUEST CYCLE (முழு சுழற்சி)

### Example: Create New Job Posting

```
┌──────────────────────────────────────┐
│ USER ACTION (User clicks "Post Job") │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ FRONTEND (React Component)            │
│ - Collects form data                  │
│ - Validates input                     │
│ - Shows loading spinner               │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ API CALL (HTTP POST)                  │
│ POST /api/jobs                        │
│ Body: { title, location, salary }    │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ BACKEND (Express Server)              │
│ - Receives request                    │
│ - Validates data                      │
│ - Checks authentication               │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ DATABASE (Supabase)                   │
│ - INSERT INTO jobs                    │
│ - Returns new job ID                  │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ BACKEND RESPONSE                      │
│ - Success: { id, data }               │
│ - Or Error: { error }                 │
└──────────────────────────────────────┘
              ↓
┌──────────────────────────────────────┐
│ FRONTEND UPDATES                      │
│ - Hide loading spinner                │
│ - Show success toast                  │
│ - Redirect to job listing             │
│ - UI updates with new job ✅          │
└──────────────────────────────────────┘
```

---

## 🌐 6. EXTERNAL SERVICES (வெளி சேவைகள்)

### Google Gemini AI

**என்ன செய்கிறது?**
- Chat responses
- Job-candidate matching
- Resume analysis
- SEO optimization suggestions

**எப்படி?**
```typescript
// Backend calls Gemini AI
const response = await geminiClient.models.generateContent({
  model: 'gemini-3.6-flash',
  contents: prompt,
});

// Returns AI-generated response
```

### Google OAuth

**என்ன செய்கிறது?**
- User authentication
- Profile information (name, email, photo)
- Secure login without password

---

## 📊 7. DATA FLOW (தரவு ஓட்டம்)

### Example: Dashboard Page Load

```
1. User opens dashboard
   ↓
2. Dashboard component mounts
   ↓
3. useEffect() runs
   ↓
4. Calls getJobs() helper function
   ↓
5. Helper makes Supabase query:
   supabase.from('jobs').select('*')
   ↓
6. Supabase returns job data
   ↓
7. Frontend stores in state:
   setJobs(data)
   ↓
8. React re-renders UI
   ↓
9. Jobs display in cards ✅
```

**Code:**
```typescript
const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load jobs on mount
    async function loadJobs() {
      const { data } = await getJobs();
      setJobs(data);
    }
    loadJobs();
  }, []);

  return (
    <div>
      <h1>Welcome {user.email}</h1>
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};
```

---

## 🔄 8. REAL-TIME UPDATES (நேரடி புதுப்பிப்பு)

### Supabase Realtime

**எப்படி வேலை செய்கிறது?**

```typescript
// Listen for new jobs
supabase
  .channel('jobs')
  .on('postgres_changes', 
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'jobs' 
    },
    (payload) => {
      // New job posted!
      console.log('New job:', payload.new);
      // Update UI automatically
      setJobs([...jobs, payload.new]);
    }
  )
  .subscribe();
```

**Benefits:**
- No page refresh needed
- Instant updates
- Multiple users see changes immediately
- WebSocket connection (very fast!)

---

## 🔒 9. SECURITY (பாதுகாப்பு)

### Row Level Security (RLS)

**Supabase-இல்:**
```sql
-- Users can only update their own profiles
CREATE POLICY "Users update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Anyone can view jobs
CREATE POLICY "Jobs are public"
ON jobs FOR SELECT
USING (true);

-- Only authenticated users can create jobs
CREATE POLICY "Authenticated create jobs"
ON jobs FOR INSERT
WITH CHECK (auth.role() = 'authenticated');
```

**என்ன ஆகுது?**
- Database-level security
- Users can't access others' data
- Automatic enforcement
- No backend code needed!

---

## 🎯 10. YOUR PROJECT STRUCTURE

```
worknear-main/
├── src/                          ← Frontend code
│   ├── components/               ← React components
│   ├── contexts/                 ← Global state
│   ├── lib/                      ← Helper functions
│   │   └── supabase.ts          ← Database helpers
│   ├── data/                     ← Mock data
│   ├── assets/                   ← Images, styles
│   ├── App.tsx                   ← Main app
│   └── main.tsx                  ← Entry point
│
├── server.ts                     ← Backend server
│
├── .env                          ← Environment variables
│   ├── VITE_SUPABASE_URL        ← Database URL
│   ├── VITE_SUPABASE_ANON_KEY   ← Public API key
│   ├── GEMINI_API_KEY           ← AI API key
│   └── GOOGLE_CLIENT_ID         ← OAuth credentials
│
├── package.json                  ← Dependencies
├── vite.config.ts               ← Build config
└── tsconfig.json                ← TypeScript config
```

---

## 🚀 11. DEPLOYMENT FLOW (நிலைநிறுத்தம்)

### Development (இப்போது)

```
npm run dev
   ↓
Vite starts dev server
   ↓
http://localhost:3000
   ↓
Hot reload enabled (code changes auto-update)
```

### Production (எதிர்காலம்)

```
npm run build
   ↓
Creates optimized bundle
   ↓
Deploy to hosting (Vercel, Netlify, etc.)
   ↓
https://worknear.com ✅
```

---

## 📈 12. PERFORMANCE (செயல்திறன்)

### Frontend Optimization

**React:**
- Virtual DOM (fast updates)
- Component memoization
- Lazy loading
- Code splitting

**Vite:**
- Fast hot reload
- Optimized builds
- Tree shaking (removes unused code)

### Backend Optimization

**Supabase:**
- Indexed queries (fast database lookups)
- Connection pooling
- Edge functions (near user)
- CDN caching

---

## 🎓 சுருக்கம் (Summary)

### உங்கள் Stack:

**Frontend:**
- ✅ React (UI components)
- ✅ TypeScript (type safety)
- ✅ Vite (build tool)
- ✅ Tailwind CSS (styling)

**Backend:**
- ✅ Node.js + Express (server)
- ✅ Passport.js (OAuth)
- ✅ Express Session (sessions)

**Database:**
- ✅ Supabase (PostgreSQL)
- ✅ Row Level Security
- ✅ Real-time subscriptions

**Authentication:**
- ✅ Supabase Auth
- ✅ Google OAuth
- ✅ Session management

**External APIs:**
- ✅ Google Gemini (AI)
- ✅ Google Maps (optional)

---

## 🎯 எப்படி எல்லாம் ஒன்றாக வேலை செய்கிறது?

```
User Action → Frontend → Backend → Database → AI/External APIs
                ↓                       ↓
            Updates UI ← Response ← Processing ← Data
```

**Example: User logs in with Google**
```
1. Click "Continue with Google" (Frontend)
2. Redirect to Google (OAuth)
3. User selects account (Google)
4. Google sends auth code (OAuth)
5. Supabase validates (Backend)
6. Creates session (Database)
7. Returns user data (Backend)
8. Stores in context (Frontend)
9. UI updates - Logged in! ✅
```

---

## 🚀 உங்கள் Application-ன் பலம்

✅ **Full Stack** - Frontend to Database  
✅ **Real-time** - Live updates  
✅ **Secure** - RLS + OAuth  
✅ **Scalable** - Cloud hosted  
✅ **AI-Powered** - Gemini integration  
✅ **Type-Safe** - TypeScript  
✅ **Fast** - Vite + React  
✅ **Modern** - Latest tech stack  

---

**இதுதான் உங்கள் WorkNear Full Stack! 🎉**

**Questions?** Ask me anything! 💪
