import { useState, useEffect } from 'react';
import { getVisaRequirementByDestination, getVisaRequirementForCitizen, getLastUpdateDate } from '@/data/visaRequirements';

export const useVisaRequirements = () => {
  const [userCountry, setUserCountry] = useState<string>('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    // Try to detect user's country (you could use a geolocation service here)
    // For now, we'll leave it empty and show general requirements
    setLastUpdated(getLastUpdateDate());
  }, []);

  const getVisaInfo = (destinationCountry: string, destinationCity?: string) => {
    return getVisaRequirementByDestination(destinationCountry, destinationCity);
  };

  const getPersonalizedVisaRequirement = (destinationCountry: string, citizenshipCountry?: string) => {
    const country = citizenshipCountry || userCountry;
    if (country) {
      return getVisaRequirementForCitizen(destinationCountry, country);
    }
    const visaInfo = getVisaRequirementByDestination(destinationCountry);
    return visaInfo?.requirements.general || 'Visa requirements not available';
  };

  return {
    userCountry,
    setUserCountry,
    lastUpdated,
    getVisaInfo,
    getPersonalizedVisaRequirement
  };
};