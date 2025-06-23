import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plane, Globe, Sparkles, Heart, Users, Briefcase } from 'lucide-react';
import SplitText from '@/components/ui/split-text';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { TravelerType } from '@/types/destination';

interface WelcomeScreenProps {
  onTravelStyleSelect: (type: TravelerType) => void;
  isAuthenticated: boolean;
}

const travelStyles = [
  {
    type: 'couple' as TravelerType,
    icon: Heart,
    title: 'Romantic Getaway',
    description: 'Perfect destinations for couples seeking romance and intimate experiences',
    color: 'from-pink-500 to-red-500',
    hoverColor: 'from-pink-600 to-red-600'
  },
  {
    type: 'family' as TravelerType,
    icon: Users,
    title: 'Family Adventure',
    description: 'Kid-friendly destinations with activities for the whole family',
    color: 'from-green-500 to-blue-500',
    hoverColor: 'from-green-600 to-blue-600'
  },
  {
    type: 'solo' as TravelerType,
    icon: Briefcase,
    title: 'Solo Explorer',
    description: 'Discover amazing places at your own pace with complete freedom',
    color: 'from-purple-500 to-indigo-500',
    hoverColor: 'from-purple-600 to-indigo-600'
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
        
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-teal-900/40" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
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
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <Globe className="w-20 h-20 text-white mx-auto drop-shadow-lg" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <Plane className="w-6 h-6 text-yellow-300 absolute top-1 right-1 drop-shadow-lg" />
              </motion.div>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl"
          >
            Travel
            <motion.span
              animate={{ color: ['#ffffff', '#fbbf24', '#ffffff'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="block"
            >
              Spinner
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-white/95 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
          >
            Choose your travel style and let destiny guide you to amazing destinations tailored just for you.
          </motion.p>

          {/* Travel Style Selection */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12"
          >
            {travelStyles.map((style, index) => (
              <motion.div
                key={style.type}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                className="group cursor-pointer"
                onClick={() => onTravelStyleSelect(style.type)}
              >
                <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${style.color} p-8 shadow-2xl transition-all duration-300 group-hover:shadow-3xl border border-white/20 backdrop-blur-sm`}>
                  {/* Hover overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.hoverColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                        <style.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-4 group-hover:scale-105 transition-transform duration-300">
                      {style.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-white/90 text-sm leading-relaxed mb-6">
                      {style.description}
                    </p>
                    
                    {/* Call to action */}
                    <div className="flex items-center justify-center text-white/80 group-hover:text-white transition-colors duration-300">
                      <span className="text-sm font-medium">Click to explore</span>
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/10 rounded-full blur-lg group-hover:bg-white/20 transition-colors duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: Globe, title: "Smart Discovery", desc: "AI-powered destination matching" },
              { icon: Sparkles, title: "Personalized", desc: "Tailored to your travel style" },
              { icon: Plane, title: "Ready to Go", desc: "Complete travel information included" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 shadow-xl"
              >
                <feature.icon className="w-10 h-10 text-yellow-300 mx-auto mb-4 drop-shadow-lg" />
                <h3 className="text-lg font-semibold text-white mb-2 drop-shadow-lg">{feature.title}</h3>
                <p className="text-white/90 text-sm drop-shadow-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {!isAuthenticated && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
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