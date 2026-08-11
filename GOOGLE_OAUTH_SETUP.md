# Google OAuth Setup Guide

This guide will help you set up Google OAuth authentication for the WorkNear application.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter project name (e.g., "WorkNear Authentication")
5. Click "Create"

### 2. Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "+ CREATE CREDENTIALS" at the top
3. Select "OAuth client ID"
4. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in:
     - App name: `WorkNear`
     - User support email: Your email
     - Developer contact email: Your email
   - Click "Save and Continue"
   - Skip "Scopes" section
   - Add test users (your email) if needed
   - Click "Save and Continue"

5. Create OAuth Client ID:
   - Application type: **Web application**
   - Name: `WorkNear Web Client`
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - Add production URL when deployed
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback`
     - Add production callback URL when deployed
   - Click "Create"

6. Copy the **Client ID** and **Client Secret**

### 4. Configure Environment Variables

1. Open the `.env` file in the project root
2. Update the following variables with your credentials:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
APP_URL=http://localhost:3000
SESSION_SECRET=generate-a-random-secret-key
```

**Important:** Never commit the `.env` file to version control!

### 5. Restart the Development Server

```bash
npm run dev
```

### 6. Test Google Login

1. Open `http://localhost:3000` in your browser
2. Click "Continue with Google" button
3. Select your Google account
4. Grant permissions
5. You should be redirected back and logged in successfully

## Production Deployment

When deploying to production:

1. Create new OAuth credentials with production URLs
2. Update `.env` with production values:
   - `APP_URL`: Your production domain (e.g., `https://worknear.com`)
   - Authorized JavaScript origins: `https://worknear.com`
   - Authorized redirect URIs: `https://worknear.com/auth/google/callback`
3. Generate a strong random string for `SESSION_SECRET`
4. Set `NODE_ENV=production`

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Verify the redirect URI in Google Cloud Console exactly matches: `http://localhost:3000/auth/google/callback`
- Make sure there are no trailing slashes

### Error: "Access blocked: Authorization Error"
- Make sure you've configured the OAuth consent screen
- Add your email as a test user in the OAuth consent screen

### Error: "Missing credentials"
- Double-check your `.env` file has the correct `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Restart the server after updating `.env`

### Session not persisting
- Check that `SESSION_SECRET` is set in `.env`
- Make sure cookies are enabled in your browser

## Security Best Practices

1. **Never commit credentials** - Keep `.env` in `.gitignore`
2. **Use environment variables** - Never hardcode credentials
3. **Rotate secrets** - Change `SESSION_SECRET` periodically
4. **HTTPS in production** - Always use HTTPS for OAuth in production
5. **Validate redirect URIs** - Only whitelist trusted domains

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Google OAuth Strategy](http://www.passportjs.org/packages/passport-google-oauth20/)
- [Express Session Documentation](https://github.com/expressjs/session)
