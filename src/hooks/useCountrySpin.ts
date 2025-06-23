import { useState, useCallback } from 'react';
import { Country, TravelStyle } from '@/types/country';
import { getCountriesByTravelStyle, getRandomCountryByStyle } from '@/data/countries';

export const useCountrySpin = (travelStyle?: TravelStyle) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [availableCountries, setAvailableCountries] = useState<Country[]>([]);

  // Get available countries for a travel style
  const getAvailableCountries = useCallback((style: TravelStyle) => {
    return getCountriesByTravelStyle(style);
  }, []);

  // Spin for a random country
  const spinCountry = useCallback(async (style: TravelStyle): Promise<Country | null> => {
    if (isSpinning) return null;

    setIsSpinning(true);
    
    try {
      // Add artificial delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const country = getRandomCountryByStyle(style);
      return country;
    } catch (error) {
      console.error('Error spinning country:', error);
      return null;
    } finally {
      setIsSpinning(false);
    }
  }, [isSpinning]);

  return {
    isSpinning,
    availableCountries,
    spinCountry,
    getAvailableCountries
  };
};