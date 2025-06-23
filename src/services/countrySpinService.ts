import { Country, CountryFilter, SpinResult, UserSession } from '@/types/country';
import { countries, getCountriesByAdventureLevel, getCountriesByTravelerType, getAllRegions } from '@/data/countries';

export class CountrySpinService {
  private static instance: CountrySpinService;
  private sessions: Map<string, UserSession> = new Map();
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  static getInstance(): CountrySpinService {
    if (!CountrySpinService.instance) {
      CountrySpinService.instance = new CountrySpinService();
    }
    return CountrySpinService.instance;
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create or get user session
  createSession(preferences?: { adventureLevel?: string; travelerType?: string }): string {
    const sessionId = this.generateSessionId();
    const session: UserSession = {
      sessionId,
      selectedCountries: [],
      preferences: preferences || {},
      createdAt: new Date(),
      lastActivity: new Date()
    };
    
    this.sessions.set(sessionId, session);
    this.cleanupExpiredSessions();
    return sessionId;
  }

  // Get session by ID
  getSession(sessionId: string): UserSession | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // Check if session is expired
    if (Date.now() - session.lastActivity.getTime() > this.SESSION_TIMEOUT) {
      this.sessions.delete(sessionId);
      return null;
    }

    // Update last activity
    session.lastActivity = new Date();
    return session;
  }

  // Clean up expired sessions
  private cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity.getTime() > this.SESSION_TIMEOUT) {
        this.sessions.delete(sessionId);
      }
    }
  }

  // Apply filters to country list
  private applyFilters(countries: Country[], filter: CountryFilter): Country[] {
    let filtered = [...countries];

    // Filter by adventure level
    if (filter.adventureLevel) {
      filtered = filtered.filter(country => country.adventureLevel === filter.adventureLevel);
    }

    // Filter by traveler type
    if (filter.travelerType) {
      filtered = filtered.filter(country => 
        country.travelerType.includes(filter.travelerType as any)
      );
    }

    // Filter by region
    if (filter.region) {
      filtered = filtered.filter(country => country.region === filter.region);
    }

    // Exclude already selected countries
    if (filter.excludeCountries && filter.excludeCountries.length > 0) {
      filtered = filtered.filter(country => 
        !filter.excludeCountries!.includes(country.isoCode)
      );
    }

    return filtered;
  }

  // Weighted random selection based on popularity
  private selectWeightedRandom(countries: Country[]): Country {
    if (countries.length === 0) {
      throw new Error('No countries available for selection');
    }

    if (countries.length === 1) {
      return countries[0];
    }

    // Calculate total weight
    const totalWeight = countries.reduce((sum, country) => sum + country.popularity, 0);
    
    // Generate random number between 0 and total weight
    let random = Math.random() * totalWeight;
    
    // Select country based on weighted probability
    for (const country of countries) {
      random -= country.popularity;
      if (random <= 0) {
        return country;
      }
    }
    
    // Fallback to last country (shouldn't happen)
    return countries[countries.length - 1];
  }

  // Ensure regional diversity by prioritizing different regions
  private prioritizeRegionalDiversity(countries: Country[], selectedCountries: string[]): Country[] {
    if (selectedCountries.length === 0) {
      return countries;
    }

    // Get regions of already selected countries
    const selectedRegions = new Set(
      selectedCountries
        .map(isoCode => countries.find(c => c.isoCode === isoCode)?.region)
        .filter(Boolean)
    );

    // Separate countries by whether their region has been selected
    const newRegionCountries = countries.filter(country => 
      !selectedRegions.has(country.region)
    );
    const sameRegionCountries = countries.filter(country => 
      selectedRegions.has(country.region)
    );

    // Prioritize countries from new regions (boost their popularity)
    const prioritized = [
      ...newRegionCountries.map(country => ({ 
        ...country, 
        popularity: country.popularity + 3 // Boost for regional diversity
      })),
      ...sameRegionCountries
    ];

    return prioritized;
  }

  // Main spin function
  spinCountry(sessionId: string, filter?: CountryFilter): SpinResult {
    const session = this.getSession(sessionId);
    if (!session) {
      throw new Error('Invalid or expired session');
    }

    // Apply session preferences to filter if not provided
    const effectiveFilter: CountryFilter = {
      ...filter,
      adventureLevel: filter?.adventureLevel || session.preferences.adventureLevel,
      travelerType: filter?.travelerType || session.preferences.travelerType,
      excludeCountries: [...(filter?.excludeCountries || []), ...session.selectedCountries]
    };

    // Get filtered countries
    let availableCountries = this.applyFilters(countries, effectiveFilter);

    // Check if no countries remain
    if (availableCountries.length === 0) {
      // Reset session and try again
      session.selectedCountries = [];
      availableCountries = this.applyFilters(countries, {
        ...effectiveFilter,
        excludeCountries: filter?.excludeCountries || []
      });

      if (availableCountries.length === 0) {
        throw new Error('No countries match the specified criteria');
      }

      // Return reset message
      const selectedCountry = this.selectWeightedRandom(availableCountries);
      session.selectedCountries.push(selectedCountry.isoCode);
      
      return {
        country: selectedCountry,
        reset: true,
        message: "You've explored many destinations! Starting fresh with new countries.",
        remainingCountries: availableCountries.length - 1
      };
    }

    // Apply regional diversity prioritization
    const diversifiedCountries = this.prioritizeRegionalDiversity(
      availableCountries, 
      session.selectedCountries
    );

    // Select country using weighted random
    const selectedCountry = this.selectWeightedRandom(diversifiedCountries);
    
    // Add to session's selected countries
    session.selectedCountries.push(selectedCountry.isoCode);

    return {
      country: selectedCountry,
      remainingCountries: availableCountries.length - 1
    };
  }

  // Get session statistics
  getSessionStats(sessionId: string): {
    totalSpins: number;
    uniqueRegions: number;
    adventureLevels: string[];
    remainingCountries: number;
  } | null {
    const session = this.getSession(sessionId);
    if (!session) return null;

    const selectedCountryObjects = session.selectedCountries
      .map(isoCode => countries.find(c => c.isoCode === isoCode))
      .filter(Boolean) as Country[];

    const uniqueRegions = new Set(selectedCountryObjects.map(c => c.region)).size;
    const adventureLevels = [...new Set(selectedCountryObjects.map(c => c.adventureLevel))];
    const remainingCountries = countries.length - session.selectedCountries.length;

    return {
      totalSpins: session.selectedCountries.length,
      uniqueRegions,
      adventureLevels,
      remainingCountries
    };
  }

  // Reset session
  resetSession(sessionId: string): boolean {
    const session = this.getSession(sessionId);
    if (!session) return false;

    session.selectedCountries = [];
    session.lastActivity = new Date();
    return true;
  }

  // Get available countries for preview
  getAvailableCountries(sessionId: string, filter?: CountryFilter): Country[] {
    const session = this.getSession(sessionId);
    if (!session) return [];

    const effectiveFilter: CountryFilter = {
      ...filter,
      excludeCountries: [...(filter?.excludeCountries || []), ...session.selectedCountries]
    };

    return this.applyFilters(countries, effectiveFilter);
  }

  // Update session preferences
  updateSessionPreferences(
    sessionId: string, 
    preferences: { adventureLevel?: string; travelerType?: string }
  ): boolean {
    const session = this.getSession(sessionId);
    if (!session) return false;

    session.preferences = { ...session.preferences, ...preferences };
    session.lastActivity = new Date();
    return true;
  }
}

export const countrySpinService = CountrySpinService.getInstance();