import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useDestinations } from '@/hooks/useDestinations';
import { Destination, TravelerType } from '@/types/destination';
import { Country, TravelStyle } from '@/types/country';

// Import all spinner components
import WelcomeScreen from './spinner/WelcomeScreen';
import CountrySpinner from './spinner/CountrySpinner';
import DestinationReveal from './spinner/DestinationReveal';
import DestinationExplorer from './spinner/DestinationExplorer';
import UserAccount from './spinner/UserAccount';
import UserProfile from './auth/UserProfile';
import UserProfilePage from './profile/UserProfilePage';

type SpinnerStep = 'welcome' | 'globe-zoom' | 'country-spinner' | 'reveal' | 'explore' | 'account' | 'profile';

const TravelSpinner: React.FC = () => {
  const { user } = useAuth();
  const { saveDestination, recordSpin, isDestinationSaved } = useDestinations();
  
  const [currentStep, setCurrentStep] = useState<SpinnerStep>('welcome');
  const [selectedTravelStyle, setSelectedTravelStyle] = useState<TravelStyle>('Solo');
  const [currentDestination, setCurrentDestination] = useState<Destination | null>(null);
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);

  // Handle travel style selection with globe zoom transition
  const handleTravelStyleSelect = (style: TravelStyle) => {
    setSelectedTravelStyle(style);
    // First trigger the globe zoom transition
    setCurrentStep('globe-zoom');
    
    // After a short delay, transition to the spinning phase
    setTimeout(() => {
      setCurrentStep('country-spinner');
    }, 2000); // 2 second delay for the zoom effect
  };

  const handleCountrySelected = (country: Country) => {
    setCurrentCountry(country);
    
    // Convert country to destination format for compatibility
    const destination: Destination = {
      id: country.isoCode,
      name: country.name,
      country: country.name,
      city: country.capital,
      latitude: country.coordinates.lat,
      longitude: country.coordinates.lng,
      tagline: country.tagline,
      budget_estimate: '$50-200/day', // Default, will be updated with real data
      best_time_to_visit: country.bestTimeToVisit || 'Year-round',
      visa_requirements: 'Check requirements for your nationality',
      activities: country.highlights || ['Sightseeing', 'Culture', 'Adventure'],
      description: `Explore ${country.name}, ${country.tagline.toLowerCase()}`
    };
    
    setCurrentDestination(destination);
    
    // Record the spin with travel style
    const travelerTypeMap: { [key in TravelStyle]: TravelerType } = {
      'Romantic': 'couple',
      'Family': 'family',
      'Solo': 'solo'
    };
    
    recordSpin(destination.name, travelerTypeMap[selectedTravelStyle]);
    
    setCurrentStep('reveal');
  };

  const handleSaveDestination = async () => {
    if (currentDestination) {
      await saveDestination(currentDestination);
    }
  };

  const handleExploreDestination = () => {
    setCurrentStep('explore');
  };

  const handleSpinAgain = () => {
    setCurrentDestination(null);
    setCurrentCountry(null);
    setCurrentStep('country-spinner');
  };

  const handleBackToWelcome = () => {
    setCurrentStep('welcome');
    setCurrentDestination(null);
    setCurrentCountry(null);
  };

  const handleBackToReveal = () => {
    setCurrentStep('reveal');
  };

  const handleShowAccount = () => {
    setCurrentStep('account');
  };

  const handleShowProfile = () => {
    setCurrentStep('profile');
  };

  const handleBackToSpinner = () => {
    setCurrentStep('welcome');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {currentStep === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <WelcomeScreen 
              onTravelStyleSelect={handleTravelStyleSelect}
              isAuthenticated={!!user}
            />
          </motion.div>
        )}

        {currentStep === 'globe-zoom' && (
          <motion.div
            key="globe-zoom"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black relative overflow-hidden"
          >
            {/* Globe Zoom Transition Effect */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0.7, z: -100 }}
              animate={{ scale: 1.5, opacity: 1, z: 0 }}
              transition={{ 
                duration: 2, 
                ease: [0.25, 0.46, 0.45, 0.94] 
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-96 h-96 rounded-full bg-gradient-to-br from-blue-500 via-green-500 to-blue-700 shadow-2xl">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-transparent via-white/10 to-transparent animate-pulse" />
              </div>
            </motion.div>

            {/* Transition Text */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-center"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Zooming into Adventure!
                </h2>
                <p className="text-white/80 text-xl">
                  Preparing your {selectedTravelStyle} journey...
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}

        {currentStep === 'country-spinner' && (
          <motion.div
            key="country-spinner"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <CountrySpinner 
              onCountrySelected={handleCountrySelected}
              onBack={handleBackToWelcome}
              travelStyle={selectedTravelStyle}
              autoStart={true}
            />
          </motion.div>
        )}

        {currentStep === 'reveal' && currentDestination && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.5 }}
          >
            <DestinationReveal 
              destination={currentDestination}
              onSave={handleSaveDestination}
              onExplore={handleExploreDestination}
              onSpinAgain={handleSpinAgain}
              isSaved={isDestinationSaved(currentDestination.name)}
            />
          </motion.div>
        )}

        {currentStep === 'explore' && currentDestination && (
          <motion.div
            key="explore"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <DestinationExplorer 
              destination={currentDestination}
              onBack={handleBackToReveal}
              onSave={handleSaveDestination}
            />
          </motion.div>
        )}

        {currentStep === 'account' && (
          <motion.div
            key="account"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.5 }}
          >
            <UserAccount 
              onBack={handleBackToSpinner}
            />
          </motion.div>
        )}

        {currentStep === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.5 }}
          >
            <UserProfilePage 
              onBack={handleBackToSpinner}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced User Profile Button */}
      {user && currentStep !== 'account' && currentStep !== 'profile' && currentStep !== 'globe-zoom' && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="fixed top-6 right-6 z-50"
        >
          <div className="bg-black/20 backdrop-blur-sm border border-white/20 rounded-full p-1 shadow-lg">
            <UserProfile onProfileClick={handleShowProfile} />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TravelSpinner;