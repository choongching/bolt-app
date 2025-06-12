import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { Destination, TravelerType } from '@/types/destination';
import { getDestinationsByTravelerType, getRandomDestination } from '@/data/destinations';

// Set your Mapbox access token from environment variables
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

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
  const spinningRef = useRef<number | null>(null);
  const userInteractingRef = useRef(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize the map with globe projection
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12', // Beautiful satellite view
      projection: 'globe', // Enable 3D globe
      zoom: 1.5,
      center: [0, 20],
      pitch: 0,
      bearing: 0,
      antialias: true,
      attributionControl: false, // Clean UI
    });

    // Configure globe settings for better visual appeal
    map.current.on('style.load', () => {
      if (!map.current) return;

      // Set atmosphere for beautiful globe effect
      map.current.setFog({
        color: 'rgb(186, 210, 235)', // Light blue atmosphere
        'high-color': 'rgb(36, 92, 223)', // Blue high altitude
        'horizon-blend': 0.02,
        'space-color': 'rgb(11, 11, 25)', // Dark space
        'star-intensity': 0.6,
      });

      // Add destinations as markers
      addDestinationMarkers();
      
      // Start fast spinning immediately
      startSpinning();
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
      }, 1000); // Brief normal speed before selection
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
  }, [travelerType]);

  const addDestinationMarkers = () => {
    if (!map.current) return;

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
  };

  const startSpinning = () => {
    if (!map.current) return;

    // Spinning animation function with variable speed
    function spinGlobe() {
      if (!map.current || spinPhase === 'stopped') return;

      const zoom = map.current.getZoom();
      if (!userInteractingRef.current && zoom < 5) {
        // Calculate rotation speed based on phase
        let distancePerSecond;
        
        if (spinPhase === 'fast') {
          // Fast spinning: Complete rotation in 45 seconds (8 degrees per second)
          distancePerSecond = 360 / 45;
        } else {
          // Normal spinning: Complete rotation in 120 seconds (3 degrees per second)
          distancePerSecond = 360 / 120;
        }
        
        const center = map.current.getCenter();
        center.lng -= distancePerSecond;
        
        // Use different easing based on speed
        const easingFunction = spinPhase === 'fast' 
          ? (t: number) => t // Linear for fast spinning
          : (t: number) => t * (2 - t); // Ease out for normal spinning
        
        // Smoothly update the map center with appropriate duration
        map.current.easeTo({ 
          center, 
          duration: spinPhase === 'fast' ? 800 : 1000,
          easing: easingFunction
        });
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

    // Animate to the selected destination with normal speed
    if (map.current) {
      map.current.flyTo({
        center: [destination.longitude, destination.latitude],
        zoom: 4,
        pitch: 45,
        bearing: 0,
        duration: 3000,
        essential: true,
        // Use smooth easing for the final approach
        easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      });

      // Trigger destination selection after animation
      setTimeout(() => {
        onDestinationSelected(destination);
      }, 3500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black relative overflow-hidden">
      {/* Mapbox Globe Container */}
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: 'linear-gradient(to bottom, #0f0f23, #1a1a2e, #16213e)',
        }}
      />
      
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

      {/* Controls hint */}
      <div className="absolute bottom-8 left-8 text-white/60 text-sm z-10">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${
              spinPhase === 'fast' ? 'bg-yellow-400' : 
              spinPhase === 'normal' ? 'bg-blue-400' : 'bg-green-400'
            }`} />
            <span>Interactive Globe</span>
            {spinPhase === 'fast' && <span className="text-yellow-400 text-xs">(Fast Spin)</span>}
            {spinPhase === 'normal' && <span className="text-blue-400 text-xs">(Normal Speed)</span>}
          </div>
          <div className="text-xs space-y-1">
            <div>• Drag to rotate</div>
            <div>• Scroll to zoom</div>
            <div>• Click markers for details</div>
          </div>
        </div>
      </div>

      {/* Mapbox attribution */}
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
    </div>
  );
};

export default MapboxGlobe;