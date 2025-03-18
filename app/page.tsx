'use client';

import { useState, useEffect } from 'react';
import WeatherCard from './components/weather/WeatherCard';
import ForecastSlider from './components/weather/ForecastSlider';
import SearchBar from './components/weather/SearchBar';
import BlurIn from './components/animations/BlurIn';
import FadeIn from './components/animations/FadeIn';
import { getCurrentWeather, getForecast, WeatherData, DayForecast, WeatherError } from './services/weatherService';

export default function Home() {
  const [city, setCity] = useState<string | null>(null);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [pastDays, setPastDays] = useState<DayForecast[]>([]);
  const [futureDays, setFutureDays] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{message: string, isInvalidCity: boolean} | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchWeatherData = async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const weatherData = await getCurrentWeather(cityName);
      const forecastData = await getForecast(cityName);
      
      setCurrentWeather(weatherData);
      setPastDays(forecastData.pastDays);
      setFutureDays(forecastData.futureDays);
      setHasSearched(true);
    } catch (err) {
      if (err instanceof WeatherError) {
        setError({
          message: err.message,
          isInvalidCity: err.isInvalidCity
        });
      } else {
        setError({
          message: 'An error occurred. Please try again later.',
          isInvalidCity: false
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (cityName: string) => {
    setCity(cityName);
    fetchWeatherData(cityName);
  };

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <div className="weather-gradient min-h-screen">
        <div className="container mx-auto px-4 py-10">
          <div className={`flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${hasSearched ? 'mt-4' : 'min-h-[80vh]'}`}>
            <BlurIn className={`${hasSearched ? 'mb-8' : 'mb-12'} text-center`}>
              <h1 onClick={() => window.location.reload()} className="text-4xl font-light tracking-tight mb-1 cursor-pointer hover:text-zinc-300 transition-all">Weather <span className="font-bold">Forecast</span></h1>
              <p className="text-zinc-400 text-sm max-w-md mx-auto">Real-time weather data with beautiful minimalist black & white design</p>
            </BlurIn>
            
            <SearchBar onSearch={handleSearch} />
            
            {error && (
              <BlurIn className="w-full max-w-md mb-8">
                <div className="p-5 rounded-2xl backdrop-blur-md bg-amber-900/20 border border-amber-800/30 text-amber-200">
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span className="font-medium">{error.message}</span>
                  </div>
                </div>
              </BlurIn>
            )}
            
            {hasSearched && (
              <div className="flex flex-col items-center justify-center max-w-4xl mx-auto w-full">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-pulse-slow">
                      <svg className="w-12 h-12 text-white opacity-75" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                ) : currentWeather && (
                  <FadeIn className="w-full" delay={0.2}>
                    <div className="mb-16">
                      <WeatherCard currentWeather={currentWeather} />
                    </div>
                    
                    <ForecastSlider pastDays={pastDays} futureDays={futureDays} />
                  </FadeIn>
                )}
              </div>
            )}
          </div>
          
          <footer className="mt-24 text-center text-zinc-500 text-sm">
            <FadeIn delay={0.6}>
              <p>© {new Date().getFullYear()} Weather Forecast App by <a href="https://github.com/nexusdevv" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 text-zinc-100 transition-colors hover:underline">Nexus</a></p>
            </FadeIn>
          </footer>
        </div>
      </div>
    </main>
  );
}
