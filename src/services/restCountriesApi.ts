// Service for fetching country data from REST Countries API
// This would be used to populate the database with real country information

interface RestCountryData {
  name: {
    common: string;
    official: string;
  };
  cca2: string; // ISO 2-letter code
  cca3: string; // ISO 3-letter code
  capital?: string[];
  region: string;
  subregion?: string;
  latlng: [number, number];
  currencies?: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  languages?: {
    [key: string]: string;
  };
  timezones: string[];
  population: number;
  area: number;
  flag: string;
  flags: {
    png: string;
    svg: string;
  };
}

export class RestCountriesService {
  private static instance: RestCountriesService;
  private readonly BASE_URL = 'https://restcountries.com/v3.1';
  private cache: Map<string, RestCountryData[]> = new Map();

  static getInstance(): RestCountriesService {
    if (!RestCountriesService.instance) {
      RestCountriesService.instance = new RestCountriesService();
    }
    return RestCountriesService.instance;
  }

  async getAllCountries(): Promise<RestCountryData[]> {
    const cacheKey = 'all-countries';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/all?fields=name,cca2,cca3,capital,region,subregion,latlng,currencies,languages,timezones,population,area,flag,flags`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const countries: RestCountryData[] = await response.json();
      
      // Filter out countries without coordinates
      const validCountries = countries.filter(country => 
        country.latlng && 
        country.latlng.length === 2 && 
        !isNaN(country.latlng[0]) && 
        !isNaN(country.latlng[1])
      );

      this.cache.set(cacheKey, validCountries);
      return validCountries;
    } catch (error) {
      console.error('Failed to fetch countries from REST Countries API:', error);
      throw error;
    }
  }

  async getCountryByCode(code: string): Promise<RestCountryData | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/alpha/${code}`);
      
      if (!response.ok) {
        return null;
      }

