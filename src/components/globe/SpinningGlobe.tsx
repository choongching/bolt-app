import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Destination, TravelerType } from '@/types/destination';
import { getDestinationsByTravelerType, getRandomDestination } from '@/data/destinations';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface SpinningGlobeProps {
  travelerType: TravelerType;
  onDestinationSelected: (destination: Destination) => void;
}

const SpinningGlobe: React.FC<SpinningGlobeProps> = ({ travelerType, onDestinationSelected }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isSpinning, setIsSpinning] = useState(true);
  const [showText, setShowText] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [zoomPhase, setZoomPhase] = useState<'zooming' | 'spinning' | 'selecting'>('zooming');
  const [mapError, setMapError] = useState<string | null>(null);
  const spinningRef = useRef<number | null>(null);

  // Check if Mapbox token is available and valid
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const hasValidMapboxToken = MAPBOX_TOKEN && 
                             MAPBOX_TOKEN !== 'YOUR_ACTUAL_MAPBOX_TOKEN_HERE' &&
                             MAPBOX_TOKEN.startsWith('pk.');

  useEffect(() => {
    if (!hasValidMapboxToken) {
      // Fallback behavior without Mapbox - MUCH FASTER
      const timer = setTimeout(() => {
        setZoomPhase('spinning');
        setTimeout(() => {
          setZoomPhase('selecting');
          setIsSpinning(false);
          setShowText(true);
          
          const availableDestinations = getDestinationsByTravelerType(travelerType);
          const destination = availableDestinations.length > 0 
            ? availableDestinations[Math.floor(Math.random() * availableDestinations.length)]
            : getRandomDestination();
          
          setSelectedDestination(destination);
          setTimeout(() => onDestinationSelected(destination), 500); // Much faster (was 1000)
        }, 1500); // Much faster (was 3000)
      }, 1000); // Much faster (was 2000)

      return () => clearTimeout(timer);
    }

    if (!mapContainer.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize the map with globe projection - starting from zoomed out view
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
      maxZoom: 20, // Set maximum zoom level to 20
    });

    // Add error handling
    map.current.on('error', (e) => {
      console.error('Mapbox GL JS Error:', e);
      setMapError('Failed to load map. Using fallback experience.');
      
      // Fallback to non-map experience - MUCH FASTER
      setTimeout(() => {
        setZoomPhase('spinning');
        setTimeout(() => {
          setZoomPhase('selecting');
          setIsSpinning(false);
          setShowText(true);
          
          const availableDestinations = getDestinationsByTravelerType(travelerType);
          const destination = availableDestinations.length > 0 
            ? availableDestinations[Math.floor(Math.random() * availableDestinations.length)]
            : getRandomDestination();
          
          setSelectedDestination(destination);
          setTimeout(() => onDestinationSelected(destination), 500);
        }, 1000); // Much faster (was 2000)
      }, 500); // Much faster (was 1000)
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

        // Start the transition sequence - MUCH FASTER
        startGlobeTransition();
      } catch (error) {
        console.error('Error setting up map:', error);
        setMapError('Map setup failed. Using fallback experience.');
        
        // Fallback behavior - MUCH FASTER
        setTimeout(() => {
          setZoomPhase('spinning');
          setTimeout(() => {
            setZoomPhase('selecting');
            setIsSpinning(false);
            setShowText(true);
            
            const availableDestinations = getDestinationsByTravelerType(travelerType);
            const destination = availableDestinations.length > 0 
              ? availableDestinations[Math.floor(Math.random() * availableDestinations.length)]
              : getRandomDestination();
            
            setSelectedDestination(destination);
            setTimeout(() => onDestinationSelected(destination), 500);
          }, 1000);
        }, 500);
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
  }, [travelerType, hasValidMapboxToken]);

  const startGlobeTransition = () => {
    if (!map.current) return;

    try {
      // Phase 1: Zoom in to make globe the main focus - MUCH FASTER
      setTimeout(() => {
        if (!map.current) return;
        
        map.current.easeTo({
          zoom: 2.5,
          pitch: 15,
          duration: 1000, // Much faster (was 2000)
          easing: (t) => t * (2 - t)
        });

        setZoomPhase('spinning');
      }, 200); // Much faster (was 500)

      // Phase 2: Add destinations and start spinning - MUCH FASTER
      setTimeout(() => {
        addDestinationMarkers();
        startSpinning();
      }, 1200); // Much faster (was 2500)

      // Phase 3: Select destination - MUCH FASTER
      setTimeout(() => {
        stopSpinning();
        selectRandomDestination();
      }, 3000); // Much faster (was 6000)
    } catch (error) {
      console.error('Error in globe transition:', error);
      setMapError('Globe transition failed. Using fallback experience.');
    }
  };

  const addDestinationMarkers = () => {
    if (!map.current) return;

    try {
      const availableDestinations = getDestinationsByTravelerType(travelerType);
      
      availableDestinations.forEach((destination) => {
        // Create custom marker element with MORE ENERGETIC animation
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
          transition: all 0.2s ease;
          animation: energeticPulse 1s infinite;
        `;

        // Add hover effects with MORE ENERGY
        markerElement.addEventListener('mouseenter', () => {
          markerElement.style.transform = 'scale(2)';
          markerElement.style.zIndex = '1000';
          markerElement.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.8)';
        });

        markerElement.addEventListener('mouseleave', () => {
          markerElement.style.transform = 'scale(1)';
          markerElement.style.zIndex = '1';
          markerElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });

        // Create marker and add to map
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([destination.longitude, destination.latitude])
          .addTo(map.current!);

        // Add popup on click with ENERGETIC styling
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
            animation: popupBounce 0.3s ease-out;
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

    let userInteracting = false;
    let spinEnabled = true;

    try {
      // Disable spinning when user interacts
      map.current.on('mousedown', () => { userInteracting = true; });
      map.current.on('mouseup', () => { userInteracting = false; });
      map.current.on('dragend', () => { userInteracting = false; });

      // MUCH FASTER spinning animation function
      function spinGlobe() {
        if (!map.current || !spinEnabled) return;

        try {
          const zoom = map.current.getZoom();
          if (spinEnabled && !userInteracting && zoom < 5) {
            let distancePerSecond = 360 / 30; // MUCH FASTER - complete rotation in 30 seconds (was 90)
            const center = map.current.getCenter();
            center.lng -= distancePerSecond;
            
            map.current.easeTo({ center, duration: 500, easing: (t) => t }); // Much faster (was 1000)
          }
        } catch (error) {
          console.error('Error during spinning animation:', error);
          return;
        }
        
        spinningRef.current = requestAnimationFrame(spinGlobe);
      }

      spinGlobe();
    } catch (error) {
      console.error('Error setting up spinning:', error);
    }
  };

  const stopSpinning = () => {
    if (spinningRef.current) {
      cancelAnimationFrame(spinningRef.current);
    }
    setIsSpinning(false);
    setShowText(true);
    setZoomPhase('selecting');
  };

  const selectRandomDestination = () => {
    const availableDestinations = getDestinationsByTravelerType(travelerType);
    const destination = availableDestinations.length > 0 
      ? availableDestinations[Math.floor(Math.random() * availableDestinations.length)]
      : getRandomDestination();

    setSelectedDestination(destination);

    // Animate to the selected destination if map is available - MUCH FASTER
    if (map.current && !mapError) {
      try {
        map.current.flyTo({
          center: [destination.longitude, destination.latitude],
          zoom: 12, // Increased zoom level for much closer view (was 4, now 12)
          pitch: 45,
          bearing: 0,
          duration: 1500, // Much faster (was 3000)
          essential: true
        });

        setTimeout(() => {
          onDestinationSelected(destination);
        }, 1800); // Much faster (was 3500)
      } catch (error) {
        console.error('Error flying to destination:', error);
        // Fallback: just trigger destination selection
        setTimeout(() => {
          onDestinationSelected(destination);
        }, 500);
      }
    } else {
      // No map available, just trigger destination selection
      setTimeout(() => {
        onDestinationSelected(destination);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-black" />
      
      {/* Mapbox Globe Container or Fallback */}
      {hasValidMapboxToken && !mapError ? (
        <motion.div 
          ref={mapContainer} 
          className="absolute inset-0 w-full h-full"
          initial={{ filter: 'blur(1px) brightness(0.7)' }}
          animate={{ 
            filter: zoomPhase === 'zooming' 
              ? 'blur(0px) brightness(1)' 
              : 'blur(0px) brightness(1)' 
          }}
          transition={{ duration: 1 }} // Much faster (was 2)
          style={{ 
            background: 'linear-gradient(to bottom, #0f0f23, #1a1a2e, #16213e)',
          }}
        />
      ) : (
        // Fallback background for when Mapbox token is not available or there's an error
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-black">
          {/* MUCH MORE ENERGETIC animated background for fallback */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                initial={{ 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                }}
                animate={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
                }}
                transition={{
                  duration: Math.random() * 5 + 3, // Much faster (was 20 + 15)
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Custom CSS for markers and popups with MORE ENERGETIC animations */}
      <style jsx>{`
        @keyframes energeticPulse {
          0% { 
            box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.9);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 0 15px rgba(255, 107, 107, 0);
            transform: scale(1.3);
          }
          100% { 
            box-shadow: 0 0 0 0 rgba(255, 107, 107, 0);
            transform: scale(1);
          }
        }
        
        @keyframes popupBounce {
          0% { 
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% { 
            transform: scale(1.2) rotate(0deg);
            opacity: 0.8;
          }
          100% { 
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
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
      
      {/* Overlay Content with MUCH MORE ENERGETIC animations */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="text-center">
          {/* Zoom in phase - MORE ENERGETIC */}
          {zoomPhase === 'zooming' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }} // Much faster (was 2)
                  className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="w-8 h-8 bg-yellow-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </div>
              </div>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-white mb-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {mapError ? 'Preparing Experience...' : 'Focusing the Globe...'}
              </motion.h2>
              <p className="text-white/80 text-lg">
                {mapError ? 'Setting up your adventure' : 'Preparing your personalized adventure'}
              </p>
            </motion.div>
          )}

          {/* Spinning indicator - MUCH MORE ENERGETIC */}
          {zoomPhase === 'spinning' && isSpinning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
              className="mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} // Much faster (was 1.5)
                  className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="w-10 h-10 bg-yellow-400 rounded-full"
                    animate={{ 
                      scale: [1, 1.8, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>
              </div>
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-white mb-2"
                animate={{ 
                  scale: [1, 1.1, 1],
                  color: ['#ffffff', '#fbbf24', '#ffffff']
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {mapError ? 'Selecting Destination...' : 'Spinning the Globe...'}
              </motion.h2>
              <motion.p 
                className="text-white/80 text-xl"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Finding your perfect {travelerType} destination
              </motion.p>
            </motion.div>
          )}

          {/* Destination found text - EXPLOSIVE animation */}
          {zoomPhase === 'selecting' && showText && !isSpinning && selectedDestination && (
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.5, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
              className="text-center bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-white mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 200 }}
              >
                Destination Found!
              </motion.h2>
              <motion.h3 
                className="text-2xl md:text-3xl font-semibold text-yellow-400 mb-2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 150 }}
              >
                {selectedDestination.name}
              </motion.h3>
              <motion.p 
                className="text-white/80 text-xl mb-4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6, type: "spring", stiffness: 150 }}
              >
                {selectedDestination.country}
              </motion.p>
              <motion.p 
                className="text-white/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                Preparing your adventure details...
              </motion.p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Status indicator */}
      <div className="absolute bottom-8 left-8 text-white/60 text-sm z-10">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <motion.div 
              className={`w-2 h-2 rounded-full ${
                mapError ? 'bg-red-400' : 
                !hasValidMapboxToken ? 'bg-orange-400' : 'bg-green-400'
              }`}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span>
              {mapError ? 'Fallback Mode' :
               !hasValidMapboxToken ? 'Basic Mode' : 'Interactive Globe'}
            </span>
          </div>
          {mapError && (
            <div className="text-xs text-red-300 mb-2">{mapError}</div>
          )}
          {!hasValidMapboxToken && !mapError && (
            <div className="text-xs space-y-1">
              <div>• Add valid Mapbox token for 3D globe</div>
              <div>• Get token from mapbox.com</div>
            </div>
          )}
          {hasValidMapboxToken && !mapError && zoomPhase !== 'zooming' && (
            <div className="text-xs space-y-1">
              <div>• Drag to rotate</div>
              <div>• Scroll to zoom</div>
              <div>• Click markers for details</div>
            </div>
          )}
        </div>
      </div>

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