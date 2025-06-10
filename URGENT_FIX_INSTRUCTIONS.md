# 🚨 URGENT FIX: Incorrect Supabase URL

## The Problem (Confirmed by Debug Panel)
Your Supabase URL is **WRONG**:
- **Current (Broken)**: `https://lpxknltghrlinkjngjhs.supabase.co` ❌
- **Correct**: `https://lpxknltghrlinkjngjhs.supabase.com` ✅

## Step 1: Fix Netlify Environment Variables (CRITICAL)

1. **Go to Netlify Dashboard**: https://app.netlify.com/
2. **Find your site**: wanderlust-spinner
3. **Go to**: Site settings → Environment variables
4. **Update this variable**:
   ```
   VITE_SUPABASE_URL=https://lpxknltghrlinkjngjhs.supabase.com
   ```
   **CHANGE `.co` TO `.com`**

5. **Click "Save"**
6. **Redeploy your site** (trigger a new deployment)

## Step 2: Update Google OAuth Redirect URI

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Navigate to**: APIs & Services → Credentials
3. **Find your OAuth 2.0 Client ID**
4. **Update the redirect URI to**:
   ```
   https://lpxknltghrlinkjngjhs.supabase.com/auth/v1/callback
   ```
   **Make sure it's `.com` not `.co`**

## Step 3: Verify Supabase Settings

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard/project/vmrwthjeyyxvkjrielwx
2. **Check Authentication → URL Configuration**:
   - Site URL: `https://wanderlust-spinner.netlify.app`
   - Redirect URLs: `https://wanderlust-spinner.netlify.app/**`

## Step 4: Test the Fix

1. **Wait for Netlify deployment to complete**
2. **Clear browser cache and cookies**
3. **Try Google login again**
4. **Check debug panel** - URL should now show `.com`

## Why This Happened

Supabase URLs should always end with `.com`, but somehow `.co` was configured. This causes OAuth to fail because Google can't reach the correct Supabase callback endpoint.

## Expected Result

After fixing the URL:
- Debug panel will show: `https://lpxknltghrlinkjngjhs.supabase.com` ✅
- Google login will work properly
- No more "This site can't be reached" errors

**This is a simple but critical fix - just change `.co` to `.com` in your Netlify environment variables!**