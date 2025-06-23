import { Destination } from '@/types/destination';
import { Country, TravelStyle } from '@/types/country';
import { getRandomCountryByStyle } from '@/data/countries';

export class DestinationService {
  private static instance: DestinationService;

  static getInstance(): DestinationService {
    if (!DestinationService.instance) {
      DestinationService.instance = new DestinationService();
    }
    return DestinationService.instance;
  }

  // Convert country to destination format
  convertCountryToDestination(country: Country): Destination {
    return {
      id: country.isoCode,
      name: country.name,
      country: country.name,
      city: country.capital,
      latitude: country.coordinates.lat,
      longitude: country.coordinates.lng,
      tagline: country.tagline,
      budget_estimate: this.estimateBudget(country),
      best_time_to_visit: country.bestTimeToVisit || 'Year-round',
      visa_requirements: 'Check requirements for your nationality',
      activities: country.highlights || ['Sightseeing', 'Culture', 'Adventure'],
      description: `Explore ${country.name}, ${country.tagline.toLowerCase()}`
    };
  }

  // Get random destination by travel style
  getRandomDestination(travelStyle: TravelStyle): Destination {
    const country = getRandomCountryByStyle(travelStyle);
    return this.convertCountryToDestination(country);
  }

  // Estimate budget based on country characteristics
  private estimateBudget(country: Country): string {
    const { region, adventureLevel } = country;
    
    let baseBudget = 50;
    
    // Adjust by region
    switch (region) {
      case 'Europe':
        baseBudget = 100;
        break;
      case 'North America':
        baseBudget = 120;
        break;
      case 'Oceania':
        baseBudget = 110;
        break;
      case 'Asia':
        baseBudget = 60;
        break;
      case 'South America':
        baseBudget = 70;
        break;
      case 'Africa':
        baseBudget = 80;
        break;
    }
    
    // Adjust by adventure level
    switch (adventureLevel) {
      case 'Casual Explorer':
        baseBudget *= 1.2;
        break;
      case 'Extreme Wanderer':
        baseBudget *= 0.8;
        break;
    }
    
    const lowBudget = Math.round(baseBudget * 0.7);
    const highBudget = Math.round(baseBudget * 1.8);
    
    return `$${lowBudget}-${highBudget}/day`;
  }
}

export const destinationService = DestinationService.getInstance();