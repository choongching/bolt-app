import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { Destination, TravelerType } from '@/types/destination';
import { getDestinationsByTravelerType, getRandomDestination } from '@/data/destinations';

// Set your Mapbox access token from environment variables
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface MapboxGlobeProps {
  travelerType: TravelerType;
  onDestinationSelected: (destination: Destination) => void;
}

const MapboxGlobe: React.FC<MapboxGlobeProps> = ({ travelerType, onDestinationSelected }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isSpinning, setIsSpinning] = useState(true);
  const [showText, setShowText] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [spinPhase, setSpinPhase] = useState<'fast' | 'normal' | 'stopped'>('fast');
  const [mapError, setMapError] = useState<string | null>(null);
  const spinningRef = useRef<number | null>(null);
  const userInteractingRef = useRef(false);

  // Validate Mapbox token
  const isValidMapboxToken = MAPBOX_TOKEN && 
    MAPBOX_TOKEN !== 'YOUR_ACTUAL_MAPBOX_TOKEN_HERE' && 
    MAPBOX_TOKEN.startsWith('pk.');

  useEffect(() => {
    if (!isValidMapboxToken) {
      // Fallback behavior without valid Mapbox token
      const timer = setTimeout(() => {
        setSpinPhase('normal');
        setTimeout(() => {
          setSpinPhase('stopped');
          setIsSpinning(false);
          setShowText(true);
          
          const availableDestinations = getDestinationsByTravelerType(travelerType);
          const destination = availableDestinations.length > 0 
            ? availableDestinations[Math.floor(Math.random() * availableDestinations.length)]
            : getRandomDestination();
          
          setSelectedDestination(destination);
          setTimeout(() => onDestinationSelected(destination), 1000);
        }, 3000);
      }, 4000);

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
      zoom: 1.5,
      center: [0, 20],
      pitch: 0,
      bearing: 0,
      antialias: true,
      attributionControl: false,
      maxZoom: 20, // Set maximum zoom level to 20
    });

    // Add error handling
    map.current.on('error', (e) => {
      console.error('Mapbox GL JS Error:', e);
      setMapError('Failed to load map. Please check your internet connection.');
      
      // Fallback to non-map experience
      setTimeout(() => {
        setSpinPhase('normal');
        setTimeout(() => {
          stopSpinning();
          selectRandomDestination();
        }, 2000);
      }, 1000);
    });

    // Configure globe settings for better visual appeal
    map.current.on('style.load', () => {
      if (!map.current) return;

      try {
        // Set atmosphere for beautiful globe effect
        map.current.setFog({
          color: 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.6,
        });

        // Add destinations as markers
        addDestinationMarkers();
        
        // Start fast spinning immediately
        startSpinning();
      } catch (error) {
        console.error('Error setting up map:', error);
        setMapError('Map setup failed. Using fallback experience.');
        
        // Fallback behavior
        setTimeout(() => {
          setSpinPhase('normal');
          setTimeout(() => {
            stopSpinning();
            selectRandomDestination();
          }, 2000);
        }, 1000);
      }
    });

    // Set up interaction listeners
    const handleInteractionStart = () => {
      userInteractingRef.current = true;
    };

    const handleInteractionEnd = () => {
      userInteractingRef.current = false;
    };

    if (map.current) {
      map.current.on('mousedown', handleInteractionStart);
      map.current.on('touchstart', handleInteractionStart);
      map.current.on('mouseup', handleInteractionEnd);
      map.current.on('touchend', handleInteractionEnd);
      map.current.on('dragend', handleInteractionEnd);
      map.current.on('pitchend', handleInteractionEnd);
      map.current.on('rotateend', handleInteractionEnd);
    }

    // Auto-select destination after fast spinning
    const timer = setTimeout(() => {
      setSpinPhase('normal');
      setTimeout(() => {
        stopSpinning();
        selectRandomDestination();
      }, 1000);
    }, 4000);

    return () => {
      clearTimeout(timer);
      if (spinningRef.current) {
        cancelAnimationFrame(spinningRef.current);
      }
      if (map.current) {
        map.current.remove();
      }
    };
  }, [travelerType, isValidMapboxToken]);

  const addDestinationMarkers = () => {
    if (!map.current) return;

    try {
      const availableDestinations = getDestinationsByTravelerType(travelerType);
      
      availableDestinations.forEach((destination) => {
        // Create custom marker element
        const markerElement = document.createElement('div');
        markerElement.className = 'destination-marker';
        markerElement.style.cssText = `
          width: 20px;
          height: 20px;
          background: linear-gradient(45deg, #ff6b6b, #ffd93d);
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          animation: pulse 2s infinite;
        `;

        // Add hover effects
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(1.5)';
          markerElement.style.zIndex = '1000';
        });

        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
          markerElement.style.zIndex = '1';
        });

        // Create marker and add to map
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([destination.longitude, destination.latitude])
          .addTo(map.current!);

        // Add popup on click
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          className: 'destination-popup'
        }).setHTML(`
          <div style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            font-family: system-ui, -apple-system, sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          ">
            <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: bold;">${destination.name}</h3>
            <p style="margin: 0; font-size: 12px; opacity: 0.9;">${destination.country}</p>
          </div>
        `);

        marker.setPopup(popup);
      });
    } catch (error) {
      console.error('Error adding destination markers:', error);
    }
  };

  const startSpinning = () => {
    if (!map.current) return;

    // Spinning animation function with variable speed
    function spinGlobe() {
      if (!map.current || spinPhase === 'stopped') return;

      try {
        const zoom = map.current.getZoom();
        if (!userInteractingRef.current && zoom < 5) {
          // Calculate rotation speed based on phase
          let distancePerSecond;
          
          if (spinPhase === 'fast') {
            distancePerSecond = 360 / 45;
          } else {
            distancePerSecond = 360 / 120;
          }
          
          const center = map.current.getCenter();
          center.lng -= distancePerSecond;
          
          const easingFunction = spinPhase === 'fast' 
            ? (t: number) => t
            : (t: number) => t * (2 - t);
          
          map.current.easeTo({ 
            center, 
            duration: spinPhase === 'fast' ? 800 : 1000,
            easing: easingFunction
          });
        }
      } catch (error) {
        console.error('Error during spinning animation:', error);
        return;
      }
      
      spinningRef.current = requestAnimationFrame(spinGlobe);
    }

    spinGlobe();
  };

  const stopSpinning = () => {
    if (spinningRef.current) {
      cancelAnimationFrame(spinningRef.current);
    }
    setSpinPhase('stopped');
    setIsSpinning(false);
    setShowText(true);
  };

  const selectRandomDestination = () => {
    const availableDestinations = getDestinationsByTravelerType(travelerType);
    const destination = availableDestinations.length > 0 
      ? availableDestinations[Math.floor(Math.random() * availableDestinations.length)]
      : getRandomDestination();

    setSelectedDestination(destination);

    // Animate to the selected destination if map is available
    if (map.current && !mapError) {
      try {
        map.current.flyTo({
          center: [destination.longitude, destination.latitude],
          zoom: 12, // Increased zoom level for much closer view (was 4, now 12)
          pitch: 45,
          bearing: 0,
          duration: 3000,
          essential: true,
          easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        });

        setTimeout(() => {
          onDestinationSelected(destination);
        }, 3500);
      } catch (error) {
        console.error('Error flying to destination:', error);
        // Fallback: just trigger destination selection
        setTimeout(() => {
          onDestinationSelected(destination);
        }, 1000);
      }
    } else {
      // No map available, just trigger destination selection
      setTimeout(() => {
        onDestinationSelected(destination);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black relative overflow-hidden">
      {/* Mapbox Globe Container or Fallback Background */}
      {isValidMapboxToken && !mapError ? (
        <div 
          ref={mapContainer} 
          className="absolute inset-0 w-full h-full"
          style={{ 
            background: 'linear-gradient(to bottom, #0f0f23, #1a1a2e, #16213e)',
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-black">
          {/* Animated background for fallback */}
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
        </div>
      )}
      
      {/* Custom CSS for markers and popups */}
      <style jsx>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 107, 107, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
        }
        
        .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 8px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;
        }
        
        .mapboxgl-popup-tip {
          border-top-color: #667eea !important;
        }
      `}</style>
      
      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center">
          {/* Fast spinning indicator */}
          {isSpinning && spinPhase === 'fast' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full animate-pulse" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Spinning the Globe...
              </h2>
              <p className="text-white/80 text-xl">
                Finding your perfect destination
              </p>
              <div className="mt-4 flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}

          {/* Normal spinning indicator */}
          {isSpinning && spinPhase === 'normal' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-blue-400 rounded-full animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Focusing...
              </h2>
              <p className="text-white/80 text-lg">
                Locking onto your destination
              </p>
            </motion.div>
          )}

          {/* Destination found text */}
          {showText && !isSpinning && selectedDestination && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Destination Found!
              </h2>
              <h3 className="text-2xl md:text-3xl font-semibold text-yellow-400 mb-2">
                {selectedDestination.name}
              </h3>
              <p className="text-white/80 text-xl mb-4">
                {selectedDestination.country}
              </p>
              <p className="text-white/70">
                Preparing your adventure details...
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-8 left-8 text-white/60 text-sm z-10">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              mapError ? 'bg-red-400' : 
              !isValidMapboxToken ? 'bg-orange-400' :
              spinPhase === 'fast' ? 'bg-yellow-400' : 
              spinPhase === 'normal' ? 'bg-blue-400' : 'bg-green-400'
            }`} />
            <span>
              {mapError ? 'Fallback Mode' :
               !isValidMapboxToken ? 'Basic Mode' : 'Interactive Globe'}
            </span>
          </div>
          {mapError && (
            <div className="text-xs text-red-300 mb-2">{mapError}</div>
          )}
          {!isValidMapboxToken && (
            <div className="text-xs space-y-1">
              <div>• Add valid Mapbox token for 3D globe</div>
              <div>• Get token from mapbox.com</div>
            </div>
          )}
          {isValidMapboxToken && !mapError && (
            <div className="text-xs space-y-1">
              <div>• Drag to rotate</div>
              <div>• Scroll to zoom</div>
              <div>• Click markers for details</div>
            </div>
          )}
        </div>
      </div>

      {/* Mapbox attribution */}
      {isValidMapboxToken && !mapError && (
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

export default MapboxGlobe;