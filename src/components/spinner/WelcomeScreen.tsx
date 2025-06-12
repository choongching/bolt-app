import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plane, Globe, Sparkles } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface WelcomeScreenProps {
  onStartSpin: () => void;
  isAuthenticated: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartSpin, isAuthenticated }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    // Check if Mapbox token is available
    const hasMapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN && 
                          import.meta.env.VITE_MAPBOX_ACCESS_TOKEN !== 'YOUR_ACTUAL_MAPBOX_TOKEN_HERE';

    if (!hasMapboxToken || !mapContainer.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

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

    map.current.on('style.load', () => {
      if (!map.current) return;

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
        
        const zoom = map.current.getZoom();
        if (zoom < 5) {
          let distancePerSecond = 360 / 240; // Complete rotation in 4 minutes (slower for background effect)
          const center = map.current.getCenter();
          center.lng -= distancePerSecond;
          
          map.current.easeTo({ 
            center, 
            duration: 1000, 
            easing: (t) => t 
          });
        }
        
        requestAnimationFrame(spinGlobe);
      }

      spinGlobe();
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Globe Container */}
      <div className="absolute inset-0">
        {/* Mapbox Globe */}
        <div 
          ref={mapContainer} 
          className="absolute inset-0 w-full h-full"
          style={{ 
            filter: 'blur(1px) brightness(0.7)',
            background: 'linear-gradient(to bottom, #0f0f23, #1a1a2e, #16213e)',
          }}
        />
        
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
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
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
        <div className="text-center max-w-4xl mx-auto px-6">
          {/* Logo/Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <Globe className="w-24 h-24 text-white mx-auto drop-shadow-lg" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <Plane className="w-8 h-8 text-yellow-300 absolute top-2 right-2 drop-shadow-lg" />
              </motion.div>
            </div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl"
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
            className="text-xl md:text-2xl text-white/95 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-lg"
          >
            Let destiny choose your next adventure. Spin the globe and discover amazing destinations tailored just for you.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Button
              onClick={onStartSpin}
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-6 px-12 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 backdrop-blur-sm"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Start the Spin
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="ml-3"
              >
                <Globe className="w-6 h-6" />
              </motion.div>
            </Button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: Globe, title: "Random Discovery", desc: "Let chance guide your next adventure" },
              { icon: Sparkles, title: "Personalized", desc: "Tailored to your travel style" },
              { icon: Plane, title: "Ready to Go", desc: "Complete travel information included" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 shadow-xl"
              >
                <feature.icon className="w-12 h-12 text-yellow-300 mx-auto mb-4 drop-shadow-lg" />
                <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-lg">{feature.title}</h3>
                <p className="text-white/90 drop-shadow-lg">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {!isAuthenticated && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-8 text-white/80 text-sm drop-shadow-lg"
            >
              Sign in to save your discoveries and create personalized travel plans
            </motion.p>
          )}
        </div>
      </div>

      {/* Setup instructions for missing Mapbox token */}
      {(!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || 
        import.meta.env.VITE_MAPBOX_ACCESS_TOKEN === 'YOUR_ACTUAL_MAPBOX_TOKEN_HERE') && (
        <div className="absolute bottom-8 left-8 text-white/60 text-sm z-20">
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20 max-w-sm">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
              <span className="font-semibold">Enhanced Globe Available</span>
            </div>
            <div className="text-xs space-y-1">
              <div>• Add VITE_MAPBOX_ACCESS_TOKEN to .env</div>
              <div>• Get token from mapbox.com</div>
              <div>• Restart dev server for 3D globe</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;