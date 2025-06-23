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
  {
    id: 'CZ',
    name: 'Czech Republic',
    isoCode: 'CZ',
    coordinates: { lat: 50.0755, lng: 14.4378 }, // Prague coordinates
    adventureLevel: 'Casual Explorer',
    travelerType: ['Couple'],
    popularity: 7,
    tagline: 'Fairytale Romance in Prague',
    region: 'Europe',
    capital: 'Prague',
    currency: 'CZK',
    languages: ['Czech'],
    timeZone: 'CET',
    bestTimeToVisit: 'April-June, September-October',
    highlights: ['Prague Castle', 'Charles Bridge', 'Old Town Square', 'River cruises'],
    difficulty: 2
  },
  {
    id: 'MA',
    name: 'Morocco',
    isoCode: 'MA',
    coordinates: { lat: 31.6295, lng: -7.9811 }, // Marrakech coordinates
    adventureLevel: 'Adventurous Spirit',
    travelerType: ['Couple'],
    popularity: 7,
    tagline: 'Exotic Romance in Imperial Cities',
    region: 'Africa',
    capital: 'Rabat',
    currency: 'MAD',
    languages: ['Arabic', 'French'],
    timeZone: 'WET',
    bestTimeToVisit: 'March-May, September-November',
    highlights: ['Marrakech souks', 'Sahara Desert', 'Riads', 'Atlas Mountains'],
    difficulty: 4
  },
  {
    id: 'JP',
    name: 'Japan',
    isoCode: 'JP',
    coordinates: { lat: 35.0116, lng: 135.7681 }, // Kyoto coordinates
    adventureLevel: 'Adventurous Spirit',
    travelerType: ['Couple'],
    popularity: 8,
    tagline: 'Cherry Blossoms and Ancient Romance',
    region: 'Asia',
    capital: 'Tokyo',
    currency: 'JPY',
    languages: ['Japanese'],
    timeZone: 'JST',
    bestTimeToVisit: 'March-May, September-November',
    highlights: ['Cherry blossoms', 'Traditional ryokans', 'Temple gardens', 'Hot springs'],
    difficulty: 3
  },
  {
    id: 'TR',
    name: 'Turkey',
    isoCode: 'TR',
    coordinates: { lat: 38.3232, lng: 34.9245 }, // Cappadocia coordinates
    adventureLevel: 'Adventurous Spirit',
    travelerType: ['Couple'],
    popularity: 7,
    tagline: 'Hot Air Balloons and Ancient Love Stories',
    region: 'Europe',
    capital: 'Ankara',
    currency: 'TRY',
    languages: ['Turkish'],
    timeZone: 'TRT',
    bestTimeToVisit: 'April-May, September-November',
    highlights: ['Cappadocia balloons', 'Istanbul bridges', 'Pamukkale', 'Bosphorus cruises'],
    difficulty: 4
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
    id: 'CR',
    name: 'Costa Rica',
    isoCode: 'CR',
    coordinates: { lat: 9.7489, lng: -83.7534 },
    adventureLevel: 'Adventurous Spirit',
    travelerType: ['Family'],
    popularity: 7,
    tagline: 'Pura Vida Family Adventures',
    region: 'North America',
    capital: 'San José',
    currency: 'CRC',
    languages: ['Spanish'],
    timeZone: 'CST',
    bestTimeToVisit: 'December-April',
    highlights: ['Zip-lining', 'Wildlife parks', 'Volcanoes', 'Beaches'],
    difficulty: 4
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
  {
    id: 'GB',
    name: 'United Kingdom',
    isoCode: 'GB',
    coordinates: { lat: 51.5074, lng: -0.1278 }, // London coordinates
    adventureLevel: 'Casual Explorer',
    travelerType: ['Family'],
    popularity: 8,
    tagline: 'Royal Adventures and Harry Potter Magic',
    region: 'Europe',
    capital: 'London',
    currency: 'GBP',
    languages: ['English'],
    timeZone: 'GMT',
    bestTimeToVisit: 'May-September',
    highlights: ['Harry Potter studios', 'Castles', 'Museums', 'Countryside'],
    difficulty: 2
  },
  {
    id: 'NZ',
    name: 'New Zealand',
    isoCode: 'NZ',
    coordinates: { lat: -45.0312, lng: 168.6626 }, // Queenstown coordinates
    adventureLevel: 'Adventurous Spirit',
    travelerType: ['Family'],
    popularity: 7,
    tagline: 'Middle-earth Family Adventures',
    region: 'Oceania',
    capital: 'Wellington',
    currency: 'NZD',
    languages: ['English'],
    timeZone: 'NZST',
    bestTimeToVisit: 'December-February, March-May',
    highlights: ['Hobbiton', 'Adventure activities', 'Fjords', 'Glaciers'],
    difficulty: 5
  },
  {
    id: 'MX',
    name: 'Mexico',
    isoCode: 'MX',
    coordinates: { lat: 20.6296, lng: -87.0739 }, // Cancun coordinates
    adventureLevel: 'Casual Explorer',
    travelerType: ['Family'],
    popularity: 8,
    tagline: 'Beach Fun and Ancient Wonders',
    region: 'North America',
    capital: 'Mexico City',
    currency: 'MXN',
    languages: ['Spanish'],
    timeZone: 'CST',
    bestTimeToVisit: 'December-April',
    highlights: ['Mayan ruins', 'Beaches', 'Cenotes', 'Family resorts'],
    difficulty: 3
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
    id: 'IN',
    name: 'India',
    isoCode: 'IN',
    coordinates: { lat: 27.1751, lng: 78.0421 }, // Agra coordinates (Taj Mahal)
    adventureLevel: 'Extreme Wanderer',
    travelerType: ['Solo'],
    popularity: 8,
    tagline: 'Solo Spiritual Journey Through Colors and Chaos',
    region: 'Asia',
    capital: 'New Delhi',
    currency: 'INR',
    languages: ['Hindi', 'English'],
    timeZone: 'IST',
    bestTimeToVisit: 'October-March',
    highlights: ['Taj Mahal', 'Rajasthan palaces', 'Kerala backwaters', 'Yoga retreats'],
    difficulty: 9
  },
  {
    id: 'VN',
    name: 'Vietnam',
    isoCode: 'VN',
    coordinates: { lat: 21.0285, lng: 105.8542 }, // Hanoi coordinates
    adventureLevel: 'Adventurous Spirit',
    travelerType: ['Solo'],
    popularity: 7,
    tagline: 'Solo Adventure Through Ancient and Modern',
    region: 'Asia',
    capital: 'Hanoi',
    currency: 'VND',
    languages: ['Vietnamese'],
    timeZone: 'ICT',
    bestTimeToVisit: 'February-April, August-October',
    highlights: ['Ha Long Bay', 'Motorbike tours', 'Street food', 'History'],
    difficulty: 6
  },
  {
    id: 'PT',
    name: 'Portugal',
    isoCode: 'PT',
    coordinates: { lat: 38.7223, lng: -9.1393 }, // Lisbon coordinates
    adventureLevel: 'Casual Explorer',
    travelerType: ['Solo'],
    popularity: 6,
    tagline: 'Solo Wandering Through Coastal Charm',
    region: 'Europe',
    capital: 'Lisbon',
    currency: 'EUR',
    languages: ['Portuguese'],
    timeZone: 'WET',
    bestTimeToVisit: 'March-May, September-October',
    highlights: ['Porto wine cellars', 'Coastal towns', 'Fado music', 'Pastéis de nata'],
    difficulty: 2
  },
  {
    id: 'NP',
    name: 'Nepal',
    isoCode: 'NP',
    coordinates: { lat: 27.7172, lng: 85.3240 }, // Kathmandu coordinates
    adventureLevel: 'Extreme Wanderer',
    travelerType: ['Solo'],
    popularity: 6,
    tagline: 'Solo Trek to the Roof of the World',
    region: 'Asia',
    capital: 'Kathmandu',
    currency: 'NPR',
    languages: ['Nepali'],
    timeZone: 'NPT',
    bestTimeToVisit: 'September-November, March-May',
    highlights: ['Everest Base Camp', 'Annapurna Circuit', 'Temples', 'Mountain views'],
    difficulty: 9
  },
  {
    id: 'ID',
    name: 'Indonesia',
    isoCode: 'ID',
    coordinates: { lat: -8.3405, lng: 115.0920 }, // Bali coordinates
    adventureLevel: 'Adventurous Spirit',
    travelerType: ['Solo'],
    popularity: 8,
    tagline: 'Solo Island-Hopping and Self-Discovery',
    region: 'Asia',
    capital: 'Jakarta',
    currency: 'IDR',
    languages: ['Indonesian'],
    timeZone: 'WIB',
    bestTimeToVisit: 'April-October',
    highlights: ['Bali temples', 'Volcano hikes', 'Island hopping', 'Yoga retreats'],
    difficulty: 5
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