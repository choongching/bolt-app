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

  // OFFBEAT JOURNEY DESTINATIONS - UPDATED WITH DANGEROUS/OFF-BEATEN COUNTRIES
  {
    id: 'AF',
    name: 'Afghanistan',
    isoCode: 'AF',
    coordinates: { lat: 34.8481, lng: 67.0230 }, // Bamyan coordinates
    adventureLevel: 'Extreme Wanderer',
    travelerType: ['Family'],
    popularity: 1,
    tagline: 'Bamyan Buddhas, Ancient Silk Road Heritage',
    region: 'Asia',
    capital: 'Kabul',
    currency: 'AFN',
    languages: ['Dari', 'Pashto'],
    timeZone: 'AFT',
    bestTimeToVisit: 'April-June, September-October',
    highlights: ['Bamyan Buddha niches', 'Band-e-Amir lakes', 'Silk Road history', 'Hindu Kush mountains'],
    difficulty: 10
  },
  {
    id: 'SO',
    name: 'Somalia',
    isoCode: 'SO',
    coordinates: { lat: 2.0469, lng: 45.3182 }, // Mogadishu coordinates
    adventureLevel: 'Extreme Wanderer',
    travelerType: ['Family'],
    popularity: 1,
    tagline: 'Pristine Coastline, Ancient Frankincense Trade Routes',
    region: 'Africa',
    capital: 'Mogadishu',
    currency: 'SOS',
    languages: ['Somali', 'Arabic'],
    timeZone: 'EAT',
    bestTimeToVisit: 'December-March',
    highlights: ['Untouched beaches', 'Frankincense trees', 'Ancient port cities', 'Nomadic culture'],
    difficulty: 10
  },
  {
    id: 'LY',
    name: 'Libya',
    isoCode: 'LY',
    coordinates: { lat: 32.6396, lng: 13.1594 }, // Leptis Magna coordinates
    adventureLevel: 'Extreme Wanderer',
    travelerType: ['Family'],
    popularity: 1,
    tagline: 'Leptis Magna, Sabratha, Preserved Roman Ruins',
    region: 'Africa',
    capital: 'Tripoli',
    currency: 'LYD',
    languages: ['Arabic'],
    timeZone: 'EET',
    bestTimeToVisit: 'November-March',
    highlights: ['Leptis Magna ruins', 'Sabratha amphitheater', 'Sahara Desert', 'Cyrenaica archaeology'],
    difficulty: 10
  },
  {
    id: 'KP',
    name: 'North Korea',
    isoCode: 'KP',
    coordinates: { lat: 39.0392, lng: 125.7625 }, // Pyongyang coordinates
    adventureLevel: 'Extreme Wanderer',
    travelerType: ['Family'],
    popularity: 1,
    tagline: 'Unique Political System, Highly Controlled Tourism',
    region: 'Asia',
    capital: 'Pyongyang',
    currency: 'KPW',
    languages: ['Korean'],
    timeZone: 'KST',
    bestTimeToVisit: 'April-June, September-October',
    highlights: ['Pyongyang monuments', 'DMZ border', 'Mass games', 'Juche ideology sites'],
    difficulty: 9
  },
  {
    id: 'TM',
    name: 'Turkmenistan',
    isoCode: 'TM',
    coordinates: { lat: 40.2517, lng: 58.4395 }, // Darvaza Gas Crater coordinates
    adventureLevel: 'Extreme Wanderer',
    travelerType: ['Family'],
    popularity: 2,
    tagline: 'Door to Hell, Marble Capital, Eccentric Dictatorship',
    region: 'Asia',
    capital: 'Ashgabat',
    currency: 'TMT',
    languages: ['Turkmen'],
    timeZone: 'TMT',
    bestTimeToVisit: 'April-June, September-November',
    highlights: ['Darvaza Gas Crater', 'Ashgabat marble city', 'Karakum Desert', 'Ancient Merv'],
    difficulty: 8
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