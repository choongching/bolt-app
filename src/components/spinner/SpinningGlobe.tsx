import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Destination, TravelerType } from '@/types/destination';
import { getDestinationsByTravelerType, getRandomDestination } from '@/data/destinations';
import MapboxGlobe from '@/components/globe/MapboxGlobe';

interface SpinningGlobeProps {
  travelerType: TravelerType;
  onDestinationSelected: (destination: Destination) => void;
}

const SpinningGlobe: React.FC<SpinningGlobeProps> = ({ travelerType, onDestinationSelected }) => {
  // Check if Mapbox token is available
  const hasMapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN && 
                        import.meta.env.VITE_MAPBOX_ACCESS_TOKEN !== 'YOUR_ACTUAL_MAPBOX_TOKEN_HERE';

  // If Mapbox token is available, use the new MapboxGlobe component
  if (hasMapboxToken) {
    return <MapboxGlobe travelerType={travelerType} onDestinationSelected={onDestinationSelected} />;
  }

  // Fallback to the original Three.js implementation
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSpinning, setIsSpinning] = useState(true);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Auto-select destination after spinning (fallback behavior)
    const timer = setTimeout(() => {
      setIsSpinning(false);
      setShowText(true);
      
      // Select destination based on traveler type
      const availableDestinations = getDestinationsByTravelerType(travelerType);
      const selectedDestination = availableDestinations.length > 0 
        ? availableDestinations[Math.floor(Math.random() * availableDestinations.length)]
        : getRandomDestination();

      setTimeout(() => onDestinationSelected(selectedDestination), 1000);
    }, 4000);

    return () => {
      clearTimeout(timer);
    };
  }, [travelerType, onDestinationSelected]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black relative overflow-hidden">
      {/* Fallback Globe Container */}
      <div ref={mountRef} className="absolute inset-0" />
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center z-10">
          {/* Spinning indicator */}
          {isSpinning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Spinning the Globe...
              </h2>
              <p className="text-white/80 text-lg">
                Finding your perfect destination
              </p>
              <p className="text-white/60 text-sm mt-4">
                Add your Mapbox token for enhanced 3D globe experience
              </p>
            </motion.div>
          )}

          {/* Destination found text */}
          {showText && !isSpinning && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Destination Found!
              </h2>
              <p className="text-white/80 text-xl">
                Preparing your adventure details...
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Setup instructions */}
      <div className="absolute bottom-8 left-8 text-white/60 text-sm">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20 max-w-sm">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            <span className="font-semibold">Setup Required</span>
          </div>
          <div className="text-xs space-y-1">
            <div>• Add VITE_MAPBOX_ACCESS_TOKEN to .env</div>
            <div>• Get token from mapbox.com</div>
            <div>• Restart dev server</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpinningGlobe;