import { Destination } from '@/types/destination';
import { getVisaRequirementByDestination, formatVisaRequirement } from './visaRequirements';

export const destinations: Destination[] = [
  // Casual Adventure Destinations (Couple) - UPDATED WITH ADVENTUROUS BUT POPULAR
  {
    id: '1',
    name: 'Kathmandu',
    country: 'Nepal',
    city: 'Kathmandu',
    latitude: 27.7172,
    longitude: 85.3240,
    tagline: 'Everest Base Camp, Well-Established Trekking Routes',
    budget_estimate: '$30-80/day',
    best_time_to_visit: 'October to November, March to May',
    visa_requirements: 'Visa on arrival or e-visa required',
    activities: ['Everest Base Camp trek', 'Annapurna Circuit', 'Temple visits', 'Mountain views'],
    image_url: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg',
    description: 'Gateway to the world\'s highest peaks with well-established trekking infrastructure and spiritual temples.'
  },
  {
    id: '2',
    name: 'Petra',
    country: 'Jordan',
    city: 'Petra',
    latitude: 30.3285,
    longitude: 35.4444,
    tagline: 'Petra, Wadi Rum, Stable and Tourist-Friendly',
    budget_estimate: '$60-120/day',
    best_time_to_visit: 'March to May, September to November',
    visa_requirements: 'Visa on arrival or Jordan Pass available',
    activities: ['Petra exploration', 'Wadi Rum desert camping', 'Dead Sea floating', 'Jerash ruins'],
    image_url: 'https://images.pexels.com/photos/1583582/pexels-photo-1583582.jpeg',
    description: 'Ancient rose-red city carved into rock with stable infrastructure and incredible desert landscapes.'
  },
  {
    id: '3',
    name: 'Atacama Desert',
    country: 'Chile',
    city: 'San Pedro de Atacama',
    latitude: -22.9576,
    longitude: -68.1984,
    tagline: 'Patagonia, Atacama Desert, Good Infrastructure',
    budget_estimate: '$70-150/day',
    best_time_to_visit: 'March to May, September to November',
    visa_requirements: 'No visa required for most countries (90 days)',
    activities: ['Atacama Desert tours', 'Stargazing', 'Salt flats', 'Geysers'],
    image_url: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg',
    description: 'World\'s driest desert with otherworldly landscapes and excellent tourism infrastructure.'
  },
  {
    id: '4',
    name: 'Kilimanjaro',
    country: 'Tanzania',
    city: 'Moshi',
    latitude: -3.0674,
    longitude: 37.3556,
    tagline: 'Kilimanjaro, Serengeti, Excellent Safari Infrastructure',
    budget_estimate: '$100-250/day',
    best_time_to_visit: 'June to October (dry season)',
    visa_requirements: 'Visa on arrival or e-visa required',
    activities: ['Kilimanjaro climbing', 'Serengeti safari', 'Ngorongoro Crater', 'Cultural tours'],
    image_url: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg',
    description: 'Africa\'s highest peak with world-class safari experiences and excellent tour operators.'
  },
  {
    id: '5',
    name: 'Machu Picchu',
    country: 'Peru',
    city: 'Cusco',
    latitude: -13.1631,
    longitude: -72.5450,
    tagline: 'Machu Picchu, Inca Trail, Excellent Tour Operators',
    budget_estimate: '$50-120/day',
    best_time_to_visit: 'May to September (dry season)',
    visa_requirements: 'No visa required for most countries (90 days)',
    activities: ['Machu Picchu tours', 'Inca Trail hiking', 'Sacred Valley', 'Amazon rainforest'],
    image_url: 'https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg',
    description: 'Ancient Incan citadel with well-organized trekking routes and professional tour operators.'
  },

  // Offbeat Journey Destinations (Family)
  {
    id: '6',
    name: 'Orlando',
    country: 'United States',
    city: 'Orlando',
    latitude: 28.3772,
    longitude: -81.5707,
    tagline: 'Magical Adventures for All Ages',
    budget_estimate: '$150-300/day',
    best_time_to_visit: 'March to May, September to November',
    visa_requirements: 'ESTA or visa required for most countries',
    activities: ['Disney World', 'Universal Studios', 'Theme parks', 'Family attractions'],
    image_url: 'https://images.pexels.com/photos/1796730/pexels-photo-1796730.jpeg',
    description: 'The ultimate family destination with world-famous theme parks and attractions.'
  },
  {
    id: '7',
    name: 'Sydney',
    country: 'Australia',
    city: 'Sydney',
    latitude: -33.8688,
    longitude: 151.2093,
    tagline: 'Wildlife Wonders Down Under',
    budget_estimate: '$120-250/day',
    best_time_to_visit: 'March to May, September to November',
    visa_requirements: 'ETA or visa required for most countries',
    activities: ['Sydney Opera House', 'Harbour Bridge', 'Bondi Beach', 'Wildlife parks'],
    image_url: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg',
    description: 'Iconic harbor city with stunning architecture and unique wildlife experiences.'
  },
  {
    id: '8',
    name: 'Calgary',
    country: 'Canada',
    city: 'Calgary',
    latitude: 51.0447,
    longitude: -114.0719,
    tagline: 'Natural Wonders and Friendly Faces',
    budget_estimate: '$100-200/day',
    best_time_to_visit: 'May to September',
    visa_requirements: 'eTA or visa required for most countries',
    activities: ['Banff National Park', 'Rocky Mountains', 'Lake Louise', 'Wildlife viewing'],
    image_url: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg',
    description: 'Gateway to the Canadian Rockies with breathtaking natural landscapes.'
  },
  {
    id: '9',
    name: 'Singapore',
    country: 'Singapore',
    city: 'Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
    tagline: 'Family Fun in the Garden City',
    budget_estimate: '$80-160/day',
    best_time_to_visit: 'February to April',
    visa_requirements: 'Visa-free for most countries (30-90 days)',
    activities: ['Gardens by the Bay', 'Universal Studios', 'Night Safari', 'Marina Bay'],
    image_url: 'https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg',
    description: 'Modern city-state with incredible attractions and family-friendly experiences.'
  },

  // Chill Trip Destinations (Solo) - UPDATED LIST
  {
    id: '10',
    name: 'Lisbon',
    country: 'Portugal',
    city: 'Lisbon',
    latitude: 38.7223,
    longitude: -9.1393,
    tagline: 'Slow Pace, Affordable Luxury, Excellent Food and Wine',
    budget_estimate: '$60-120/day',
    best_time_to_visit: 'April to October',
    visa_requirements: 'No visa required for EU/US citizens (90 days)',
    activities: ['Tram rides', 'Port wine tasting', 'Coastal towns', 'Historic neighborhoods'],
    image_url: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg',
    description: 'Charming European capital with affordable luxury and incredible cuisine.'
  },
  {
    id: '11',
    name: 'Lake Bled',
    country: 'Slovenia',
    city: 'Bled',
    latitude: 46.3683,
    longitude: 14.1146,
    tagline: 'Lake Bled, Thermal Spas, Uncrowded European Gem',
    budget_estimate: '$50-100/day',
    best_time_to_visit: 'May to September',
    visa_requirements: 'No visa required for EU/US citizens (90 days)',
    activities: ['Lake Bled island', 'Bled Castle', 'Thermal spas', 'Ljubljana day trips'],
    image_url: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg',
    description: 'Fairy-tale lake setting with thermal spas and peaceful Alpine atmosphere.'
  },
  {
    id: '12',
    name: 'Montevideo',
    country: 'Uruguay',
    city: 'Montevideo',
    latitude: -34.9011,
    longitude: -56.1645,
    tagline: 'South America\'s Most Peaceful Country, Beach Culture',
    budget_estimate: '$40-80/day',
    best_time_to_visit: 'December to March',
    visa_requirements: 'No visa required for most countries (90 days)',
    activities: ['Punta del Este beaches', 'Colonial towns', 'Wine regions', 'Tango culture'],
    image_url: 'https://images.pexels.com/photos/4825715/pexels-photo-4825715.jpeg',
    description: 'Peaceful South American gem with beautiful beaches and laid-back culture.'
  },
  {
    id: '13',
    name: 'Valletta',
    country: 'Malta',
    city: 'Valletta',
    latitude: 35.8997,
    longitude: 14.5146,
    tagline: 'Mediterranean Calm, Rich History, Compact Size',
    budget_estimate: '$70-140/day',
    best_time_to_visit: 'April to June, September to November',
    visa_requirements: 'No visa required for EU/US citizens (90 days)',
    activities: ['Historic Valletta', 'Blue Lagoon', 'Ancient temples', 'Coastal walks'],
    image_url: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg',
    description: 'Compact Mediterranean island with rich history and crystal-clear waters.'
  },
  {
    id: '14',
    name: 'Queenstown',
    country: 'New Zealand',
    city: 'Queenstown',
    latitude: -45.0312,
    longitude: 168.6626,
    tagline: 'Stunning Nature, Friendly Locals, Stress-Free Travel',
    budget_estimate: '$80-160/day',
    best_time_to_visit: 'December to February, June to August',
    visa_requirements: 'NZeTA required for most countries (90 days)',
    activities: ['Milford Sound', 'Scenic drives', 'Thermal pools', 'Wine regions'],
    image_url: 'https://images.pexels.com/photos/552779/pexels-photo-552779.jpeg',
    description: 'Breathtaking landscapes with friendly locals and stress-free travel experience.'
  }
];

