'use client';

import React, { useState, useEffect, useRef } from 'react';
import FadeIn from '../animations/FadeIn';
import { searchCities, getPopularCities } from '../../services/citiesService';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [popularCities, setPopularCities] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Load popular cities when component mounts
  useEffect(() => {
    const loadPopularCities = async () => {
      try {
        const cities = await getPopularCities(20);
        setPopularCities(cities);
      } catch (error) {
        // Silently handle errors
      }
    };
    
    loadPopularCities();
  }, []);

  useEffect(() => {
    // Debounce search to avoid excessive API calls
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (city.trim().length > 1) {
      setIsLoading(true);
      debounceTimeout.current = setTimeout(async () => {
        try {
          const results = await searchCities(city.trim());
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
        } catch (error) {
          // If API fails, try to filter from popular cities
          const filteredCities = popularCities.filter(
            c => c.toLowerCase().includes(city.toLowerCase())
          ).slice(0, 10);
          setSuggestions(filteredCities);
          setShowSuggestions(filteredCities.length > 0);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [city, popularCities]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCity(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  // Show suggestions when input is focused if there are any
  const handleInputFocus = () => {
    if (city.trim().length > 1 && suggestions.length > 0) {
      setShowSuggestions(true);
    } else if (city.trim().length === 0 && popularCities.length > 0) {
      // Show popular cities if no search term
      setSuggestions(popularCities.slice(0, 10));
      setShowSuggestions(true);
    }
  };

  return (
    <FadeIn className="w-full max-w-md mb-8">
      <div className="relative">
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="Search for a city..."
            className="w-full px-6 py-4 pr-12 bg-black backdrop-blur-md border border-zinc-700/30 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-white/70 transition-all text-base"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
          </button>
        </form>
        
        {showSuggestions && suggestions.length > 0 && (
          <div 
            ref={suggestionRef}
            className="absolute mt-2 w-full bg-black backdrop-blur-lg rounded-xl border border-white/70 shadow-lg z-10 max-h-72 overflow-y-auto hide-scrollbar"
          >
            <ul>
              {suggestions.map((suggestion, index) => (
                <li 
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-6 py-3 hover:bg-zinc-700/50 cursor-pointer transition-colors text-white"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </FadeIn>
  );
} 