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

  // Get travel style display name
  const getTravelStyleDisplay = (type: TravelerType): string => {
    const mapping: { [key in TravelerType]: string } = {
      'solo': 'Chill Trip',
      'couple': 'Casual Adventure',
      'family': 'Offbeat Journey',
      'friends': 'Group Adventure',
      'business': 'Business Travel'
    };
    return mapping[type] || 'Adventure';
  };

  useEffect(() => {
    if (!hasValidMapboxToken) {
      // Fallback behavior without Mapbox
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
          setTimeout(() => onDestinationSelected(destination), 1000);
        }, 3000);
      }, 2000);

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
      
      // Fallback to non-map experience
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
          setTimeout(() => onDestinationSelected(destination), 1000);
        }, 2000);
      }, 1000);
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

        // Start the transition sequence
        startGlobeTransition();
      } catch (error) {
        console.error('Error setting up map:', error);
        setMapError('Map setup failed. Using fallback experience.');
        
        // Fallback behavior
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
            setTimeout(() => onDestinationSelected(destination), 1000);
          }, 2000);
        }, 1000);
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
      // Phase 1: Zoom in to make globe the main focus (2 seconds)
      setTimeout(() => {
        if (!map.current) return;
        
        map.current.easeTo({
          zoom: 2.5,
          pitch: 15,
          duration: 2000,
          easing: (t) => t * (2 - t)
        });

        setZoomPhase('spinning');
      }, 500);

      // Phase 2: Add destinations and start spinning (after zoom completes)
      setTimeout(() => {
        addDestinationMarkers();
        startSpinning();
      }, 2500);

      // Phase 3: Select destination (after spinning for 3 seconds)
      setTimeout(() => {
        stopSpinning();
        selectRandomDestination();
      }, 6000);
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
          animation: markerPulse 2s infinite;
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

    let userInteracting = false;
    let spinEnabled = true;

    try {
      // Disable spinning when user interacts
      map.current.on('mousedown', () => { userInteracting = true; });
      map.current.on('mouseup', () => { userInteracting = false; });
      map.current.on('dragend', () => { userInteracting = false; });

      // Spinning animation function
      function spinGlobe() {
        if (!map.current || !spinEnabled) return;

        try {
          const zoom = map.current.getZoom();
          if (spinEnabled && !userInteracting && zoom < 5) {
            let distancePerSecond = 360 / 90;
            const center = map.current.getCenter();
            center.lng -= distancePerSecond;
            
            map.current.easeTo({ center, duration: 1000, easing: (t) => t });
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

    // Animate to the selected destination if map is available
    if (map.current && !mapError) {
      try {
        map.current.flyTo({
          center: [destination.longitude, destination.latitude],
          zoom: 12, // Increased zoom level for much closer view (was 4, now 12)
          pitch: 45,
          bearing: 0,
          duration: 3000,
          essential: true
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
          transition={{ duration: 2 }}
          style={{ 
            background: 'linear-gradient(to bottom, #0f0f23, #1a1a2e, #16213e)',
          }}
        />
      ) : (
        // Fallback background for when Mapbox token is not available or there's an error
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
          {/* Zoom in phase */}
          {zoomPhase === 'zooming' && (
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
                {mapError ? 'Preparing Experience...' : 'Focusing the Globe...'}
              </h2>
              <p className="text-white/80 text-lg">
                {mapError ? 'Setting up your adventure' : 'Preparing your personalized adventure'}
              </p>
            </motion.div>
          )}

          {/* Spinning indicator */}
          {zoomPhase === 'spinning' && isSpinning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full animate-pulse" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {mapError ? 'Selecting Destination...' : 'Spinning the Globe...'}
              </h2>
              <p className="text-white/80 text-xl">
                Finding your perfect {getTravelStyleDisplay(travelerType)} destination
              </p>
            </motion.div>
          )}

          {/* Destination found text */}
          {zoomPhase === 'selecting' && showText && !isSpinning && selectedDestination && (
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
              !hasValidMapboxToken ? 'bg-orange-400' : 'bg-green-400'
            }`} />
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