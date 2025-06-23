import { useState, useEffect, useCallback } from 'react';
import { Country, CountryFilter, SpinResult, TravelStyle } from '@/types/country';
import { countrySpinService } from '@/services/countrySpinService';
import { useToast } from '@/hooks/use-toast';

export const useCountrySpin = (travelStyle?: TravelStyle) => {
  const [sessionId, setSessionId] = useState<string>('');
  const [currentCountry, setCurrentCountry] = useState<Country | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [sessionStats, setSessionStats] = useState<any>(null);
  const [availableCountries, setAvailableCountries] = useState<Country[]>([]);
  const { toast } = useToast();

  // Initialize session with travel style
  useEffect(() => {
    const newSessionId = countrySpinService.createSession(travelStyle);
    setSessionId(newSessionId);
    updateSessionStats(newSessionId);
    updateAvailableCountries(newSessionId, { travelStyle });
  }, [travelStyle]);

  // Update session statistics
  const updateSessionStats = useCallback((sessionId: string) => {
    const stats = countrySpinService.getSessionStats(sessionId);
    setSessionStats(stats);
  }, []);

  // Update available countries
  const updateAvailableCountries = useCallback((sessionId: string, filter?: CountryFilter) => {
    const countries = countrySpinService.getAvailableCountries(sessionId, filter);
    setAvailableCountries(countries);
  }, []);

  // Spin for a new country
  const spinCountry = useCallback(async (filter?: CountryFilter): Promise<SpinResult | null> => {
    if (!sessionId || isSpinning) return null;

    setIsSpinning(true);
    
    try {
      // Add artificial delay for better UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ensure travel style is included in filter
      const filterWithStyle = {
        ...filter,
        travelStyle: filter?.travelStyle || travelStyle
      };
      
      const result = countrySpinService.spinCountry(sessionId, filterWithStyle);
      
      setCurrentCountry(result.country);
      updateSessionStats(sessionId);
      updateAvailableCountries(sessionId, filterWithStyle);

      if (result.reset) {
        toast({
          title: "Fresh Start!",
          description: result.message,
          duration: 5000,
        });
      }

      return result;
    } catch (error) {
      console.error('Error spinning country:', error);
      toast({
        title: "Spin Error",
        description: "Failed to select a country. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSpinning(false);
    }
  }, [sessionId, isSpinning, travelStyle, toast, updateSessionStats, updateAvailableCountries]);

  // Reset session
  const resetSession = useCallback(() => {
    if (!sessionId) return;

    const success = countrySpinService.resetSession(sessionId);
    if (success) {
      setCurrentCountry(null);
      updateSessionStats(sessionId);
      updateAvailableCountries(sessionId, { travelStyle });
      toast({
        title: "Session Reset",
        description: "Starting fresh with all countries available again!",
      });
    }
  }, [sessionId, travelStyle, toast, updateSessionStats, updateAvailableCountries]);

  // Update preferences
  const updatePreferences = useCallback((preferences: { 
    adventureLevel?: string; 
    travelerType?: string;
    travelStyle?: TravelStyle;
  }) => {
    if (!sessionId) return;

    const success = countrySpinService.updateSessionPreferences(sessionId, preferences);
    if (success) {
      updateAvailableCountries(sessionId, { travelStyle: preferences.travelStyle || travelStyle });
    }
  }, [sessionId, travelStyle, updateAvailableCountries]);

  return {
    sessionId,
    currentCountry,
    isSpinning,
    sessionStats,
    availableCountries,
    spinCountry,
    resetSession,
    updatePreferences,
    updateAvailableCountries: (filter?: CountryFilter) => updateAvailableCountries(sessionId, { 
      ...filter, 
      travelStyle: filter?.travelStyle || travelStyle 
    })
  };
};