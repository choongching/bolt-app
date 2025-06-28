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
  Activity,
  Grid,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Destination } from '@/types/destination';
import { numbeoService } from '@/services/numbeoService';
import { openMeteoService } from '@/services/openMeteoService';
import { getVisaRequirementByDestination } from '@/data/visaRequirements';

interface DestinationRevealProps {
  destination: Destination;
  onSave: () => void;
  onExplore: () => void;
  onSpinAgain: () => void;
  isSaved?: boolean;
}

// Destination-specific high-quality images with special focus on Bamyan and Leptis Magna
const getDestinationImage = (destination: Destination): string => {
  const imageMap: { [key: string]: string } = {
    // Casual Adventure Destinations
    'Kathmandu': 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg', // Nepal mountains and temples
    'Petra': 'https://images.pexels.com/photos/1583582/pexels-photo-1583582.jpeg', // Petra Treasury
    'San Pedro de Atacama': 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg', // Atacama Desert
    'Moshi': 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg', // Kilimanjaro
    'Cusco': 'https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg', // Machu Picchu
    
    // Offbeat Journey Destinations - Updated with Bamyan and Leptis Magna specific images
    'Bamyan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Buddhas_of_Bamiyan4.jpg/1200px-Buddhas_of_Bamiyan4.jpg', // Bamyan Buddha niches
    'Mogadishu': 'https://images.pexels.com/photos/4825715/pexels-photo-4825715.jpeg', // Coastal landscape
    'Al Khums': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Leptis_Magna_Arch_of_Septimius_Severus.jpg/1200px-Leptis_Magna_Arch_of_Septimius_Severus.jpg', // Leptis Magna - Arch of Septimius Severus
    'Leptis Magna': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Leptis_Magna_Arch_of_Septimius_Severus.jpg/1200px-Leptis_Magna_Arch_of_Septimius_Severus.jpg', // Direct reference
    'Pyongyang': 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg', // Urban architecture
    'Ashgabat': 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg', // Desert landscape
    
    // Chill Trip Destinations
    'Lisbon': 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg', // European coastal city
    'Bled': 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg', // Lake and mountains
    'Montevideo': 'https://images.pexels.com/photos/4825715/pexels-photo-4825715.jpeg', // South American coast
    'Valletta': 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg', // Mediterranean architecture
    'Queenstown': 'https://images.pexels.com/photos/552779/pexels-photo-552779.jpeg', // New Zealand landscape
  };

  // Special handling for Bamyan, Afghanistan
  if (destination.country === 'Afghanistan' || destination.name === 'Bamyan' || destination.city === 'Bamyan') {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Buddhas_of_Bamiyan4.jpg/1200px-Buddhas_of_Bamiyan4.jpg';
  }

  // Special handling for Libya/Leptis Magna
  if (destination.country === 'Libya' || destination.name === 'Leptis Magna' || destination.city === 'Al Khums') {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Leptis_Magna_Arch_of_Septimius_Severus.jpg/1200px-Leptis_Magna_Arch_of_Septimius_Severus.jpg';
  }

  return imageMap[destination.city || destination.name] || destination.image_url || 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg';
};

// Additional Bamyan gallery images for future use
const getBamyanGalleryImages = (): string[] => {
  return [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Buddhas_of_Bamiyan4.jpg/1200px-Buddhas_of_Bamiyan4.jpg', // Buddha niches main view
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Bamiyan_valley_and_cliffs_2009.jpg/1200px-Bamiyan_valley_and_cliffs_2009.jpg', // Bamyan valley and cliffs
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Band-e-Amir_lakes.jpg/1200px-Band-e-Amir_lakes.jpg', // Band-e-Amir lakes
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bamyan_Buddha_niche.jpg/1200px-Bamyan_Buddha_niche.jpg', // Close-up of Buddha niche
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Shahr-e_Gholghola_ruins.jpg/1200px-Shahr-e_Gholghola_ruins.jpg', // Shahr-e Gholghola ruins
  ];
};

