import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  const destinationMarker = useRef<mapboxgl.Marker | null>(null);
  const destinationPopup = useRef<mapboxgl.Popup | null>(null);

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
      if (destinationMarker.current) {
        destinationMarker.current.remove();
      }
      if (destinationPopup.current) {
        destinationPopup.current.remove();
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
      // Phase 2: Stop spinning and show destination on map (2 seconds)
      stopSpinning();
      const country = getRandomCountryByStyle(travelStyle);
      setSelectedCountry(country);
      setStatus('found');
      
      // Show destination directly on the map
      showDestinationOnMap(country);
      
      setTimeout(() => {
        // Phase 3: Zoom to destination and show detailed card (3 seconds)
        setStatus('zooming');
        zoomToDestination(country);
      }, 3000);
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

  const showDestinationOnMap = (country: any) => {
    if (!map.current || mapError) return;

    try {
      // Create custom marker element with pulsing animation
      const markerElement = document.createElement('div');
      markerElement.className = 'destination-marker-found';
      markerElement.style.cssText = `
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #10b981, #059669);
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 8px 30px rgba(16, 185, 129, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: destinationFoundPulse 2s infinite;
        cursor: pointer;
        position: relative;
      `;

      // Add location icon inside the marker
      markerElement.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="white"/>
        </svg>
      `;

      // Create the marker
      destinationMarker.current = new mapboxgl.Marker(markerElement)
        .setLngLat([country.coordinates.lng, country.coordinates.lat])
        .addTo(map.current);

      // Create initial popup with "Destination Found" message
      const initialPopupContent = `
        <div style="
          background: linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.8));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          padding: 24px;
          text-align: center;
          min-width: 280px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        ">
          <div style="
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px auto;
            animation: destinationFoundScale 1s ease-out;
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <h2 style="
            color: white;
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 8px 0;
            font-family: system-ui, -apple-system, sans-serif;
          ">Destination Found!</h2>
          <h3 style="
            color: #fbbf24;
            font-size: 20px;
            font-weight: 600;
            margin: 0 0 4px 0;
            font-family: system-ui, -apple-system, sans-serif;
          ">${country.name}</h3>
          <p style="
            color: rgba(255,255,255,0.8);
            font-size: 14px;
            margin: 0;
            font-family: system-ui, -apple-system, sans-serif;
          ">${country.tagline}</p>
        </div>
      `;

      destinationPopup.current = new mapboxgl.Popup({
        offset: [0, -80],
        closeButton: false,
        closeOnClick: false,
        className: 'destination-found-popup'
      })
        .setLngLat([country.coordinates.lng, country.coordinates.lat])
        .setHTML(initialPopupContent)
        .addTo(map.current);

    } catch (error) {
      console.error('Error showing destination on map:', error);
    }
  };

  const zoomToDestination = (country: any) => {
    if (map.current && !mapError) {
      try {
        // Dramatic zoom to the destination
        map.current.flyTo({
          center: [country.coordinates.lng, country.coordinates.lat],
          zoom: 8,
          pitch: 45,
          bearing: 0,
          duration: 3000,
          essential: true,
          easing: (t) => {
            // Custom easing for dramatic effect
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          }
        });

        // Update popup with detailed destination card after zoom starts
        setTimeout(() => {
          if (destinationPopup.current && map.current) {
            const destination = createDestinationFromCountry(country);
            
            const detailedPopupContent = `
              <div style="
                background: linear-gradient(135deg, rgba(0,0,0,0.95), rgba(0,0,0,0.9));
                backdrop-filter: blur(15px);
                border: 1px solid rgba(255,255,255,0.2);
                border-radius: 20px;
                padding: 0;
                min-width: 320px;
                max-width: 400px;
                box-shadow: 0 25px 50px rgba(0,0,0,0.4);
                overflow: hidden;
                font-family: system-ui, -apple-system, sans-serif;
              ">
                <!-- Header with image placeholder -->
                <div style="
                  height: 160px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  position: relative;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                  <div style="
                    width: 80px;
                    height: 80px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(10px);
                  ">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                      <path d="M14,6L10.25,11L13.1,14.8L11.5,16C9.81,13.75 7,10 7,10L1,18H23L14,6Z"/>
                    </svg>
                  </div>
                </div>
                
                <!-- Content -->
                <div style="padding: 24px;">
                  <h2 style="
                    color: white;
                    font-size: 28px;
                    font-weight: bold;
                    margin: 0 0 8px 0;
                    text-align: center;
                  ">${destination.name}</h2>
                  
                  <p style="
                    color: #fbbf24;
                    font-size: 16px;
                    font-weight: 500;
                    margin: 0 0 20px 0;
                    text-align: center;
                  ">${destination.tagline}</p>
                  
                  <!-- Info Grid -->
                  <div style="
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-bottom: 20px;
                  ">
                    <div style="
                      background: rgba(255,255,255,0.1);
                      padding: 12px;
                      border-radius: 12px;
                      text-align: center;
                    ">
                      <div style="color: #10b981; font-size: 12px; font-weight: 600; margin-bottom: 4px;">BUDGET</div>
                      <div style="color: white; font-size: 14px; font-weight: 600;">${destination.budget_estimate}</div>
                    </div>
                    <div style="
                      background: rgba(255,255,255,0.1);
                      padding: 12px;
                      border-radius: 12px;
                      text-align: center;
                    ">
                      <div style="color: #3b82f6; font-size: 12px; font-weight: 600; margin-bottom: 4px;">BEST TIME</div>
                      <div style="color: white; font-size: 14px; font-weight: 600;">${destination.best_time_to_visit}</div>
                    </div>
                  </div>
                  
                  <!-- Activities -->
                  <div style="margin-bottom: 24px;">
                    <div style="color: #a855f7; font-size: 12px; font-weight: 600; margin-bottom: 8px;">TOP ACTIVITIES</div>
                    <div style="display: flex; flex-wrap: gap: 6px;">
                      ${destination.activities.slice(0, 3).map(activity => `
                        <span style="
                          background: rgba(168, 85, 247, 0.2);
                          color: #c084fc;
                          padding: 4px 8px;
                          border-radius: 6px;
                          font-size: 11px;
                          font-weight: 500;
                        ">${activity}</span>
                      `).join('')}
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div style="display: flex; gap: 8px;">
                    <button onclick="window.handleSaveDestination && window.handleSaveDestination()" style="
                      flex: 1;
                      background: linear-gradient(135deg, #ef4444, #dc2626);
                      color: white;
                      border: none;
                      padding: 12px;
                      border-radius: 12px;
                      font-weight: 600;
                      font-size: 14px;
                      cursor: pointer;
                      transition: all 0.2s;
                    " onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                      ❤️ Save
                    </button>
                    <button onclick="window.handleExploreDestination && window.handleExploreDestination()" style="
                      flex: 1;
                      background: linear-gradient(135deg, #3b82f6, #2563eb);
                      color: white;
                      border: none;
                      padding: 12px;
                      border-radius: 12px;
                      font-weight: 600;
                      font-size: 14px;
                      cursor: pointer;
                      transition: all 0.2s;
                    " onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                      🔍 Explore
                    </button>
                  </div>
                  
                  <button onclick="window.handleSpinAgain && window.handleSpinAgain()" style="
                    width: 100%;
                    background: rgba(255,255,255,0.1);
                    color: white;
                    border: 1px solid rgba(255,255,255,0.2);
                    padding: 12px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    margin-top: 8px;
                    transition: all 0.2s;
                  " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                    ⚡ Spin Again
                  </button>
                </div>
              </div>
            `;

            destinationPopup.current.setHTML(detailedPopupContent);

            // Set up global handlers for the buttons
            window.handleSaveDestination = () => {
              console.log('Save destination clicked');
              // You can add save functionality here
            };

            window.handleExploreDestination = () => {
              console.log('Explore destination clicked');
              onDestinationFound(destination);
            };

            window.handleSpinAgain = () => {
              console.log('Spin again clicked');
              // Reset the experience
              if (destinationPopup.current) {
                destinationPopup.current.remove();
              }
              if (destinationMarker.current) {
                destinationMarker.current.remove();
              }
              setStatus('spinning');
              setSelectedCountry(null);
              startGlobeSequence();
            };
          }
        }, 1500);

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
      
      {/* Status Overlay - Only show during spinning */}
      {status === 'spinning' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <motion.div
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
              Finding your perfect adventure destination
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        </div>
      )}

      {/* Travel Style Indicator */}
      <div className="absolute top-8 left-8 z-20">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              travelStyle === 'Solo' ? 'bg-purple-500' :
              travelStyle === 'Romantic' ? 'bg-pink-500' : 'bg-green-500'
            }`} />
            <span className="text-white font-medium">{travelStyle} Adventure</span>
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