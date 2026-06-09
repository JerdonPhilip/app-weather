import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import config from '../config';
import { useDebounce } from '../hooks/useDebounce';
import Spinner from './Spinner';

const LocationSearch = ({ onSelectLocation }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        if (debouncedQuery.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }
        const fetchSuggestions = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${config.GEOCODING_API}?name=${encodeURIComponent(debouncedQuery)}&count=5&language=en&format=json`
                );
                const data = res.data.results || [];
                setResults(data);
                setIsOpen(data.length > 0);
                setActiveIndex(-1);
            } catch (err) {
                console.error(err);
                setResults([]);
                setIsOpen(false);
            } finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
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

    const handleKeyDown = (e) => {
        if (!isOpen) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < results.length) {
                selectResult(results[activeIndex]);
            }
        } else if (e.key === 'Escape') {
            setQuery('');
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    const selectResult = useCallback((result) => {
        setQuery('');
        setIsOpen(false);
        onSelectLocation({
            lat: result.latitude,
            lon: result.longitude,
            name: result.name,
            country: result.country,
        });
    }, [onSelectLocation]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        if (e.target.value.length < 2) setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            <input
                ref={ inputRef }
                type="text"
                value={ query }
                onChange={ handleInputChange }
                onKeyDown={ handleKeyDown }
                placeholder="Search location..."
                className="w-full px-5 py-3.5 pr-12 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/50
                   text-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                   backdrop-blur-md transition-all duration-200"
                aria-autocomplete="list"
                aria-expanded={ isOpen }
            />
            { loading && (
                <div className="absolute right-5 top-3.5">
                    <Spinner size="h-5 w-5" />
                </div>
            ) }

            { isOpen && (
                <ul
                    ref={ listRef }
                    className="absolute z-20 mt-2 w-full bg-surface-light/95 backdrop-blur-md border border-white/10 rounded-card shadow-2xl overflow-hidden"
                    role="listbox"
                >
                    { results.map((res, idx) => (
                        <li
                            key={ res.id }
                            role="option"
                            aria-selected={ idx === activeIndex }
                            className={ `px-5 py-4 flex flex-col cursor-pointer transition-colors duration-100
                ${idx === activeIndex ? 'bg-accent/20 text-white' : 'text-text-secondary hover:bg-white/5 hover:text-white'}` }
                            onClick={ () => selectResult(res) }
                            onMouseEnter={ () => setActiveIndex(idx) }
                        >
                            <span className="font-medium text-white text-lg">{ res.name }</span>
                            <span className="text-sm text-text-secondary mt-0.5">
                                { res.admin1 ? `${res.admin1}, ` : '' }{ res.country }
                            </span>
                        </li>
                    )) }
                </ul>
            ) }
        </div>
    );
};

export default LocationSearch;