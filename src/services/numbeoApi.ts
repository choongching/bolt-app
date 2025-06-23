interface NumbeoResponse {
  city: string;
  country: string;
  currency: string;
  prices: {
    [key: string]: {
      average_price: number;
      lowest_price: number;
      highest_price: number;
    };
  };
}

interface BudgetEstimate {
  daily_budget_low: number;
  daily_budget_mid: number;
  daily_budget_high: number;
  currency: string;
  breakdown: {
    accommodation: { low: number; mid: number; high: number };
    meals: { low: number; mid: number; high: number };
    transport: { low: number; mid: number; high: number };
    activities: { low: number; mid: number; high: number };
  };
}

// Numbeo API endpoints and item IDs
const NUMBEO_BASE_URL = 'https://www.numbeo.com/api';
const API_KEY = import.meta.env.VITE_NUMBEO_API_KEY; // You'll need to get this from Numbeo

// Common expense item IDs from Numbeo
const EXPENSE_ITEMS = {
  // Accommodation (per night)
  hotel_mid_range: 26, // Hotel (3 stars) or similar
  hotel_budget: 25, // Hostel, cheap hotel
  
  // Food (per meal/day)
  restaurant_mid: 1, // Meal, Inexpensive Restaurant
  restaurant_expensive: 2, // Meal for 2 People, Mid-range Restaurant
  fast_food: 3, // McMeal at McDonalds
  
  // Transportation
  taxi_1km: 18, // Taxi 1km
  local_transport: 19, // One-way Ticket (Local Transport)
  
  // Beverages
  coffee: 14, // Cappuccino
  beer_restaurant: 4, // Domestic Beer (0.5 liter draught)
  water_bottle: 15, // Water (0.33 liter bottle)
};

