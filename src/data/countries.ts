import { Country } from '@/types/country';

// Curated database of countries organized by the three travel categories
export const countries: Country[] = [
  // CASUAL ADVENTURE DESTINATIONS - UPDATED WITH ADVENTUROUS BUT POPULAR
  {
    id: 'NP',
    name: 'Nepal',
    isoCode: 'NP',
    coordinates: { lat: 27.7172, lng: 85.3240 }, // Kathmandu coordinates
    adventureLevel: 'Adventurous Spirit',
    travelerType: ['Couple'],
    popularity: 8,
    tagline: 'Everest Base Camp, Well-Established Trekking Routes',
    region: 'Asia',
    capital: 'Kathmandu',
    currency: 'NPR',
    languages: ['Nepali'],
    timeZone: 'NPT',
    bestTimeToVisit: 'October-November, March-May',
    highlights: ['Everest Base Camp trek', 'Annapurna Circuit', 'Kathmandu temples', 'Mountain views'],
    difficulty: 7
  },
  {
    id: 'JO',
    name: 'Jordan',
    isoCode: 'JO',
    coordinates: { lat: 30.3285, lng: 35.4444 }, // Petra coordinates
    adventureLevel: 'Adventurous Spirit',
    travelerType: ['Couple'],
    popularity: 8,
    tagline: 'Petra, Wadi Rum, Stable and Tourist-Friendly',
    region: 'Middle East',
    capital: 'Amman',
    currency: 'JOD',
    languages: ['Arabic'],
    timeZone: 'EET',
    bestTimeToVisit: 'March-May, September-November',
    highlights: ['Petra ancient city', 'Wadi Rum desert', 'Dead Sea', 'Jerash ruins'],
    difficulty: 5
  },
  {
    id: 'CL',
    name: 'Chile',
    isoCode: 'CL',
    coordinates: { lat: -22.9576, lng: -68.1984 }, // Atacama Desert coordinates
    adventureLevel: 'Adventurous Spirit',
    travelerType: ['Couple'],
    popularity: 7,
    tagline: 'Patagonia, Atacama Desert, Good Infrastructure',
    region: 'South America',
    capital: 'Santiago',
    currency: 'CLP',
    languages: ['Spanish'],
    timeZone: 'CLT',
    bestTimeToVisit: 'December-March (Patagonia), March-May (Atacama)',
    highlights: ['Torres del Paine', 'Atacama Desert', 'Easter Island', 'Wine valleys'],
    difficulty: 6
  },
  {
    id: 'TZ',
    name: 'Tanzania',
    isoCode: 'TZ',
    coordinates: { lat: -3.0674, lng: 37.3556 }, // Kilimanjaro coordinates
    adventureLevel: 'Adventurous Spirit',
    travelerType: ['Couple'],
    popularity: 8,
    tagline: 'Kilimanjaro, Serengeti, Excellent Safari Infrastructure',
    region: 'Africa',
    capital: 'Dodoma',
    currency: 'TZS',
    languages: ['Swahili', 'English'],
    timeZone: 'EAT',
    bestTimeToVisit: 'June-October (dry season)',
    highlights: ['Mount Kilimanjaro', 'Serengeti National Park', 'Ngorongoro Crater', 'Zanzibar beaches'],
    difficulty: 6
  },
  {
    id: 'PE',
    name: 'Peru',
    isoCode: 'PE',
    coordinates: { lat: -13.1631, lng: -72.5450 }, // Machu Picchu coordinates
    adventureLevel: 'Adventurous Spirit',
    travelerType: ['Couple'],
    popularity: 9,
    tagline: 'Machu Picchu, Inca Trail, Excellent Tour Operators',
    region: 'South America',
    capital: 'Lima',
    currency: 'PEN',
    languages: ['Spanish', 'Quechua'],
    timeZone: 'PET',
    bestTimeToVisit: 'May-September (dry season)',
    highlights: ['Machu Picchu', 'Inca Trail', 'Sacred Valley', 'Amazon rainforest'],
    difficulty: 7
  },

  // OFFBEAT JOURNEY DESTINATIONS (formerly Family)
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

  // CHILL TRIP DESTINATIONS (formerly Solo) - UPDATED LIST
  {
    id: 'PT',
    name: 'Portugal',
    isoCode: 'PT',
    coordinates: { lat: 38.7223, lng: -9.1393 }, // Lisbon coordinates
    adventureLevel: 'Casual Explorer',
    travelerType: ['Solo'],
    popularity: 8,
    tagline: 'Slow Pace, Affordable Luxury, Excellent Food and Wine',
    region: 'Europe',
    capital: 'Lisbon',
    currency: 'EUR',
    languages: ['Portuguese'],
    timeZone: 'WET',
    bestTimeToVisit: 'April-October',
    highlights: ['Porto wine cellars', 'Sintra palaces', 'Coastal towns', 'Pastéis de nata'],
    difficulty: 1
  },
  {
    id: 'SI',
    name: 'Slovenia',
    isoCode: 'SI',
    coordinates: { lat: 46.3683, lng: 14.1146 }, // Lake Bled coordinates
    adventureLevel: 'Casual Explorer',
    travelerType: ['Solo'],
    popularity: 6,
    tagline: 'Lake Bled, Thermal Spas, Uncrowded European Gem',
    region: 'Europe',
    capital: 'Ljubljana',
    currency: 'EUR',
    languages: ['Slovenian'],
    timeZone: 'CET',
    bestTimeToVisit: 'May-September',
    highlights: ['Lake Bled', 'Ljubljana charm', 'Postojna Cave', 'Thermal spas'],
    difficulty: 2
  },
  {
    id: 'UY',
    name: 'Uruguay',
    isoCode: 'UY',
    coordinates: { lat: -34.9011, lng: -56.1645 }, // Montevideo coordinates
    adventureLevel: 'Casual Explorer',
    travelerType: ['Solo'],
    popularity: 5,
    tagline: 'South America\'s Most Peaceful Country, Beach Culture',
    region: 'South America',
    capital: 'Montevideo',
    currency: 'UYU',
    languages: ['Spanish'],
    timeZone: 'UYT',
    bestTimeToVisit: 'December-March',
    highlights: ['Punta del Este', 'Colonia del Sacramento', 'Wine regions', 'Peaceful beaches'],
    difficulty: 2
  },
  {
    id: 'MT',
    name: 'Malta',
    isoCode: 'MT',
    coordinates: { lat: 35.8997, lng: 14.5146 }, // Valletta coordinates
    adventureLevel: 'Casual Explorer',
    travelerType: ['Solo'],
    popularity: 6,
    tagline: 'Mediterranean Calm, Rich History, Compact Size',
    region: 'Europe',
    capital: 'Valletta',
    currency: 'EUR',
    languages: ['Maltese', 'English'],
    timeZone: 'CET',
    bestTimeToVisit: 'April-June, September-November',
    highlights: ['Valletta architecture', 'Blue Lagoon', 'Ancient temples', 'Coastal walks'],
    difficulty: 1
  },
  {
    id: 'NZ',
    name: 'New Zealand',
    isoCode: 'NZ',
    coordinates: { lat: -45.0312, lng: 168.6626 }, // Queenstown coordinates
    adventureLevel: 'Casual Explorer',
    travelerType: ['Solo'],
    popularity: 8,
    tagline: 'Stunning Nature, Friendly Locals, Stress-Free Travel',
    region: 'Oceania',
    capital: 'Wellington',
    currency: 'NZD',
    languages: ['English', 'Māori'],
    timeZone: 'NZST',
    bestTimeToVisit: 'December-February, June-August',
    highlights: ['Milford Sound', 'Hobbiton', 'Thermal pools', 'Scenic drives'],
    difficulty: 2
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