# Quick Start Guide - Google OAuth Setup

## 🚀 Get Your WorkNear Login Working in 5 Minutes

### Step 1: Get Google Credentials (2 minutes)

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure consent screen (just fill in app name "WorkNear")
4. Choose "Web application"
5. Add these:
   - **Authorized JavaScript origins:** `http://localhost:3000`
   - **Authorized redirect URIs:** `http://localhost:3000/auth/google/callback`
6. Click "Create" and copy the **Client ID** and **Client Secret**

### Step 2: Update .env File (1 minute)

Open the `.env` file and replace these values:

```env
GOOGLE_CLIENT_ID=paste-your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=paste-your-client-secret-here
```

### Step 3: Restart Server (30 seconds)

If the server is already running, just save the `.env` file - it will auto-restart!

Otherwise:
```bash
npm run dev
```

### Step 4: Test It! (30 seconds)

1. Open: http://localhost:3000
2. Click "Continue with Google" button
3. Select your Google account
4. ✅ You're logged in!

---

## 🎯 What's Already Done

✅ Server code configured  
✅ OAuth routes set up  
✅ Session management ready  
✅ Login page updated  
✅ Dependencies installed  

**You only need to add your Google credentials!**

---

## 📚 Need More Details?

- **Detailed setup guide:** See `GOOGLE_OAUTH_SETUP.md`
- **What was fixed:** See `OAUTH_FIX_README.md`

---

## ⚠️ Troubleshooting

**"Redirect URI mismatch"**  
Make sure you added EXACTLY: `http://localhost:3000/auth/google/callback`

**Button doesn't work**  
Check that you updated both `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`

**Still having issues?**  
Check `GOOGLE_OAUTH_SETUP.md` for detailed troubleshooting steps.

---

## 🔒 Security Note

Never commit your `.env` file to git! It's already in `.gitignore` ✅