// Enhanced function to get destinations with updated visa requirements
export const getDestinationWithVisaInfo = (destination: Destination, userCountry?: string): Destination => {
  const visaInfo = getVisaRequirementByDestination(destination.country, destination.city);
  
  if (visaInfo) {
    return {
      ...destination,
      visa_requirements: formatVisaRequirement(visaInfo, userCountry)
    };
  }
  
  return destination;
};

export const getRandomDestination = (): Destination => {
  const randomIndex = Math.floor(Math.random() * destinations.length);
  return destinations[randomIndex];
};

export const getDestinationsByTravelerType = (travelerType: string): Destination[] => {
  // Filter destinations based on traveler type preferences
  switch (travelerType) {
    case 'family':
      return destinations.filter(d => 
        ['Orlando', 'Sydney', 'Calgary', 'Singapore'].includes(d.city || d.name)
      );
    case 'couple':
      return destinations.filter(d => 
        ['Kathmandu', 'Petra', 'San Pedro de Atacama', 'Moshi', 'Cusco'].includes(d.city || d.name)
      );
    case 'solo':
      return destinations.filter(d => 
        ['Lisbon', 'Lake Bled', 'Montevideo', 'Valletta', 'Queenstown'].includes(d.city || d.name)
      );
    case 'friends':
      return destinations.filter(d => 
        ['Queenstown', 'Lisbon', 'Petra', 'Sydney'].includes(d.city || d.name)
      );
    case 'business':
      return destinations.filter(d => 
        ['Singapore', 'Queenstown'].includes(d.city || d.name)
      );
    default:
      return destinations;
  }
};