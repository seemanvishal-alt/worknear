# Google OAuth Authentication Flow

## Visual Flow Diagram

```
┌─────────────┐
│   Browser   │
│  (Client)   │
└──────┬──────┘
       │
       │ 1. User clicks "Continue with Google"
       │
       ▼
┌──────────────────────────────────────────────────┐
│  handleGoogleLogin()                             │
│  → window.location.href = '/auth/google'         │
└──────┬───────────────────────────────────────────┘
       │
       │ 2. Browser requests /auth/google
       │
       ▼
┌──────────────────────────────────────────────────┐
│  WorkNear Server (Express + Passport)            │
│  GET /auth/google                                │
│  → passport.authenticate('google', {...})        │
└──────┬───────────────────────────────────────────┘
       │
       │ 3. Server redirects to Google OAuth
       │
       ▼
┌──────────────────────────────────────────────────┐
│  Google OAuth Server                             │
│  https://accounts.google.com/o/oauth2/v2/auth    │
│  ┌────────────────────────────────────┐          │
│  │  Select Google Account             │          │
│  │  ☐ user@gmail.com                  │          │
│  │                                    │          │
│  │  WorkNear wants to:                │          │
│  │  ✓ View your email address         │          │
│  │  ✓ View your basic profile         │          │
│  │                                    │          │
│  │  [Cancel]  [Allow]                 │          │
│  └────────────────────────────────────┘          │
└──────┬───────────────────────────────────────────┘
       │
       │ 4. User approves, Google redirects back
       │    with authorization code
       │
       ▼
┌──────────────────────────────────────────────────┐
│  WorkNear Server                                 │
│  GET /auth/google/callback?code=XXXXX            │
│                                                  │
│  1. Passport exchanges code for access token    │
│  2. Passport fetches user profile from Google   │
│  3. Creates user object:                        │
│     {                                            │
│       id: "google-user-id",                      │
│       email: "user@gmail.com",                   │
│       name: "John Doe",                          │
│       picture: "https://..."                     │
│     }                                            │
│  4. Saves user in session                       │
│  5. Redirects to /?login=success                 │
└──────┬───────────────────────────────────────────┘
       │
       │ 5. Browser redirected to homepage
       │
       ▼
┌──────────────────────────────────────────────────┐
│  Browser - LoginPage Component                   │
│                                                  │
│  useEffect detects ?login=success                │
│  → Calls GET /api/user                           │
└──────┬───────────────────────────────────────────┘
       │
       │ 6. Fetch user info
       │
       ▼
┌──────────────────────────────────────────────────┐
│  WorkNear Server                                 │
│  GET /api/user                                   │
│                                                  │
│  → Returns: {                                    │
│      authenticated: true,                        │
│      user: { name: "John Doe", ... }             │
│    }                                             │
└──────┬───────────────────────────────────────────┘
       │
       │ 7. User info returned
       │
       ▼
┌──────────────────────────────────────────────────┐
│  Browser - LoginPage Component                   │
│                                                  │
│  1. setIsLoggedIn(true)                          │
│  2. Show toast: "Welcome John Doe!"              │
│  3. setActiveTab('dashboard')                    │
│  4. Clean URL (remove ?login=success)            │
└──────────────────────────────────────────────────┘
       │
       │ 8. User is now logged in!
       │
       ▼
┌──────────────────────────────────────────────────┐
│  Dashboard View                                  │
│  ✅ Authenticated session active                 │
│  🍪 Session cookie stored                        │
│  ⏰ Valid for 24 hours                           │
└──────────────────────────────────────────────────┘
```

## Key Components

### 1. Client-Side (LoginPage.tsx)

**Before (Mock):**
```typescript
const handleGoogleLogin = () => {
  setIsLoading(true);
  setTimeout(() => {
    setIsLoggedIn(true);  // Fake login!
  }, 1200);
};
```

**After (Real OAuth):**
```typescript
const handleGoogleLogin = () => {
  window.location.href = '/auth/google';  // Real OAuth redirect
};

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('login') === 'success') {
    fetch('/api/user')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setIsLoggedIn(true);
          addToast(`Welcome ${data.user.name}!`);
          setActiveTab('dashboard');
        }
      });
  }
}, []);
```

### 2. Server-Side (server.ts)

**OAuth Configuration:**
```typescript
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        id: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        picture: profile.photos?.[0]?.value,
      };
      return done(null, user);
    }
  )
);
```

