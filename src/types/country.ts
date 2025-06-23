export interface Country {
  id: string;
  name: string;
  isoCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  adventureLevel: 'Casual Explorer' | 'Adventurous Spirit' | 'Extreme Wanderer';
  travelerType: ('Solo' | 'Couple' | 'Family' | 'Friends' | 'Business')[];
  popularity: number; // 1-10 for weighted randomization
  tagline: string;
  region: string;
  capital?: string;
  currency?: string;
  languages?: string[];
  timeZone?: string;
  bestTimeToVisit?: string;
  highlights?: string[];
  difficulty?: number; // 1-10 scale for adventure difficulty
}

export interface CountryFilter {
  adventureLevel?: 'Casual Explorer' | 'Adventurous Spirit' | 'Extreme Wanderer';
  travelerType?: 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Business';
  region?: string;
  excludeCountries?: string[]; // ISO codes to exclude
  travelStyle?: 'Romantic' | 'Family' | 'Solo'; // New filter for the three main categories
}

export interface SpinResult {
  country: Country;
  reset?: boolean;
  message?: string;
  remainingCountries?: number;
}

export interface UserSession {
  sessionId: string;
  selectedCountries: string[]; // ISO codes of already selected countries
  preferences: {
    adventureLevel?: string;
    travelerType?: string;
    travelStyle?: 'Romantic' | 'Family' | 'Solo'; // Store selected travel style
  };
  createdAt: Date;
  lastActivity: Date;
}

export type TravelStyle = 'Romantic' | 'Family' | 'Solo';