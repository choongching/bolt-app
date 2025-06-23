import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Globe, 
  Filter, 
  MapPin, 
  Mountain, 
  Compass,
  TrendingUp,
  RefreshCw,
  Heart,
  Users,
  User,
  ArrowLeft
} from 'lucide-react';
import { Country, CountryFilter, TravelStyle } from '@/types/country';
import { useCountrySpin } from '@/hooks/useCountrySpin';
import { getAllAdventureLevels, getAllRegions } from '@/data/countries';

interface CountrySpinnerProps {
  onCountrySelected: (country: Country) => void;
  onBack: () => void;
  travelStyle: TravelStyle;
}

const CountrySpinner: React.FC<CountrySpinnerProps> = ({ onCountrySelected, onBack, travelStyle }) => {
  const {
    currentCountry,
    isSpinning,
    sessionStats,
    availableCountries,
    spinCountry,
    resetSession,
    updatePreferences,
    updateAvailableCountries
  } = useCountrySpin(travelStyle);

  const [filter, setFilter] = useState<CountryFilter>({ travelStyle });
  const [showFilters, setShowFilters] = useState(false);
  const [spinPhase, setSpinPhase] = useState<'idle' | 'spinning' | 'selecting' | 'complete'>('idle');

  // Update filter when travel style changes
  useEffect(() => {
    setFilter({ travelStyle });
    updateAvailableCountries({ travelStyle });
  }, [travelStyle, updateAvailableCountries]);

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
    
    // Update session preferences for adventure level
    if (key === 'adventureLevel') {
      updatePreferences({ [key]: value });
    }
  };

  // Get travel style icon and info
  const getTravelStyleInfo = () => {
    switch (travelStyle) {
      case 'Romantic':
        return {
          icon: Heart,
          color: 'from-pink-500 to-red-500',
          description: 'Perfect destinations for couples and romantic getaways'
        };
      case 'Family':
        return {
          icon: Users,
          color: 'from-green-500 to-blue-500',
          description: 'Family-friendly destinations with activities for all ages'
        };
      case 'Solo':
        return {
          icon: User,
          color: 'from-purple-500 to-indigo-500',
          description: 'Perfect for solo travelers seeking adventure and self-discovery'
        };
    }
  };

  const styleInfo = getTravelStyleInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-6 left-6 right-6 z-20">
        <div className="flex items-center justify-between">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${styleInfo.color} flex items-center justify-center mr-3`}>
                <styleInfo.icon className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">{travelStyle} Travel</h1>
            </div>
            <p className="text-white/80 text-sm max-w-md">{styleInfo.description}</p>
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
            className="absolute top-24 left-6 right-6 z-20"
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-lg">Filter {travelStyle} Destinations</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
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
      <div className="absolute inset-0 flex items-center justify-center z-10">
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
                    <h2 className="text-3xl font-bold text-white mb-2">Ready for {travelStyle} Adventure?</h2>
                    <p className="text-white/80 mb-6">
                      Spin the globe to discover your perfect {travelStyle.toLowerCase()} destination
                    </p>
                    
                    <div className="flex justify-center mb-4">
                      <Badge variant="secondary" className={`bg-gradient-to-r ${styleInfo.color} text-white border-0`}>
                        {availableCountries.length} {travelStyle} destinations available
                      </Badge>
                    </div>
                  </div>

                  <Button
                    onClick={handleSpin}
                    size="lg"
                    disabled={isSpinning || availableCountries.length === 0}
                    className={`bg-gradient-to-r ${styleInfo.color} hover:opacity-90 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-300`}
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Spin for {travelStyle} Destination
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
                      Finding your perfect {travelStyle.toLowerCase()} destination
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
                      Pinpointing your {travelStyle.toLowerCase()} adventure
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
                    <h2 className="text-3xl font-bold text-white mb-2">{travelStyle} Destination Found!</h2>
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
                      <Badge variant="secondary" className={`bg-gradient-to-r ${styleInfo.color} text-white border-0`}>
                        {travelStyle}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-white/70 text-sm">
                    Preparing your {travelStyle.toLowerCase()} adventure details...
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Session Stats */}
      {sessionStats && (
        <div className="absolute bottom-6 left-6 z-20">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="text-white text-sm space-y-2">
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  <span>{travelStyle} Session Stats</span>
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
  );
};

export default CountrySpinner;