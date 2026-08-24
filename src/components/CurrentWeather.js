import React from 'react';
import { motion } from 'framer-motion';
import { SkyGlyph, PinIcon, DropletIcon, UvIcon } from './icons';
import { weatherDescriptions, compassPoint, uvCategory } from '../utils/weatherCodes';

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

const CurrentWeather = ({ forecast, locationName, nowIndex }) => {
  if (!forecast) return null;

  const current = forecast.current_weather;
  const daily = forecast.daily;
  const hourly = forecast.hourly;
  const isDay = current.is_day === 1;
  const idx = nowIndex ?? 0;
  const feelsLike =
    hourly?.apparent_temperature?.[idx] != null
      ? Math.round(hourly.apparent_temperature[idx])
      : Math.round(current.temperature);
  const humidity = hourly?.relativehumidity_2m?.[idx] ?? null;
  const uvIndex = daily?.uv_index_max?.[0];
  const precipProb = hourly?.precipitation_probability?.[idx] ?? null;
  const uvData = uvCategory(uvIndex);
  const dirStr = compassPoint(current.winddirection);

  const chips = [
    { icon: <PinIcon className="w-4 h-4" />, label: 'Wind', value: `${Math.round(current.windspeed)} km/h`, sub: dirStr },
    { icon: <DropletIcon className="w-4 h-4" />, label: 'Humidity', value: humidity != null ? `${humidity}%` : '--' },
    { icon: <DropletIcon className="w-4 h-4" />, label: 'Rain chance', value: precipProb != null ? `${precipProb}%` : '--' },
    { icon: <UvIcon className="w-4 h-4" />, label: 'UV max', value: uvIndex ?? '--', accent: uvData?.color },
    { label: 'Feels like', value: `${feelsLike}°C` },
  ];

  const now = new Date();
  return (
    <motion.section
      aria-label="Current conditions"
      initial="hidden"
      animate="show"
      className="relative"
    >
      <motion.div variants={rise} custom={0} className="flex items-center gap-2 text-white">
        <PinIcon className="w-5 h-5 text-horizon" />
        <h1 className="font-display font-semibold text-xl sm:text-2xl tracking-tight">{locationName}</h1>
      </motion.div>
      <motion.p variants={rise} custom={1} className="eyebrow mt-1.5">
        {now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        {' · '}
        {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </motion.p>

      <div className="mt-6 sm:mt-8 flex items-center justify-center relative">
        <div
          aria-hidden="true"
          className="absolute w-[46vmin] h-[46vmin] rounded-full blur-3xl bg-horizon/15"
        />
        <SkyGlyph
          code={current.weathercode}
          isDay={isDay}
          className="w-24 h-24 sm:w-32 sm:h-32 text-horizon-soft relative shrink-0 drop-shadow-[0_0_18px_rgba(124,196,255,0.35)]"
        />
        <div className="relative ml-2 sm:ml-4">
          <div className="font-display font-extrabold leading-none text-white tracking-tighter text-[clamp(4.2rem,17vw,8.5rem)]">
            {Math.round(current.temperature)}
            <span className="align-top text-[0.38em] font-semibold text-horizon">°C</span>
          </div>
        </div>
      </div>

      <motion.div variants={rise} custom={2} className="text-center mt-3">
        <p className="font-display font-medium text-xl sm:text-2xl text-white/95">
          {weatherDescriptions[current.weathercode] || 'Unknown'}
        </p>
        <p className="readout text-sm text-mist mt-1">
          Feels like {feelsLike}°C · H {daily ? Math.round(daily.temperature_2m_max[0]) : '--'}° / L{' '}
          {daily ? Math.round(daily.temperature_2m_min[0]) : '--'}°
        </p>
      </motion.div>

      <motion.div variants={rise} custom={3} className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {chips.map((chip, i) => (
          <div
            key={chip.label}
            className={`glass-panel rounded-xl px-3 py-2.5 flex items-center gap-2.5 ${
              i === 4 ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <span className="text-horizon shrink-0">{chip.icon}</span>
            <span className="min-w-0">
              <span className="block eyebrow !tracking-[0.16em] !text-[10px]">{chip.label}</span>
              <span
                className="readout block text-sm font-semibold truncate"
                style={{ color: chip.accent || '#F2F7FD' }}
              >
                {chip.value}
                {chip.sub && <span className="text-mist font-normal"> {chip.sub}</span>}
              </span>
            </span>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default CurrentWeather;
