// Pexels API Service for fetching destination images
// Documentation: https://www.pexels.com/api/documentation/

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

interface PexelsResponse {
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  total_results: number;
  next_page?: string;
  prev_page?: string;
}

interface GalleryImage {
  id: string;
  url: string;
  thumbnail: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
  avgColor: string;
  aspectRatio: number;
}

export class PexelsService {
  private static instance: PexelsService;
  private readonly API_KEY = 'Q641rlhqSIJzKzsw6n0xtjncaQsBMCoWnzNm8CsXbDUn8njB4YF6G0dz';
  private readonly BASE_URL = 'https://api.pexels.com/v1';
  private cache: Map<string, { data: GalleryImage[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60 * 60 * 1000; // 1 hour

  static getInstance(): PexelsService {
    if (!PexelsService.instance) {
      PexelsService.instance = new PexelsService();
    }
    return PexelsService.instance;
  }

  async getDestinationImages(destination: string, country: string, count: number = 12): Promise<GalleryImage[]> {
    const cacheKey = `${destination}-${country}-${count}`.toLowerCase();
    const cached = this.cache.get(cacheKey);

    if (cached && this.isValidCache(cached.timestamp)) {
      return cached.data;
    }

    try {
      const images = await this.fetchImages(destination, country, count);
      this.cache.set(cacheKey, { data: images, timestamp: Date.now() });
      return images;
    } catch (error) {
      console.error('Failed to fetch Pexels images:', error);
      return this.getFallbackImages(destination, country);
    }
  }

  private async fetchImages(destination: string, country: string, count: number): Promise<GalleryImage[]> {
    const queries = [
      `${destination} ${country}`,
      `${destination} travel`,
      `${country} tourism`,
      `${destination} landmarks`,
      `${country} culture`,
      `${destination} architecture`
    ];

    const allImages: GalleryImage[] = [];
    const imagesPerQuery = Math.ceil(count / queries.length);

    for (const query of queries) {
      if (allImages.length >= count) break;

      try {
        const response = await fetch(
          `${this.BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=${imagesPerQuery}&orientation=all`,
          {
            headers: {
              'Authorization': this.API_KEY,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Pexels API error: ${response.status}`);
        }

        const data: PexelsResponse = await response.json();
        const processedImages = data.photos.map(this.processPhoto).slice(0, imagesPerQuery);
        allImages.push(...processedImages);

        // Add small delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(`Failed to fetch images for query "${query}":`, error);
      }
    }

    // Remove duplicates and limit to requested count
    const uniqueImages = this.removeDuplicates(allImages);
    return uniqueImages.slice(0, count);
  }

  private processPhoto(photo: PexelsPhoto): GalleryImage {
    return {
      id: photo.id.toString(),
      url: photo.src.large,
      thumbnail: photo.src.medium,
      alt: photo.alt || `Photo by ${photo.photographer}`,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      avgColor: photo.avg_color,
      aspectRatio: photo.width / photo.height
    };
  }

  private removeDuplicates(images: GalleryImage[]): GalleryImage[] {
    const seen = new Set<string>();
    return images.filter(image => {
      if (seen.has(image.id)) {
        return false;
      }
      seen.add(image.id);
      return true;
    });
  }

  private getFallbackImages(destination: string, country: string): GalleryImage[] {
    // Fallback images from Pexels (known working URLs)
    const fallbackUrls = [
      'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg',
      'https://images.pexels.com/photos/2070033/pexels-photo-2070033.jpeg',
      'https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg',
      'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg',
      'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg',
      'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg',
      'https://images.pexels.com/photos/552779/pexels-photo-552779.jpeg',
      'https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg'
    ];

    return fallbackUrls.map((url, index) => ({
      id: `fallback-${index}`,
      url,
      thumbnail: url,
      alt: `${destination} - Beautiful destination photo`,
      photographer: 'Pexels Photographer',
      photographerUrl: 'https://www.pexels.com',
      avgColor: '#4A90E2',
      aspectRatio: 1.5
    }));
  }

  private isValidCache(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  // Get curated collections for specific destinations
  async getCuratedCollection(destination: string): Promise<GalleryImage[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/curated?per_page=15`, {
        headers: {
          'Authorization': this.API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`);
      }

      const data: PexelsResponse = await response.json();
      return data.photos.map(this.processPhoto);
    } catch (error) {
      console.error('Failed to fetch curated collection:', error);
      return [];
    }
  }
}

export const pexelsService = PexelsService.getInstance();