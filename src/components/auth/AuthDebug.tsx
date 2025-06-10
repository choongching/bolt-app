import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AuthDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkConfiguration();
  }, []);

  const checkConfiguration = async () => {
    const info = {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing',
      currentUrl: window.location.origin,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      urlCheck: {
        hasCorrectDomain: import.meta.env.VITE_SUPABASE_URL?.includes('.supabase.com'),
        isNotCoDomain: !import.meta.env.VITE_SUPABASE_URL?.includes('.supabase.co'),
      }
    };

    setDebugInfo(info);
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log('Session test:', { data, error });
      
      const { data: user, error: userError } = await supabase.auth.getUser();
      console.log('User test:', { user, userError });

      // Test if we can reach Supabase
      const healthCheck = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        }
      }).then(res => res.ok).catch(() => false);

      setDebugInfo(prev => ({
        ...prev,
        sessionTest: { data, error: error?.message },
        userTest: { user, error: userError?.message },
        healthCheck: healthCheck ? 'Connected' : 'Failed',
      }));
    } catch (err) {
      console.error('Connection test failed:', err);
      setDebugInfo(prev => ({
        ...prev,
        connectionError: err.message,
      }));
    } finally {
      setLoading(false);
    }
  };

  const testGoogleAuth = async () => {
    setLoading(true);
    try {
      console.log('Testing Google OAuth...');
      
      // Don't actually trigger the OAuth, just test the URL construction
      const redirectUrl = window.location.origin.includes('localhost') 
        ? 'http://localhost:8080/' 
        : 'https://wanderlust-spinner.netlify.app/';
      
      const expectedAuthUrl = `${import.meta.env.VITE_SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectUrl)}`;
      
      setDebugInfo(prev => ({
        ...prev,
        googleAuthTest: {
          redirectUrl,
          expectedAuthUrl,
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
          status: 'URL constructed (not executed)',
        },
      }));
    } catch (err) {
      console.error('Google auth test failed:', err);
      setDebugInfo(prev => ({
        ...prev,
        googleAuthError: err.message,
      }));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (condition: boolean, trueText: string, falseText: string) => {
    return (
      <Badge variant={condition ? "default" : "destructive"}>
        {condition ? trueText : falseText}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuration Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Supabase URL</label>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-gray-100 p-1 rounded">{debugInfo.supabaseUrl}</code>
                {getStatusBadge(debugInfo.urlCheck?.hasCorrectDomain, "✓ .com", "✗ Wrong domain")}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Anon Key</label>
              <div className="flex items-center gap-2">
                <span className="text-sm">{debugInfo.supabaseAnonKey}</span>
                {getStatusBadge(debugInfo.supabaseAnonKey === 'Present', "✓ Present", "✗ Missing")}
              </div>
            </div>
          </div>
          
          {debugInfo.healthCheck && (
            <div>
              <label className="text-sm font-medium">Supabase Connection</label>
              <div className="flex items-center gap-2">
                <span className="text-sm">{debugInfo.healthCheck}</span>
                {getStatusBadge(debugInfo.healthCheck === 'Connected', "✓ Connected", "✗ Failed")}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-96">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </CardContent>
      </Card>
      
      <div className="flex gap-2">
        <Button onClick={testConnection} disabled={loading}>
          Test Supabase Connection
        </Button>
        <Button onClick={testGoogleAuth} disabled={loading} variant="outline">
          Test Google OAuth URL
        </Button>
      </div>
      
      {loading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Testing...</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Fixes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm space-y-1">
            <p><strong>1. Check Supabase URL:</strong> Must end with .com not .co</p>
            <p><strong>2. Enable Google Provider:</strong> In Supabase Dashboard → Authentication → Providers</p>
            <p><strong>3. Set Redirect URLs:</strong> In Google Cloud Console and Supabase</p>
            <p><strong>4. Clear Cache:</strong> Clear browser cache and cookies</p>
            <p><strong>5. Redeploy:</strong> Redeploy your Netlify site after changes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthDebug;