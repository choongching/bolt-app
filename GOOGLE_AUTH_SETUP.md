# Google Authentication Setup Guide

## Current Issue Analysis

Based on your error, here are the most likely causes and solutions:

### 1. Supabase Configuration Issues

**Check your Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/vmrwthjeyyxvkjrielwx
2. Navigate to: **Authentication** → **URL Configuration**
3. Verify these settings:

```
Site URL: https://wanderlust-spinner.netlify.app
Additional Redirect URLs:
- https://wanderlust-spinner.netlify.app
- https://wanderlust-spinner.netlify.app/**
- https://wanderlust-spinner.netlify.app/auth/callback
```

### 2. Google Cloud Console Configuration

**Your Google OAuth Client needs these redirect URIs:**

1. Go to: https://console.cloud.google.com/
2. Navigate to: **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID
4. Add these **Authorized redirect URIs**:

```
https://lpxknltghrlinkjngjhs.supabase.com/auth/v1/callback
```

**IMPORTANT**: Make sure it's `.com` not `.co`

### 3. Supabase Google Provider Setup

1. In Supabase Dashboard: **Authentication** → **Providers**
2. **Enable Google** provider
3. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console

### 4. Environment Variables Check

Verify in Netlify:
```
VITE_SUPABASE_URL=https://lpxknltghrlinkjngjhs.supabase.com
VITE_SUPABASE_ANON_KEY=[your-anon-key]
```

### 5. Common Issues & Solutions

**Issue**: "This site can't be reached"
**Solution**: Wrong Supabase URL (should be .com not .co)

**Issue**: "Invalid redirect URL"
**Solution**: Mismatch between Google Console and Supabase redirect URLs

**Issue**: "Provider not enabled"
**Solution**: Google provider not enabled in Supabase

### 6. Testing Steps

1. **Clear browser cache and cookies**
2. **Open browser dev tools** (F12)
3. **Go to Console tab**
4. **Try Google login**
5. **Check for error messages**

### 7. Debug Information

Use the debug component in your app to check:
- Current Supabase URL
- Environment variables
- Connection status

### 8. Expected OAuth Flow

1. User clicks "Continue with Google"
2. Redirect to: `https://lpxknltghrlinkjngjhs.supabase.com/auth/v1/authorize?provider=google&redirect_to=...`
3. Supabase redirects to Google
4. User authenticates with Google
5. Google redirects back to Supabase callback
6. Supabase redirects to your app with auth tokens

### 9. If Still Not Working

**Check these in order:**

1. **Supabase URL is correct** (.com not .co)
2. **Google provider is enabled** in Supabase
3. **Redirect URLs match** between Google Console and Supabase
4. **Environment variables are correct** in Netlify
5. **Site has been redeployed** after changes

### 10. Quick Fix Checklist

- [ ] Supabase URL ends with `.com`
- [ ] Google provider enabled in Supabase
- [ ] Google OAuth client has correct redirect URI
- [ ] Netlify environment variables are correct
- [ ] Site redeployed after changes
- [ ] Browser cache cleared

The most common issue is the URL mismatch - make sure everything uses `.com` not `.co`.