// Open-Meteo Weather Service
// Free weather API with no API key required
// Documentation: https://open-meteo.com/en/docs

interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    windspeed_10m_max: number[];
    weathercode: number[];
  };
}

interface MonthlyWeatherData {
  month: string;
  monthIndex: number;
  temperature: {
    min: number;
    max: number;
    average: number;
  };
  precipitation: number;
  windSpeed: number;
  weatherScore: number; // 1-10 scale for travel suitability
}

interface TravelSeasonData {
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  months: string[];
  weather: {
    temperature: { min: number; max: number; average: number };
    precipitation: number;
    windSpeed: number;
  };
  crowdLevel: 'low' | 'medium' | 'high';
  priceLevel: 'budget' | 'moderate' | 'expensive';
  travelScore: number; // Overall travel suitability score
  pros: string[];
  cons: string[];
}

interface BestTimeData {
  destination: string;
  country: string;
  coordinates: { lat: number; lng: number };
  bestMonths: string[];
  goodMonths: string[];
  avoidMonths: string[];
  seasons: TravelSeasonData[];
  currentSeason?: TravelSeasonData;
  specialEvents: Array<{
    name: string;
    months: string[];
    description: string;
  }>;
  lastUpdated: string;
  dataSource: string;
}

export class OpenMeteoService {
  private static instance: OpenMeteoService;
  private cache: Map<string, { data: BestTimeData; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours cache
  private readonly API_BASE = 'https://api.open-meteo.com/v1';

  static getInstance(): OpenMeteoService {
    if (!OpenMeteoService.instance) {
      OpenMeteoService.instance = new OpenMeteoService();
    }
    return OpenMeteoService.instance;
  }

  async getBestTimeToVisit(
    destination: string, 
    country: string, 
    coordinates: { lat: number; lng: number }
  ): Promise<BestTimeData> {
    const cacheKey = `${destination}-${country}`.toLowerCase().replace(/\s+/g, '-');
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      // Fetch historical weather data for the past year
      const weatherData = await this.fetchHistoricalWeather(coordinates);
      const processedData = this.processWeatherData(destination, country, coordinates, weatherData);
      
      this.cache.set(cacheKey, { data: processedData, timestamp: Date.now() });
      return processedData;
    } catch (error) {
      console.warn('Failed to fetch Open-Meteo data, using fallback:', error);
      return this.getFallbackData(destination, country, coordinates);
    }
  }

