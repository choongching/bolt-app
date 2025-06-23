import { Country } from '@/types/country';

// Curated database of countries organized by the three travel categories
export const countries: Country[] = [
  // ROMANTIC DESTINATIONS
  {
    id: 'GR',
    name: 'Greece',
    isoCode: 'GR',
    coordinates: { lat: 36.3932, lng: 25.4615 }, // Santorini coordinates
    adventureLevel: 'Casual Explorer',
    travelerType: ['Couple'],
    popularity: 9,
    tagline: 'Romantic Sunsets and Island Paradise',
    region: 'Europe',
    capital: 'Athens',
    currency: 'EUR',
    languages: ['Greek'],
    timeZone: 'EET',
    bestTimeToVisit: 'April-October',
    highlights: ['Santorini sunsets', 'Mykonos beaches', 'Ancient ruins', 'Wine tasting'],
    difficulty: 2
  },
  {
    id: 'IT',
    name: 'Italy',
    isoCode: 'IT',
    coordinates: { lat: 45.4408, lng: 12.3155 }, // Venice coordinates
    adventureLevel: 'Casual Explorer',
    travelerType: ['Couple'],
    popularity: 10,
    tagline: 'Romance in Every Corner',
    region: 'Europe',
    capital: 'Rome',
    currency: 'EUR',
    languages: ['Italian'],
    timeZone: 'CET',
    bestTimeToVisit: 'April-June, September-October',
    highlights: ['Venice canals', 'Tuscan vineyards', 'Amalfi Coast', 'Renaissance art'],
    difficulty: 2
  },
  {
    id: 'FR',
    name: 'France',
    isoCode: 'FR',
    coordinates: { lat: 48.8566, lng: 2.3522 }, // Paris coordinates
    adventureLevel: 'Casual Explorer',
    travelerType: ['Couple'],
    popularity: 10,
    tagline: 'City of Love and Lights',
    region: 'Europe',
    capital: 'Paris',
    currency: 'EUR',
    languages: ['French'],
    timeZone: 'CET',
    bestTimeToVisit: 'April-June, September-October',
    highlights: ['Eiffel Tower', 'Seine River cruises', 'Champagne region', 'Château visits'],
    difficulty: 2
  },
  {
    id: 'MV',
    name: 'Maldives',
    isoCode: 'MV',
    coordinates: { lat: 3.2028, lng: 73.2207 },
    adventureLevel: 'Casual Explorer',
    travelerType: ['Couple'],
    popularity: 8,
    tagline: 'Tropical Paradise for Two',
    region: 'Asia',
    capital: 'Malé',
    currency: 'MVR',
    languages: ['Dhivehi'],
    timeZone: 'MVT',
    bestTimeToVisit: 'November-April',
    highlights: ['Overwater bungalows', 'Crystal clear waters', 'Coral reefs', 'Spa treatments'],
    difficulty: 1
  },

  // FAMILY DESTINATIONS
  {
    id: 'US',
    name: 'United States',
    isoCode: 'US',
    coordinates: { lat: 28.3772, lng: -81.5707 }, // Orlando, Florida coordinates
    adventureLevel: 'Casual Explorer',
    travelerType: ['Family'],
    popularity: 10,
    tagline: 'Magical Adventures for All Ages',
    region: 'North America',
    capital: 'Washington D.C.',
    currency: 'USD',
    languages: ['English'],
    timeZone: 'EST',
    bestTimeToVisit: 'March-May, September-November',
    highlights: ['Disney World', 'National Parks', 'Beaches', 'Museums'],
    difficulty: 2
  },
  {
    id: 'AU',
    name: 'Australia',
    isoCode: 'AU',
    coordinates: { lat: -33.8688, lng: 151.2093 }, // Sydney coordinates
    adventureLevel: 'Casual Explorer',
    travelerType: ['Family'],
    popularity: 8,
    tagline: 'Wildlife Wonders Down Under',
    region: 'Oceania',
    capital: 'Canberra',
    currency: 'AUD',
    languages: ['English'],
    timeZone: 'AEST',
    bestTimeToVisit: 'March-May, September-November',
    highlights: ['Great Barrier Reef', 'Sydney Opera House', 'Kangaroos', 'Beaches'],
    difficulty: 3
  },
  {
    id: 'CA',
    name: 'Canada',
    isoCode: 'CA',
    coordinates: { lat: 51.0447, lng: -114.0719 }, // Calgary coordinates
    adventureLevel: 'Casual Explorer',
    travelerType: ['Family'],
    popularity: 7,
    tagline: 'Natural Wonders and Friendly Faces',
    region: 'North America',
    capital: 'Ottawa',
    currency: 'CAD',
    languages: ['English', 'French'],
    timeZone: 'EST',
    bestTimeToVisit: 'May-September',
    highlights: ['Banff National Park', 'Niagara Falls', 'Wildlife viewing', 'Lakes'],
    difficulty: 3
  },
  {
    id: 'SG',
    name: 'Singapore',
    isoCode: 'SG',
    coordinates: { lat: 1.3521, lng: 103.8198 },
    adventureLevel: 'Casual Explorer',
    travelerType: ['Family'],
    popularity: 8,
    tagline: 'Family Fun in the Garden City',
    region: 'Asia',
    capital: 'Singapore',
    currency: 'SGD',
    languages: ['English', 'Mandarin', 'Malay', 'Tamil'],
    timeZone: 'SGT',
    bestTimeToVisit: 'February-April',
    highlights: ['Universal Studios', 'Gardens by the Bay', 'Zoo', 'Sentosa Island'],
    difficulty: 1
  },

  // SOLO DESTINATIONS
  {
    id: 'TH',
    name: 'Thailand',
    isoCode: 'TH',
    coordinates: { lat: 13.7563, lng: 100.5018 }, // Bangkok coordinates
    adventureLevel: 'Adventurous Spirit',
    travelerType: ['Solo'],
    popularity: 9,
    tagline: 'Solo Soul-Searching in the Land of Smiles',
    region: 'Asia',
    capital: 'Bangkok',
    currency: 'THB',
    languages: ['Thai'],
    timeZone: 'ICT',
    bestTimeToVisit: 'November-March',
    highlights: ['Temples', 'Street food', 'Islands', 'Meditation retreats'],
    difficulty: 4
  },
  {
    id: 'IS',
    name: 'Iceland',
    isoCode: 'IS',
    coordinates: { lat: 64.1466, lng: -21.9426 }, // Reykjavik coordinates
    adventureLevel: 'Extreme Wanderer',
    travelerType: ['Solo'],
    popularity: 7,
    tagline: 'Solo Journey Through Fire and Ice',
    region: 'Europe',
    capital: 'Reykjavik',
    currency: 'ISK',
    languages: ['Icelandic'],
    timeZone: 'GMT',
    bestTimeToVisit: 'June-August, September-March',
    highlights: ['Northern Lights', 'Geysers', 'Glaciers', 'Hot springs'],
    difficulty: 7
  },
  {
    id: 'PE',
    name: 'Peru',
    isoCode: 'PE',
    coordinates: { lat: -13.1631, lng: -72.5450 }, // Machu Picchu coordinates
    adventureLevel: 'Extreme Wanderer',
    travelerType: ['Solo'],
    popularity: 8,
    tagline: 'Solo Trek to Ancient Mysteries',
    region: 'South America',
    capital: 'Lima',
    currency: 'PEN',
    languages: ['Spanish', 'Quechua'],
    timeZone: 'PET',
    bestTimeToVisit: 'May-September',
    highlights: ['Machu Picchu', 'Inca Trail', 'Sacred Valley', 'Cusco'],
    difficulty: 8
  },
  {
    id: 'JP',
    name: 'Japan',
    isoCode: 'JP',
    coordinates: { lat: 35.0116, lng: 135.7681 }, // Kyoto coordinates
    adventureLevel: 'Adventurous Spirit',
    travelerType: ['Solo'],
    popularity: 8,
    tagline: 'Solo Journey Through Ancient and Modern',
    region: 'Asia',
    capital: 'Tokyo',
    currency: 'JPY',
    languages: ['Japanese'],
    timeZone: 'JST',
    bestTimeToVisit: 'March-May, September-November',
    highlights: ['Cherry blossoms', 'Traditional ryokans', 'Temple gardens', 'Hot springs'],
    difficulty: 3
  }
];

