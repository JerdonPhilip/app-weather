// src/ui/atmosphere.js — presentation theming: the sky is the palette.
// Gradient stops + aurora blob hues per condition key and day/night part.
import { getConditionKey } from '../domain/wmo';

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
