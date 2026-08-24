import React from 'react';
import { motion } from 'framer-motion';
import { RunIcon, BasketIcon, BikeIcon, ShirtIcon, CheckIcon, XIcon } from './icons';
import { activityVerdicts, wearAdvice } from '../domain/advisories';

const ACTIVITY_ICONS = { run: RunIcon, picnic: BasketIcon, cycle: BikeIcon };

const ActivityAdvisories = ({ current, daily, aqiData }) => {
  if (!current) return null;

  const verdicts = activityVerdicts({
    temp: current.temperature,
    windSpeed: current.windspeed,
    precipSum: daily?.precipitation_sum?.[0] || 0,
    uv: daily?.uv_index_max?.[0] ?? null,
    code: current.weathercode,
    usAqi: aqiData?.usAqi ?? null,
  });

  const wear = wearAdvice({
    temp: current.temperature,
    precipSum: daily?.precipitation_sum?.[0] || 0,
    uv: daily?.uv_index_max?.[0] ?? null,
  });

  return (
    <motion.section
      aria-label="Today's advisories"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-5 sm:p-6"
    >
      <h2 className="eyebrow mb-4">Plan your day</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-2.5">
        {verdicts.map((v) => {
          const IconCmp = ACTIVITY_ICONS[v.key];
          return (
            <div
              key={v.key}
              className={`rounded-2xl border px-4 py-3 flex items-center gap-3 ${
                v.good ? 'bg-status-good/[0.08] border-status-good/25' : 'bg-white/[0.04] border-white/10'
              }`}
            >
              <span
                className={`shrink-0 w-9 h-9 rounded-full grid place-items-center ${
                  v.good ? 'bg-status-good/15 text-status-good' : 'bg-white/10 text-mist'
                }`}
              >
                <IconCmp className="w-5 h-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-display font-semibold text-[15px] leading-tight">
                  {v.good ? v.yes : v.no}
                </span>
                <span
                  className={`readout text-[10px] uppercase tracking-wider inline-flex items-center gap-1 mt-0.5 ${
                    v.good ? 'text-status-good' : 'text-mist/70'
                  }`}
                >
                  {v.good ? <CheckIcon className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
                  {v.good ? 'Go for it' : 'Not today'}
                </span>
              </span>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white/[0.04] border border-white/10 px-4 py-3 flex items-center gap-3">
        <span className="shrink-0 w-9 h-9 rounded-full grid place-items-center bg-horizon/15 text-horizon">
          <ShirtIcon className="w-5 h-5" />
        </span>
        <span>
          <span className="block eyebrow !text-[10px] !tracking-[0.16em]">What to wear</span>
          <span className="block text-sm text-white/90">{wear}</span>
        </span>
      </div>
    </motion.section>
  );
};

export default ActivityAdvisories;
