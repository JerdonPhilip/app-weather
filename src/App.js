import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import config from './config';
import WeatherEffects from './components/WeatherEffects';
import LocationSearch from './components/LocationSearch';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import ForecastCards from './components/ForecastCards';
import LaundryAdvisory from './components/LaundryAdvisory';
import SunriseCountdown from './components/SunriseCountdown';
import AirQualityCard from './components/AirQualityCard';
import ActivityAdvisories from './components/ActivityAdvisories';
import SkeletonLoader from './components/SkeletonLoader';
import PullToRefreshWrapper from './components/PullToRefreshWrapper';
import WindUVSummary from './components/WindUVSummary';
import Spinner from './components/Spinner';
import { useToast } from './components/Toast';
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
  const [airQuality, setAirQuality] = useState(null);
  const [location, setLocation] = useState({ name: '', country: '', lat: 0, lon: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState('default');
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    getUserLocation();
  }, []);

  const fetchData = useCallback(async (lat, lon, name = '', country = '') => {
    setError('');
    setLoading(true);
    try {
      // Fetch forecast and air quality in parallel
      const [forecastRes, aqiRes] = await Promise.all([
        axios.get(`${config.FORECAST_API}?latitude=${lat}&longitude=${lon}${config.FORECAST_PARAMS}`),
        axios.get(`${config.AIR_QUALITY_API}?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,european_aqi`)
      ]);
      setForecast(forecastRes.data);
      setAirQuality(aqiRes.data.current);
      setWeatherCondition(getWeatherBackground(forecastRes.data.current_weather.weathercode));
      if (name) {
        setLocation({ name, country, lat, lon });
      } else {
        setLocation({ name: 'Your Location', country: '', lat, lon });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load weather data. Please try again.');
      showToast('Error fetching weather', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      showToast('Geolocation not supported', 'error');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchData(pos.coords.latitude, pos.coords.longitude)
          .finally(() => setLocationLoading(false));
      },
      (err) => {
        console.error(err);
        setError('Unable to retrieve location');
        showToast('Location access denied', 'error');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleLocationSelect = ({ lat, lon, name, country }) => {
    fetchData(lat, lon, name, country);
    showToast(`Weather updated for ${name}`);
  };

  const handleRefresh = async () => {
    await fetchData(location.lat, location.lon, location.name, location.country);
    showToast('Weather refreshed');
  };

  return (
    <div className={ `min-h-screen ${backgroundClasses[weatherCondition]} p-4 sm:p-6 md:p-8 overflow-hidden transition-all duration-1000` }>
      <WeatherEffects condition={ weatherCondition } />
      <PullToRefreshWrapper onRefresh={ handleRefresh }>
        <div className="relative z-10 max-w-5xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Weather Dashboard</h1>
            <p className="text-lg text-white/80 mt-2">Real‑time forecasts & insights</p>
          </header>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <LocationSearch onSelectLocation={ handleLocationSelect } />
            </div>
            <button
              onClick={ getUserLocation }
              disabled={ locationLoading }
              className="px-6 py-3 bg-accent/80 hover:bg-accent text-white rounded-full font-semibold
             inline-flex items-center justify-center gap-2 transition-all shadow-lg
             disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="bg-red-500/20 border border-red-400/30 text-red-200 px-5 py-4 rounded-card mb-6 text-base" role="alert">
              { error }
            </div>
          ) }

          {/* Loading state with skeleton */ }
          { (loading || locationLoading) && <SkeletonLoader /> }

          <AnimatePresence mode="wait">
            { forecast && !loading && (
              <div key={ location.name + forecast.current_weather.time } className="space-y-8">
                <CurrentWeather
                  forecast={ forecast }
                  locationName={ `${location.name}, ${location.country}` }
                />
                <HourlyForecast hourly={ forecast.hourly } />

                <WindUVSummary
                  current={ forecast.current_weather }
                  daily={ forecast.daily }
                />

                {/* Radar map */ }
                <div className="bg-surface-light/50 backdrop-blur-md rounded-card p-5 border border-white/10 shadow-card">
                  <h3 className="text-lg font-semibold text-text-primary mb-3">🗺️ Precipitation Radar</h3>
                  <iframe
                    title="RainViewer"
                    src={ `https://www.rainviewer.com/map.html?loc=${location.lat},${location.lon},8&oFa=1&oC=1&oU=1&oCS=1&oF=1&oAP=1&rmt=4&c=3&o=83&lm=1&th=0&sm=1&sn=1` }
                    className="w-full h-64 rounded-lg border-0"
                    allowFullScreen
                  />
                </div>

                {/* AQI, Sunrise, Activities row */ }
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  <AirQualityCard lat={ location.lat } lon={ location.lon } />
                  { forecast.daily?.sunrise && forecast.daily?.sunset && (
                    <SunriseCountdown
                      sunriseISO={ forecast.daily.sunrise[0] }
                      sunsetISO={ forecast.daily.sunset[0] }
                    />
                  ) }
                  <ActivityAdvisories
                    current={ forecast.current_weather }
                    daily={ forecast.daily }
                    aqiData={ airQuality }
                  />
                </div>

                {/* Forecast + laundry */ }
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
      </PullToRefreshWrapper>
      <ToastComponent />
    </div>
  );
}

export default App;