import { useState, useEffect, useRef } from 'react';
import { Doctor } from '../types/doctor';

interface AutocompleteSearchProps {
  doctors: Doctor[];
  onSearch: (query: string) => void;
}

export default function AutocompleteSearch({ doctors, onSearch }: AutocompleteSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const filtered = doctors
        .filter(doctor => 
          doctor.name.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 3);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [query, doctors]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (doctor: Doctor) => {
    setQuery(doctor.name);
    setShowSuggestions(false);
    onSearch(doctor.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Search for doctors..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        data-testid="autocomplete-input"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {suggestions.map((doctor) => (
            <div
              key={doctor.id}
              onClick={() => handleSuggestionClick(doctor)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              data-testid="suggestion-item"
            >
              {doctor.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 