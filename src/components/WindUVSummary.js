import React from 'react';
import { motion } from 'framer-motion';
import { WindIcon, SunIcon } from './icons';
import { compassPoint, uvCategory } from '../domain/wmo';

const n = (v) => Math.round(v * 100) / 100;

// Compass dial — ticks share one center (50,50); needle swings via plain CSS
// transform with an explicit SVG transform-origin, so it pivots correctly
// everywhere without relying on animation-library origin handling.
const CompassDial = ({ degrees }) => {
  const ticks = [];
  for (let i = 0; i < 24; i++) {
    const a = (i * Math.PI * 2) / 24 - Math.PI / 2; // start at North
    const major = i % 6 === 0;
    const r1 = major ? 27 : 31;
    const r2 = 35;
    ticks.push(
      <line
        key={i}
        x1={n(50 + Math.cos(a) * r1)}
        y1={n(50 + Math.sin(a) * r1)}
        x2={n(50 + Math.cos(a) * r2)}
        y2={n(50 + Math.sin(a) * r2)}
        stroke="currentColor"
        strokeWidth={major ? 2 : 1}
        opacity={major ? 0.8 : 0.3}
        strokeLinecap="round"
      />
    );
  }

  // Labels live OUTSIDE the tick ring (radius 44) so no spoke strikes through them
  const labelPos = { N: [50, 6], E: [94, 50], S: [50, 94], W: [6, 50] };

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full max-w-[150px]"
      role="img"
      aria-label={`Wind blowing from ${compassPoint(degrees) || 'unknown'} at ${degrees ?? '--'} degrees`}
    >
      <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1" opacity="0.25" fill="none" />
      <circle cx="50" cy="50" r="21" stroke="currentColor" strokeWidth="1" opacity="0.15" fill="none" />
      {ticks}
      {Object.entries(labelPos).map(([d, [x, y]]) => (
        <text
          key={d}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="currentColor"
          fontSize="9"
          fontFamily="'JetBrains Mono', monospace"
          fontWeight={d === 'N' ? 700 : 400}
          opacity={d === 'N' ? 1 : 0.75}
        >
          {d}
        </text>
      ))}

      {/* Needle: tip points the way the wind blows toward */}
      <g
        style={{
          transform: `rotate(${(degrees ?? 0) + 180}deg)`,
          transformOrigin: '50px 50px',
          transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <path d="M50 18 L54.5 51 L50 47 L45.5 51 Z" fill="#7CC4FF" stroke="none" />
        <path d="M50 82 L46 53 L50 56.5 L54 53 Z" fill="currentColor" opacity="0.35" stroke="none" />
      </g>
      <circle cx="50" cy="50" r="3.2" fill="#BFDCFF" stroke="#0A1120" strokeWidth="1" />
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
        <h2 className="eyebrow self-start mb-2 flex items-center gap-2">
          <WindIcon className="w-4 h-4 text-horizon" /> Wind
        </h2>
        <CompassDial degrees={current.winddirection} />
        <p className="readout mt-2 text-lg font-bold text-white">
          {Math.round(current.windspeed)} <span className="text-xs font-normal text-mist">km/h</span>
        </p>
        <p className="readout text-xs text-mist">from the {compassPoint(current.winddirection) || '--'}</p>
      </div>

      <div className="flex flex-col items-center text-white/80 border-l border-white/10 pl-4">
        <h2 className="eyebrow self-start mb-2 flex items-center gap-2">
          <SunIcon className="w-4 h-4 text-horizon" /> UV index
        </h2>
        <UvArc value={uvIndex} />
        <p className="readout text-xs text-mist mt-1">daily maximum</p>
      </div>
    </motion.section>
  );
};

export default WindUVSummary;
