import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';

function App() {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [weatherCondition, setWeatherCondition] = useState('default');

  // Get user's current location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  // Function to determine background based on weather condition
  const getWeatherBackground = (condition) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
      return 'rainy';
    } else if (conditionLower.includes('snow') || conditionLower.includes('sleet') || conditionLower.includes('blizzard')) {
      return 'snowy';
    } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
      return 'cloudy';
    } else if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
      return 'sunny';
    } else if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
      return 'stormy';
    } else if (conditionLower.includes('fog') || conditionLower.includes('mist') || conditionLower.includes('haze')) {
      return 'foggy';
    } else {
      return 'default';
    }
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        
        try {
          const response = await axios.get(`/api/forecast?lat=${latitude}&lon=${longitude}`);
          setForecast(response.data);
          setCity(response.data.location.name);
          setWeatherCondition(getWeatherBackground(response.data.current.condition));
        } catch (err) {
          setError('Failed to get weather for your location');
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Unable to retrieve your location');
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const fetchWeather = async (e) => {
    if (e) e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');
    setForecast(null);

    try {
      const response = await axios.get(`/api/forecast?city=${city}`);
      setForecast(response.data);
      setWeatherCondition(getWeatherBackground(response.data.current.condition));
    } catch (err) {
      console.error('API Error:', err);
      const errorMessage = err.response?.data?.error 
        || err.response?.data?.details 
        || 'Failed to fetch weather data. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshLocation = () => {
    getUserLocation();
  };

  // Dynamic background classes based on weather condition
  const backgroundClasses = {
    default: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600',
    rainy: 'bg-gradient-to-br from-gray-600 via-gray-700 to-blue-800',
    snowy: 'bg-gradient-to-br from-blue-200 via-blue-300 to-gray-100',
    cloudy: 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600',
    sunny: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
    stormy: 'bg-gradient-to-br from-gray-800 via-gray-900 to-purple-900',
    foggy: 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500'
  };

  return (
    <div className={`min-h-screen ${backgroundClasses[weatherCondition]} p-3 sm:p-4 md:p-6 safe-area-inset overflow-hidden transition-all duration-1000 ease-in-out`}>
      
      {/* Animated Rain Effect (only shows when weather is rainy) */}
      {weatherCondition === 'rainy' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Rain drops */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 h-8 w-0.5 bg-blue-300 opacity-60 animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`
              }}
            />
          ))}
          {/* Water droplets on "glass" */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-200/10 to-blue-300/20 animate-pulse" />
        </div>
      )}

      {/* Animated Snow Effect (only shows when weather is snowy) */}
      {weatherCondition === 'snowy' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 text-white opacity-70 animate-snow"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            >
              ❄
            </div>
          ))}
        </div>
      )}

      {/* Cloud Effect (for cloudy weather) */}
      {weatherCondition === 'cloudy' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white opacity-20 text-6xl animate-float"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${20 + Math.random() * 20}s`
              }}
            >
              ☁
            </div>
          ))}
        </div>
      )}

      {/* Sun Effect (for sunny weather) */}
      {weatherCondition === 'sunny' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 right-10 text-yellow-300 text-6xl opacity-30 animate-pulse">
            ☀
          </div>
          {/* Sun rays */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/10 via-transparent to-orange-200/10 animate-pulse" />
        </div>
      )}

      {/* Lightning Effect (for stormy weather) */}
      {weatherCondition === 'stormy' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-0 animate-lightning" />
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute text-yellow-300 text-4xl opacity-0 animate-lightning-text"
              style={{
                top: `${20 + i * 20}%`,
                left: `${30 + i * 15}%`,
                animationDelay: `${2 + i * 3}s`
              }}
            >
              ⚡
            </div>
          ))}
        </div>
      )}

      {/* Fog Effect (for foggy weather) */}
      {weatherCondition === 'foggy' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-white/10 animate-pulse" />
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="text-center mt-8 sm:mt-12 md:mt-16 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 px-2 drop-shadow-lg">
            Weather Dashboard
          </h1>
          <p className="text-white/90 text-sm sm:text-base px-2 drop-shadow">
            Real-time weather forecasts for any location
          </p>
        </header>

        {/* Search Section */}
        <div className="bg-white/20 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-2xl mx-1 border border-white/10">
          <div className="flex flex-col gap-3 sm:gap-4">
            <form onSubmit={fetchWeather} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                className="flex-1 px-4 sm:px-5 py-3 rounded-full bg-white/90 border-0 focus:ring-2 sm:focus:ring-3 focus:ring-blue-500 focus:bg-white outline-none transition-all text-base sm:text-lg backdrop-blur-sm"
                style={{ WebkitAppearance: 'none' }}
              />
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 sm:px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg text-base sm:text-lg whitespace-nowrap min-h-[48px] backdrop-blur-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : 'Search'}
              </button>
            </form>
            
            <button 
              onClick={refreshLocation}
              disabled={locationLoading}
              className="px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2 text-base sm:text-lg min-h-[48px] backdrop-blur-sm"
            >
              {locationLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Locating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  My Location
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 font-medium text-center mx-1 text-sm sm:text-base backdrop-blur-sm">
            {error}
          </div>
        )}

        {/* Weather Dashboard */}
        {forecast && (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {/* Current Weather Card */}
            <div className="bg-white/20 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl mx-1 border border-white/10">
              <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 drop-shadow-lg">
                  {forecast.location.name}, {forecast.location.country}
                </h2>
                <p className="text-white/90 text-sm sm:text-base drop-shadow">Current Weather</p>
                <p className="text-white/80 text-xs sm:text-sm mt-1 drop-shadow">
                  Updated: {new Date(forecast.current.lastUpdated).toLocaleTimeString()}
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 sm:gap-6">
                {/* Temperature and Icon Row */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 w-full">
                  <img 
                    src={`https:${forecast.current.icon}`} 
                    alt={forecast.current.condition}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 drop-shadow-lg"
                  />
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                      {Math.round(forecast.current.temperature)}°C
                    </div>
                    <div className="text-white font-semibold text-base sm:text-lg md:text-xl mt-1 drop-shadow">
                      {forecast.current.condition}
                    </div>
                  </div>
                </div>

                {/* Weather Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-md">
                  <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                    <div className="text-white/90 text-xs sm:text-sm drop-shadow">Feels Like</div>
                    <div className="text-white font-bold text-lg sm:text-xl drop-shadow">{Math.round(forecast.current.feelsLike)}°C</div>
                  </div>
                  <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10">
                    <div className="text-white/90 text-xs sm:text-sm drop-shadow">Humidity</div>
                    <div className="text-white font-bold text-lg sm:text-xl drop-shadow">{forecast.current.humidity}%</div>
                  </div>
                  <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm border border-white/10 col-span-2 sm:col-span-1">
                    <div className="text-white/90 text-xs sm:text-sm drop-shadow">Wind Speed</div>
                    <div className="text-white font-bold text-lg sm:text-xl drop-shadow">{forecast.current.windSpeed} km/h</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Highlights and Forecast - Side by side on larger screens */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Today's Highlights */}
              <div className="bg-white/20 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl mx-1 lg:col-span-1 border border-white/10">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 text-center lg:text-left drop-shadow-lg">
                  Today's Highlights
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {forecast.forecast.slice(0, 1).map((day, index) => (
                    <div key={index} className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/90 text-sm sm:text-base drop-shadow">High / Low</span>
                        <span className="text-white font-bold text-base sm:text-lg drop-shadow">
                          {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/90 text-sm sm:text-base drop-shadow">Sunrise</span>
                        <span className="text-white font-bold text-base sm:text-lg drop-shadow">{day.sunrise}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/90 text-sm sm:text-base drop-shadow">Sunset</span>
                        <span className="text-white font-bold text-base sm:text-lg drop-shadow">{day.sunset}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/90 text-sm sm:text-base drop-shadow">Avg Humidity</span>
                        <span className="text-white font-bold text-base sm:text-lg drop-shadow">{day.humidity}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/90 text-sm sm:text-base drop-shadow">Max Wind</span>
                        <span className="text-white font-bold text-base sm:text-lg drop-shadow">{day.windSpeed} km/h</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3-Day Forecast */}
              <div className="bg-white/20 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl mx-1 lg:col-span-2 border border-white/10">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 text-center lg:text-left drop-shadow-lg">
                  3-Day Forecast
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {forecast.forecast.map((day, index) => (
                    <div key={index} className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center backdrop-blur-sm border border-white/10">
                      <h4 className="font-semibold text-white text-sm sm:text-base mb-2 drop-shadow">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: index === 0 ? 'short' : 'short',
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </h4>
                      <img 
                        src={`https:${day.icon}`} 
                        alt={day.condition}
                        className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 drop-shadow-lg"
                      />
                      <div className="text-white font-bold text-base sm:text-lg mb-1 drop-shadow">
                        {Math.round(day.maxTemp)}° / {Math.round(day.minTemp)}°
                      </div>
                      <div className="text-white/90 text-xs sm:text-sm mb-2 line-clamp-2 min-h-[2rem] drop-shadow">
                        {day.condition}
                      </div>
                      <div className="flex justify-between text-xs text-white/80 drop-shadow">
                        <span>H: {day.humidity}%</span>
                        <span>W: {day.windSpeed}km/h</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {(loading || locationLoading) && !forecast && (
          <div className="text-center text-white text-base sm:text-lg py-8 sm:py-12 backdrop-blur-sm rounded-xl">
            <div className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading weather data...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;