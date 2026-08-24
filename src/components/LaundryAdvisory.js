import React from 'react';
import { motion } from 'framer-motion';
import { HangerIcon, CheckIcon, AlertIcon, DropletIcon } from './icons';

// Score 0–10 rendered as five dots (2 points each)
const ScoreDots = ({ score }) => (
  <div className="flex items-center gap-1.5" role="img" aria-label={`Drying score ${score} out of 10`}>
    {[0, 1, 2, 3, 4].map((i) => (
      <motion.span
        key={i}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4 + i * 0.08, type: 'spring', stiffness: 300, damping: 18 }}
        className={`w-2.5 h-2.5 rounded-full ${i < Math.round(score / 2) ? 'bg-status-good' : 'bg-white/15'}`}
      />
    ))}
  </div>
);

const LaundryAdvisory = ({ today }) => {
  if (!today) return null;

  const { temperature_2m_max, temperature_2m_min, precipitation_sum, windspeed_10m_max, relativehumidity_2m, weathercode } =
    today;

  let score = 0;
  const reasons = [];

  const avgTemp = (temperature_2m_max + temperature_2m_min) / 2;
  if (avgTemp >= 20 && avgTemp <= 30) {
    score += 2;
    reasons.push({ ok: true, text: 'Warm enough for a quick dry' });
  } else if (avgTemp > 15) {
    score += 1;
    reasons.push({ ok: true, text: 'Mild temperature — drying takes longer' });
  } else {
    reasons.push({ ok: false, text: 'Too cold for outdoor drying' });
  }

  if (precipitation_sum <= 0.1) {
    score += 3;
    reasons.push({ ok: true, text: 'No rain expected today' });
  } else if (precipitation_sum <= 0.5) {
    score += 1;
    reasons.push({ ok: false, text: 'Light drizzle possible — keep an eye out' });
  } else {
    reasons.push({ ok: false, text: `About ${Math.round(precipitation_sum)} mm of rain expected` });
  }

  if (windspeed_10m_max >= 5 && windspeed_10m_max <= 25) {
    score += 2;
    reasons.push({ ok: true, text: 'Good breeze for drying' });
  } else if (windspeed_10m_max > 25) {
    score += 1;
    reasons.push({ ok: false, text: 'Strong wind — secure the clothesline' });
  } else {
    reasons.push({ ok: false, text: 'Barely any breeze today' });
  }

  const avgHumidity = relativehumidity_2m?.length
    ? relativehumidity_2m.reduce((a, b) => a + b, 0) / relativehumidity_2m.length
    : null;
  if (avgHumidity != null && avgHumidity < 50) {
    score += 2;
    reasons.push({ ok: true, text: 'Low humidity — fast drying' });
  } else if (avgHumidity != null && avgHumidity > 80) {
    reasons.push({ ok: false, text: 'Humid air slows drying' });
  } else {
    score += 1;
  }

  if ([0, 1, 2].includes(weathercode)) {
    score += 1;
    reasons.push({ ok: true, text: 'Sun or broken cloud helps' });
  }
  score = Math.min(score, 10);

  const verdict =
    score >= 6
      ? { text: 'Hang it out', color: '#4ADE80', note: 'Conditions are on your side today.' }
      : score >= 4
        ? { text: 'Risky, but possible', color: '#FBBF24', note: 'Watch the sky and bring it in early.' }
        : { text: 'Dry indoors today', color: '#F87171', note: 'The air is not on your side.' };

  return (
    <motion.section
      aria-label="Laundry drying forecast"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-5 sm:p-6 flex flex-col"
    >
      <h2 className="eyebrow mb-3 flex items-center gap-2">
        <HangerIcon className="w-4 h-4 text-horizon" /> Laundry forecast
      </h2>

      <div className="flex items-center justify-between">
        <p className="font-display font-bold text-2xl leading-tight" style={{ color: verdict.color }}>
          {verdict.text}
        </p>
        <ScoreDots score={score} />
      </div>
      <p className="text-sm text-mist mt-1">{verdict.note}</p>

      <ul className="mt-4 space-y-2 pt-3 border-t border-white/10 flex-1">
        {reasons.map((r, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            {r.ok ? (
              <CheckIcon className="w-4 h-4 shrink-0 mt-0.5 text-status-good" />
            ) : (
              <AlertIcon className="w-4 h-4 shrink-0 mt-0.5 text-status-alert" />
            )}
            <span className="text-mist">{r.text}</span>
          </li>
        ))}
      </ul>

      {avgHumidity != null && (
        <p className="readout text-[11px] text-mist/80 mt-3 flex items-center gap-1.5">
          <DropletIcon className="w-3 h-3" /> Avg humidity next 12h: {Math.round(avgHumidity)}%
        </p>
      )}
    </motion.section>
  );
};

export default LaundryAdvisory;
