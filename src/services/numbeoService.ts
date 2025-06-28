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
      const budgetData = this.getFallbackBudgetEstimate(city, country);
      this.cache.set(cacheKey, { data: budgetData, timestamp: Date.now() });
      return budgetData;
    } catch (error) {
      console.warn('Failed to fetch budget data, using fallback:', error);
      return this.getFallbackBudgetEstimate(city, country);
    }
  }

  private getFallbackBudgetEstimate(city: string, country: string): BudgetEstimate {
    // Fallback budget estimates based on destination tier
    const budgetTiers: { [key: string]: BudgetEstimate } = {
      // Casual Adventure Destinations
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
      'venice-italy': {
        daily_budget_low: 70,
        daily_budget_mid: 120,
        daily_budget_high: 250,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 35, mid: 70, high: 150 },
          meals: { low: 20, mid: 35, high: 70 },
          transport: { low: 10, mid: 10, high: 20 },
          activities: { low: 5, mid: 5, high: 10 }
        }
      },
      'paris-france': {
        daily_budget_low: 80,
        daily_budget_mid: 130,
        daily_budget_high: 280,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 40, mid: 75, high: 170 },
          meals: { low: 25, mid: 40, high: 80 },
          transport: { low: 10, mid: 10, high: 20 },
          activities: { low: 5, mid: 5, high: 10 }
        }
      },
      'malé-maldives': {
        daily_budget_low: 150,
        daily_budget_mid: 300,
        daily_budget_high: 500,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 100, mid: 200, high: 350 },
          meals: { low: 30, mid: 60, high: 100 },
          transport: { low: 15, mid: 30, high: 40 },
          activities: { low: 5, mid: 10, high: 10 }
        }
      },

      // Offbeat Journey Destinations
      'orlando-united states': {
        daily_budget_low: 100,
        daily_budget_mid: 150,
        daily_budget_high: 300,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 50, mid: 80, high: 180 },
          meals: { low: 30, mid: 45, high: 80 },
          transport: { low: 15, mid: 20, high: 30 },
          activities: { low: 5, mid: 5, high: 10 }
        }
      },
      'sydney-australia': {
        daily_budget_low: 80,
        daily_budget_mid: 120,
        daily_budget_high: 250,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 40, mid: 70, high: 150 },
          meals: { low: 25, mid: 35, high: 70 },
          transport: { low: 10, mid: 10, high: 20 },
          activities: { low: 5, mid: 5, high: 10 }
        }
      },
      'calgary-canada': {
        daily_budget_low: 70,
        daily_budget_mid: 100,
        daily_budget_high: 200,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 35, mid: 55, high: 120 },
          meals: { low: 20, mid: 30, high: 50 },
          transport: { low: 10, mid: 10, high: 20 },
          activities: { low: 5, mid: 5, high: 10 }
        }
      },
      'singapore-singapore': {
        daily_budget_low: 60,
        daily_budget_mid: 80,
        daily_budget_high: 160,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 30, mid: 45, high: 100 },
          meals: { low: 20, mid: 25, high: 40 },
          transport: { low: 8, mid: 8, high: 15 },
          activities: { low: 2, mid: 2, high: 5 }
        }
      },

      // Chill Trip Destinations - UPDATED
      'lisbon-portugal': {
        daily_budget_low: 40,
        daily_budget_mid: 60,
        daily_budget_high: 120,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 20, mid: 35, high: 70 },
          meals: { low: 12, mid: 18, high: 35 },
          transport: { low: 5, mid: 5, high: 10 },
          activities: { low: 3, mid: 2, high: 5 }
        }
      },
      'bled-slovenia': {
        daily_budget_low: 35,
        daily_budget_mid: 50,
        daily_budget_high: 100,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 18, mid: 28, high: 60 },
          meals: { low: 10, mid: 15, high: 25 },
          transport: { low: 5, mid: 5, high: 10 },
          activities: { low: 2, mid: 2, high: 5 }
        }
      },
      'montevideo-uruguay': {
        daily_budget_low: 30,
        daily_budget_mid: 40,
        daily_budget_high: 80,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 15, mid: 22, high: 45 },
          meals: { low: 10, mid: 12, high: 25 },
          transport: { low: 3, mid: 4, high: 8 },
          activities: { low: 2, mid: 2, high: 2 }
        }
      },
      'valletta-malta': {
        daily_budget_low: 50,
        daily_budget_mid: 70,
        daily_budget_high: 140,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 25, mid: 40, high: 85 },
          meals: { low: 15, mid: 20, high: 35 },
          transport: { low: 8, mid: 8, high: 15 },
          activities: { low: 2, mid: 2, high: 5 }
        }
      },
      'queenstown-new zealand': {
        daily_budget_low: 60,
        daily_budget_mid: 80,
        daily_budget_high: 160,
        currency: 'USD',
        breakdown: {
          accommodation: { low: 30, mid: 45, high: 95 },
          meals: { low: 20, mid: 25, high: 45 },
          transport: { low: 8, mid: 8, high: 15 },
          activities: { low: 2, mid: 2, high: 5 }
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