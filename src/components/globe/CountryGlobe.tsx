import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { motion } from 'framer-motion';
import { Country } from '@/types/country';

// Set your Mapbox access token from environment variables
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

interface CountryGlobeProps {
  onCountrySelected: (country: Country) => void;
  availableCountries?: Country[];
  isSpinning?: boolean;
  targetCountry?: Country | null;
}

const CountryGlobe: React.FC<CountryGlobeProps> = ({ 
  onCountrySelected, 
  availableCountries = [],
  isSpinning = false,
  targetCountry = null
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const spinningRef = useRef<number | null>(null);
  const userInteractingRef = useRef(false);
  const [isZooming, setIsZooming] = useState(false);

  // Validate Mapbox token
  const isValidMapboxToken = MAPBOX_TOKEN && 
    MAPBOX_TOKEN !== 'YOUR_ACTUAL_MAPBOX_TOKEN_HERE' && 
    MAPBOX_TOKEN.startsWith('pk.');

  useEffect(() => {
    if (!isValidMapboxToken || !mapContainer.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize the map with globe projection - start zoomed out
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      projection: 'globe',
      zoom: 1.2, // Start more zoomed out
      center: [0, 20],
      pitch: 0,
      bearing: 0,
      antialias: true,
      attributionControl: false,
      maxZoom: 20,
    });

    // Add error handling
    map.current.on('error', (e) => {
      console.error('Mapbox GL JS Error:', e);
      setMapError('Failed to load map. Please check your internet connection.');
    });

    // Configure globe settings
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

        // Add country markers
        addCountryMarkers();
        
        // Start with gentle zoom in
        setTimeout(() => {
          if (map.current) {
            map.current.easeTo({
              zoom: 1.8,
              duration: 2000,
              easing: (t) => t * (2 - t)
            });
          }
        }, 500);
        
        // Start spinning if needed
        if (isSpinning) {
          startSpinning();
        }
      } catch (error) {
        console.error('Error setting up map:', error);
        setMapError('Map setup failed.');
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
    }

    return () => {
      if (spinningRef.current) {
        cancelAnimationFrame(spinningRef.current);
      }
      if (map.current) {
        map.current.remove();
      }
    };
  }, [isValidMapboxToken]);

  // Update markers when available countries change
  useEffect(() => {
    if (map.current && isValidMapboxToken) {
      clearMarkers();
      addCountryMarkers();
    }
  }, [availableCountries, isValidMapboxToken]);

  // Handle spinning animation - FIXED: Properly stop spinning when isSpinning becomes false
  useEffect(() => {
    if (isSpinning) {
      startSpinning();
    } else {
      stopSpinning();
    }
  }, [isSpinning]);

  // Handle target country selection with dramatic zoom
  useEffect(() => {
    if (targetCountry && map.current && !mapError && !isZooming) {
      flyToCountry(targetCountry);
    }
  }, [targetCountry, mapError, isZooming]);

  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  const addCountryMarkers = () => {
    if (!map.current) return;

    try {
      availableCountries.forEach((country) => {
        // Create custom marker element based on travel type
        const markerElement = document.createElement('div');
        markerElement.className = 'country-marker';
        
        // Color coding based on traveler type
        let markerColor = '#8b5cf6'; // Default purple for Solo
        if (country.travelerType.includes('Couple')) {
          markerColor = '#ef4444'; // Red for Romantic
        } else if (country.travelerType.includes('Family')) {
          markerColor = '#10b981'; // Green for Family
        }

        markerElement.style.cssText = `
          width: 16px;
          height: 16px;
          background: ${markerColor};
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
          animation: countryPulse 2s infinite;
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
          .setLngLat([country.coordinates.lng, country.coordinates.lat])
          .addTo(map.current!);

        // Add popup with country information
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          className: 'country-popup'
        }).setHTML(`
          <div style="
            background: linear-gradient(135deg, ${markerColor} 0%, ${markerColor}dd 100%);
            color: white;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
            font-family: system-ui, -apple-system, sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            min-width: 200px;
          ">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${country.name}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; opacity: 0.9;">${country.tagline}</p>
            <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 11px;">
              <span style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 10px;">
                ${country.adventureLevel}
              </span>
              <span style="background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 10px;">
                ${country.region}
              </span>
            </div>
          </div>
        `);

        marker.setPopup(popup);

        // Add click handler
        markerElement.addEventListener('click', () => {
          onCountrySelected(country);
        });

        markers.current.push(marker);
      });
    } catch (error) {
      console.error('Error adding country markers:', error);
    }
  };

  const startSpinning = () => {
    if (!map.current || spinningRef.current) return; // Prevent multiple spinning animations

    function spinGlobe() {
      if (!map.current || !isSpinning) {
        // FIXED: Stop spinning when isSpinning becomes false
        if (spinningRef.current) {
          cancelAnimationFrame(spinningRef.current);
          spinningRef.current = null;
        }
        return;
      }

      try {
        const zoom = map.current.getZoom();
        if (!userInteractingRef.current && zoom < 5) {
          const distancePerSecond = 360 / 90; // Complete rotation in 1.5 minutes
          const center = map.current.getCenter();
          center.lng -= distancePerSecond;
          
          map.current.easeTo({ 
            center, 
            duration: 1000,
            easing: (t: number) => t
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
      spinningRef.current = null;
    }
  };

  const flyToCountry = (country: Country) => {
    if (!map.current || isZooming) return;

    setIsZooming(true);

    try {
      // Stop any ongoing spinning
      stopSpinning();

      // First, add a special marker for the selected country
      const selectedMarkerElement = document.createElement('div');
      selectedMarkerElement.style.cssText = `
        width: 24px;
        height: 24px;
        background: #ef4444;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 16px rgba(239, 68, 68, 0.6);
        animation: selectedCountryPulse 1s infinite;
      `;

      const selectedMarker = new mapboxgl.Marker(selectedMarkerElement)
        .setLngLat([country.coordinates.lng, country.coordinates.lat])
        .addTo(map.current);

      // Dramatic zoom in with multiple stages
      map.current.flyTo({
        center: [country.coordinates.lng, country.coordinates.lat],
        zoom: 8, // Much closer zoom
        pitch: 60, // Dramatic angle
        bearing: 0,
        duration: 3000,
        essential: true,
        easing: (t) => {
          // Custom easing for dramatic effect
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
      });

      // After zoom completes, clean up
      setTimeout(() => {
        selectedMarker.remove();
        setIsZooming(false);
      }, 3000);

    } catch (error) {
      console.error('Error flying to country:', error);
      setIsZooming(false);
    }
  };

  if (!isValidMapboxToken) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h2 className="text-2xl font-bold mb-4">Enhanced Globe Experience</h2>
          <p className="mb-4">Add a valid Mapbox token to enable the interactive 3D globe</p>
          <div className="text-sm opacity-80">
            <p>• Get token from mapbox.com</p>
            <p>• Add to .env as VITE_MAPBOX_ACCESS_TOKEN</p>
            <p>• Token must start with 'pk.'</p>
          </div>
        </div>
      </div>
    );
  }

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
      
      {/* Custom CSS for markers and animations */}
      <style jsx>{`
        @keyframes countryPulse {
          0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(139, 92, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
        }
        
        @keyframes selectedCountryPulse {
          0% { 
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.8);
            transform: scale(1);
          }
          50% { 
            box-shadow: 0 0 0 15px rgba(239, 68, 68, 0);
            transform: scale(1.2);
          }
          100% { 
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
            transform: scale(1);
          }
        }
        
        .mapboxgl-popup-content {
          padding: 0 !important;
          border-radius: 8px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3) !important;
        }
        
        .mapboxgl-popup-tip {
          border-top-color: #8b5cf6 !important;
        }
      `}</style>

      {/* Country count indicator */}
      <div className="absolute top-8 right-8 text-white/80 text-sm z-10">
        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold">{availableCountries.length}</div>
            <div className="text-xs">Countries Available</div>
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

export default CountryGlobe;