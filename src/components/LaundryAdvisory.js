import React from 'react';
import { motion } from 'framer-motion';
import { HangerIcon, CheckIcon, AlertIcon, DropletIcon } from './icons';
import {
  dryLaundryScore,
  dryLaundryReasons,
  laundryVerdict,
} from '../domain/advisories';

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

  const score = dryLaundryScore(today);
  const reasons = dryLaundryReasons(today);
  const verdict = laundryVerdict(score);

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

      {today.humidityAvg != null && (
        <p className="readout text-[11px] text-mist/80 mt-3 flex items-center gap-1.5">
          <DropletIcon className="w-3 h-3" /> Avg humidity next 12h: {Math.round(today.humidityAvg)}%
        </p>
      )}
    </motion.section>
  );
};

export default LaundryAdvisory;
