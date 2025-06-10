import React, { useState } from 'react';
import TravelSpinner from '@/components/TravelSpinner';
import AuthContainer from '@/components/auth/AuthContainer';
import AuthDebug from '@/components/auth/AuthDebug';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user, loading } = useAuth();
  const [showDebug, setShowDebug] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your travel experience...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show auth overlay
  if (!user) {
    return (
      <div className="relative min-h-screen">
        {/* Background with Travel Spinner */}
        <div className="absolute inset-0">
          <TravelSpinner />
        </div>
        
        {/* Auth Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome to Travel Spinner</h2>
              <p className="text-white/80">Sign in to save your discoveries and create personalized travel plans</p>
            </div>
            <AuthContainer />
            
            {/* Debug toggle button */}
            <div className="mt-6 text-center">
              <Button 
                onClick={() => setShowDebug(!showDebug)} 
                variant="outline" 
                size="sm"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                {showDebug ? 'Hide' : 'Show'} Debug Info
              </Button>
            </div>
          </div>
        </div>

        {/* Debug overlay - HIGHEST Z-INDEX */}
        {showDebug && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            style={{ zIndex: 9999 }}
          >
            <div 
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
              style={{ zIndex: 10000 }}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-white border-b pb-4">
                  <h2 className="text-xl font-bold">Debug Information</h2>
                  <Button 
                    onClick={() => setShowDebug(false)} 
                    variant="outline" 
                    size="sm"
                    className="hover:bg-gray-100"
                  >
                    Close
                  </Button>
                </div>
                <AuthDebug />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // User is authenticated, show the full experience
  return (
    <div className="relative">
      <TravelSpinner />
      
      {/* Debug toggle for authenticated users - floating button */}
      <div className="fixed top-4 right-4 z-50">
        <Button 
          onClick={() => setShowDebug(!showDebug)} 
          variant="outline" 
          size="sm"
          className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          {showDebug ? 'Hide' : 'Show'} Debug
        </Button>
      </div>

      {/* Debug overlay for authenticated users - HIGHEST Z-INDEX */}
      {showDebug && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
            style={{ zIndex: 10000 }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-4 sticky top-0 bg-white border-b pb-4">
                <h2 className="text-xl font-bold">Debug Information</h2>
                <Button 
                  onClick={() => setShowDebug(false)} 
                  variant="outline" 
                  size="sm"
                  className="hover:bg-gray-100"
                >
                  Close
                </Button>
              </div>
              <AuthDebug />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;