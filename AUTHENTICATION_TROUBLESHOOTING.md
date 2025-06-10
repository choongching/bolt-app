# Authentication Troubleshooting Guide

## Current Issue: Google Authentication Not Working

### Step 1: Check Supabase Configuration

1. **Verify Environment Variables**
   - Go to your Netlify dashboard
   - Navigate to: Site settings → Environment variables
   - Ensure these variables are set:
     ```
     VITE_SUPABASE_URL=https://lpxknltghrlinkjngjhs.supabase.co
     VITE_SUPABASE_ANON_KEY=[your-anon-key]
     ```

2. **Check Supabase Project Settings**
   - Go to: https://supabase.com/dashboard/project/vmrwthjeyyxvkjrielwx
   - Navigate to: Authentication → URL Configuration
   - Set **Site URL**: `https://wanderlust-spinner.netlify.app`
   - Add **Redirect URLs**:
     - `https://wanderlust-spinner.netlify.app`
     - `https://wanderlust-spinner.netlify.app/**`
     - `https://wanderlust-spinner.netlify.app/auth/callback`

### Step 2: Configure Google OAuth

1. **Google Cloud Console Setup**
   - Go to: https://console.cloud.google.com/
   - Navigate to: APIs & Services → Credentials
   - Find your OAuth 2.0 Client ID
   - Add **Authorized redirect URIs**:
     - `https://lpxknltghrlinkjngjhs.supabase.co/auth/v1/callback`

2. **Supabase Google Provider Setup**
   - In Supabase dashboard: Authentication → Providers
   - Enable Google provider
   - Add your Google OAuth credentials:
     - Client ID from Google Cloud Console
     - Client Secret from Google Cloud Console

### Step 3: Test the Configuration

1. **Use the Debug Component**
   - Click "Show Debug Info" on the login screen
   - Check for any configuration issues
   - Test Supabase connection
   - Test Google OAuth flow

2. **Check Browser Console**
   - Open browser developer tools
   - Look for any error messages
   - Check Network tab for failed requests

### Step 4: Common Issues and Solutions

#### Issue: "This site can't be reached"
**Solution**: Check if Supabase URL is correct and accessible
- Verify VITE_SUPABASE_URL in environment variables
- Test URL directly in browser

#### Issue: "Invalid redirect URL"
**Solution**: Ensure all redirect URLs are properly configured
- Check Supabase URL Configuration
- Verify Google OAuth redirect URIs

#### Issue: "Provider not enabled"
**Solution**: Enable Google provider in Supabase
- Go to Authentication → Providers
- Enable Google and add credentials

#### Issue: "Invalid client configuration"
**Solution**: Check Google OAuth setup
- Verify Client ID and Secret in Supabase
- Ensure OAuth consent screen is configured

### Step 5: Manual Testing Steps

1. **Test Supabase Connection**
   ```javascript
   // Open browser console and run:
   fetch('https://lpxknltghrlinkjngjhs.supabase.co/rest/v1/', {
     headers: {
       'apikey': 'your-anon-key',
       'Authorization': 'Bearer your-anon-key'
     }
   }).then(r => r.json()).then(console.log)
   ```

2. **Test OAuth URL**
   - Try accessing this URL directly:
   ```
   https://lpxknltghrlinkjngjhs.supabase.co/auth/v1/authorize?provider=google&redirect_to=https://wanderlust-spinner.netlify.app/
   ```

### Step 6: Alternative Solutions

If Google OAuth continues to fail, consider these alternatives:

1. **Email/Password Authentication**
   - Implement email/password signup
   - Add password reset functionality

2. **Magic Link Authentication**
   - Use Supabase magic links
   - Simpler setup, no OAuth required

3. **Different OAuth Provider**
   - Try GitHub or Discord OAuth
   - Often easier to configure

### Debug Information to Collect

When reporting issues, please provide:

1. **Browser Console Errors**
2. **Network Tab Requests/Responses**
3. **Supabase Dashboard Screenshots**
4. **Google Cloud Console Configuration**
5. **Environment Variables (without sensitive data)**

### Contact Support

If issues persist:
1. Check Supabase documentation: https://supabase.com/docs/guides/auth
2. Supabase Discord: https://discord.supabase.com/
3. Google OAuth documentation: https://developers.google.com/identity/protocols/oauth2