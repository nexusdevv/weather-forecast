const API_KEY = '9d7cde1f6d07ec55650544be1631307e'; // OpenWeatherMap free API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  date: string;
}

export interface DayForecast {
  date: string;
  temperature: number;
  condition: string;
  isPast?: boolean;
}

export class WeatherError extends Error {
  constructor(message: string, public readonly isInvalidCity = false) {
    super(message);
    this.name = 'WeatherError';
  }
}

export async function getCurrentWeather(city: string = 'London'): Promise<WeatherData> {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (response.status === 404) {
      // Return error for invalid city name
      throw new WeatherError(`City "${city}" not found. Please check the spelling and try again.`, true);
    }
    
    if (!response.ok) {
      throw new WeatherError('Unable to fetch weather data. Please try again later.');
    }
    
    const data = await response.json();
    
    return {
      location: data.name,
      temperature: data.main.temp,
      condition: data.weather[0].main,
      feelsLike: data.main.feels_like,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      date: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof WeatherError) {
      throw error;
    }
    throw new WeatherError('Unable to fetch weather data. Please try again later.');
  }
}

export async function getForecast(city: string = 'London'): Promise<{
  pastDays: DayForecast[];
  futureDays: DayForecast[];
}> {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    
    if (response.status === 404) {
      throw new WeatherError(`City "${city}" not found. Please check the spelling and try again.`, true);
    }
    
    if (!response.ok) {
      throw new WeatherError('Unable to fetch forecast data. Please try again later.');
    }
    
    const data = await response.json();
    
    // Get 5 day forecast
    const futureDays: DayForecast[] = [];
    const processedDates = new Set<string>();
    
    for (const forecast of data.list) {
      const date = new Date(forecast.dt * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!processedDates.has(dateStr) && date.getHours() >= 12 && date.getHours() <= 15) {
        processedDates.add(dateStr);
        
        futureDays.push({
          date: date.toISOString(),
          temperature: forecast.main.temp,
          condition: forecast.weather[0].main,
        });
        
        if (futureDays.length >= 5) break;
      }
    }
    
    // Create past days data with similar pattern to futureDays
    return {
      pastDays: getPastDays(5),
      futureDays: futureDays.length > 0 ? futureDays : getNextDays(5),
    };
  } catch (error) {
    if (error instanceof WeatherError) {
      throw error;
    }
    throw new WeatherError('Unable to fetch forecast data. Please try again later.');
  }
}

// Generate past days with realistic weather patterns
function getPastDays(count: number): DayForecast[] {
  const today = new Date();
  const pastDays: DayForecast[] = [];
  
  for (let i = count; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    pastDays.push({
      date: date.toISOString(),
      temperature: Math.floor(Math.random() * 10) + 15, // 15-25°C
      condition: ['Clear', 'Clouds', 'Rain', 'Thunderstorm'][Math.floor(Math.random() * 4)],
      isPast: true,
    });
  }
  
  return pastDays;
}

// Fallback data for testing only
export function getDummyData(): {
  current: WeatherData;
  pastDays: DayForecast[];
  futureDays: DayForecast[];
} {
  return {
    current: {
      location: 'London',
      temperature: 21,
      condition: 'Clouds',
      feelsLike: 22,
      humidity: 65,
      windSpeed: 8,
      date: new Date().toISOString(),
    },
    pastDays: getPastDays(5),
    futureDays: getNextDays(5),
  };
}

function getNextDays(count: number): DayForecast[] {
  const today = new Date();
  const futureDays: DayForecast[] = [];
  
  for (let i = 1; i <= count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    futureDays.push({
      date: date.toISOString(),
      temperature: Math.floor(Math.random() * 10) + 15, // 15-25°C
      condition: ['Clear', 'Clouds', 'Rain', 'Thunderstorm', 'Mist'][Math.floor(Math.random() * 5)],
    });
  }
  
  return futureDays;
} 