import React from 'react';
import { motion } from 'framer-motion';
import { WindIcon, SunIcon } from './icons';
import { compassPoint, uvCategory } from '../domain/wmo';

// Compass dial — needle points where wind blows toward
const CompassDial = ({ degrees }) => {
  const ticks = Array.from({ length: 16 }).map((_, i) => {
    const a = (i * Math.PI * 2) / 16;
    const major = i % 4 === 0;
    return (
      <line
        key={i}
        x1={50 + Math.cos(a) * (major ? 34 : 38)}
        y1={50 + Math.sin(a) * (major ? 34 : 38)}
        x2={44 + Math.cos(a) * 44}
        y2={44 + Math.sin(a) * 44}
        stroke="currentColor"
        strokeWidth={major ? 2 : 1}
        opacity={major ? 0.7 : 0.3}
        transform={`rotate(90 50 50)`}
      />
    );
  });
  return (
    <svg viewBox="0 0 100 100" className="w-full max-w-[150px]" role="img" aria-label={`Wind direction ${compassPoint(degrees)}`}>
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="1" opacity="0.25" fill="none" />
      {ticks}
      {['N', 'E', 'S', 'W'].map((d, i) => {
        const pos = [
          [50, 12],
          [88, 53],
          [50, 94],
          [12, 53],
        ][i];
        return (
          <text
            key={d}
            x={pos[0]}
            y={pos[1]}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="currentColor"
            fontSize="10"
            fontFamily="'JetBrains Mono', monospace"
            opacity="0.75"
          >
            {d}
          </text>
        );
      })}
      <motion.g
        initial={{ rotate: 0 }}
        animate={{ rotate: (degrees ?? 0) + 180 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: '50px', originY: '50px' }}
      >
        <path d="M50 18 L56 52 L50 47 L44 52 Z" fill="#7CC4FF" stroke="none" />
        <path d="M50 82 L46 54 L50 58 L54 54 Z" fill="currentColor" opacity="0.35" stroke="none" />
      </motion.g>
      <circle cx="50" cy="50" r="3" fill="#BFDCFF" stroke="none" />
    </svg>
  );
};

// UV arc gauge
const UvArc = ({ value }) => {
  const data = uvCategory(value);
  const pct = Math.min((value ?? 0) / 12, 1);
  const arcLen = Math.PI * 38;
  const color = data?.color || '#7CC4FF';
  return (
    <svg viewBox="0 0 100 62" className="w-full max-w-[150px]" role="img" aria-label={`UV index ${value}, ${data?.label ?? 'unknown'}`}>
      <path d="M12 54 A38 38 0 0 1 88 54" stroke="currentColor" strokeWidth="6" fill="none" opacity="0.18" strokeLinecap="round" />
      <motion.path
        d="M12 54 A38 38 0 0 1 88 54"
        stroke={color}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={arcLen}
        initial={{ strokeDashoffset: arcLen }}
        animate={{ strokeDashoffset: arcLen * (1 - pct) }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      />
      <text
        x="50"
        y="48"
        textAnchor="middle"
        fill="#F2F7FD"
        fontSize="17"
        fontWeight="700"
        fontFamily="'Bricolage Grotesque', sans-serif"
      >
        {value != null ? value : '--'}
      </text>
      <text x="50" y="60" textAnchor="middle" fill={color} fontSize="8" fontFamily="'JetBrains Mono', monospace">
        {(data?.label || '').toUpperCase()}
      </text>
    </svg>
  );
};

const WindUVSummary = ({ current, daily }) => {
  if (!current || !daily) return null;
  const uvIndex = daily.uv_index_max?.[0];

  return (
    <motion.section
      aria-label="Wind and UV detail"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-5 sm:p-6 grid grid-cols-2 gap-4 items-center"
    >
      <div className="flex flex-col items-center text-white/80">
        <h2 className="eyebrow self-start mb-2 flex items-center gap-2 text-white/60">
          <WindIcon className="w-4 h-4 text-horizon" /> Wind
        </h2>
        <CompassDial degrees={current.winddirection} />
        <p className="readout mt-2 text-lg font-bold text-white">
          {Math.round(current.windspeed)} <span className="text-xs font-normal text-mist">km/h</span>
        </p>
        <p className="readout text-[11px] text-mist">from the {compassPoint(current.winddirection) || '--'}</p>
      </div>

      <div className="flex flex-col items-center text-white/80 border-l border-white/10 pl-4">
        <h2 className="eyebrow self-start mb-2 flex items-center gap-2 text-white/60">
          <SunIcon className="w-4 h-4 text-horizon" /> UV index
        </h2>
        <UvArc value={uvIndex} />
        <p className="readout text-[11px] text-mist mt-1">daily maximum</p>
      </div>
    </motion.section>
  );
};

export default WindUVSummary;
