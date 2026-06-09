import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import config from './config';
import WeatherEffects from './components/WeatherEffects';
import LocationSearch from './components/LocationSearch';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import ForecastCards from './components/ForecastCards';
import LaundryAdvisory from './components/LaundryAdvisory';
import Spinner from './components/Spinner';
import { getWeatherBackground } from './utils/weatherCodes';

const backgroundClasses = {
  default: 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800',
  rainy: 'bg-gradient-to-br from-gray-700 via-gray-800 to-blue-900',
  snowy: 'bg-gradient-to-br from-blue-200 via-blue-300 to-gray-100',
  cloudy: 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800',
  sunny: 'bg-gradient-to-br from-yellow-500 via-orange-600 to-red-600',
  stormy: 'bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900',
  foggy: 'bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700',
};

function App() {
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState({ name: '', country: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState('default');

  useEffect(() => {
    getUserLocation();
  }, []);

  const fetchForecastByCoords = async (lat, lon, name = '', country = '') => {
    try {
      setError('');
      setLoading(true);
      const res = await axios.get(
        `${config.FORECAST_API}?latitude=${lat}&longitude=${lon}${config.FORECAST_PARAMS}`
      );
      setForecast(res.data);
      setWeatherCondition(getWeatherBackground(res.data.current_weather.weathercode));
      if (name) setLocation({ name, country });
      else setLocation({ name: 'Your Location', country: '' });
    } catch (err) {
      console.error(err);
      setError('Failed to load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchForecastByCoords(pos.coords.latitude, pos.coords.longitude)
          .finally(() => setLocationLoading(false));
      },
      (err) => {
        console.error(err);
        setError('Unable to retrieve your location. Please enable location access.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleLocationSelect = ({ lat, lon, name, country }) => {
    fetchForecastByCoords(lat, lon, name, country);
  };

  return (
    <div className={ `min-h-screen ${backgroundClasses[weatherCondition]} p-4 sm:p-6 md:p-8 overflow-hidden transition-all duration-1000` }>
      <WeatherEffects condition={ weatherCondition } />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */ }
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Weather Dashboard</h1>
          <p className="text-lg text-white/80 mt-2">Real‑time forecasts powered by Open‑Meteo</p>
        </header>

        {/* Search & Location row */ }
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <LocationSearch onSelectLocation={ handleLocationSelect } />
          </div>
          <button
            onClick={ getUserLocation }
            disabled={ locationLoading }
            className="px-6 py-3 bg-accent/80 hover:bg-accent text-white rounded-full font-semibold
                       inline-flex items-center justify-center gap-2 transition-all shadow-lg
                       disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            { locationLoading ? (
              <Spinner size="h-5 w-5" />
            ) : (
              <span className="text-xl">📍</span>
            ) }
            My Location
          </button>
        </div>

        { error && (
          <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-5 py-4 rounded-card mb-6 text-base">
            { error }
          </div>
        ) }

        {/* Loading state */ }
        { (loading || locationLoading) && (
          <div className="flex justify-center items-center py-16 text-white/70">
            <Spinner size="h-8 w-8" color="border-white/40 border-t-white" />
            <span className="text-xl ml-4">Loading weather data...</span>
          </div>
        ) }

        {/* Weather data with animations */ }
        <AnimatePresence mode="wait">
          { forecast && !loading && (
            <div key={ location.name + forecast.current_weather.time } className="space-y-8">
              <CurrentWeather
                forecast={ forecast }
                locationName={ `${location.name}, ${location.country}` }
              />
              <HourlyForecast hourly={ forecast.hourly } />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ForecastCards forecast={ forecast } />
                </div>
                <LaundryAdvisory today={ {
                  temperature_2m_max: forecast.daily.temperature_2m_max[0],
                  temperature_2m_min: forecast.daily.temperature_2m_min[0],
                  precipitation_sum: forecast.daily.precipitation_sum[0],
                  windspeed_10m_max: forecast.daily.windspeed_10m_max[0],
                  relativehumidity_2m: forecast.hourly.relativehumidity_2m?.slice(0, 12),
                  weathercode: forecast.daily.weathercode?.[0],
                } } />
              </div>
            </div>
          ) }
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;