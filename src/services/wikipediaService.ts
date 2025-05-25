import { WikipediaSearchResult, DeviceCategory } from '../types/types';

// Wikipedia API endpoints
const WIKIPEDIA_API_URL = 'https://en.wikipedia.org/api/rest_v1';
const WIKIPEDIA_ACTION_API = 'https://en.wikipedia.org/w/api.php';

const extractYearFromText = (text: string): number | null => {
  // Common patterns for release years in device descriptions
  const patterns = [
    /released in (\d{4})/i,
    /launched in (\d{4})/i,
    /introduced in (\d{4})/i,
    /debuted in (\d{4})/i,
    /first released in (\d{4})/i,
    /(\d{4}) release/i,
    /released on [^,]*, (\d{4})/i,
    /released [^,]* (\d{4})/i,
    /^.*?(\d{4}).*?(?:released|launched|introduced|unveiled)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const year = parseInt(match[1], 10);
      if (year >= 1970 && year <= new Date().getFullYear()) {
        return year;
      }
    }
  }
  return null;
};

const detectDeviceCategory = (title: string, description: string): DeviceCategory => {
  const text = (title + ' ' + description).toLowerCase();
  
  // Define category keywords
  const categoryKeywords: Record<DeviceCategory, string[]> = {
    smartphone: ['smartphone', 'mobile phone', 'iphone', 'android phone', 'cell phone'],
    laptop: ['laptop', 'notebook', 'macbook', 'ultrabook'],
    desktop: ['desktop computer', 'pc', 'personal computer', 'workstation'],
    tablet: ['tablet', 'ipad', 'android tablet'],
    smartwatch: ['smartwatch', 'smart watch', 'apple watch', 'wearable'],
    gaming: ['game console', 'gaming console', 'playstation', 'xbox', 'nintendo'],
    audio: ['headphones', 'earbuds', 'speaker', 'sound system', 'audio device'],
    camera: ['camera', 'digital camera', 'dslr', 'mirrorless'],
    other: []
  };

  // Check each category's keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category as DeviceCategory;
    }
  }

  return 'other';
};

const fetchPageImages = async (pageId: number): Promise<string[]> => {
  try {
    const url = new URL(WIKIPEDIA_ACTION_API);
    url.search = new URLSearchParams({
      action: 'query',
      format: 'json',
      pageids: pageId.toString(),
      prop: 'images',
      imlimit: '10',
      origin: '*'
    }).toString();

    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.query?.pages?.[pageId]?.images) {
      return [];
    }

    // Filter for image files and get their URLs
    const imageTitles = data.query.pages[pageId].images
      .filter((img: any) => img.title.toLowerCase().endsWith('.jpg') || 
                          img.title.toLowerCase().endsWith('.png') ||
                          img.title.toLowerCase().endsWith('.jpeg'))
      .map((img: any) => img.title);

    // Get image URLs
    const imageUrls = await Promise.all(
      imageTitles.map(async (title: string) => {
        const imageUrl = new URL(WIKIPEDIA_ACTION_API);
        imageUrl.search = new URLSearchParams({
          action: 'query',
          format: 'json',
          titles: title,
          prop: 'imageinfo',
          iiprop: 'url',
          origin: '*'
        }).toString();

        const response = await fetch(imageUrl);
        const data = await response.json();
        const pages = Object.values(data.query.pages);
        return pages[0]?.imageinfo?.[0]?.url || '';
      })
    );

    return imageUrls.filter(url => url !== '');
  } catch (error) {
    console.error('Error fetching page images:', error);
    return [];
  }
};

export const searchWikipedia = async (query: string): Promise<WikipediaSearchResult[]> => {
  try {
    // Use the action API with origin=* for CORS support
    const url = new URL(WIKIPEDIA_ACTION_API);
    url.search = new URLSearchParams({
      action: 'query',
      format: 'json',
      generator: 'search',
      gsrsearch: query,
      gsrlimit: '5',
      prop: 'pageimages|extracts|info',
      pilimit: 'max',
      exintro: '1',
      explaintext: '1',
      exlimit: 'max',
      inprop: 'url',
      origin: '*'
    }).toString();

    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.query || !data.query.pages) {
      return [];
    }

    const results = await Promise.all(
      Object.values(data.query.pages).map(async (page: any) => {
        const title = page.title;
        const description = page.extract || 'No description available';
        const defaultImageUrl = page.thumbnail ? page.thumbnail.source : '';
        
        // Fetch additional images
        const additionalImages = await fetchPageImages(page.pageid);
        const allImages = [defaultImageUrl, ...additionalImages].filter(url => url !== '');

        // Only return results that have at least one image
        if (allImages.length === 0) {
          return null;
        }

        return {
          title,
          description,
          imageUrl: defaultImageUrl,
          additionalImages: allImages,
          wikiUrl: page.fullurl,
          releaseYear: extractYearFromText(description),
          category: detectDeviceCategory(title, description)
        };
      })
    );

    // Filter out null results (entries with no images)
    return results.filter((result): result is WikipediaSearchResult => result !== null);
  } catch (error) {
    console.error('Error fetching from Wikipedia:', error);
    return [];
  }
};

export const getDeviceImageFallback = (category: string): string => {
  // Return fallback images based on category if Wikipedia doesn't provide an image
  const fallbacks: Record<string, string> = {
    smartphone: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg',
    laptop: 'https://images.pexels.com/photos/18105/pexels-photo.jpg',
    desktop: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg',
    tablet: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg',
    smartwatch: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    gaming: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg',
    audio: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    camera: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg',
  };
  
  return fallbacks[category.toLowerCase()] || 'https://images.pexels.com/photos/1476321/pexels-photo-1476321.jpeg';
};