import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SunriseIcon, SunsetIcon } from './icons';

// Sun-path arc: dot travels the day's arc between sunrise and sunset.
const SunPathArc = ({ progress }) => {
  const angle = Math.PI * Math.min(Math.max(progress, 0), 1);
  const x = 50 - 40 * Math.cos(angle);
  const y = 52 - 38 * Math.sin(angle);
  return (
    <svg viewBox="0 0 100 60" className="w-full max-h-[120px]" role="img" aria-label={`Day ${Math.round(progress * 100)}% complete`}>
      <path d="M10 52 A40 38 0 0 1 90 52" stroke="#7CC4FF" strokeWidth="1.6" fill="none" opacity="0.45" strokeDasharray="3 4" />
      <line x1="4" y1="52" x2="96" y2="52" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
      {progress > 0 && progress < 1 && (
        <>
          <circle cx={x} cy={y} r="9" fill="#FFD75E" opacity="0.22" />
          <circle cx={x} cy={y} r="4.5" fill="#FFD75E" />
        </>
      )}
    </svg>
  );
};

const SunriseCountdown = ({ sunriseISO, sunsetISO, sunriseTomorrowISO }) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  const sunrise = new Date(sunriseISO);
  const sunset = new Date(sunsetISO);

  // Three real phases — no +24h hand-waving:
  //   before today's sunrise → count to it
  //   during the day         → count to sunset
  //   after sunset           → count to tomorrow's sunrise (API day 2, else +24h fallback)
  let phase, target;
  if (now < sunrise) {
    phase = 'beforeSunrise';
    target = sunrise;
  } else if (now < sunset) {
    phase = 'day';
    target = sunset;
  } else {
    phase = 'afterSunset';
    target = sunriseTomorrowISO ? new Date(sunriseTomorrowISO) : new Date(sunrise.getTime() + 86400000);
  }

  const diffMs = target - now;
  if (diffMs < 0) return null;

  const progress = phase === 'day' ? (now - sunrise) / (sunset - sunrise) : 0;
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  const fmt = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const heading =
    phase === 'day' ? 'Daylight remaining' : 'Until sunrise';
  const note =
    phase === 'day'
      ? `Sunset at ${fmt(sunset)}`
      : phase === 'beforeSunrise'
        ? `Sunrise at ${fmt(sunrise)}`
        : `Tomorrow at ${fmt(target)}`;

  return (
    <motion.section
      aria-label="Daylight"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-5 sm:p-6 flex flex-col"
    >
      <h2 className="eyebrow mb-3">{heading}</h2>

      <div className="my-1">
        {phase === 'day' ? (
          <SunPathArc progress={progress} />
        ) : (
          <div className="h-[72px] flex items-end justify-center text-white/25 pb-2">
            <SunriseIcon className="w-12 h-12" />
          </div>
        )}
      </div>

      <p className="readout text-3xl font-bold text-white leading-none mt-auto">
        {hours}
        <span className="text-base text-mist font-normal">h </span>
        {minutes}
        <span className="text-base text-mist font-normal">m</span>
      </p>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
        <span className="readout text-xs text-mist">{note}</span>
        <span className="flex items-center gap-3">
          <span className="readout text-xs text-mist flex items-center gap-1.5">
            <SunriseIcon className="w-3.5 h-3.5 text-status-caution" /> {fmt(sunrise)}
          </span>
          <span className="readout text-xs text-mist flex items-center gap-1.5">
            <SunsetIcon className="w-3.5 h-3.5 text-horizon" /> {fmt(sunset)}
          </span>
        </span>
      </div>
    </motion.section>
  );
};

export default SunriseCountdown;