// Additional Leptis Magna gallery images for future use
const getLeptisMagnaGalleryImages = (): string[] => {
  return [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Leptis_Magna_Arch_of_Septimius_Severus.jpg/1200px-Leptis_Magna_Arch_of_Septimius_Severus.jpg', // Arch of Septimius Severus
    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Leptis_Magna_Theatre.jpg/1200px-Leptis_Magna_Theatre.jpg', // Roman Theatre
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Leptis_Magna_Basilica.jpg/1200px-Leptis_Magna_Basilica.jpg', // Basilica ruins
    'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Leptis_Magna_Market.jpg/1200px-Leptis_Magna_Market.jpg', // Ancient market
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Leptis_Magna_Hadrianic_Baths.jpg/1200px-Leptis_Magna_Hadrianic_Baths.jpg', // Hadrianic Baths
  ];
};

// Simplified Weather Card Component
const WeatherCard: React.FC<{ destination: Destination }> = ({ destination }) => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const travelData = await openMeteoService.getBestTimeToVisit(
          destination.name,
          destination.country,
          { lat: destination.latitude, lng: destination.longitude }
        );
        setWeatherData(travelData);
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [destination]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-white/60" />
      </div>
    );
  }

  const bestTime = weatherData ? openMeteoService.formatBestTimeToVisit(weatherData) : destination.best_time_to_visit;
  const currentSeason = weatherData?.currentSeason;

  return (
    <div className="h-full flex flex-col">
      {/* Main weather info */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
          <Sun className="w-8 h-8 mr-3 text-yellow-400" />
          {Math.round(currentSeason?.weather?.temperature?.average || 22)}°C
        </div>
        <p className="text-white/80 text-sm">{bestTime}</p>
      </div>

      {/* Weather stats */}
      {currentSeason && (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <Droplets className="w-4 h-4 mx-auto mb-1 text-blue-400" />
            <div className="text-white font-medium">{Math.round(currentSeason.weather.precipitation)}mm</div>
            <div className="text-white/60 text-xs">Rain</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <Users className="w-4 h-4 mx-auto mb-1 text-purple-400" />
            <div className="text-white font-medium capitalize">{currentSeason.crowdLevel}</div>
            <div className="text-white/60 text-xs">Crowds</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simplified Budget Card Component
const BudgetCard: React.FC<{ destination: Destination }> = ({ destination }) => {
  const [budgetData, setBudgetData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const city = destination.city || destination.name;
        const estimate = await numbeoService.getBudgetEstimate(city, destination.country);
        setBudgetData(estimate);
      } catch (error) {
        console.error('Failed to fetch budget data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, [destination]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-white/60" />
      </div>
    );
  }

  const budgetRange = budgetData 
    ? `$${budgetData.daily_budget_low}-${budgetData.daily_budget_high}`
    : destination.budget_estimate.replace('/day', '');

  return (
    <div className="h-full flex flex-col justify-center text-center">
      <div className="text-3xl font-bold text-white mb-2 flex items-center justify-center">
        <DollarSign className="w-8 h-8 mr-2 text-green-400" />
        {budgetRange}
      </div>
      <p className="text-white/80 text-sm mb-4">per day</p>
      
      {budgetData && (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white/10 rounded-lg p-2">
            <div className="text-white font-medium">${budgetData.breakdown.accommodation.low}-{budgetData.breakdown.accommodation.high}</div>
            <div className="text-white/60">Stay</div>
          </div>
          <div className="bg-white/10 rounded-lg p-2">
            <div className="text-white font-medium">${budgetData.breakdown.meals.low}-{budgetData.breakdown.meals.high}</div>
            <div className="text-white/60">Food</div>
          </div>
        </div>
      )}
    </div>
  );
};

const DestinationReveal: React.FC<DestinationRevealProps> = ({
  destination,
  onSave,
  onExplore,
  onSpinAgain,
  isSaved = false
}) => {
  const [visaInfo, setVisaInfo] = useState<any>(null);

  useEffect(() => {
    // Get detailed visa information
    const visaRequirement = getVisaRequirementByDestination(destination.country, destination.city);
    setVisaInfo(visaRequirement);
  }, [destination]);

  const formatVisaDisplay = () => {
    if (!visaInfo) {
      return destination.visa_requirements;
    }

    const isVisaFree = visaInfo.requirements.general.toLowerCase().includes('no visa required');
    
    return (
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          {isVisaFree ? (
            <CheckCircle className="w-6 h-6 mr-2 text-green-400" />
          ) : (
            <Info className="w-6 h-6 mr-2 text-blue-400" />
          )}
        </div>
        <div className="text-white font-medium text-sm mb-1">
          {isVisaFree ? 'Visa Free' : 'Visa Required'}
        </div>
        <div className="text-white/70 text-xs">
          {visaInfo.duration_allowed}
        </div>
      </div>
    );
  };

  const destinationImage = getDestinationImage(destination);

  // Special descriptions for historical sites
  const getDestinationDescription = (dest: Destination): string => {
    if (dest.country === 'Afghanistan' || dest.name === 'Bamyan' || dest.city === 'Bamyan') {
      return 'Home to the destroyed 6th and 7th-century Buddha statues, a UNESCO World Heritage site with profound historical significance along the ancient Silk Road. The dramatic cliff faces and surrounding valleys showcase Afghanistan\'s rich Buddhist heritage.';
    }
    if (dest.country === 'Libya' || dest.name === 'Leptis Magna' || dest.city === 'Al Khums') {
      return 'One of the most spectacular and well-preserved Roman archaeological sites in the world, featuring the magnificent Arch of Septimius Severus, ancient theatre, basilica, and market ruins that showcase the grandeur of Roman Africa.';
    }
    return dest.description || `Explore the wonders of ${dest.name} in ${dest.country}`;
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
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8"
        >
          {/* Single Cover Image - Large Card with enhanced historical site display */}
          <Card className="lg:col-span-2 lg:row-span-2 bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden group hover:bg-white/15 transition-all duration-300">
            <div className="relative h-64 md:h-80 lg:h-full">
              <img
                src={destinationImage}
                alt={`${destination.name} - ${destination.country}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  // Fallback to Pexels image if Wikipedia image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-semibold mb-1">{destination.name}</h3>
                <p className="text-sm opacity-90">{destination.country}</p>
                <p className="text-xs opacity-75 mt-2 max-w-md leading-relaxed">
                  {getDestinationDescription(destination)}
                </p>
              </div>
              <div className="absolute top-4 right-4">
                <Camera className="w-6 h-6 text-white/80" />
              </div>
              
              {/* Special badges for UNESCO World Heritage sites */}
              {(destination.country === 'Afghanistan' || destination.name === 'Bamyan' || 
                destination.country === 'Libya' || destination.name === 'Leptis Magna') && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-yellow-600 text-white text-xs">
                    UNESCO World Heritage
                  </Badge>
                </div>
              )}

              {/* Special warning badge for dangerous destinations */}
              {(destination.country === 'Afghanistan' || destination.country === 'Libya' || 
                destination.country === 'Somalia') && (
                <div className="absolute top-12 left-4">
                  <Badge className="bg-red-600 text-white text-xs flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Travel Advisory
                  </Badge>
                </div>
              )}
            </div>
          </Card>

          {/* Weather Card - Simplified */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-4 md:p-6 h-full">
              <div className="flex items-center mb-3">
                <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Weather</h3>
              </div>
              <WeatherCard destination={destination} />
            </CardContent>
          </Card>

          {/* Budget Card - Simplified */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-4 md:p-6 h-full">
              <div className="flex items-center mb-3">
                <DollarSign className="w-5 h-5 mr-2 text-green-400" />
                <h3 className="text-lg font-bold text-white">Budget</h3>
              </div>
              <BudgetCard destination={destination} />
            </CardContent>
          </Card>

          {/* Visa Card - Simplified */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-4 md:p-6 h-full flex flex-col justify-center">
              <div className="flex items-center justify-center mb-3">
                <FileText className="w-5 h-5 mr-2 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">Visa</h3>
              </div>
              {formatVisaDisplay()}
            </CardContent>
          </Card>

          {/* Activities Card - Simplified */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardContent className="p-4 md:p-6 h-full">
              <div className="flex items-center mb-3">
                <Activity className="w-5 h-5 mr-2 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Activities</h3>
              </div>
              <div className="flex flex-wrap gap-1">
                {destination.activities.slice(0, 4).map((activity, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-white/20 text-white border-white/30 text-xs"
                  >
                    {activity}
                  </Badge>
                ))}
                {destination.activities.length > 4 && (
                  <Badge 
                    variant="secondary" 
                    className="bg-white/20 text-white border-white/30 text-xs"
                  >
                    +{destination.activities.length - 4}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
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
            {isSaved ? 'Saved!' : 'Save'}
          </Button>

          <Button
            onClick={onExplore}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Explore
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
      </div>
    </div>
  );
};

export default DestinationReveal;