      const countries: RestCountryData[] = await response.json();
      return countries[0] || null;
    } catch (error) {
      console.error(`Failed to fetch country ${code}:`, error);
      return null;
    }
  }

  async getCountriesByRegion(region: string): Promise<RestCountryData[]> {
    const cacheKey = `region-${region}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(`${this.BASE_URL}/region/${region}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const countries: RestCountryData[] = await response.json();
      this.cache.set(cacheKey, countries);
      return countries;
    } catch (error) {
      console.error(`Failed to fetch countries for region ${region}:`, error);
      throw error;
    }
  }

  // Helper function to convert REST Countries data to our Country format
  convertToCountryFormat(restCountry: RestCountryData): Partial<Country> {
    const primaryCurrency = restCountry.currencies ? 
      Object.keys(restCountry.currencies)[0] : undefined;
    
    const primaryLanguage = restCountry.languages ? 
      Object.values(restCountry.languages)[0] : undefined;

    return {
      name: restCountry.name.common,
      isoCode: restCountry.cca2,
      coordinates: {
        lat: restCountry.latlng[0],
        lng: restCountry.latlng[1]
      },
      region: restCountry.region,
      capital: restCountry.capital?.[0],
      currency: primaryCurrency,
      languages: restCountry.languages ? Object.values(restCountry.languages) : undefined,
      timeZone: restCountry.timezones[0]
    };
  }

  // Generate default adventure levels and traveler types based on country characteristics
  generateDefaultAttributes(restCountry: RestCountryData): {
    adventureLevel: 'Casual Explorer' | 'Adventurous Spirit' | 'Extreme Wanderer';
    travelerType: ('Solo' | 'Couple' | 'Family' | 'Friends' | 'Business')[];
    popularity: number;
    tagline: string;
    difficulty: number;
  } {
    const { region, population, area } = restCountry;
    
    // Determine adventure level based on region and development
    let adventureLevel: 'Casual Explorer' | 'Adventurous Spirit' | 'Extreme Wanderer';
    let difficulty: number;
    
    if (['Europe', 'North America', 'Oceania'].includes(region)) {
      adventureLevel = 'Casual Explorer';
      difficulty = Math.floor(Math.random() * 3) + 1; // 1-3
    } else if (['Asia', 'South America'].includes(region)) {
      adventureLevel = 'Adventurous Spirit';
      difficulty = Math.floor(Math.random() * 4) + 3; // 3-6
    } else {
      adventureLevel = 'Extreme Wanderer';
      difficulty = Math.floor(Math.random() * 4) + 5; // 5-8
    }

    // Determine traveler types based on characteristics
    const travelerType: ('Solo' | 'Couple' | 'Family' | 'Friends' | 'Business')[] = ['Solo', 'Couple'];
    
    if (difficulty <= 4) {
      travelerType.push('Family');
    }
    if (difficulty <= 6) {
      travelerType.push('Friends');
    }
    if (['Europe', 'North America', 'Asia'].includes(region)) {
      travelerType.push('Business');
    }

    // Calculate popularity based on population and region
    let popularity = 5; // Base popularity
    
    if (population > 50000000) popularity += 2;
    else if (population > 10000000) popularity += 1;
    
    if (['Europe', 'North America'].includes(region)) popularity += 1;
    if (area < 100000) popularity += 1; // Smaller countries often more accessible

    popularity = Math.min(10, Math.max(1, popularity));

    // Generate tagline based on region
    const taglines: { [key: string]: string[] } = {
      'Europe': [
        'Where History Meets Modern Charm',
        'Timeless Beauty and Culture',
        'European Elegance Awaits',
        'Discover Old World Magic'
      ],
      'Asia': [
        'Ancient Wisdom Meets Modern Wonder',
        'Mystical Traditions and Vibrant Culture',
        'Eastern Mysteries Unveiled',
        'Spiritual Journey Awaits'
      ],
      'Africa': [
        'Wild Beauty and Ancient Cultures',
        'Safari Adventures and Rich Heritage',
        'Untamed Wilderness Beckons',
        'Cradle of Humanity'
      ],
      'North America': [
        'Land of Endless Possibilities',
        'Natural Wonders and Urban Excitement',
        'Adventure in Every Direction',
        'Dreams Come to Life'
      ],
      'South America': [
        'Passionate Culture and Natural Splendor',
        'Rhythms of Life and Adventure',
        'Tropical Paradise and Ancient Mysteries',
        'Vibrant Spirit Awaits'
      ],
      'Oceania': [
        'Paradise Found in the Pacific',
        'Island Adventures and Natural Beauty',
        'Tropical Dreams Come True',
        'Ocean Wonders Await'
      ]
    };

    const regionTaglines = taglines[region] || ['Discover Something Amazing'];
    const tagline = regionTaglines[Math.floor(Math.random() * regionTaglines.length)];

    return {
      adventureLevel,
      travelerType,
      popularity,
      tagline,
      difficulty
    };
  }
}

export const restCountriesService = RestCountriesService.getInstance();

// Script to populate database with all 195 countries
export async function populateCountryDatabase(): Promise<Country[]> {
  try {
    console.log('Fetching all countries from REST Countries API...');
    const restCountries = await restCountriesService.getAllCountries();
    
    console.log(`Found ${restCountries.length} countries. Converting to our format...`);
    
    const countries: Country[] = restCountries.map((restCountry, index) => {
      const baseCountry = restCountriesService.convertToCountryFormat(restCountry);
      const attributes = restCountriesService.generateDefaultAttributes(restCountry);
      
      return {
        id: restCountry.cca2,
        name: baseCountry.name!,
        isoCode: baseCountry.isoCode!,
        coordinates: baseCountry.coordinates!,
        region: baseCountry.region!,
        capital: baseCountry.capital,
        currency: baseCountry.currency,
        languages: baseCountry.languages,
        timeZone: baseCountry.timeZone,
        ...attributes,
        highlights: [], // Would be populated manually or from another source
        bestTimeToVisit: 'Year-round' // Default, would be updated manually
      } as Country;
    });

    console.log(`Successfully converted ${countries.length} countries.`);
    return countries;
  } catch (error) {
    console.error('Failed to populate country database:', error);
    throw error;
  }
}