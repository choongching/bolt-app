import React from 'react';
import TravelSpinner from '@/components/TravelSpinner';
import AuthContainer from '@/components/auth/AuthContainer';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();

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
          </div>
        </div>
      </div>
    );
  }

  // User is authenticated, show the full experience
  return <TravelSpinner />;
};

export default Index;