  private async fetchHistoricalWeather(coordinates: { lat: number; lng: number }): Promise<OpenMeteoResponse> {
    // Get data for the past 365 days to calculate monthly averages
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    const params = new URLSearchParams({
      latitude: coordinates.lat.toFixed(4),
      longitude: coordinates.lng.toFixed(4),
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      daily: [
        'temperature_2m_max',
        'temperature_2m_min', 
        'precipitation_sum',
        'windspeed_10m_max',
        'weathercode'
      ].join(','),
      timezone: 'auto'
    });

    const response = await fetch(`${this.API_BASE}/forecast?${params}`);
    
    if (!response.ok) {
      throw new Error(`Open-Meteo API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  private processWeatherData(
    destination: string,
    country: string, 
    coordinates: { lat: number; lng: number },
    weatherData: OpenMeteoResponse
  ): BestTimeData {
    // Calculate monthly averages from daily data
    const monthlyData = this.calculateMonthlyAverages(weatherData);
    
    // Generate seasonal data
    const seasons = this.generateSeasonalData(monthlyData, coordinates.lat);
    
    // Determine best/good/avoid months
    const { bestMonths, goodMonths, avoidMonths } = this.categorizeMonths(monthlyData);
    
    // Get current season
    const currentMonth = new Date().getMonth();
    const currentSeason = seasons.find(season => 
      season.months.some(month => this.getMonthIndex(month) === currentMonth)
    );

    return {
      destination,
      country,
      coordinates,
      bestMonths,
      goodMonths,
      avoidMonths,
      seasons,
      currentSeason,
      specialEvents: this.getSpecialEvents(destination, country),
      lastUpdated: new Date().toISOString(),
      dataSource: 'Open-Meteo API'
    };
  }

  private calculateMonthlyAverages(weatherData: OpenMeteoResponse): MonthlyWeatherData[] {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return months.map((month, monthIndex) => {
      // Filter data for this month
      const monthData = weatherData.daily.time
        .map((date, index) => ({
          date: new Date(date),
          tempMax: weatherData.daily.temperature_2m_max[index],
          tempMin: weatherData.daily.temperature_2m_min[index],
          precipitation: weatherData.daily.precipitation_sum[index],
          windSpeed: weatherData.daily.windspeed_10m_max[index],
          weatherCode: weatherData.daily.weathercode[index]
        }))
        .filter(day => day.date.getMonth() === monthIndex);

      if (monthData.length === 0) {
        // Fallback if no data for this month
        return this.getFallbackMonthData(month, monthIndex);
      }

      // Calculate averages
      const avgTempMax = monthData.reduce((sum, day) => sum + (day.tempMax || 0), 0) / monthData.length;
      const avgTempMin = monthData.reduce((sum, day) => sum + (day.tempMin || 0), 0) / monthData.length;
      const avgPrecipitation = monthData.reduce((sum, day) => sum + (day.precipitation || 0), 0) / monthData.length;
      const avgWindSpeed = monthData.reduce((sum, day) => sum + (day.windSpeed || 0), 0) / monthData.length;

      // Calculate weather score (1-10) based on temperature comfort and precipitation
      const avgTemp = (avgTempMax + avgTempMin) / 2;
      const tempScore = this.calculateTemperatureScore(avgTemp);
      const precipScore = this.calculatePrecipitationScore(avgPrecipitation);
      const weatherScore = (tempScore + precipScore) / 2;

      return {
        month,
        monthIndex,
        temperature: {
          min: Math.round(avgTempMin * 10) / 10,
          max: Math.round(avgTempMax * 10) / 10,
          average: Math.round(avgTemp * 10) / 10
        },
        precipitation: Math.round(avgPrecipitation * 10) / 10,
        windSpeed: Math.round(avgWindSpeed * 10) / 10,
        weatherScore: Math.round(weatherScore * 10) / 10
      };
    });
  }

  private calculateTemperatureScore(temp: number): number {
    // Optimal temperature range: 18-26°C
    if (temp >= 18 && temp <= 26) return 10;
    if (temp >= 15 && temp <= 30) return 8;
    if (temp >= 10 && temp <= 35) return 6;
    if (temp >= 5 && temp <= 40) return 4;
    return 2;
  }

  private calculatePrecipitationScore(precipitation: number): number {
    // Lower precipitation is better for tourism
    if (precipitation <= 30) return 10;
    if (precipitation <= 60) return 8;
    if (precipitation <= 100) return 6;
    if (precipitation <= 150) return 4;
    return 2;
  }

  private generateSeasonalData(monthlyData: MonthlyWeatherData[], latitude: number): TravelSeasonData[] {
    const isNorthernHemisphere = latitude > 0;
    
    const seasonDefinitions = isNorthernHemisphere ? {
      spring: [2, 3, 4], // Mar, Apr, May
      summer: [5, 6, 7], // Jun, Jul, Aug
      autumn: [8, 9, 10], // Sep, Oct, Nov
      winter: [11, 0, 1] // Dec, Jan, Feb
    } : {
      spring: [8, 9, 10], // Sep, Oct, Nov
      summer: [11, 0, 1], // Dec, Jan, Feb
      autumn: [2, 3, 4], // Mar, Apr, May
      winter: [5, 6, 7] // Jun, Jul, Aug
    };

    return Object.entries(seasonDefinitions).map(([season, monthIndices]) => {
      const seasonMonths = monthIndices.map(i => monthlyData[i]);
      const avgWeather = this.averageWeatherData(seasonMonths);
      const travelScore = seasonMonths.reduce((sum, month) => sum + month.weatherScore, 0) / seasonMonths.length;

      // Determine crowd and price levels based on season and weather score
      const { crowdLevel, priceLevel } = this.determineCrowdAndPricing(season as any, travelScore);
      
      return {
        season: season as any,
        months: monthIndices.map(i => monthlyData[i].month),
        weather: avgWeather,
        crowdLevel,
        priceLevel,
        travelScore: Math.round(travelScore * 10) / 10,
        pros: this.getSeasonPros(season as any, avgWeather, crowdLevel),
        cons: this.getSeasonCons(season as any, avgWeather, crowdLevel)
      };
    });
  }

  private averageWeatherData(months: MonthlyWeatherData[]) {
    return {
      temperature: {
        min: Math.round((months.reduce((sum, m) => sum + m.temperature.min, 0) / months.length) * 10) / 10,
        max: Math.round((months.reduce((sum, m) => sum + m.temperature.max, 0) / months.length) * 10) / 10,
        average: Math.round((months.reduce((sum, m) => sum + m.temperature.average, 0) / months.length) * 10) / 10
      },
      precipitation: Math.round((months.reduce((sum, m) => sum + m.precipitation, 0) / months.length) * 10) / 10,
      windSpeed: Math.round((months.reduce((sum, m) => sum + m.windSpeed, 0) / months.length) * 10) / 10
    };
  }

  private determineCrowdAndPricing(season: string, travelScore: number): { crowdLevel: 'low' | 'medium' | 'high'; priceLevel: 'budget' | 'moderate' | 'expensive' } {
    // Summer typically has highest crowds and prices
    if (season === 'summer') {
      return { crowdLevel: 'high', priceLevel: 'expensive' };
    }
    
    // High travel score means good weather, which attracts more tourists
    if (travelScore >= 8) {
      return { crowdLevel: 'high', priceLevel: 'expensive' };
    } else if (travelScore >= 6) {
      return { crowdLevel: 'medium', priceLevel: 'moderate' };
    } else {
      return { crowdLevel: 'low', priceLevel: 'budget' };
    }
  }

  private getSeasonPros(season: string, weather: any, crowdLevel: string): string[] {
    const pros: string[] = [];
    
    if (weather.temperature.average >= 18 && weather.temperature.average <= 26) {
      pros.push('Perfect temperatures');
    } else if (weather.temperature.average >= 15) {
      pros.push('Comfortable weather');
    }
    
    if (weather.precipitation < 50) {
      pros.push('Low rainfall');
    }
    
    if (crowdLevel === 'low') {
      pros.push('Fewer tourists');
    }
    
    // Season-specific pros
    switch (season) {
      case 'spring':
        pros.push('Blooming nature', 'Mild temperatures');
        break;
      case 'summer':
        pros.push('Long daylight hours', 'All attractions open');
        break;
      case 'autumn':
        pros.push('Beautiful fall colors', 'Harvest season');
        break;
      case 'winter':
        pros.push('Lower prices', 'Cozy atmosphere');
        break;
    }
    
    return pros;
  }

  private getSeasonCons(season: string, weather: any, crowdLevel: string): string[] {
    const cons: string[] = [];
    
    if (weather.temperature.average < 10) {
      cons.push('Cold temperatures');
    } else if (weather.temperature.average > 30) {
      cons.push('Hot temperatures');
    }
    
    if (weather.precipitation > 100) {
      cons.push('High rainfall');
    }
    
    if (crowdLevel === 'high') {
      cons.push('Peak tourist season');
    }
    
    // Season-specific cons
    switch (season) {
      case 'spring':
        cons.push('Variable weather');
        break;
      case 'summer':
        cons.push('Highest prices', 'Crowded attractions');
        break;
      case 'autumn':
        cons.push('Shorter days');
        break;
      case 'winter':
        cons.push('Limited daylight', 'Some attractions closed');
        break;
    }
    
    return cons;
  }

  private categorizeMonths(monthlyData: MonthlyWeatherData[]): { bestMonths: string[]; goodMonths: string[]; avoidMonths: string[] } {
    const sortedMonths = [...monthlyData].sort((a, b) => b.weatherScore - a.weatherScore);
    
    const bestMonths = sortedMonths.filter(month => month.weatherScore >= 8).map(month => month.month);
    const goodMonths = sortedMonths.filter(month => month.weatherScore >= 6 && month.weatherScore < 8).map(month => month.month);
    const avoidMonths = sortedMonths.filter(month => month.weatherScore < 4).map(month => month.month);
    
    return { bestMonths, goodMonths, avoidMonths };
  }

  private getSpecialEvents(destination: string, country: string): Array<{ name: string; months: string[]; description: string }> {
    // Curated special events database
    const eventDatabase: { [key: string]: Array<{ name: string; months: string[]; description: string }> } = {
      'santorini-greece': [
        { name: 'Santorini Jazz Festival', months: ['July'], description: 'International jazz performances with stunning sunset views' },
        { name: 'Ifestia Festival', months: ['September'], description: 'Volcanic fireworks celebrating the island\'s history' },
        { name: 'Easter Celebrations', months: ['April'], description: 'Traditional Greek Orthodox Easter festivities' }
      ],
      'kyoto-japan': [
        { name: 'Cherry Blossom Season', months: ['March', 'April'], description: 'Peak sakura blooming period with hanami festivals' },
        { name: 'Autumn Foliage', months: ['November', 'December'], description: 'Spectacular fall colors in temples and gardens' },
        { name: 'Gion Matsuri', months: ['July'], description: 'One of Japan\'s most famous traditional festivals' },
        { name: 'Jidai Matsuri', months: ['October'], description: 'Festival of Ages with historical processions' }
      ],
      'machu-picchu-peru': [
        { name: 'Inti Raymi', months: ['June'], description: 'Festival of the Sun celebrating Inca heritage' },
        { name: 'Dry Season', months: ['May', 'June', 'July', 'August', 'September'], description: 'Best hiking conditions for Inca Trail' }
      ],
      'reykjavik-iceland': [
        { name: 'Northern Lights Season', months: ['September', 'October', 'November', 'December', 'January', 'February', 'March'], description: 'Best aurora viewing conditions with dark nights' },
        { name: 'Midnight Sun', months: ['May', 'June', 'July'], description: 'Nearly 24 hours of daylight' },
        { name: 'Iceland Airwaves', months: ['November'], description: 'International music festival' }
      ],
      'dubai-uae': [
        { name: 'Dubai Shopping Festival', months: ['January', 'February'], description: 'Major shopping and entertainment event with discounts' },
        { name: 'Dubai Food Festival', months: ['February', 'March'], description: 'Culinary celebrations across the city' },
        { name: 'Dubai Fountain Shows', months: ['October', 'November', 'December', 'January', 'February', 'March'], description: 'Best weather for outdoor fountain viewing' }
      ],
      'ubud-indonesia': [
        { name: 'Dry Season', months: ['April', 'May', 'June', 'July', 'August', 'September'], description: 'Best weather for outdoor activities and temple visits' },
        { name: 'Nyepi (Silent Day)', months: ['March'], description: 'Balinese New Year with unique cultural celebrations' },
        { name: 'Rice Harvest', months: ['March', 'April', 'September', 'October'], description: 'Beautiful golden rice terraces' }
      ],
      'marrakech-morocco': [
        { name: 'Rose Festival', months: ['May'], description: 'Celebration of rose harvest in nearby Dades Valley' },
        { name: 'Marrakech Popular Arts Festival', months: ['July'], description: 'Traditional music and dance performances' }
      ],
      'queenstown-new zealand': [
        { name: 'Winter Festival', months: ['June', 'July'], description: 'Celebration of winter with fireworks and performances' },
        { name: 'Summer Season', months: ['December', 'January', 'February'], description: 'Peak adventure sports season' }
      ]
    };

    const key = `${destination}-${country}`.toLowerCase().replace(/\s+/g, '-');
    return eventDatabase[key] || [];
  }

  private getFallbackMonthData(month: string, monthIndex: number): MonthlyWeatherData {
    // Fallback data based on typical seasonal patterns
    const tempBase = 20;
    const seasonalVariation = Math.sin((monthIndex - 3) * Math.PI / 6) * 10;
    
    return {
      month,
      monthIndex,
      temperature: {
        min: tempBase + seasonalVariation - 5,
        max: tempBase + seasonalVariation + 5,
        average: tempBase + seasonalVariation
      },
      precipitation: 50 + Math.random() * 50,
      windSpeed: 10 + Math.random() * 10,
      weatherScore: 6 + Math.random() * 2
    };
  }

  private getFallbackData(destination: string, country: string, coordinates: { lat: number; lng: number }): BestTimeData {
    // Curated fallback data for major destinations
    const fallbackDatabase: { [key: string]: Partial<BestTimeData> } = {
      'santorini-greece': {
        bestMonths: ['April', 'May', 'September', 'October'],
        goodMonths: ['March', 'June', 'November'],
        avoidMonths: ['December', 'January', 'February']
      },
      'kyoto-japan': {
        bestMonths: ['March', 'April', 'May', 'October', 'November'],
        goodMonths: ['September', 'December'],
        avoidMonths: ['July', 'August']
      },
      'machu-picchu-peru': {
        bestMonths: ['May', 'June', 'July', 'August', 'September'],
        goodMonths: ['April', 'October'],
        avoidMonths: ['December', 'January', 'February', 'March']
      },
      'reykjavik-iceland': {
        bestMonths: ['June', 'July', 'August'],
        goodMonths: ['May', 'September'],
        avoidMonths: ['December', 'January', 'February']
      }
    };

    const key = `${destination}-${country}`.toLowerCase().replace(/\s+/g, '-');
    const fallback = fallbackDatabase[key] || {
      bestMonths: ['April', 'May', 'September', 'October'],
      goodMonths: ['March', 'June', 'November'],
      avoidMonths: ['December', 'January']
    };

    return {
      destination,
      country,
      coordinates,
      bestMonths: fallback.bestMonths || [],
      goodMonths: fallback.goodMonths || [],
      avoidMonths: fallback.avoidMonths || [],
      seasons: [],
      specialEvents: this.getSpecialEvents(destination, country),
      lastUpdated: new Date().toISOString(),
      dataSource: 'Curated Data (API Unavailable)'
    };
  }

  private getMonthIndex(monthName: string): number {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.indexOf(monthName);
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  formatBestTimeToVisit(data: BestTimeData): string {
    if (data.bestMonths.length === 0 && data.goodMonths.length === 0) {
      return 'Year-round destination';
    }
    
    const allGoodMonths = [...data.bestMonths, ...data.goodMonths];
    
    if (allGoodMonths.length <= 3) {
      return allGoodMonths.join(', ');
    }
    
    // Group consecutive months for better readability
    return this.groupConsecutiveMonths(allGoodMonths);
  }

  private groupConsecutiveMonths(months: string[]): string {
    const monthOrder = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const monthIndices = months
      .map(month => monthOrder.indexOf(month))
      .filter(index => index !== -1)
      .sort((a, b) => a - b);
    
    if (monthIndices.length <= 3) {
      return monthIndices.map(i => monthOrder[i]).join(', ');
    }
    
    // Find consecutive groups
    const groups: number[][] = [];
    let currentGroup: number[] = [];
    
    for (let i = 0; i < monthIndices.length; i++) {
      if (currentGroup.length === 0 || monthIndices[i] === currentGroup[currentGroup.length - 1] + 1) {
        currentGroup.push(monthIndices[i]);
      } else {
        groups.push([...currentGroup]);
        currentGroup = [monthIndices[i]];
      }
    }
    
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    
    return groups.map(group => {
      if (group.length === 1) {
        return monthOrder[group[0]];
      } else if (group.length === 2) {
        return `${monthOrder[group[0]]}, ${monthOrder[group[1]]}`;
      } else {
        return `${monthOrder[group[0]]} to ${monthOrder[group[group.length - 1]]}`;
      }
    }).join(', ');
  }
}

export const openMeteoService = OpenMeteoService.getInstance();