# Authentication Troubleshooting Guide

## URGENT FIX: Incorrect Supabase URL

### The Problem
Your Supabase URL is incorrect in the environment variables:
- **Current (Wrong)**: `https://lpxknltghrlinkjngjhs.supabase.co`
- **Correct**: `https://lpxknltghrlinkjngjhs.supabase.com`

### Step 1: Fix Netlify Environment Variables

1. **Go to your Netlify dashboard**
2. **Navigate to**: Site settings → Environment variables
3. **Update this variable**:
   ```
   VITE_SUPABASE_URL=https://lpxknltghrlinkjngjhs.supabase.com
   ```
   (Change `.co` to `.com`)

4. **Keep this variable as is**:
   ```
   VITE_SUPABASE_ANON_KEY=[your-anon-key]
   ```

5. **Deploy the site** after making this change

### Step 2: Update Supabase Configuration

1. **Go to your Supabase dashboard**
   - URL: https://supabase.com/dashboard/project/vmrwthjeyyxvkjrielwx

2. **Navigate to**: Authentication → URL Configuration

3. **Set Site URL**:
   ```
   https://wanderlust-spinner.netlify.app
   ```

4. **Add Redirect URLs**:
   ```
   https://wanderlust-spinner.netlify.app
   https://wanderlust-spinner.netlify.app/**
   https://wanderlust-spinner.netlify.app/auth/callback
   ```

### Step 3: Configure Google OAuth (if not done)

1. **Google Cloud Console**
   - Go to: https://console.cloud.google.com/
   - Navigate to: APIs & Services → Credentials
   - Find your OAuth 2.0 Client ID

2. **Add Authorized redirect URIs**:
   ```
   https://lpxknltghrlinkjngjhs.supabase.com/auth/v1/callback
   ```
   (Note: Use `.com` not `.co`)

3. **In Supabase Dashboard**
   - Go to: Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials

### Step 4: Test After Changes

1. **Clear browser cache and cookies**
2. **Try Google login again**
3. **Use the debug component** to verify the URL is correct

### Why This Happened

Supabase URLs should end with `.com`, but somehow `.co` was used in the configuration. This is a common typo that causes authentication to fail because the OAuth provider can't reach the correct Supabase endpoint.

### Expected Result

After fixing the URL, the Google OAuth flow should work:
1. Click "Continue with Google"
2. Redirect to Google login
3. After Google authentication, redirect back to your app
4. User should be logged in successfully

### If Still Not Working

If you still have issues after fixing the URL:

1. **Check the debug component** for any remaining errors
2. **Verify all URLs match** between Google Cloud Console and Supabase
3. **Clear all browser data** and try again
4. **Check browser console** for any error messages

The URL fix should resolve the "This site can't be reached" error you're seeing.