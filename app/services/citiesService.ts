// Using GeoDB Cities API - a free service
const GEODB_API_KEY = '62ffb76c8bmsh6f7d1c9d91c23d2p1d5c55jsn1ef6a21bfe92'; // Demo API key
const GEODB_API_HOST = 'wft-geo-db.p.rapidapi.com';
const GEODB_API_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo';

export interface City {
  id: string;
  name: string;
  country: string;
  population?: number;
}

// Cache mechanism to avoid repeated API calls
let cachedPopularCities: City[] | null = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
let cacheTimestamp: number | null = null;

// Search results cache to reduce API calls
const searchCache: Record<string, { results: string[], timestamp: number }> = {};
const SEARCH_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Get a list of popular cities from the GeoDB Cities API
 */
export async function getPopularCities(limit: number = 30): Promise<string[]> {
  try {
    // Check cache first
    if (cachedPopularCities && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      return cachedPopularCities.map(city => city.name);
    }

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': GEODB_API_KEY,
        'X-RapidAPI-Host': GEODB_API_HOST
      }
    };

    const response = await fetch(
      `${GEODB_API_URL}/cities?limit=${limit}&minPopulation=1000000&sort=-population`,
      options
    );

    if (!response.ok) {
      return getFallbackCities();
    }

    const data = await response.json();
    
    if (data && data.data && Array.isArray(data.data)) {
      cachedPopularCities = data.data.map((city: any) => ({
        id: city.id,
        name: city.city,
        country: city.country,
        population: city.population
      }));
      
      cacheTimestamp = Date.now();
      
      return cachedPopularCities ? cachedPopularCities.map(city => city.name) : [];
    }
    
    return getFallbackCities();
  } catch (error) {
    return getFallbackCities();
  }
}

/**
 * Search for cities by name
 */
export async function searchCities(query: string, limit: number = 10): Promise<string[]> {
  if (!query || query.length < 2) {
    return [];
  }
  
  // Check if we have cached results for this query
  const cacheKey = query.toLowerCase().trim();
  if (searchCache[cacheKey] && (Date.now() - searchCache[cacheKey].timestamp < SEARCH_CACHE_DURATION)) {
    return searchCache[cacheKey].results;
  }
  
  try {
    // Try to match using fallback cities first for faster response
    const fallbackMatches = filterFallbackCities(query, limit);
    if (fallbackMatches.length > 0) {
      searchCache[cacheKey] = {
        results: fallbackMatches,
        timestamp: Date.now()
      };
      return fallbackMatches;
    }
    
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': GEODB_API_KEY,
        'X-RapidAPI-Host': GEODB_API_HOST
      }
    };

    const response = await fetch(
      `${GEODB_API_URL}/cities?namePrefix=${encodeURIComponent(query)}&limit=${limit}&sort=-population`,
      options
    );

    if (!response.ok) {
      // Fallback to fuzzy search in our local cities list
      return fuzzySearchFallbackCities(query, limit);
    }

    const data = await response.json();
    
    if (data && data.data && Array.isArray(data.data)) {
      const results = data.data.map((city: any) => city.city);
      
      searchCache[cacheKey] = {
        results,
        timestamp: Date.now()
      };
      
      return results;
    }
    
    // Fallback to fuzzy search in our local cities list
    return fuzzySearchFallbackCities(query, limit);
  } catch (error) {
    // Fallback to fuzzy search in our local cities list
    return fuzzySearchFallbackCities(query, limit);
  }
}

// Fallback city list in case the API fails - extended list
function getFallbackCities(): string[] {
  return [
    'Tokyo', 'Delhi', 'Shanghai', 'São Paulo', 'Mexico City', 
    'Cairo', 'Mumbai', 'Beijing', 'Dhaka', 'Osaka', 
    'New York', 'Karachi', 'Buenos Aires', 'Chongqing', 'Istanbul', 
    'Kolkata', 'Manila', 'Lagos', 'Rio de Janeiro', 'Tianjin',
    'Kinshasa', 'Guangzhou', 'Los Angeles', 'Moscow', 'Shenzhen',
    'Lahore', 'Bangalore', 'Paris', 'Bogotá', 'Jakarta',
    'Chennai', 'Lima', 'Bangkok', 'Seoul', 'Nagoya',
    'Hyderabad', 'London', 'Tehran', 'Chicago', 'Chengdu',
    'Nanjing', 'Wuhan', 'Ho Chi Minh City', 'Luanda', 'Ahmedabad',
    'Kuala Lumpur', 'Xi\'an', 'Hong Kong', 'Dongguan', 'Hangzhou',
    'Foshan', 'Shenyang', 'Riyadh', 'Baghdad', 'Santiago',
    'Surat', 'Madrid', 'Suzhou', 'Pune', 'Harbin',
    'Houston', 'Dallas', 'Toronto', 'Dar es Salaam', 'Miami',
    'Belo Horizonte', 'Singapore', 'Philadelphia', 'Atlanta', 'Fukuoka',
    'Khartoum', 'Barcelona', 'Johannesburg', 'Saint Petersburg', 'Qingdao',
    'Dalian', 'Washington', 'Yangon', 'Alexandria', 'Jinan',
    'Berlin', 'Ankara', 'Milan', 'Rome', 'Amsterdam',
    'Hamburg', 'Manchester', 'Dubai', 'Doha', 'Athens'
  ];
}

// Filter fallback cities based on query (exact match)
function filterFallbackCities(query: string, limit: number = 10): string[] {
  const lowercaseQuery = query.toLowerCase().trim();
  return getFallbackCities().filter(city => 
    city.toLowerCase().includes(lowercaseQuery)
  ).slice(0, limit);
}

// More flexible fuzzy search for fallback cities
function fuzzySearchFallbackCities(query: string, limit: number = 10): string[] {
  const cities = getFallbackCities();
  const lowercaseQuery = query.toLowerCase().trim();
  const queryChars = lowercaseQuery.split('');
  
  // Score each city based on character matches and position
  const scoredCities = cities.map(city => {
    const lowerCity = city.toLowerCase();
    
    // Exact match gets highest score
    if (lowerCity.includes(lowercaseQuery)) {
      return { city, score: 1000 + (1000 - lowerCity.indexOf(lowercaseQuery)) };
    }
    
    // Partial match scoring
    let score = 0;
    let lastFoundIndex = -1;
    
    for (const char of queryChars) {
      const index = lowerCity.indexOf(char, lastFoundIndex + 1);
      if (index !== -1) {
        score += 10 - (index / lowerCity.length);
        lastFoundIndex = index;
      }
    }
    
    return { city, score };
  });
  
  // Sort by score and return top matches
  return scoredCities
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.city)
    .slice(0, limit);
} 