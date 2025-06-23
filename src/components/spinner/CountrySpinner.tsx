import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Globe, 
  RotateCcw, 
  Filter, 
  MapPin, 
  Users, 
  Mountain, 
  Compass,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { Country, CountryFilter } from '@/types/country';
import { useCountrySpin } from '@/hooks/useCountrySpin';
import { getAllAdventureLevels, getAllTravelerTypes, getAllRegions } from '@/data/countries';
import CountryGlobe from '@/components/globe/CountryGlobe';

interface CountrySpinnerProps {
  onCountrySelected: (country: Country) => void;
  onBack: () => void;
}

const CountrySpinner: React.FC<CountrySpinnerProps> = ({ onCountrySelected, onBack }) => {
  const {
    currentCountry,
    isSpinning,
    sessionStats,
    availableCountries,
    spinCountry,
    resetSession,
    updatePreferences,
    updateAvailableCountries
  } = useCountrySpin();

  const [filter, setFilter] = useState<CountryFilter>({});
  const [showFilters, setShowFilters] = useState(false);
  const [spinPhase, setSpinPhase] = useState<'idle' | 'spinning' | 'selecting' | 'complete'>('idle');

  // Handle spin button click
  const handleSpin = async () => {
    setSpinPhase('spinning');
    
    // Start spinning animation
    setTimeout(() => setSpinPhase('selecting'), 2000);
    
    const result = await spinCountry(filter);
    
    if (result) {
      setSpinPhase('complete');
      setTimeout(() => {
        onCountrySelected(result.country);
      }, 1500);
    } else {
      setSpinPhase('idle');
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof CountryFilter, value: string | undefined) => {
    const newFilter = { ...filter };
    if (value && value !== 'all') {
      newFilter[key] = value as any;
    } else {
      delete newFilter[key];
    }
    setFilter(newFilter);
    updateAvailableCountries(newFilter);
    
    // Update session preferences for adventure level and traveler type
    if (key === 'adventureLevel' || key === 'travelerType') {
      updatePreferences({ [key]: value });
    }
  };

  // Handle country selection from globe
  const handleGlobeCountrySelect = (country: Country) => {
    onCountrySelected(country);
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Globe */}
      <CountryGlobe
        onCountrySelected={handleGlobeCountrySelect}
        availableCountries={availableCountries}
        isSpinning={spinPhase === 'spinning'}
        targetCountry={currentCountry}
      />

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header */}
        <div className="absolute top-6 left-6 right-6 z-20 pointer-events-auto">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              ← Back
            </Button>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">Country Spinner</h1>
              <p className="text-white/80 text-sm">Discover your next adventure destination</p>
            </div>

            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-6 right-6 z-20 pointer-events-auto"
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Filter Countries</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-white/80 text-sm font-medium mb-2 block">
                      Adventure Level
                    </label>
                    <Select
                      value={filter.adventureLevel || 'all'}
                      onValueChange={(value) => handleFilterChange('adventureLevel', value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Any level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Level</SelectItem>
                        {getAllAdventureLevels().map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-white/80 text-sm font-medium mb-2 block">
                      Traveler Type
                    </label>
                    <Select
                      value={filter.travelerType || 'all'}
                      onValueChange={(value) => handleFilterChange('travelerType', value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Any type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Type</SelectItem>
                        {getAllTravelerTypes().map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-white/80 text-sm font-medium mb-2 block">
                      Region
                    </label>
                    <Select
                      value={filter.region || 'all'}
                      onValueChange={(value) => handleFilterChange('region', value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/30 text-white">
                        <SelectValue placeholder="Any region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Region</SelectItem>
                        {getAllRegions().map(region => (
                          <SelectItem key={region} value={region}>{region}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Spin Control */}
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-auto">
          <AnimatePresence mode="wait">
            {spinPhase === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
                  <CardContent className="text-center space-y-6">
                    <div className="relative">
                      <Globe className="w-20 h-20 text-white mx-auto mb-4" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0"
                      >
                        <Compass className="w-6 h-6 text-yellow-300 absolute top-2 right-6" />
                      </motion.div>
                    </div>
                    
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Ready to Explore?</h2>
                      <p className="text-white/80 mb-6">
                        Spin the globe to discover your next adventure destination
                      </p>
                    </div>

                    <Button
                      onClick={handleSpin}
                      size="lg"
                      disabled={isSpinning || availableCountries.length === 0}
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Globe className="w-5 h-5 mr-2" />
                      Spin the Globe
                    </Button>

                    {availableCountries.length === 0 && (
                      <p className="text-red-400 text-sm">
                        No countries match your filters. Try adjusting your preferences.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {spinPhase === 'spinning' && (
              <motion.div
                key="spinning"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
                  <CardContent className="text-center space-y-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Globe className="w-20 h-20 text-yellow-400 mx-auto" />
                    </motion.div>
                    
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Spinning the Globe...</h2>
                      <p className="text-white/80">
                        Finding your perfect destination
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {spinPhase === 'selecting' && (
              <motion.div
                key="selecting"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
                  <CardContent className="text-center space-y-6">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      <MapPin className="w-20 h-20 text-red-500 mx-auto" />
                    </motion.div>
                    
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Selecting Destination...</h2>
                      <p className="text-white/80">
                        Pinpointing your adventure
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {spinPhase === 'complete' && currentCountry && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
                  <CardContent className="text-center space-y-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <MapPin className="w-20 h-20 text-green-500 mx-auto" />
                    </motion.div>
                    
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">Destination Found!</h2>
                      <h3 className="text-2xl font-semibold text-yellow-400 mb-2">
                        {currentCountry.name}
                      </h3>
                      <p className="text-white/80 mb-4">
                        {currentCountry.tagline}
                      </p>
                      
                      <div className="flex justify-center space-x-2 mb-4">
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {currentCountry.adventureLevel}
                        </Badge>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {currentCountry.region}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-white/70 text-sm">
                      Preparing your adventure details...
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Session Stats */}
        {sessionStats && (
          <div className="absolute bottom-6 left-6 z-20 pointer-events-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="text-white text-sm space-y-2">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span>Session Stats</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-white/60">Countries Visited</div>
                      <div className="font-semibold">{sessionStats.totalSpins}</div>
                    </div>
                    <div>
                      <div className="text-white/60">Regions Explored</div>
                      <div className="font-semibold">{sessionStats.uniqueRegions}</div>
                    </div>
                    <div>
                      <div className="text-white/60">Remaining</div>
                      <div className="font-semibold">{sessionStats.remainingCountries}</div>
                    </div>
                    <div>
                      <Button
                        onClick={resetSession}
                        size="sm"
                        variant="outline"
                        className="bg-white/10 border-white/30 text-white hover:bg-white/20 h-6 text-xs"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CountrySpinner;