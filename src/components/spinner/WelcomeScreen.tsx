import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plane, Globe, Sparkles } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TravelStyle } from '@/types/country';

interface WelcomeScreenProps {
  onTravelStyleSelect: (type: TravelStyle) => void;
  isAuthenticated: boolean;
}

const travelStyles = [
  {
    type: 'Solo' as TravelStyle,
    title: 'Chill Trip',
    color: 'from-purple-500 to-indigo-500',
    hoverColor: 'from-purple-600 to-indigo-600'
  },
  {
    type: 'Romantic' as TravelStyle,
    title: 'Casual Adventure',
    color: 'from-pink-500 to-red-500',
    hoverColor: 'from-pink-600 to-red-600'
  },
  {
    type: 'Family' as TravelStyle,
    title: 'Offbeat Journey',
    color: 'from-green-500 to-blue-500',
    hoverColor: 'from-green-600 to-blue-600'
  }
];

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onTravelStyleSelect, isAuthenticated }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    // Check if Mapbox token is available and valid
    const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const hasValidMapboxToken = MAPBOX_TOKEN && 
                               MAPBOX_TOKEN !== 'YOUR_ACTUAL_MAPBOX_TOKEN_HERE' &&
                               MAPBOX_TOKEN.startsWith('pk.');

    if (!hasValidMapboxToken || !mapContainer.current) return;

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
      interactive: false, // Disable user interaction
    });

    // Add error handling
    map.current.on('error', (e) => {
      console.error('Mapbox GL JS Error in WelcomeScreen:', e);
      // Silently handle the error - the fallback background will show
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    });

    map.current.on('style.load', () => {
      if (!map.current) return;

      try {
        // Set beautiful atmosphere for the globe
        map.current.setFog({
          color: 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.8,
        });

        // Start continuous rotation
        let userInteracting = false;
        const spinEnabled = true;

        function spinGlobe() {
          if (!map.current || !spinEnabled || userInteracting) return;
          
          try {
            const zoom = map.current.getZoom();
            if (zoom < 5) {
              let distancePerSecond = 360 / 240; // Complete rotation in 4 minutes
              const center = map.current.getCenter();
              center.lng -= distancePerSecond;
              
              map.current.easeTo({ 
                center, 
                duration: 1000,
                easing: (t) => t 
              });
            }
          } catch (error) {
            console.error('Error during welcome screen globe spinning:', error);
            return;
          }
          
          requestAnimationFrame(spinGlobe);
        }

        spinGlobe();
      } catch (error) {
        console.error('Error setting up welcome screen map:', error);
        // Silently handle the error
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Check if we have a valid Mapbox token
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const hasValidMapboxToken = MAPBOX_TOKEN && 
                             MAPBOX_TOKEN !== 'YOUR_ACTUAL_MAPBOX_TOKEN_HERE' &&
                             MAPBOX_TOKEN.startsWith('pk.');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Globe Container or Fallback */}
      <div className="absolute inset-0">
        {hasValidMapboxToken ? (
          // Mapbox Globe
          <div 
            ref={mapContainer} 
            className="absolute inset-0 w-full h-full"
            style={{ 
              filter: 'blur(1px) brightness(0.7)',
              background: 'linear-gradient(to bottom, #0f0f23, #1a1a2e, #16213e)',
            }}
          />
        ) : (
          // Fallback animated background
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-black">
            <div className="absolute inset-0">
              {[...Array(30)].map((_, i) => (
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
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-teal-900/40" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Enhanced animated background particles */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
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
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-6xl mx-auto px-6">
          {/* Logo/Icon with enhanced animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  filter: ['brightness(1)', 'brightness(1.2)', 'brightness(1)']
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Globe className="w-24 h-24 text-white mx-auto drop-shadow-lg" />
              </motion.div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <Plane className="w-8 h-8 text-yellow-300 absolute top-2 right-2 drop-shadow-lg" />
              </motion.div>
              {/* Sparkle effects */}
              <motion.div
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: 0.5,
                  ease: "easeInOut"
                }}
                className="absolute -top-2 -left-2"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
              <motion.div
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [360, 180, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: 1,
                  ease: "easeInOut"
                }}
                className="absolute -bottom-2 -right-2"
              >
                <Sparkles className="w-4 h-4 text-pink-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Main heading with enhanced animation */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl"
          >
            Welcome to
            <motion.span
              animate={{ 
                color: ['#ffffff', '#fbbf24', '#f59e0b', '#ffffff'],
                textShadow: [
                  '0 0 20px rgba(251, 191, 36, 0)',
                  '0 0 20px rgba(251, 191, 36, 0.5)',
                  '0 0 30px rgba(245, 158, 11, 0.8)',
                  '0 0 20px rgba(251, 191, 36, 0)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="block"
            >
              WanderSpin!
            </motion.span>
          </motion.h1>

          {/* Updated subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
          >
            Log in to spin and find your perfect escape
          </motion.p>

          {/* Body copy */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
          >
            What's your travel vibe today?
          </motion.p>

          {/* Travel Style Selection with enhanced animations */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col md:flex-row justify-center gap-6 mb-16"
          >
            {travelStyles.map((style, index) => (
              <motion.button
                key={style.type}
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1.1 + index * 0.15,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -10,
                  rotateY: 5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden rounded-xl bg-gradient-to-r ${style.color} px-8 py-6 shadow-lg transition-all duration-300 border border-white/20 backdrop-blur-sm group min-w-[180px]`}
                onClick={() => onTravelStyleSelect(style.type)}
              >
                {/* Animated background overlay */}
                <motion.div 
                  className={`absolute inset-0 bg-gradient-to-r ${style.hoverColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  animate={{
                    background: [
                      `linear-gradient(45deg, ${style.color.split(' ')[1]}, ${style.color.split(' ')[3]})`,
                      `linear-gradient(90deg, ${style.color.split(' ')[1]}, ${style.color.split(' ')[3]})`,
                      `linear-gradient(135deg, ${style.color.split(' ')[1]}, ${style.color.split(' ')[3]})`,
                      `linear-gradient(45deg, ${style.color.split(' ')[1]}, ${style.color.split(' ')[3]})`
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                {/* Content with enhanced styling */}
                <div className="relative z-10">
                  <span className="text-white font-semibold text-xl">
                    {style.title}
                  </span>
                </div>
                
                {/* Sparkle effect on hover */}
                <motion.div
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4 text-white/80" />
                </motion.div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-30 transition-opacity duration-300 rounded-xl blur-sm" />
              </motion.button>
            ))}
          </motion.div>

          {/* Updated copy text */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
          >
            Let's spin & go!
          </motion.p>

          {!isAuthenticated && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="mt-8 text-white/80 text-sm drop-shadow-lg"
            >
              Sign in to save your discoveries and create personalized travel plans
            </motion.p>
          )}
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
    </div>
  );
};

export default WelcomeScreen;