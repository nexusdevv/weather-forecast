'use client';

import React from 'react';
import { getWeatherIcon } from '../icons/WeatherIcons';
import BlurIn from '../animations/BlurIn';

interface WeatherCardProps {
  currentWeather: {
    location: string;
    temperature: number;
    condition: string;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    date: string;
  };
}

export default function WeatherCard({ currentWeather }: WeatherCardProps) {
  const formattedDate = new Date(currentWeather.date).toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <BlurIn className="w-full max-w-lg">
      <div className="p-10 backdrop-blur-lg text-white rounded-[40px] bg-gradient-to-b from-black to-black border border-black shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-1">{currentWeather.location}</h1>
            <p className="text-zinc-400 text-sm">{formattedDate}</p>
          </div>
          <div className="scale-90">
            {getWeatherIcon(currentWeather.condition)}
          </div>
        </div>
        
        <div className="flex items-end gap-4 mb-6">
          <div className="text-8xl font-light tracking-tighter">
            {Math.round(currentWeather.temperature)}°
          </div>
          <div className="text-xl text-zinc-300 mb-2 font-medium">
            {currentWeather.condition}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="flex flex-col">
            <span className="text-zinc-400 text-xs mb-1">Feels like</span>
            <span className="text-lg font-medium">{Math.round(currentWeather.feelsLike)}°</span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-400 text-xs mb-1">Humidity</span>
            <span className="text-lg font-medium">{currentWeather.humidity}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-zinc-400 text-xs mb-1">Wind</span>
            <span className="text-lg font-medium">{currentWeather.windSpeed} km/h</span>
          </div>
        </div>
      </div>
      
    </BlurIn>
  );
} 