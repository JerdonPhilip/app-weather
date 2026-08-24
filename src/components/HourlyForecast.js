import React from 'react';
import { motion } from 'framer-motion';
import { SkyGlyph, DropletIcon, ClockIcon } from './icons';

const HourlyForecast = ({ hourly, startIndex }) => {
  if (!hourly) return null;

  const start =
    startIndex ??
    hourly.time.findIndex((t) => new Date(t) >= new Date());
  if (start === -1 || start == null) return null;

  const hours = hourly.time.slice(start, start + 12).map((time, i) => ({
    key: time,
    label:
      i === 0
        ? 'Now'
        : new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(hourly.temperature_2m[start + i]),
    code: hourly.weathercode[start + i],
    precip: hourly.precipitation_probability?.[start + i] ?? 0,
  }));

  return (
    <motion.section
      aria-label="Hourly forecast"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-5 sm:p-6"
    >
      <h2 className="eyebrow flex items-center gap-2 mb-4">
        <ClockIcon className="w-4 h-4 text-horizon" />
        Next 12 hours
      </h2>
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-1 px-1">
        {hours.map((hour, i) => (
          <div
            key={hour.key}
            className={`snap-start shrink-0 w-[68px] rounded-2xl py-3 flex flex-col items-center gap-1.5 border transition-colors ${
              i === 0
                ? 'bg-horizon/15 border-horizon/40'
                : 'bg-white/[0.04] border-transparent hover:bg-white/[0.08]'
            }`}
          >
            <span className="readout text-[11px] uppercase tracking-wide text-mist">{hour.label}</span>
            <SkyGlyph code={hour.code} isDay className="w-8 h-8 text-horizon-soft" />
            <span className="font-display font-semibold text-lg leading-none">{hour.temp}°</span>
            <span
              className={`readout text-[11px] flex items-center gap-0.5 ${
                hour.precip > 20 ? 'text-horizon' : 'text-mist/70'
              }`}
              aria-label={`${hour.precip}% chance of precipitation`}
            >
              {hour.precip > 5 && (
                <>
                  <DropletIcon className="w-3 h-3" />
                  {hour.precip}%
                </>
              )}
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

export default HourlyForecast;
