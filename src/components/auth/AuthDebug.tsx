import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

      setDebugInfo(prev => ({
        ...prev,
        sessionTest: { data, error: error?.message },
        userTest: { user, error: userError?.message },
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
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      console.log('Google OAuth test result:', { data, error });
      
      setDebugInfo(prev => ({
        ...prev,
        googleAuthTest: { data, error: error?.message },
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

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Authentication Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Configuration</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={testConnection} disabled={loading}>
              Test Supabase Connection
            </Button>
            <Button onClick={testGoogleAuth} disabled={loading} variant="outline">
              Test Google OAuth
            </Button>
          </div>
          
          {loading && (
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Testing...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthDebug;