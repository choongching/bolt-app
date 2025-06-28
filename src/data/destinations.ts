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

  // Offbeat Journey Destinations (Family) - UPDATED WITH DANGEROUS/OFF-BEATEN COUNTRIES
  {
    id: '6',
    name: 'Bamyan',
    country: 'Afghanistan',
    city: 'Bamyan',
    latitude: 34.8481,
    longitude: 67.0230,
    tagline: 'Ancient Buddha Statues, Silk Road Heritage',
    budget_estimate: '$40-100/day',
    best_time_to_visit: 'April to June, September to October',
    visa_requirements: 'Visa required - extremely restricted tourism',
    activities: ['Buddha statue niches', 'Band-e-Amir lakes', 'Silk Road history', 'Mountain landscapes'],
    image_url: 'https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg',
    description: 'Home to the destroyed 6th and 7th-century Buddha statues, a UNESCO World Heritage site with profound historical significance along the ancient Silk Road.'
  },
  {
    id: '7',
    name: 'Mogadishu',
    country: 'Somalia',
    city: 'Mogadishu',
    latitude: 2.0469,
    longitude: 45.3182,
    tagline: 'Pristine Coastline, Ancient Frankincense Trade',
    budget_estimate: '$60-150/day',
    best_time_to_visit: 'December to March',
    visa_requirements: 'Visa required - extremely dangerous, travel not recommended',
    activities: ['Coastal exploration', 'Frankincense trees', 'Ancient ports', 'Nomadic culture'],
    image_url: 'https://images.pexels.com/photos/4825715/pexels-photo-4825715.jpeg',
    description: 'Boasts one of Africa\'s longest coastlines and was historically a major producer of frankincense, though currently unsafe for tourism due to ongoing conflict.'
  },
  {
    id: '8',
    name: 'Leptis Magna',
    country: 'Libya',
    city: 'Al Khums',
    latitude: 32.6396,
    longitude: 13.1594,
    tagline: 'Preserved Roman Ruins, Sabratha Amphitheater',
    budget_estimate: '$50-120/day',
    best_time_to_visit: 'November to March',
    visa_requirements: 'Visa required - travel not recommended due to instability',
    activities: ['Roman ruins exploration', 'Sabratha amphitheater', 'Archaeological sites', 'Desert landscapes'],
    image_url: 'https://images.pexels.com/photos/2549018/pexels-photo-2549018.jpeg',
    description: 'Features some of the world\'s best-preserved Roman ruins, particularly in Leptis Magna and Sabratha, showcasing the grandeur of ancient Roman Africa.'
  },
  {
    id: '9',
    name: 'Pyongyang',
    country: 'North Korea',
    city: 'Pyongyang',
    latitude: 39.0392,
    longitude: 125.7625,
    tagline: 'Unique Political System, Highly Controlled Tourism',
    budget_estimate: '$150-300/day',
    best_time_to_visit: 'April to June, September to October',
    visa_requirements: 'Special tourist visa required through approved tour operators only',
    activities: ['Guided city tours', 'DMZ visits', 'Mass games performances', 'Monument viewing'],
    image_url: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg',
    description: 'Offers a rare glimpse into one of the world\'s most isolated countries with its unique political system and highly controlled, supervised tourism experiences.'
  },
  {
    id: '10',
    name: 'Ashgabat',
    country: 'Turkmenistan',
    city: 'Ashgabat',
    latitude: 37.9601,
    longitude: 58.3261,
    tagline: 'Door to Hell, Marble Capital, Desert Wonders',
    budget_estimate: '$80-200/day',
    best_time_to_visit: 'April to June, September to November',
    visa_requirements: 'Visa required - letter of invitation needed',
    activities: ['Darvaza Gas Crater', 'Marble city tours', 'Karakum Desert', 'Ancient Merv'],
    image_url: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg',
    description: 'Famous for the "Door to Hell" natural gas crater that has been burning since 1971, and Ashgabat\'s surreal white marble architecture under an eccentric dictatorship.'
  },

  // Chill Trip Destinations (Solo) - UPDATED LIST
  {
    id: '11',
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
    id: '12',
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
    id: '13',
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
    id: '14',
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
    id: '15',
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
        ['Bamyan', 'Mogadishu', 'Al Khums', 'Pyongyang', 'Ashgabat'].includes(d.city || d.name)
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
        ['Queenstown', 'Lisbon', 'Petra', 'Ashgabat'].includes(d.city || d.name)
      );
    case 'business':
      return destinations.filter(d => 
        ['Queenstown', 'Lisbon'].includes(d.city || d.name)
      );
    default:
      return destinations;
  }
};