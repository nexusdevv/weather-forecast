'use client';

import React, { useState, useRef } from 'react';
import { getWeatherIcon } from '../icons/WeatherIcons';
import FadeIn from '../animations/FadeIn';

interface DayForecast {
  date: string;
  temperature: number;
  condition: string;
  isPast?: boolean;
}

interface ForecastSliderProps {
  pastDays: DayForecast[];
  futureDays: DayForecast[];
}

export default function ForecastSlider({ pastDays, futureDays }: ForecastSliderProps) {
  const [activeSection, setActiveSection] = useState<'past' | 'future'>('future');
  const sliderRef = useRef<HTMLDivElement>(null);

  const handlePrevDays = () => {
    setActiveSection('past');
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleNextDays = () => {
    setActiveSection('future');
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: sliderRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  };

  const formatDay = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric'
    });
  };

  return (
    <FadeIn className="w-full max-w-4xl" y={40}>
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={handlePrevDays}
          className={`px-6 py-2 rounded-full transition-all ${
            activeSection === 'past'
              ? 'bg-white text-black font-medium'
              : 'bg-zinc-800/50 text-zinc-400'
          }`}
        >
          Past Days
        </button>
        <button
          onClick={handleNextDays}
          className={`px-6 py-2 rounded-full transition-all ${
            activeSection === 'future'
              ? 'bg-white text-black font-medium'
              : 'bg-zinc-800/50 text-zinc-400'
          }`}
        >
          Forecast
        </button>
      </div>

      <div 
        ref={sliderRef}
        className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory"
      >
        <div className="flex min-w-full snap-center">
          <div className="grid grid-cols-5 gap-6 w-full">
            {pastDays.map((day, index) => (
              <div 
                key={day.date}
                className="flex flex-col items-center transition-all"
                style={{ opacity: day.isPast ? 0.5 + (index * 0.1) : 1 }}
              >
                <div className="text-sm font-medium mb-3">{formatDay(day.date)}</div>
                <div className="scale-[0.65] my-1">
                  {getWeatherIcon(day.condition)}
                </div>
                <div className="text-2xl font-light mt-1">{Math.round(day.temperature)}°</div>
                <div className="text-xs mt-1 text-zinc-400">{day.condition}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex min-w-full snap-center">
          <div className="grid grid-cols-5 gap-6 w-full">
            {futureDays.map((day) => (
              <div 
                key={day.date}
                className="flex flex-col items-center"
              >
                <div className="text-sm font-medium mb-3">{formatDay(day.date)}</div>
                <div className="scale-[0.65] my-1">
                  {getWeatherIcon(day.condition)}
                </div>
                <div className="text-2xl font-light mt-1">{Math.round(day.temperature)}°</div>
                <div className="text-xs mt-1 text-zinc-400">{day.condition}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
} 