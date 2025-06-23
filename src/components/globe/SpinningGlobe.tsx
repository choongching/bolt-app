import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TravelStyle } from '@/types/country';
import { getRandomCountryByStyle } from '@/data/countries';

// Set your Mapbox access token from environment variables
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface SpinningGlobeProps {
  travelStyle: TravelStyle;
  onDestinationFound: (destination: any) => void;
}

const SpinningGlobe: React.FC<SpinningGlobeProps> = ({ travelStyle, onDestinationFound }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [status, setStatus] = useState<'spinning' | 'found' | 'zooming'>('spinning');
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const spinningRef = useRef<number | null>(null);

  // Check if Mapbox token is available and valid
  const hasValidMapboxToken = MAPBOX_TOKEN && 
                             MAPBOX_TOKEN !== 'YOUR_ACTUAL_MAPBOX_TOKEN_HERE' &&
                             MAPBOX_TOKEN.startsWith('pk.');

  useEffect(() => {
    if (!hasValidMapboxToken) {
      // Fallback behavior without Mapbox
      const timer = setTimeout(() => {
        const country = getRandomCountryByStyle(travelStyle);
        setSelectedCountry(country);
        setStatus('found');
        
        setTimeout(() => {
          setStatus('zooming');
          setTimeout(() => {
            const destination = createDestinationFromCountry(country);
            onDestinationFound(destination);
          }, 2000);
        }, 2000);
      }, 3000);

      return () => clearTimeout(timer);
    }

    if (!mapContainer.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize the map with globe projection
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      projection: 'globe',
      zoom: 1.2,
      center: [0, 20],
      pitch: 0,
      bearing: 0,
      antialias: true,
      attributionControl: false,
      interactive: false, // Disable user interaction during spinning
    });

    // Add error handling
    map.current.on('error', (e) => {
      console.error('Mapbox GL JS Error:', e);
      setMapError('Failed to load map. Using fallback experience.');
      handleFallbackFlow();
    });

    map.current.on('style.load', () => {
      if (!map.current) return;

      try {
        // Set atmosphere for beautiful globe effect
        map.current.setFog({
          color: 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.8,
        });

        // Start the sequence
        startGlobeSequence();
      } catch (error) {
        console.error('Error setting up map:', error);
        setMapError('Map setup failed. Using fallback experience.');
        handleFallbackFlow();
      }
    });

    return () => {
      if (spinningRef.current) {
        cancelAnimationFrame(spinningRef.current);
      }
      if (map.current) {
        map.current.remove();
      }
    };
  }, [travelStyle, hasValidMapboxToken, onDestinationFound]);

  const createDestinationFromCountry = (country: any) => {
    return {
      id: country.isoCode,
      name: country.name,
      country: country.name,
      city: country.capital,
      latitude: country.coordinates.lat,
      longitude: country.coordinates.lng,
      tagline: country.tagline,
      budget_estimate: '$50-200/day',
      best_time_to_visit: country.bestTimeToVisit || 'Year-round',
      visa_requirements: 'Check requirements for your nationality',
      activities: country.highlights || ['Sightseeing', 'Culture', 'Adventure'],
      description: `Explore ${country.name}, ${country.tagline.toLowerCase()}`
    };
  };

  const handleFallbackFlow = () => {
    setTimeout(() => {
      const country = getRandomCountryByStyle(travelStyle);
      setSelectedCountry(country);
      setStatus('found');
      
      setTimeout(() => {
        setStatus('zooming');
        setTimeout(() => {
          const destination = createDestinationFromCountry(country);
          onDestinationFound(destination);
        }, 2000);
      }, 2000);
    }, 1000);
  };

  const startGlobeSequence = () => {
    // Phase 1: Spinning (3 seconds)
    startSpinning();
    
    setTimeout(() => {
      // Phase 2: Stop spinning and show "Destination Found" (2 seconds)
      stopSpinning();
      const country = getRandomCountryByStyle(travelStyle);
      setSelectedCountry(country);
      setStatus('found');
      
      setTimeout(() => {
        // Phase 3: Zoom to destination (3 seconds)
        setStatus('zooming');
        zoomToDestination(country);
      }, 2000);
    }, 3000);
  };

  const startSpinning = () => {
    if (!map.current) return;

    let spinEnabled = true;

    function spinGlobe() {
      if (!map.current || !spinEnabled) return;

      try {
        const distancePerSecond = 360 / 45; // Faster spinning - complete rotation in 45 seconds
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        
        map.current.easeTo({ 
          center, 
          duration: 1000,
          easing: (t) => t
        });
      } catch (error) {
        console.error('Error during spinning animation:', error);
        return;
      }
      
      if (spinEnabled) {
        spinningRef.current = requestAnimationFrame(spinGlobe);
      }
    }

    spinGlobe();

    // Store the stop function
    return () => {
      spinEnabled = false;
      if (spinningRef.current) {
        cancelAnimationFrame(spinningRef.current);
      }
    };
  };

  const stopSpinning = () => {
    if (spinningRef.current) {
      cancelAnimationFrame(spinningRef.current);
      spinningRef.current = null;
    }
  };

  const zoomToDestination = (country: any) => {
    if (map.current && !mapError) {
      try {
        // Add a dramatic marker for the destination
        const markerElement = document.createElement('div');
        markerElement.style.cssText = `
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, #ff6b6b, #ffd93d);
          border: 4px solid white;
          border-radius: 50%;
          box-shadow: 0 8px 30px rgba(255, 107, 107, 0.8);
          animation: destinationPulse 1s infinite;
        `;

        // Add CSS animation for the marker
        const style = document.createElement('style');
        style.textContent = `
          @keyframes destinationPulse {
            0% { 
              box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.9);
              transform: scale(1);
            }
            50% { 
              box-shadow: 0 0 0 25px rgba(255, 107, 107, 0);
              transform: scale(1.2);
            }
            100% { 
              box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
              transform: scale(1);
            }
          }
        `;
        document.head.appendChild(style);

        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([country.coordinates.lng, country.coordinates.lat])
          .addTo(map.current);

        // Dramatic zoom to the destination
        map.current.flyTo({
          center: [country.coordinates.lng, country.coordinates.lat],
          zoom: 8,
          pitch: 60,
          bearing: 0,
          duration: 3000,
          essential: true,
          easing: (t) => {
            // Custom easing for dramatic effect
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          }
        });

        // After zoom completes, transition to destination details
        setTimeout(() => {
          const destination = createDestinationFromCountry(country);
          onDestinationFound(destination);
        }, 3500);
      } catch (error) {
        console.error('Error flying to destination:', error);
        // Fallback: just trigger destination selection
        setTimeout(() => {
          const destination = createDestinationFromCountry(country);
          onDestinationFound(destination);
        }, 1000);
      }
    } else {
      // No map available, just trigger destination selection
      setTimeout(() => {
        const destination = createDestinationFromCountry(country);
        onDestinationFound(destination);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-black" />
      
      {/* Mapbox Globe Container or Fallback */}
      {hasValidMapboxToken && !mapError ? (
        <div 
          ref={mapContainer} 
          className="absolute inset-0 w-full h-full"
          style={{ 
            background: 'linear-gradient(to bottom, #0f0f23, #1a1a2e, #16213e)',
          }}
        />
      ) : (
        // Fallback background with animated stars
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-black">
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                initial={{ 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                  opacity: Math.random() * 0.8 + 0.2
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Status Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <AnimatePresence mode="wait">
          {status === 'spinning' && (
            <motion.div
              key="spinning"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="text-center bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-6"
              />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Spinning...
              </h2>
              <p className="text-white/80 text-xl">
                Finding your perfect {travelStyle.toLowerCase()} destination
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}

          {status === 'found' && selectedCountry && (
            <motion.div
              key="found"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8 }}
              className="text-center bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <motion.svg 
                  className="w-12 h-12 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </motion.svg>
              </motion.div>
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Destination Found!
              </motion.h2>
              <motion.h3 
                className="text-2xl md:text-3xl font-semibold text-yellow-400 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {selectedCountry.name}
              </motion.h3>
              <motion.p 
                className="text-white/80 text-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                {selectedCountry.tagline}
              </motion.p>
            </motion.div>
          )}

          {status === 'zooming' && selectedCountry && (
            <motion.div
              key="zooming"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.8 }}
              className="text-center bg-black/40 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Zooming In...
              </h2>
              <h3 className="text-2xl md:text-3xl font-semibold text-yellow-400 mb-2">
                {selectedCountry.name}
              </h3>
              <p className="text-white/80 text-xl">
                Preparing your adventure details
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Travel Style Indicator */}
      <div className="absolute top-8 left-8 z-20">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              travelStyle === 'Solo' ? 'bg-purple-500' :
              travelStyle === 'Romantic' ? 'bg-pink-500' : 'bg-green-500'
            }`} />
            <span className="text-white font-medium">{travelStyle} Travel</span>
          </div>
        </div>
      </div>

      {/* Setup instructions for missing or invalid Mapbox token */}
      {!hasValidMapboxToken && (
        <div className="absolute bottom-8 left-8 text-white/60 text-sm z-20">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20 max-w-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              <span className="font-semibold">Enhanced Globe Available</span>
            </div>
            <div className="text-xs space-y-1">
              <div>• Add valid Mapbox token to .env</div>
              <div>• Get token from mapbox.com</div>
              <div>• Token must start with 'pk.'</div>
              <div>• Restart dev server after adding</div>
            </div>
          </div>
        </div>
      )}

      {/* Mapbox attribution */}
      {hasValidMapboxToken && !mapError && (
        <div className="absolute bottom-4 right-4 text-white/40 text-xs z-10">
          <a 
            href="https://www.mapbox.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            © Mapbox
          </a>
        </div>
      )}
    </div>
  );
};

export default SpinningGlobe;