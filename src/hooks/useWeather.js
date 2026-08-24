// src/hooks/useWeather.js — the deep weather intake seam.
// Owns both Open-Meteo adapters and derives shared reads ONCE;
// consumers get plain data through a five-field interface.
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import config from '../config';
import { getConditionKey } from '../utils/weatherCodes';

const AQI_PARAMS = 'current=us_aqi,pm2_5,pm10,european_aqi';
const EMPTY_LOCATION = { name: '', country: '', lat: 0, lon: 0 };

export function useWeather({ notify = () => {} } = {}) {
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [location, setLocation] = useState(EMPTY_LOCATION);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');

  const alive = useRef(true);
  const notifyRef = useRef(notify);
  useEffect(() => {
    notifyRef.current = notify;
  });
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const fetchWeather = useCallback(async (lat, lon, name = '', country = '') => {
    setError('');
    setLoading(true);
    try {
      const [forecastRes, aqiRes] = await Promise.all([
        axios.get(`${config.FORECAST_API}?latitude=${lat}&longitude=${lon}${config.FORECAST_PARAMS}`),
        axios.get(`${config.AIR_QUALITY_API}?latitude=${lat}&longitude=${lon}&${AQI_PARAMS}`),
      ]);
      if (!alive.current) return false;
      setForecast(forecastRes.data);
      setAirQuality({
        usAqi: aqiRes.data.current?.us_aqi,
        pm25: aqiRes.data.current?.pm2_5,
        pm10: aqiRes.data.current?.pm10,
      });
      setLocation(
        name ? { name, country, lat, lon } : { name: 'Your Location', country: '', lat, lon }
      );
      return true;
    } catch (err) {
      console.error(err);
      if (!alive.current) return false;
      setError('Could not load weather data. Check your connection and try again.');
      notifyRef.current('Fetching weather failed', 'error');
      return false;
    } finally {
      if (alive.current) setLoading(false);
    }
  }, []);

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser. Search for a city instead.');
      notifyRef.current('Geolocation not supported', 'error');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await fetchWeather(pos.coords.latitude, pos.coords.longitude);
        } finally {
          if (alive.current) setLocating(false);
        }
      },
      (err) => {
        console.error(err);
        if (!alive.current) return;
        setError('Location access was denied. Search for your city below.');
        notifyRef.current('Location access denied', 'error');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [fetchWeather]);

  const selectLocation = useCallback(
    ({ lat, lon, name, country }) => {
      fetchWeather(lat, lon, name, country);
      notifyRef.current(`Showing weather for ${name}`);
    },
    [fetchWeather]
  );

  const refresh = useCallback(async () => {
    if (!location.lat && !location.lon) return;
    await fetchWeather(location.lat, location.lon, location.name, location.country);
    notifyRef.current('Weather refreshed');
  }, [fetchWeather, location]);

  // ---- derived reads, computed exactly once here ----
  const current = forecast?.current_weather ?? null;

  const nowIndex = useMemo(() => {
    if (!forecast?.hourly?.time) return null;
    const idx = forecast.hourly.time.findIndex((t) => new Date(t) >= new Date());
    return idx >= 0 ? idx : null;
  }, [forecast]);

  const humidityWindow = useMemo(() => {
    if (nowIndex == null || !forecast?.hourly?.relativehumidity_2m) return null;
    return forecast.hourly.relativehumidity_2m.slice(nowIndex, nowIndex + 12);
  }, [forecast, nowIndex]);

  const conditionKey = current ? getConditionKey(current.weathercode) : null;
  const isDay = current
    ? current.is_day === 1
    : (() => {
        const h = new Date().getHours();
        return h >= 6 && h < 19;
      })();

  // First fix: fetch on mount (guarded against StrictMode double-invoke)
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    locate();
  }, [locate]);

  return {
    forecast,
    airQuality,
    location,
    loading,
    locating,
    error,
    current,
    nowIndex,
    humidityWindow,
    conditionKey,
    isDay,
    locate,
    selectLocation,
    refresh,
  };
}
