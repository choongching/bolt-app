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
  ArrowLeft,
  Loader2,
  Zap
} from 'lucide-react';
import { Country, CountryFilter, TravelStyle } from '@/types/country';
import { useCountrySpin } from '@/hooks/useCountrySpin';
import { getAllAdventureLevels, getAllRegions } from '@/data/countries';
import CountryGlobe from '@/components/globe/CountryGlobe';

interface CountrySpinnerProps {
  onCountrySelected: (country: Country) => void;
  onBack: () => void;
  travelStyle: TravelStyle;
  autoStart?: boolean;
}

const CountrySpinner: React.FC<CountrySpinnerProps> = ({ 
  onCountrySelected, 
  onBack, 
  travelStyle, 
  autoStart = false 
}) => {
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
  const [spinPhase, setSpinPhase] = useState<'idle' | 'pin-drop' | 'zooming' | 'destination-found'>('idle');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showGlobe, setShowGlobe] = useState(true);

  // Auto-start spinning when component mounts if autoStart is true
  useEffect(() => {
    if (autoStart && !isSpinning && spinPhase === 'idle') {
      setTimeout(() => {
        handleSpin();
      }, 1000); // Small delay to ensure globe is loaded
    }
  }, [autoStart]);

  // Update filter when travel style changes
  useEffect(() => {
    setFilter({ travelStyle });
    updateAvailableCountries({ travelStyle });
  }, [travelStyle, updateAvailableCountries]);

  // Handle spin button click - Globe stays visible throughout
  const handleSpin = async () => {
    console.log('Starting spin process...');
    
    // Skip spinning phase, go directly to selection
    try {
      const result = await spinCountry(filter);
      
      if (result) {
        console.log('Country selected:', result.country.name);
        setSelectedCountry(result.country);
        setSpinPhase('pin-drop');
        
        // Phase 1: Pin drop effect
        setTimeout(() => {
          console.log('Pin drop phase complete, starting zoom...');
          setSpinPhase('zooming');
          
          // Phase 2: Show "Destination Found!" message after zoom
          setTimeout(() => {
            console.log('Zoom phase complete, showing destination found...');
            setSpinPhase('destination-found');
            
            // Phase 3: Transition to reveal after showing message
            setTimeout(() => {
              console.log('Transitioning to destination reveal...');
              onCountrySelected(result.country);
            }, 3000); // Show "Destination Found!" for 3 seconds
          }, 4000); // Wait for zoom animation to complete (4 seconds)
        }, 1500); // Pin drop duration
      } else {
        // If no country was selected, reset to idle
        console.log('No country selected, resetting to idle');
        setSpinPhase('idle');
        setSelectedCountry(null);
      }
    } catch (error) {
      console.error('Error during spin:', error);
      // Reset on error
      setSpinPhase('idle');
      setSelectedCountry(null);
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
      {/* 3D Globe Background - Always visible */}
      <div className="absolute inset-0 z-0">
        <CountryGlobe
          onCountrySelected={() => {}} // Disabled during spinning
          availableCountries={availableCountries}
          isSpinning={spinPhase === 'pin-drop' || spinPhase === 'zooming'} // Show spinning during these phases
          targetCountry={spinPhase === 'zooming' ? selectedCountry : null}
        />
      </div>

      {/* Header - only show when not in active spinning phases */}
      {(spinPhase === 'idle') && (
        <div className="absolute top-6 left-6 right-6 z-20">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              disabled={spinPhase !== 'idle'}
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
              disabled={spinPhase !== 'idle'}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      )}

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && spinPhase === 'idle' && (
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

      {/* Center Spin Control and Status Messages */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <AnimatePresence mode="wait">
          {spinPhase === 'idle' && !autoStart && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <Card className="bg-black/40 backdrop-blur-sm border-white/20 p-8">
                <CardContent className="text-center space-y-6">
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Zap className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                    </motion.div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      <Compass className="w-6 h-6 text-yellow-300 absolute top-2 right-6" />
                    </motion.div>
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Ready to Zap into Adventure?</h2>
                    <p className="text-white/80 mb-6">
                      Globe's a-whirl! Feel the Zappy vibes as it spins to your next big thrill!
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
                    <Zap className="w-5 h-5 mr-2" />
                    Zap into Adventure
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

          {spinPhase === 'pin-drop' && selectedCountry && (
            <motion.div
              key="pin-drop"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <Card className="bg-black/40 backdrop-blur-sm border-white/20 p-8">
                <CardContent className="text-center space-y-6">
                  <motion.div
                    initial={{ y: -100, scale: 0 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 10,
                      duration: 1
                    }}
                  >
                    <MapPin className="w-20 h-20 text-red-500 mx-auto" />
                  </motion.div>
                  
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Boom! Pin drops—</h2>
                    <h3 className="text-2xl font-semibold text-yellow-400 mb-2">
                      {selectedCountry.name}
                    </h3>
                    <p className="text-white/80">
                      Zoom into your Zapped destination with a wild tagline!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {spinPhase === 'zooming' && selectedCountry && (
            <motion.div
              key="zooming"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center"
            >
              <Card className="bg-black/40 backdrop-blur-sm border-white/20 p-8">
                <CardContent className="text-center space-y-6">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.5, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Compass className="w-20 h-20 text-blue-400 mx-auto" />
                  </motion.div>
                  
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Zooming In...</h2>
                    <h3 className="text-2xl font-semibold text-yellow-400 mb-2">
                      {selectedCountry.name}
                    </h3>
                    <p className="text-white/80 mb-4">
                      {selectedCountry.tagline}
                    </p>
                    
                    <div className="flex justify-center space-x-2">
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {selectedCountry.adventureLevel}
                      </Badge>
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        {selectedCountry.region}
                      </Badge>
                      <Badge variant="secondary" className={`bg-gradient-to-r ${styleInfo.color} text-white border-0`}>
                        {travelStyle}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* "Destination Found!" phase with globe still visible in background */}
          {spinPhase === 'destination-found' && selectedCountry && (
            <motion.div
              key="destination-found"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Card className="bg-black/40 backdrop-blur-sm border-white/20 p-8">
                <CardContent className="text-center space-y-6">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <MapPin className="w-24 h-24 text-red-500 mx-auto drop-shadow-lg" />
                  </motion.div>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl"
                  >
                    Destination Found!
                  </motion.h1>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="text-3xl md:text-4xl font-semibold text-yellow-400 mb-2"
                  >
                    {selectedCountry.name}
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="text-white/80 text-xl"
                  >
                    {selectedCountry.tagline}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="text-white/60 text-sm"
                  >
                    Zap Facts Unleashed! Check budget, best times, visa, and epic activities!
                  </motion.p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Session Stats - only show when idle */}
      {sessionStats && spinPhase === 'idle' && (
        <div className="absolute bottom-6 left-6 z-20">
          <Card className="bg-black/40 backdrop-blur-sm border-white/20">
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