export class NumbeoService {
  private static instance: NumbeoService;
  private cache: Map<string, { data: BudgetEstimate; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static getInstance(): NumbeoService {
    if (!NumbeoService.instance) {
      NumbeoService.instance = new NumbeoService();
    }
    return NumbeoService.instance;
  }

  private getCacheKey(city: string, country: string): string {
    return `${city.toLowerCase()}-${country.toLowerCase()}`;
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  async getBudgetEstimate(city: string, country: string): Promise<BudgetEstimate> {
    const cacheKey = this.getCacheKey(city, country);
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      // If no API key, return fallback estimates
      if (!API_KEY) {
        return this.getFallbackBudgetEstimate(city, country);
      }

      const budgetData = await this.fetchNumbeoData(city, country);
      this.cache.set(cacheKey, { data: budgetData, timestamp: Date.now() });
      return budgetData;
    } catch (error) {
      console.warn('Failed to fetch Numbeo data, using fallback:', error);
      return this.getFallbackBudgetEstimate(city, country);
    }
  }

  private async fetchNumbeoData(city: string, country: string): Promise<BudgetEstimate> {
    const params = new URLSearchParams({
      api_key: API_KEY!,
      query: `${city}, ${country}`,
      format: 'json'
    });

    // Fetch multiple expense categories
    const promises = Object.entries(EXPENSE_ITEMS).map(async ([category, itemId]) => {
      try {
        const response = await fetch(`${NUMBEO_BASE_URL}/city_prices?${params}&item_id=${itemId}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return { category, data: await response.json() };
      } catch (error) {
        console.warn(`Failed to fetch ${category} data:`, error);
        return { category, data: null };
      }
    });

    const results = await Promise.all(promises);
    return this.processBudgetData(results, city, country);
  }

  private processBudgetData(results: any[], city: string, country: string): BudgetEstimate {
    const expenses: any = {};
    
    results.forEach(({ category, data }) => {
      if (data && data.prices && data.prices.length > 0) {
        const price = data.prices[0];
        expenses[category] = {
          average: price.average_price || 0,
          lowest: price.lowest_price || 0,
          highest: price.highest_price || 0
        };
      }
    });

    // Calculate daily budget breakdown
    const accommodation = {
      low: expenses.hotel_budget?.lowest || 25,
      mid: expenses.hotel_mid_range?.average || 60,
      high: expenses.hotel_mid_range?.highest || 120
    };

    const meals = {
      low: (expenses.fast_food?.average || 8) * 3, // 3 fast food meals
      mid: (expenses.restaurant_mid?.average || 15) * 2 + (expenses.fast_food?.average || 8), // 2 restaurant + 1 fast food
      high: (expenses.restaurant_expensive?.average || 50) + (expenses.restaurant_mid?.average || 15) * 2 // 1 fine dining + 2 mid-range
    };

    const transport = {
      low: (expenses.local_transport?.average || 2) * 2, // 2 local transport tickets
      mid: (expenses.local_transport?.average || 2) * 3 + (expenses.taxi_1km?.average || 2) * 5, // Mix of public transport and short taxi rides
      high: (expenses.taxi_1km?.average || 2) * 20 // More taxi usage
    };

    const activities = {
      low: 10, // Basic sightseeing
      mid: 25, // Museum entries, guided tours
      high: 60  // Premium experiences, shows
    };

    return {
      daily_budget_low: accommodation.low + meals.low + transport.low + activities.low,
      daily_budget_mid: accommodation.mid + meals.mid + transport.mid + activities.mid,
      daily_budget_high: accommodation.high + meals.high + transport.high + activities.high,
      currency: 'USD', // Numbeo typically returns USD
      breakdown: {
        accommodation,
        meals,
        transport,
        activities
      }
    };
  }

  private getFallbackBudgetEstimate(city: string, country: string): BudgetEstimate {
    // Fallback budget estimates based on destination tier
    const budgetTiers: { [key: string]: BudgetEstimate } = {
      // Tier 1: Expensive destinations
      'santorini-greece': {
        daily_budget_low: 80,
        daily_budget_mid: 150,
        daily_budget_high: 300,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 40, mid: 80, high: 180 },
          meals: { low: 25, mid: 45, high: 80 },
          transport: { low: 10, mid: 15, high: 25 },
          activities: { low: 5, mid: 10, high: 15 }
        }
      },
      'dubai-uae': {
        daily_budget_low: 100,
        daily_budget_mid: 200,
        daily_budget_high: 400,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 50, mid: 120, high: 250 },
          meals: { low: 30, mid: 50, high: 100 },
          transport: { low: 15, mid: 20, high: 35 },
          activities: { low: 5, mid: 10, high: 15 }
        }
      },
      'reykjavik-iceland': {
        daily_budget_low: 120,
        daily_budget_mid: 220,
        daily_budget_high: 400,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 60, mid: 120, high: 220 },
          meals: { low: 40, mid: 70, high: 120 },
          transport: { low: 15, mid: 20, high: 40 },
          activities: { low: 5, mid: 10, high: 20 }
        }
      },
      // Tier 2: Mid-range destinations
      'kyoto-japan': {
        daily_budget_low: 60,
        daily_budget_mid: 120,
        daily_budget_high: 220,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 30, mid: 70, high: 130 },
          meals: { low: 20, mid: 35, high: 60 },
          transport: { low: 8, mid: 12, high: 20 },
          activities: { low: 2, mid: 3, high: 10 }
        }
      },
      'queenstown-new zealand': {
        daily_budget_low: 80,
        daily_budget_mid: 150,
        daily_budget_high: 280,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 40, mid: 80, high: 150 },
          meals: { low: 25, mid: 45, high: 80 },
          transport: { low: 10, mid: 15, high: 30 },
          activities: { low: 5, mid: 10, high: 20 }
        }
      },
      // Tier 3: Budget-friendly destinations
      'ubud-indonesia': {
        daily_budget_low: 25,
        daily_budget_mid: 60,
        daily_budget_high: 120,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 10, mid: 30, high: 70 },
          meals: { low: 8, mid: 15, high: 25 },
          transport: { low: 5, mid: 10, high: 15 },
          activities: { low: 2, mid: 5, high: 10 }
        }
      },
      'marrakech-morocco': {
        daily_budget_low: 30,
        daily_budget_mid: 70,
        daily_budget_high: 140,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 15, mid: 35, high: 80 },
          meals: { low: 10, mid: 20, high: 35 },
          transport: { low: 3, mid: 10, high: 15 },
          activities: { low: 2, mid: 5, high: 10 }
        }
      },
      'cusco-peru': {
        daily_budget_low: 35,
        daily_budget_mid: 80,
        daily_budget_high: 150,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 15, mid: 40, high: 80 },
          meals: { low: 12, mid: 25, high: 45 },
          transport: { low: 5, mid: 10, high: 15 },
          activities: { low: 3, mid: 5, high: 10 }
        }
      }
    };

    const key = this.getCacheKey(city, country);
    return budgetTiers[key] || {
      daily_budget_low: 50,
      daily_budget_mid: 100,
      daily_budget_high: 200,
      currency: 'USD',
      breakdown: {
        accommodation: { low: 25, mid: 50, high: 100 },
        meals: { low: 15, mid: 30, high: 60 },
        transport: { low: 8, mid: 15, high: 30 },
        activities: { low: 2, mid: 5, high: 10 }
      }
    };
  }

  formatBudgetRange(estimate: BudgetEstimate): string {
    const { daily_budget_low, daily_budget_high, currency } = estimate;
    return `$${daily_budget_low}-${daily_budget_high}/day`;
  }

  getBudgetBreakdownText(estimate: BudgetEstimate): string[] {
    const { breakdown } = estimate;
    return [
      `Accommodation: $${breakdown.accommodation.low}-${breakdown.accommodation.high}`,
      `Meals: $${breakdown.meals.low}-${breakdown.meals.high}`,
      `Transport: $${breakdown.transport.low}-${breakdown.transport.high}`,
      `Activities: $${breakdown.activities.low}-${breakdown.activities.high}`
    ];
  }
}

export const numbeoService = NumbeoService.getInstance();