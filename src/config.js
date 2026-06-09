const config = {
  GEOCODING_API: 'https://geocoding-api.open-meteo.com/v1/search',
  FORECAST_API: 'https://api.open-meteo.com/v1/forecast',
  FORECAST_PARAMS:
    '&current_weather=true' +
    '&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,windspeed_10m_max,uv_index_max' +
    '&hourly=temperature_2m,relativehumidity_2m,precipitation_probability,weathercode' +
    '&timezone=auto',
};

export default config;