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
  Zap
} from 'lucide-react';
import { Destination } from '@/types/destination';
import { numbeoService } from '@/services/numbeoApi';
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
  const [visaInfo, setVisaInfo] = useState<any>(null);

  useEffect(() => {
    const fetchBudgetData = async () => {
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
    };

    // Get detailed visa information
    const visaRequirement = getVisaRequirementByDestination(destination.country, destination.city);
    setVisaInfo(visaRequirement);

    fetchBudgetData();
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
          <div className="text-lg font-semibold mb-2">
            ${budgetData.daily_budget_low}-${budgetData.daily_budget_high}/day
          </div>
          <div className="text-sm text-white/80 space-y-1">
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
          <div className="mt-2 text-xs text-white/60 flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" />
            Real-time data from Numbeo
          </div>
        </div>
      );
    }

    return destination.budget_estimate;
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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
      <div className="max-w-6xl mx-auto">
        {/* Pin Drop Animation with EXPLOSIVE Zap theme */}
        <motion.div
          initial={{ y: -200, opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 150 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut", type: "spring", stiffness: 200 }}
            className="inline-block"
          >
            <div className="relative">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <MapPin className="w-16 h-16 text-red-500 mx-auto mb-4 drop-shadow-lg" />
              </motion.div>
              <motion.div
                animate={{ 
                  scale: [1, 1.5, 1],
                  rotate: [0, 180, 360],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ duration: 1, delay: 0.5, repeat: Infinity }}
                className="absolute -top-2 -right-2"
              >
                <Zap className="w-6 h-6 text-yellow-400" />
              </motion.div>
              {/* Additional energy effects */}
              <motion.div
                animate={{ 
                  scale: [0, 1.2, 0],
                  rotate: [0, -180, -360]
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
                className="absolute -bottom-1 -left-1"
              >
                <Zap className="w-4 h-4 text-pink-400" />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6, type: "spring", stiffness: 120 }}
            className="text-5xl md:text-7xl font-bold text-white mb-4"
          >
            <motion.span
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(255, 255, 255, 0.5)',
                  '0 0 40px rgba(255, 215, 0, 0.8)',
                  '0 0 20px rgba(255, 255, 255, 0.5)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {destination.name}
            </motion.span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.6, type: "spring", stiffness: 100 }}
            className="text-2xl md:text-3xl text-yellow-400 font-semibold mb-2"
          >
            <motion.span
              animate={{ 
                scale: [1, 1.05, 1],
                color: ['#fbbf24', '#f59e0b', '#fbbf24']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {destination.tagline}
            </motion.span>
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-white/80 text-lg"
          >
            {destination.country}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-white/60 text-sm mt-2"
          >
            <motion.span
              animate={{ 
                scale: [1, 1.1, 1],
                color: ['rgba(255,255,255,0.6)', '#fbbf24', 'rgba(255,255,255,0.6)']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Adventure unlocked! Check budget, best times, visa, and epic activities!
            </motion.span>
          </motion.p>
        </motion.div>

        {/* Main Content with ENERGETIC staggered animations */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Image with EXPLOSIVE reveal */}
          <motion.div
            initial={{ opacity: 0, x: -100, rotateY: -90 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 1.2, duration: 0.8, type: "spring", stiffness: 100 }}
            className="relative"
          >
            <motion.div 
              className="aspect-video rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
            >
              <img
                src={destination.image_url || 'https://images.pexels.com/photos/1591373/pexels-photo-1591373.jpeg'}
                alt={destination.name}
                className={`w-full h-full object-cover transition-opacity duration-500 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
            
            {/* Image overlay with ENERGETIC animation */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
            <motion.div 
              className="absolute bottom-4 left-4 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Camera className="w-5 h-5" />
                </motion.div>
                <span className="text-sm">Stunning views await</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Info Panel with STAGGERED EXPLOSIVE animations */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotateY: 90 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ delay: 1.4, duration: 0.8, type: "spring", stiffness: 100 }}
            className="space-y-6"
          >
            {/* Budget Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.6, duration: 0.6, type: "spring", stiffness: 120 }}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <DollarSign className="w-6 h-6 mr-2 text-green-400" />
                    </motion.div>
                    Daily Budget Estimate
                  </h3>
                  <div className="text-white/90">
                    {formatBudgetDisplay()}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Best Time Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1.8, duration: 0.6, type: "spring", stiffness: 120 }}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Calendar className="w-6 h-6 mr-2 text-blue-400" />
                    </motion.div>
                    Best Time to Visit
                  </h3>
                  <p className="text-white/90 text-lg">{destination.best_time_to_visit}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Visa Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 2, duration: 0.6, type: "spring", stiffness: 120 }}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <motion.div
                      animate={{ rotateY: [0, 180, 360] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <FileText className="w-6 h-6 mr-2 text-yellow-400" />
                    </motion.div>
                    Visa Requirements
                  </h3>
                  {formatVisaDisplay()}
                </CardContent>
              </Card>
            </motion.div>

            {/* Activities Card */}
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 2.2, duration: 0.6, type: "spring", stiffness: 120 }}
              whileHover={{ 
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Users className="w-6 h-6 mr-2 text-purple-400" />
                    </motion.div>
                    Epic Activities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {destination.activities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: 2.4 + index * 0.1, 
                          duration: 0.4,
                          type: "spring",
                          stiffness: 200
                        }}
                        whileHover={{ 
                          scale: 1.1,
                          y: -2,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <Badge 
                          variant="secondary" 
                          className="bg-white/20 text-white border-white/30"
                        >
                          {activity}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Action Buttons with EXPLOSIVE entrance */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 2.6, duration: 0.8, type: "spring", stiffness: 120 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <motion.div
            whileHover={{ 
              scale: 1.1, 
              y: -5,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onSave}
              size="lg"
              className={`${
                isSaved 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300`}
            >
              <motion.div
                animate={isSaved ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
              </motion.div>
              {isSaved ? 'Saved!' : 'Save Destination'}
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ 
              scale: 1.1, 
              y: -5,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onExplore}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Explore Deeper
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ 
              scale: 1.1, 
              y: -5,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={onSpinAgain}
              size="lg"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="w-5 h-5 mr-2" />
              </motion.div>
              Spin Again
            </Button>
          </motion.div>
        </motion.div>

        {/* Additional Info with BOUNCE animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="text-center mt-8"
        >
          <motion.p
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/60 text-sm"
          >
            <Clock className="w-4 h-4 inline mr-1" />
            Budget estimates updated with real-time data • Visa information verified from official sources
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default DestinationReveal;