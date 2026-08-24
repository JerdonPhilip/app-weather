// src/domain/wmo.js — WMO weather-code semantics + metric conversions.
// Pure domain: no React, no theming.
export const weatherDescriptions = {
  0: 'Clear Sky',
  1: 'Mainly Clear',
  2: 'Partly Cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing Rime Fog',
  51: 'Light Drizzle',
  53: 'Moderate Drizzle',
  55: 'Dense Drizzle',
  56: 'Freezing Drizzle',
  57: 'Dense Freezing Drizzle',
  61: 'Slight Rain',
  63: 'Moderate Rain',
  65: 'Heavy Rain',
  66: 'Freezing Rain',
  67: 'Heavy Freezing Rain',
  71: 'Slight Snow',
  73: 'Moderate Snow',
  75: 'Heavy Snow',
  77: 'Snow Grains',
  80: 'Slight Rain Showers',
  81: 'Moderate Rain Showers',
  82: 'Violent Rain Showers',
  85: 'Slight Snow Showers',
  86: 'Heavy Snow Showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with Slight Hail',
  99: 'Thunderstorm with Heavy Hail',
};

export const getConditionKey = (code) => {
  if (code === 0) return 'clear';
  if ([1, 2, 3].includes(code)) return 'cloudy';
  if ([45, 48].includes(code)) return 'fog';
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'storm';
  return 'cloudy';
};

export const compassPoint = (degrees) => {
  if (degrees === undefined || degrees === null) return '';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
};

export const uvCategory = (uv) => {
  if (uv === undefined || uv === null) return null;
  if (uv <= 2) return { label: 'Low', color: '#4ADE80' };
  if (uv <= 5) return { label: 'Moderate', color: '#FBBF24' };
  if (uv <= 7) return { label: 'High', color: '#FB923C' };
  if (uv <= 10) return { label: 'Very High', color: '#F87171' };
  return { label: 'Extreme', color: '#C084FC' };
};

export const aqiCategory = (usAqi) => {
  if (usAqi === undefined || usAqi === null) return null;
  if (usAqi <= 50) return { label: 'Good', color: '#4ADE80' };
  if (usAqi <= 100) return { label: 'Moderate', color: '#FBBF24' };
  if (usAqi <= 150) return { label: 'Unhealthy', color: '#FB923C' };
  if (usAqi <= 200) return { label: 'Unhealthy+', color: '#F87171' };
  return { label: 'Hazardous', color: '#C084FC' };
};
