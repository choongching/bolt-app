import React from 'react';
import TravelSpinner from '@/components/TravelSpinner';
import AuthContainer from '@/components/auth/AuthContainer';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your travel experience..." />
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
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-200">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to WanderSpin!
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                Log in to spin and find your perfect escape
              </p>
            </div>
            
            <div className="space-y-4">
              <AuthContainer />
              
              <div className="text-center pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <TravelSpinner />;
};

export default Index;