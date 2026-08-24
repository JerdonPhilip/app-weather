import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
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
import { LocateIcon, AlertIcon, RadarIcon } from './components/icons';
import { getAtmosphere, getConditionKey } from './utils/weatherCodes';

const DEFAULT_ATMOSPHERE = {
  sky: ['#101A34', '#0B1224', '#080D19'],
  blobs: ['#334155', '#26334d'],
};

// The sky itself is the page background — gradient + aurora blobs crossfade per condition
const AtmosphereLayer = ({ atmosphere }) => {
  const [top, mid, bottom] = atmosphere.sky;
  return (
    <div className="fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        <motion.div
          key={`${atmosphere.sky.join()}-${atmosphere.blobs.join()}`}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{ background: `linear-gradient(180deg, ${top} 0%, ${mid} 52%, ${bottom} 100%)` }}
        >
          <span
            className="blob drift-a"
            style={{
              width: '62vmax',
              height: '62vmax',
              left: '-16%',
              top: '-22%',
              background: `radial-gradient(circle, ${atmosphere.blobs[0]}59, transparent 70%)`,
            }}
          />
          <span
            className="blob drift-b"
            style={{
              width: '54vmax',
              height: '54vmax',
              right: '-14%',
              bottom: '-20%',
              background: `radial-gradient(circle, ${atmosphere.blobs[1]}47, transparent 70%)`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink-deep/70" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

function App() {
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [location, setLocation] = useState({ name: '', country: '', lat: 0, lon: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    getUserLocation();
  }, []);

  const fetchData = useCallback(
    async (lat, lon, name = '', country = '') => {
      setError('');
      setLoading(true);
      try {
        const [forecastRes, aqiRes] = await Promise.all([
          axios.get(`${config.FORECAST_API}?latitude=${lat}&longitude=${lon}${config.FORECAST_PARAMS}`),
          axios.get(
            `${config.AIR_QUALITY_API}?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,european_aqi`
          ),
        ]);
        setForecast(forecastRes.data);
        setAirQuality({
          usAqi: aqiRes.data.current?.us_aqi,
          pm25: aqiRes.data.current?.pm2_5,
          pm10: aqiRes.data.current?.pm10,
        });
        if (name) {
          setLocation({ name, country, lat, lon });
        } else {
          setLocation({ name: 'Your Location', country: '', lat, lon });
        }
      } catch (err) {
        console.error(err);
        setError('Could not load weather data. Check your connection and try again.');
        showToast('Fetching weather failed', 'error');
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser. Search for a city instead.');
      showToast('Geolocation not supported', 'error');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchData(pos.coords.latitude, pos.coords.longitude).finally(() => setLocationLoading(false));
      },
      (err) => {
        console.error(err);
        setError('Location access was denied. Search for your city below.');
        showToast('Location access denied', 'error');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleLocationSelect = ({ lat, lon, name, country }) => {
    fetchData(lat, lon, name, country);
    showToast(`Showing weather for ${name}`);
  };

  const handleRefresh = async () => {
    await fetchData(location.lat, location.lon, location.name, location.country);
    showToast('Weather refreshed');
  };

  // ---- living sky ----
  const current = forecast?.current_weather;
  const conditionKey = current ? getConditionKey(current.weathercode) : null;
  const isDay = current ? current.is_day === 1 : new Date().getHours() >= 6 && new Date().getHours() < 19;
  const atmosphere = current ? getAtmosphere(current.weathercode, isDay) : DEFAULT_ATMOSPHERE;

  const hourNow = new Date().getHours();
  const humidityWindow = (() => {
    if (!forecast?.hourly?.time || !forecast.hourly.relativehumidity_2m) return null;
    const idx = forecast.hourly.time.findIndex((t) => new Date(t) >= new Date());
    if (idx < 0) return null;
    return forecast.hourly.relativehumidity_2m.slice(idx, idx + 12);
  })();

  return (
    <div className="min-h-screen relative">
      <AtmosphereLayer atmosphere={atmosphere} />
      <WeatherEffects condition={conditionKey} isDay={isDay} />

      <PullToRefreshWrapper onRefresh={handleRefresh}>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* top bar */}
          <header className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div className="shrink-0">
              <p className="eyebrow">Weather Dashboard</p>
              <p className="font-display text-sm text-mist mt-0.5">Your sky, read like an instrument</p>
            </div>
            <div className="flex gap-3 flex-1 sm:max-w-xl sm:ml-auto">
              <div className="flex-1">
                <LocationSearch onSelectLocation={handleLocationSelect} />
              </div>
              <button
                onClick={getUserLocation}
                disabled={locationLoading}
                aria-label="Use my current location"
                className="h-12 px-4 sm:px-5 shrink-0 inline-flex items-center justify-center gap-2 rounded-full
                  bg-horizon/90 hover:bg-horizon text-ink font-display font-semibold text-sm
                  shadow-card transition-all duration-200 hover:-translate-y-px active:translate-y-0
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 min-w-[48px]"
              >
                {locationLoading ? <Spinner size="h-4 w-4" color="border-ink/30 border-t-ink" /> : <LocateIcon className="w-[18px] h-[18px]" />}
                <span className="hidden sm:inline">My location</span>
              </button>
            </div>
          </header>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="mb-6 rounded-card border border-status-alert/40 bg-status-alert/10 backdrop-blur-md px-5 py-4 flex items-start gap-3"
            >
              <AlertIcon className="w-5 h-5 text-status-alert shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white font-medium">{error}</p>
                <button
                  onClick={getUserLocation}
                  className="mt-2 text-sm font-semibold text-horizon underline underline-offset-4 decoration-horizon/40 hover:decoration-horizon"
                >
                  Try again
                </button>
              </div>
            </motion.div>
          )}

          {(loading || locationLoading) && !forecast && <SkeletonLoader />}

          <AnimatePresence mode="wait">
            {forecast && !loading && (
              <motion.main
                key={location.name + current.time}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <CurrentWeather
                  forecast={forecast}
                  locationName={
                    location.country ? `${location.name}, ${location.country}` : location.name
                  }
                />

                <HourlyForecast hourly={forecast.hourly} />

                <WindUVSummary current={current} daily={forecast.daily} />

                {/* AQI + daylight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  <AirQualityCard airQuality={airQuality} />
                  {forecast.daily?.sunrise && forecast.daily?.sunset && (
                    <SunriseCountdown
                      sunriseISO={forecast.daily.sunrise[0]}
                      sunsetISO={forecast.daily.sunset[0]}
                    />
                  )}
                </div>

                {/* outlook + laundry */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  <ForecastCards forecast={forecast} />
                  <LaundryAdvisory
                    today={{
                      tempMax: forecast.daily.temperature_2m_max[0],
                      tempMin: forecast.daily.temperature_2m_min[0],
                      precipSum: forecast.daily.precipitation_sum[0],
                      windMax: forecast.daily.windspeed_10m_max[0],
                      code: forecast.daily.weathercode?.[0],
                      humidityAvg:
                        humidityWindow && humidityWindow.length
                          ? humidityWindow.reduce((a, b) => a + b, 0) / humidityWindow.length
                          : null,
                    }}
                  />
                </div>

                <ActivityAdvisories
                  current={current}
                  daily={forecast.daily}
                  aqiData={airQuality}
                />

                {/* radar */}
                <section aria-label="Precipitation radar" className="glass-panel p-5 sm:p-6">
                  <h2 className="eyebrow mb-3 flex items-center gap-2">
                    <RadarIcon className="w-4 h-4 text-horizon" /> Precipitation radar
                  </h2>
                  <iframe
                    title="RainViewer precipitation radar map"
                    src={`https://www.rainviewer.com/map.html?loc=${location.lat},${location.lon},8&oFa=1&oC=1&oU=1&oCS=1&oF=1&oAP=1&rmt=4&c=3&o=83&lm=1&th=0&sm=1&sn=1`}
                    className="w-full h-64 sm:h-80 rounded-2xl border border-white/10"
                    loading="lazy"
                    allowFullScreen
                  />
                </section>

                <footer className="text-center pb-6 pt-2">
                  <p className="readout text-[11px] text-mist/70">
                    Data · Open-Meteo & RainViewer — updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </footer>
              </motion.main>
            )}
          </AnimatePresence>
        </div>
      </PullToRefreshWrapper>
      <ToastComponent />
    </div>
  );
}

export default App;
