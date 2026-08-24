// src/utils/weatherCodes.js — WMO code semantics + living-sky atmosphere themes
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

// The sky is the palette: gradient stops + aurora blob hues per condition & daypart.
export const getAtmosphere = (code, isDay = true) => {
  const key = getConditionKey(code);
  const themes = {
    clear: isDay
      ? { sky: ['#155CA8', '#0E3468', '#0A1428'], blobs: ['#38BDF8', '#F59E0B'], glow: 'sun' }
      : { sky: ['#101E44', '#0B1430', '#070C1C'], blobs: ['#3B5BDB', '#7CC4FF'], glow: 'moon' },
    cloudy: isDay
      ? { sky: ['#33465F', '#20293C', '#0C1220'], blobs: ['#64748B', '#94A3B8'] }
      : { sky: ['#1B2338', '#121828', '#090D18'], blobs: ['#475569', '#334155'] },
    fog: isDay
      ? { sky: ['#3A4759', '#28303D', '#0E131B'], blobs: ['#94A3B8', '#64748B'] }
      : { sky: ['#232B39', '#171D28', '#0A0E15'], blobs: ['#64748B', '#475569'] },
    rain: isDay
      ? { sky: ['#27435F', '#182A40', '#0A1120'], blobs: ['#22D3EE', '#3B82F6'] }
      : { sky: ['#152238', '#0E1728', '#080D18'], blobs: ['#0EA5E9', '#6366F1'] },
    snow: isDay
      ? { sky: ['#44586F', '#2B3A50', '#111827'], blobs: ['#93C5FD', '#E2E8F0'] }
      : { sky: ['#1E2A42', '#141E30', '#0A0F1C'], blobs: ['#93C5FD', '#C7D2FE'] },
    storm: { sky: ['#26243E', '#181631', '#0A0A18'], blobs: ['#7C3AED', '#4338CA'] },
  };
  return (
    themes[key] || {
      sky: ['#101A34', '#0B1224', '#080D19'],
      blobs: ['#334155', '#1E293B'],
    }
  );
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