**Routes:**
```typescript
// Start OAuth flow
app.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// OAuth callback
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/?login=success')
);

// Get current user
app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user, authenticated: true });
  } else {
    res.json({ user: null, authenticated: false });
  }
});

// Logout
app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.redirect('/');
  });
});
```

### 3. Session Management

**Session Configuration:**
```typescript
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
}));
```

**How Sessions Work:**
1. After successful OAuth, user data is serialized and stored server-side
2. A session ID is generated and sent to browser as a cookie
3. Browser includes this cookie in all subsequent requests
4. Server looks up session by ID and retrieves user data
5. `req.isAuthenticated()` returns true if valid session exists
6. Sessions expire after 24 hours or on logout

## Security Features

### ✅ What's Protected

1. **OAuth Flow**
   - Authorization code exchange (not exposed to client)
   - Access tokens handled server-side only
   - No credentials stored in browser

2. **Session Security**
   - Session ID is a random, unpredictable string
   - Session data stored server-side (not in cookie)
   - Cookie is httpOnly (JavaScript can't access it)
   - Cookie is secure in production (HTTPS only)

3. **CSRF Protection**
   - OAuth state parameter validates requests
   - Session cookie provides additional validation

4. **Credentials**
   - Client secret never exposed to browser
   - All credentials in environment variables
   - `.env` file excluded from git

### 🔒 Production Security Checklist

- [ ] Use HTTPS (required for OAuth in production)
- [ ] Set strong `SESSION_SECRET` (use crypto.randomBytes)
- [ ] Enable secure cookies (`secure: true`)
- [ ] Implement rate limiting on auth routes
- [ ] Add CSRF tokens for state-changing operations
- [ ] Log authentication attempts
- [ ] Set up session storage (Redis) for multi-server deployments
- [ ] Implement session rotation on privilege escalation
- [ ] Add logout on all devices functionality
- [ ] Monitor for suspicious authentication patterns

## Data Flow Summary

```
User Click
   ↓
Client Redirect → /auth/google
   ↓
Server Redirect → Google OAuth
   ↓
User Approval → Google
   ↓
Google Redirect → /auth/google/callback?code=XXX
   ↓
Server Exchanges Code → Access Token
   ↓
Server Fetches Profile → User Data
   ↓
Server Creates Session → Session ID
   ↓
Server Sends Cookie → Browser
   ↓
Browser Redirect → /?login=success
   ↓
Client Fetches → /api/user (with session cookie)
   ↓
Server Validates Session → Returns User Data
   ↓
Client Sets State → User Logged In ✅
```

## Token Lifecycle

| Token/Credential | Where Stored | Lifetime | Access |
|------------------|--------------|----------|---------|
| Client ID | Environment variable | Permanent | Server |
| Client Secret | Environment variable | Permanent | Server |
| Authorization Code | URL parameter | 10 minutes | Server |
| Access Token | Server memory (Passport) | 1 hour | Server |
| Refresh Token | Server memory (Passport) | Long-lived | Server |
| Session ID | Browser cookie | 24 hours | Browser + Server |
| User Data | Server session store | 24 hours | Server |

## API Endpoints Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/auth/google` | GET | Start OAuth flow | No |
| `/auth/google/callback` | GET | OAuth callback | No |
| `/auth/logout` | GET | Destroy session | Yes |
| `/api/user` | GET | Get current user | No (returns null if not authenticated) |

## Testing the Flow

### Manual Test

1. Open DevTools → Network tab
2. Click "Continue with Google"
3. Watch the redirect chain:
   - `http://localhost:3000` → `/auth/google`
   - `/auth/google` → `https://accounts.google.com/...`
   - `https://accounts.google.com/...` → `/auth/google/callback?code=...`
   - `/auth/google/callback` → `/?login=success`
4. Check Application tab → Cookies
5. You should see a session cookie (e.g., `connect.sid`)

### Check Session

```javascript
// In browser console after login:
fetch('/api/user')
  .then(r => r.json())
  .then(data => console.log('User:', data));

// Should output:
// User: {
//   authenticated: true,
//   user: { id: "...", email: "...", name: "...", picture: "..." }
// }
```

### Test Logout

```javascript
// In browser console:
fetch('/auth/logout').then(() => location.reload());

// After reload, check user:
fetch('/api/user')
  .then(r => r.json())
  .then(data => console.log('User:', data));

// Should output:
// User: { authenticated: false, user: null }
```
