import React from 'react';
import { motion } from 'framer-motion';
import { LeafIcon } from './icons';
import { aqiCategory } from '../utils/weatherCodes';

// AQI band scale 0–300 with a marker at the reading
const AqiScale = ({ value }) => {
  const pct = Math.min((value ?? 0) / 300, 1) * 100;
  return (
    <div
      className="relative h-2.5 rounded-full overflow-visible mt-4"
      role="img"
      aria-label={`Air quality index ${value} on a 0 to 300 scale`}
    >
      <div className="absolute inset-0 rounded-full flex overflow-hidden">
        <span className="h-full" style={{ width: '16.6%', background: 'rgba(74,222,128,.75)' }} />
        <span className="h-full" style={{ width: '16.7%', background: 'rgba(251,191,36,.75)' }} />
        <span className="h-full" style={{ width: '16.7%', background: 'rgba(251,146,60,.75)' }} />
        <span className="h-full" style={{ width: '16.7%', background: 'rgba(248,113,113,.75)' }} />
        <span className="h-full flex-1" style={{ background: 'rgba(192,132,252,.75)' }} />
      </div>
      <motion.div
        className="absolute -top-[3px] w-[3px] h-[17px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"
        initial={{ left: 0 }}
        animate={{ left: `calc(${pct}% - 1.5px)` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
    </div>
  );
};

const AirQualityCard = ({ airQuality }) => {
  if (!airQuality || airQuality.usAqi == null) {
    return (
      <section aria-label="Air quality" className="glass-panel p-5 sm:p-6 h-[168px] animate-pulse" />
    );
  }

  const { usAqi, pm25, pm10 } = airQuality;
  const cat = aqiCategory(usAqi);

  return (
    <motion.section
      aria-label="Air quality"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-5 sm:p-6"
    >
      <h2 className="eyebrow mb-3 flex items-center gap-2">
        <LeafIcon className="w-4 h-4 text-horizon" /> Air quality
      </h2>

      <div className="flex items-baseline gap-3">
        <span className="readout text-4xl font-bold text-white leading-none">{usAqi}</span>
        <span className="font-display font-semibold text-lg" style={{ color: cat?.color }}>
          {cat?.label}
        </span>
      </div>

      <AqiScale value={usAqi} />

      <dl className="grid grid-cols-2 gap-2 mt-4">
        {[
          ['PM2.5', pm25 != null ? `${pm25} µg/m³` : '--'],
          ['PM10', pm10 != null ? `${pm10} µg/m³` : '--'],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white/[0.05] border border-white/[0.06] px-3 py-2">
            <dt className="eyebrow !text-[10px] !tracking-[0.16em]">{k}</dt>
            <dd className="readout text-sm font-semibold mt-0.5">{v}</dd>
          </div>
        ))}
      </dl>
    </motion.section>
  );
};

export default AirQualityCard;
