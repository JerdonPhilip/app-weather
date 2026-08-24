import React from 'react';
import { motion } from 'framer-motion';
import { SkyGlyph, DropletIcon, WindIcon, HangerIcon, CalendarIcon } from './icons';
import { bestDryDayIndex } from '../domain/advisories';

const ForecastCards = ({ forecast }) => {
  if (!forecast || !forecast.daily) return null;

  const daily = forecast.daily;
  const weekMin = Math.min(...daily.temperature_2m_min.slice(0, 3));
  const weekMax = Math.max(...daily.temperature_2m_max.slice(0, 3));
  const range = weekMax - weekMin || 1;

  const days = daily.time.slice(0, 3).map((date, i) => ({
    date,
    maxTemp: Math.round(daily.temperature_2m_max[i]),
    minTemp: Math.round(daily.temperature_2m_min[i]),
    code: daily.weathercode?.[i] || 0,
    precip: Math.round(daily.precipitation_sum[i]),
    wind: Math.round(daily.windspeed_10m_max[i]),
  }));

  // Same scorer as today's laundry verdict — one rule source.
  const bestIndex = bestDryDayIndex(
    daily.time.slice(0, 3).map((_, i) => ({
      tempMax: daily.temperature_2m_max[i],
      tempMin: daily.temperature_2m_min[i],
      precipSum: daily.precipitation_sum[i],
      windMax: daily.windspeed_10m_max[i],
      humidityAvg: null,
      code: daily.weathercode?.[i] || 0,
    }))
  );

  return (
    <motion.section
      aria-label="Three day outlook"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-5 sm:p-6"
    >
      <h2 className="eyebrow flex items-center gap-2 mb-4">
        <CalendarIcon className="w-4 h-4 text-horizon" /> 3-day outlook
      </h2>

      <ul className="space-y-2.5">
        {days.map((day, i) => {
          const left = ((day.minTemp - weekMin) / range) * 100;
          const width = ((day.maxTemp - day.minTemp) / range) * 100;
          return (
            <li
              key={day.date}
              className={`relative rounded-2xl px-4 py-3 border grid grid-cols-[64px_40px_1fr_auto] items-center gap-3 ${
                i === bestIndex ? 'bg-status-good/10 border-status-good/30' : 'bg-white/[0.04] border-transparent'
              }`}
            >
              <div>
                <p className="font-display font-semibold text-white text-base">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  {i === 0 && <span className="text-mist font-normal"> · today</span>}
                </p>
                <p className="readout text-xs text-mist">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>

              <SkyGlyph code={day.code} isDay={false} className="w-9 h-9 text-horizon-soft" />

              <div className="min-w-0">
                <div className="relative h-1.5 rounded-full bg-white/10">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-horizon-dim via-horizon to-status-caution"
                    style={{ left: `${left}%`, width: `${Math.max(width, 6)}%` }}
                    role="img"
                    aria-label={`Between ${day.minTemp} and ${day.maxTemp} degrees`}
                  />
                </div>
                <p className="readout text-xs text-mist mt-1.5 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <DropletIcon className="w-3 h-3" /> {day.precip} mm
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <WindIcon className="w-3 h-3" /> {day.wind} km/h
                  </span>
                </p>
              </div>

              <p className="text-right whitespace-nowrap">
                <span className="font-display font-bold text-xl text-white">{day.maxTemp}°</span>{' '}
                <span className="readout text-sm text-mist">{day.minTemp}°</span>
              </p>

              {i === bestIndex && (
                <span className="absolute -top-2.5 right-3 inline-flex items-center gap-1 rounded-full bg-status-good/90 px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider text-ink font-bold">
                  <HangerIcon className="w-3 h-3" /> Best dry day
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
};

export default ForecastCards;
