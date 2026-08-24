import React from 'react';
import { motion } from 'framer-motion';
import { RunIcon, BasketIcon, BikeIcon, ShirtIcon, CheckIcon, XIcon } from './icons';

const ActivityAdvisories = ({ current, daily, aqiData }) => {
  if (!current) return null;

  const temp = current.temperature;
  const precip = daily?.precipitation_sum?.[0] || 0;
  const wind = current.windspeed;
  const uv = daily?.uv_index_max?.[0];
  const weatherCode = current.weathercode;
  const aqi = aqiData?.usAqi ?? null;
  const isClear = [0, 1, 2].includes(weatherCode);

  const runningGood =
    temp >= 10 && temp <= 25 && precip <= 0.1 && wind < 20 && (aqi === null || aqi <= 100);
  const picnicGood =
    temp >= 18 && temp <= 30 && precip <= 0.1 && (uv == null || uv < 6 || isClear) && (aqi === null || aqi <= 100);
  const cyclingGood =
    temp >= 12 && temp <= 28 && precip <= 0.2 && wind < 25 && (aqi === null || aqi <= 100);

  let wear = 'Heavy coat, gloves, scarf';
  if (temp >= 5 && temp < 12) wear = 'Warm jacket';
  else if (temp >= 12 && temp < 18) wear = 'Light jacket or sweater';
  else if (temp >= 18 && temp < 25) wear = 'T-shirt and shorts';
  else if (temp >= 25) wear = 'Light clothing, stay cool';
  if (precip > 0.5) wear += ' · umbrella';
  if (uv != null && uv > 6) wear += ' · sunglasses';

  const items = [
    { icon: RunIcon, good: runningGood, yes: 'Great for a run', no: 'Skip the run today' },
    { icon: BasketIcon, good: picnicGood, yes: 'Picnic weather', no: 'Save the picnic' },
    { icon: BikeIcon, good: cyclingGood, yes: 'Perfect cycling day', no: 'Cycling not advised' },
  ];

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
        {items.map(({ icon: IconCmp, good, yes, no }) => (
          <div
            key={yes}
            className={`rounded-2xl border px-4 py-3 flex items-center gap-3 ${
              good ? 'bg-status-good/[0.08] border-status-good/25' : 'bg-white/[0.04] border-white/10'
            }`}
          >
            <span
              className={`shrink-0 w-9 h-9 rounded-full grid place-items-center ${
                good ? 'bg-status-good/15 text-status-good' : 'bg-white/10 text-mist'
              }`}
            >
              <IconCmp className="w-5 h-5" />
            </span>
            <span className="min-w-0">
              <span className="block font-display font-semibold text-[15px] leading-tight">
                {good ? yes : no}
              </span>
              <span
                className={`readout text-[10px] uppercase tracking-wider inline-flex items-center gap-1 mt-0.5 ${
                  good ? 'text-status-good' : 'text-mist/70'
                }`}
              >
                {good ? <CheckIcon className="w-3 h-3" /> : <XIcon className="w-3 h-3" />}
                {good ? 'Go for it' : 'Not today'}
              </span>
            </span>
          </div>
        ))}
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
