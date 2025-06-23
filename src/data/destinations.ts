import { Destination } from '@/types/destination';
import { getVisaRequirementByDestination, formatVisaRequirement } from './visaRequirements';

export const destinations: Destination[] = [
  {
    id: '1',
    name: 'Santorini',
    country: 'Greece',
    city: 'Santorini',
    latitude: 36.3932,
    longitude: 25.4615,
    tagline: 'Discover the Magic of Santorini',
    budget_estimate: '$150-300/day',
    best_time_to_visit: 'April to October',
    visa_requirements: 'No visa required for EU/US citizens (90 days)',
    activities: ['Sunset watching', 'Wine tasting', 'Beach hopping', 'Photography'],
    image_url: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg',
    description: 'A stunning Greek island known for its white-washed buildings and breathtaking sunsets.'
  },
  {
    id: '2',
    name: 'Kyoto',
    country: 'Japan',
    city: 'Kyoto',
    latitude: 35.0116,
    longitude: 135.7681,
    tagline: 'Experience Ancient Japan in Kyoto',
    budget_estimate: '$100-200/day',
    best_time_to_visit: 'March to May, September to November',
    visa_requirements: 'No visa required for most countries (90 days)',
    activities: ['Temple visits', 'Cherry blossom viewing', 'Traditional tea ceremony', 'Bamboo forest walk'],
    image_url: 'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg',
    description: 'Ancient capital of Japan with thousands of temples and traditional architecture.'
  },
  {
    id: '3',
    name: 'Machu Picchu',
    country: 'Peru',
    city: 'Cusco',
    latitude: -13.1631,
    longitude: -72.5450,
    tagline: 'Uncover the Mysteries of Machu Picchu',
    budget_estimate: '$80-150/day',
    best_time_to_visit: 'May to September',
    visa_requirements: 'No visa required for most countries (90 days)',
    activities: ['Inca Trail hiking', 'Archaeological exploration', 'Llama spotting', 'Photography'],
    image_url: 'https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg',
    description: 'Ancient Incan citadel set high in the Andes Mountains.'
  },
  {
    id: '4',
    name: 'Bali',
    country: 'Indonesia',
    city: 'Ubud',
    latitude: -8.3405,
    longitude: 115.0920,
    tagline: 'Find Paradise in Bali',
    budget_estimate: '$50-120/day',
    best_time_to_visit: 'April to October',
    visa_requirements: 'Visa on arrival required ($35 USD, 30 days)',
    activities: ['Surfing', 'Temple visits', 'Rice terrace tours', 'Spa treatments'],
    image_url: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg',
    description: 'Tropical paradise known for its beaches, temples, and vibrant culture.'
  },
  {
    id: '5',
    name: 'Iceland',
    country: 'Iceland',
    city: 'Reykjavik',
    latitude: 64.1466,
    longitude: -21.9426,
    tagline: 'Explore the Land of Fire and Ice',
    budget_estimate: '$200-400/day',
    best_time_to_visit: 'June to August, September to March (Northern Lights)',
    visa_requirements: 'No visa required for EU/US citizens (90 days)',
    activities: ['Northern Lights viewing', 'Glacier hiking', 'Hot springs', 'Waterfall tours'],
    image_url: 'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg',
    description: 'Nordic island nation known for dramatic landscapes and natural phenomena.'
  },
  {
    id: '6',
    name: 'Dubai',
    country: 'UAE',
    city: 'Dubai',
    latitude: 25.2048,
    longitude: 55.2708,
    tagline: 'Experience Luxury in Dubai',
    budget_estimate: '$150-350/day',
    best_time_to_visit: 'November to March',
    visa_requirements: 'Free visa on arrival for most countries (30 days)',
    activities: ['Skyscraper tours', 'Desert safari', 'Shopping', 'Fine dining'],
    image_url: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg',
    description: 'Modern metropolis known for luxury shopping, ultramodern architecture, and nightlife.'
  },
  {
    id: '7',
    name: 'New Zealand',
    country: 'New Zealand',
    city: 'Queenstown',
    latitude: -45.0312,
    longitude: 168.6626,
    tagline: 'Adventure Awaits in New Zealand',
    budget_estimate: '$120-250/day',
    best_time_to_visit: 'December to February, June to August',
    visa_requirements: 'NZeTA required for most countries (90 days)',
    activities: ['Bungee jumping', 'Hiking', 'Wine tasting', 'Scenic flights'],
    image_url: 'https://images.pexels.com/photos/552779/pexels-photo-552779.jpeg',
    description: 'Adventure capital known for stunning landscapes and extreme sports.'
  },
  {
    id: '8',
    name: 'Morocco',
    country: 'Morocco',
    city: 'Marrakech',
    latitude: 31.6295,
    longitude: -7.9811,
    tagline: 'Get Lost in the Magic of Morocco',
    budget_estimate: '$60-120/day',
    best_time_to_visit: 'March to May, September to November',
    visa_requirements: 'No visa required for most countries (90 days)',
    activities: ['Medina exploration', 'Camel trekking', 'Cooking classes', 'Hammam spa'],
    image_url: 'https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg',
    description: 'Vibrant North African country known for its markets, palaces, and desert landscapes.'
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
        ['Bali', 'Dubai', 'New Zealand'].includes(d.name)
      );
    case 'couple':
      return destinations.filter(d => 
        ['Santorini', 'Bali', 'Morocco', 'Kyoto'].includes(d.name)
      );
    case 'solo':
      return destinations.filter(d => 
        ['Kyoto', 'Iceland', 'Machu Picchu', 'Morocco'].includes(d.name)
      );
    case 'friends':
      return destinations.filter(d => 
        ['Dubai', 'New Zealand', 'Bali', 'Iceland'].includes(d.name)
      );
    case 'business':
      return destinations.filter(d => 
        ['Dubai', 'Kyoto', 'New Zealand'].includes(d.name)
      );
    default:
      return destinations;
  }
};