// Helper functions for country data
export const getCountryByIsoCode = (isoCode: string): Country | null => {
  return countries.find(country => country.isoCode === isoCode) || null;
};

export const getCountriesByTravelStyle = (style: 'Romantic' | 'Family' | 'Solo'): Country[] => {
  const typeMap = {
    'Romantic': 'Couple',
    'Family': 'Family',
    'Solo': 'Solo'
  };
  
  return countries.filter(country => 
    country.travelerType.includes(typeMap[style] as any)
  );
};

export const getCountriesByRegion = (region: string): Country[] => {
  return countries.filter(country => country.region === region);
};

export const getCountriesByAdventureLevel = (level: string): Country[] => {
  return countries.filter(country => country.adventureLevel === level);
};

export const getAllRegions = (): string[] => {
  return [...new Set(countries.map(country => country.region))];
};

export const getAllAdventureLevels = (): string[] => {
  return ['Casual Explorer', 'Adventurous Spirit', 'Extreme Wanderer'];
};

export const getAllTravelerTypes = (): string[] => {
  return ['Solo', 'Couple', 'Family', 'Friends', 'Business'];
};

// Get random country from specific travel style
export const getRandomCountryByStyle = (style: 'Romantic' | 'Family' | 'Solo'): Country => {
  const styleCountries = getCountriesByTravelStyle(style);
  const randomIndex = Math.floor(Math.random() * styleCountries.length);
  return styleCountries[randomIndex];
};