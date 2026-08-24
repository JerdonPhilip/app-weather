import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import axios from 'axios';
import config from '../config';
import { useDebounce } from '../hooks/useDebounce';
import Spinner from './Spinner';
import { SearchIcon } from './icons';

const LocationSearch = ({ onSelectLocation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    let cancelled = false;
    const fetchSuggestions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${config.GEOCODING_API}?name=${encodeURIComponent(debouncedQuery)}&count=5&language=en&format=json`
        );
        if (cancelled) return;
        const data = res.data.results || [];
        setResults(data);
        setIsOpen(data.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setResults([]);
          setIsOpen(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchSuggestions();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        listRef.current &&
        !listRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectResult = useCallback(
    (result) => {
      setQuery('');
      setIsOpen(false);
      onSelectLocation({
        lat: result.latitude,
        lon: result.longitude,
        name: result.name,
        country: result.country,
      });
    },
    [onSelectLocation]
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setQuery('');
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) selectResult(results[activeIndex]);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.trim().length < 2) setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <SearchIcon className="w-5 h-5 text-mist absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={
          activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined
        }
        aria-autocomplete="list"
        aria-label="Search for a city"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Search any city…"
        className="w-full h-12 pl-12 pr-12 rounded-full bg-white/[0.08] border border-white/[0.14] text-white placeholder-white/45
           font-display text-base focus:outline-none focus:ring-2 focus:ring-horizon/70 focus:border-transparent
           backdrop-blur-xl transition-colors duration-200 hover:bg-white/[0.11]"
      />
      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <Spinner size="h-5 w-5" />
        </div>
      )}

      {isOpen && (
        <ul
          ref={listRef}
          id={listId}
          className="absolute z-30 mt-2 w-full bg-[#101a30]/95 backdrop-blur-xl border border-white/[0.14] rounded-2xl shadow-pop overflow-hidden"
          role="listbox"
          aria-label="City suggestions"
        >
          {results.map((res, idx) => (
            <li
              key={res.id}
              id={`${listId}-opt-${idx}`}
              role="option"
              aria-selected={idx === activeIndex}
              className={`px-5 py-3 flex items-baseline gap-2 cursor-pointer transition-colors duration-100 ${
                idx === activeIndex ? 'bg-horizon/20' : 'hover:bg-white/[0.06]'
              }`}
              onClick={() => selectResult(res)}
              onMouseEnter={() => setActiveIndex(idx)}
            >
              <span className="font-display font-medium text-white text-base">{res.name}</span>
              <span className="readout text-xs text-mist truncate">
                {res.admin1 ? `${res.admin1}, ` : ''}
                {res.country}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
