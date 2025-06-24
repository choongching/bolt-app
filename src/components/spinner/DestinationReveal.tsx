import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  Heart, 
  RotateCcw, 
  ExternalLink,
  Clock,
  Users,
  Camera,
  Loader2,
  TrendingUp,
  Info,
  CheckCircle,
  AlertCircle,
  Zap,
  Sun,
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  Star,
  Plane,
  Globe,
  Activity
} from 'lucide-react';
import { Destination } from '@/types/destination';
import { numbeoService } from '@/services/numbeoApi';
import { openMeteoService } from '@/services/openMeteoService';
import { getVisaRequirementByDestination } from '@/data/visaRequirements';

interface DestinationRevealProps {
  destination: Destination;
  onSave: () => void;
  onExplore: () => void;
  onSpinAgain: () => void;
  isSaved?: boolean;
}

const DestinationReveal: React.FC<DestinationRevealProps> = ({
  destination,
  onSave,
  onExplore,
  onSpinAgain,
  isSaved = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [budgetData, setBudgetData] = useState<any>(null);
  const [budgetLoading, setBudgetLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [visaInfo, setVisaInfo] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch budget data
      setBudgetLoading(true);
      try {
        const city = destination.city || destination.name;
        const estimate = await numbeoService.getBudgetEstimate(city, destination.country);
        setBudgetData(estimate);
      } catch (error) {
        console.error('Failed to fetch budget data:', error);
        setBudgetData(null);
      } finally {
        setBudgetLoading(false);
      }

      // Fetch weather/travel timing data from Open-Meteo
      setWeatherLoading(true);
      try {
        const travelData = await openMeteoService.getBestTimeToVisit(
          destination.name,
          destination.country,
          { lat: destination.latitude, lng: destination.longitude }
        );
        setWeatherData(travelData);
        console.log('Weather data loaded:', travelData); // Debug log
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
        setWeatherData(null);
      } finally {
        setWeatherLoading(false);
      }
    };

    // Get detailed visa information
    const visaRequirement = getVisaRequirementByDestination(destination.country, destination.city);
    setVisaInfo(visaRequirement);

    fetchData();
  }, [destination]);

  const formatBudgetDisplay = () => {
    if (budgetLoading) {
      return (
        <div className="flex items-center">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span>Loading real-time data...</span>
        </div>
      );
    }

    if (budgetData) {
      return (
        <div>
          <div className="text-2xl font-bold mb-3">
            ${budgetData.daily_budget_low}-${budgetData.daily_budget_high}/day
          </div>
          <div className="text-sm text-white/80 space-y-2">
            <div className="flex justify-between">
              <span>Accommodation:</span>
              <span>${budgetData.breakdown.accommodation.low}-${budgetData.breakdown.accommodation.high}</span>
            </div>
            <div className="flex justify-between">
              <span>Meals:</span>
              <span>${budgetData.breakdown.meals.low}-${budgetData.breakdown.meals.high}</span>
            </div>
            <div className="flex justify-between">
              <span>Transport:</span>
              <span>${budgetData.breakdown.transport.low}-${budgetData.breakdown.transport.high}</span>
            </div>
            <div className="flex justify-between">
              <span>Activities:</span>
              <span>${budgetData.breakdown.activities.low}-${budgetData.breakdown.activities.high}</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-white/60 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Real-time data from Numbeo
          </div>
        </div>
      );
    }

    return destination.budget_estimate;
  };

  const formatWeatherDisplay = () => {
    if (weatherLoading) {
      return (
        <div className="flex items-center">
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
          <span>Loading weather data...</span>
        </div>
      );
    }

    if (weatherData) {
      const bestTime = openMeteoService.formatBestTimeToVisit(weatherData);
      const currentSeason = weatherData.currentSeason;

      return (
        <div>
          <div className="text-xl font-bold mb-3 flex items-center">
            <Sun className="w-5 h-5 mr-2 text-yellow-400" />
            {bestTime}
          </div>
          
          {/* Best months breakdown */}
          {weatherData.bestMonths.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1 mb-2">
                {weatherData.bestMonths.map((month: string) => (
                  <Badge key={month} variant="secondary" className="bg-green-600 text-white text-xs">
                    {month.slice(0, 3)}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-white/70">Best months to visit</p>
            </div>
          )}

          {/* Current season info */}
          {currentSeason && (
            <div className="mb-3 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium capitalize flex items-center">
                  {currentSeason.season === 'spring' && <span className="mr-1">🌸</span>}
                  {currentSeason.season === 'summer' && <span className="mr-1">☀️</span>}
                  {currentSeason.season === 'autumn' && <span className="mr-1">🍂</span>}
                  {currentSeason.season === 'winter' && <span className="mr-1">❄️</span>}
                  {currentSeason.season} (Current)
                </span>
                <div className="flex items-center text-sm">
                  <Thermometer className="w-4 h-4 mr-1" />
                  {Math.round(currentSeason.weather.temperature.average)}°C
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-white/80 mb-2">
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  <span className="capitalize">{currentSeason.crowdLevel} crowds</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-3 h-3 mr-1" />
                  <span className="capitalize">{currentSeason.priceLevel} prices</span>
                </div>
                <div className="flex items-center">
                  <Droplets className="w-3 h-3 mr-1" />
                  <span>{Math.round(currentSeason.weather.precipitation)}mm rain</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  <span>{currentSeason.travelScore}/10 score</span>
                </div>
              </div>

              {/* Pros and cons */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="font-medium text-green-400 mb-1">Pros:</p>
                  <ul className="text-white/70 space-y-0.5">
                    {currentSeason.pros.slice(0, 2).map((pro: string, index: number) => (
                      <li key={index}>• {pro}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-orange-400 mb-1">Cons:</p>
                  <ul className="text-white/70 space-y-0.5">
                    {currentSeason.cons.slice(0, 2).map((con: string, index: number) => (
                      <li key={index}>• {con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="mt-3 text-xs text-white/50 flex items-center">
            <Cloud className="w-3 h-3 mr-1" />
            Weather data from {weatherData.dataSource}
          </div>
        </div>
      );
    }

    return destination.best_time_to_visit;
  };

  const formatVisaDisplay = () => {
    if (!visaInfo) {
      return (
        <div className="flex items-center text-white/90">
          <AlertCircle className="w-4 h-4 mr-2 text-yellow-400" />
          <span>{destination.visa_requirements}</span>
        </div>
      );
    }

    const isVisaFree = visaInfo.requirements.general.toLowerCase().includes('no visa required');
    
    return (
      <div>
        <div className="flex items-center mb-3">
          {isVisaFree ? (
            <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
          ) : (
            <Info className="w-5 h-5 mr-2 text-blue-400" />
          )}
          <span className="text-lg font-semibold text-white">
            {visaInfo.requirements.general}
          </span>
        </div>
        
        <div className="text-sm text-white/80 space-y-2">
          <div className="flex justify-between">
            <span>Duration allowed:</span>
            <span className="font-medium">{visaInfo.duration_allowed}</span>
          </div>
          
          {visaInfo.notes && visaInfo.notes.length > 0 && (
            <div className="mt-3">
              <p className="text-white/70 text-xs mb-2">Important notes:</p>
              <ul className="text-xs text-white/60 space-y-1">
                {visaInfo.notes.slice(0, 3).map((note: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="w-1 h-1 bg-white/40 rounded-full mt-2 mr-2 flex-shrink-0" />
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-3 text-xs text-white/50 flex items-center">
            <Info className="w-3 h-3 mr-1" />
            Updated {visaInfo.last_updated}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-6 lg:p-8" 
      style={{ 
        fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-block mb-4"
          >
            <div className="relative">
              <MapPin className="w-12 h-12 text-red-500 mx-auto drop-shadow-lg" />
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -top-1 -right-1"
              >
                <Zap className="w-4 h-4 text-yellow-400" />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4"
          >
            {destination.name}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl md:text-2xl text-yellow-400 font-semibold mb-2"
          >
            {destination.tagline}
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-white/80 text-lg"
          >
            {destination.country}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-white/60 text-sm mt-2"
          >
            Adventure unlocked! Check budget, best times, visa, and epic activities!
          </motion.p>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          {/* Hero Image - Large Card */}
          <Card className="lg:col-span-2 lg:row-span-2 bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden group hover:bg-white/15 transition-all duration-300">
            <div className="relative h-64 md:h-80 lg:h-full">
              <img
                src={destination.image_url || 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg'}
                alt={destination.name}
                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 animate-pulse" />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center space-x-2">
                  <Camera className="w-5 h-5" />
                  <span className="text-sm font-medium">Stunning views await</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Budget Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-4 md:p-6 h-full flex flex-col">
              <div className="flex items-center mb-3">
                <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                <h3 className="text-lg font-bold text-white">Daily Budget</h3>
              </div>
              <div className="text-white/90 flex-1 flex flex-col justify-center">
                {formatBudgetDisplay()}
              </div>
            </CardContent>
          </Card>

          {/* Weather/Best Time Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-4 md:p-6 h-full flex flex-col">
              <div className="flex items-center mb-3">
                <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Best Time</h3>
              </div>
              <div className="text-white/90 flex-1">
                {formatWeatherDisplay()}
              </div>
            </CardContent>
          </Card>

          {/* Visa Requirements Card */}
          <Card className="lg:col-span-2 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-4 md:p-6 h-full">
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 mr-2 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Visa Requirements</h3>
              </div>
              <div className="text-white/90">
                {formatVisaDisplay()}
              </div>
            </CardContent>
          </Card>

          {/* Activities Card */}
          <Card className="lg:col-span-2 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-4 md:p-6 h-full">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 mr-2 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Epic Activities</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {destination.activities.map((activity, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-white/20 text-white border-white/30"
                  >
                    {activity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
        >
          <Button
            onClick={onSave}
            size="lg"
            className={`${
              isSaved 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300`}
          >
            <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved!' : 'Save Destination'}
          </Button>

          <Button
            onClick={onExplore}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Explore Deeper
          </Button>

          <Button
            onClick={onSpinAgain}
            size="lg"
            variant="outline"
            className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
          >
            <Zap className="w-5 h-5 mr-2" />
            Spin Again
          </Button>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 0.8 }}
          className="text-center"
        >
          <p className="text-white/60 text-sm">
            <Clock className="w-4 h-4 inline mr-1" />
            Budget estimates updated with real-time data • Weather data from Open-Meteo • Visa information verified from official sources
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DestinationReveal;