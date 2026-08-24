// src/components/WeatherEffects.js — condition particles: depth-layered, slanted,
// deterministic (no per-render randomness), reduced-motion aware.
import React, { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

const seeded = (count, make) => Array.from({ length: count }, (_, i) => make(i));

/* ---------- rain: 3 depth tiers inside a wind-slanted layer ---------- */

const RainLayer = ({ count, slant }) => {
  const drops = useMemo(
    () =>
      seeded(count, (i) => {
        const tier = i % 3; // 0 near · 1 mid · 2 far
        return {
          left: `${((i * 16.9) % 106) - 3}%`,
          delay: `${-((i * 0.37) % 2).toFixed(2)}s`,
          duration: `${(0.5 + tier * 0.22 + ((i * 0.13) % 0.28)).toFixed(2)}s`,
          height: [88, 64, 44][tier] + ((i * 7) % 18),
          opacity: [0.6, 0.42, 0.26][tier],
        };
      }),
    [count]
  );
  return (
    <div
      className="absolute"
      style={{ inset: '-12%', transform: `rotate(${slant}deg)` }}
    >
      {drops.map((d, i) => (
        <span
          key={i}
          className="raindrop"
          style={{
            left: d.left,
            animationDelay: d.delay,
            animationDuration: d.duration,
            height: d.height,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
};

/* ---------- snow: fall wrapper × swaying core ---------- */

const Snow = () => {
  const flakes = useMemo(
    () =>
      seeded(30, (i) => ({
        left: `${((i * 31.7) % 104) - 2}%`,
        fallDur: `${(7 + ((i * 0.71) % 6)).toFixed(2)}s`,
        fallDelay: `${-((i * 0.53) % 9).toFixed(2)}s`,
        swayDur: `${(2.4 + ((i * 0.29) % 2.4)).toFixed(2)}s`,
        swayDelay: `${-((i * 0.17) % 3).toFixed(2)}s`,
        size: 4 + ((i * 13) % 6),
        blur: i % 3 === 0 ? 'blur(1px)' : undefined,
        opacity: 0.5 + ((i * 17) % 40) / 100,
      })),
    []
  );
  return (
    <>
      {flakes.map((f, i) => (
        <span
          key={i}
          className="snow-faller"
          style={{ left: f.left, '--fall-dur': f.fallDur, '--fall-delay': f.fallDelay }}
        >
          <span
            className="snowflake"
            style={{
              width: f.size,
              height: f.size,
              filter: f.blur,
              opacity: f.opacity,
              '--sway-dur': f.swayDur,
              '--sway-delay': f.swayDelay,
            }}
          />
        </span>
      ))}
    </>
  );
};

/* ---------- clouds: multi-lobe cumulus puffs ---------- */

const Clouds = ({ dense = false }) => {
  const clouds = useMemo(
    () =>
      seeded(dense ? 6 : 4, (i) => ({
        top: `${6 + ((i * 19) % 66)}%`,
        width: `${190 + ((i * 97) % 240)}px`,
        delay: `${-((i * 7.3) % 34)}s`,
        duration: `${55 + ((i * 11) % 45)}s`,
        lobes: [
          { left: '8%', bottom: 0, w: '100%', h: 46 },
          { left: '26%', bottom: 18, w: '58%', h: 42 },
          { left: '48%', bottom: 30, w: '34%', h: 30 },
        ],
      })),
    [dense]
  );
  return (
    <>
      {clouds.map((c, i) => (
        <span
          key={i}
          className="cloudlet"
          style={{
            top: c.top,
            width: c.width,
            animationDelay: c.delay,
            animationDuration: c.duration,
          }}
        >
          {c.lobes.map((l, j) => (
            <span
              key={j}
              style={{ left: l.left, bottom: l.bottom, width: l.w, height: l.h }}
            />
          ))}
        </span>
      ))}
    </>
  );
};

/* ---------- stars for clear nights ---------- */

const Stars = ({ count = 46 }) => {
  const stars = useMemo(
    () =>
      seeded(count, (i) => ({
        left: `${(i * 23.7) % 100}%`,
        top: `${2 + ((i * 37.3) % 56)}%`,
        dur: `${(1.8 + ((i * 0.53) % 2.6)).toFixed(2)}s`,
        delay: `${-((i * 0.91) % 4).toFixed(2)}s`,
        size: i % 9 === 0 ? 3 : 2,
      })),
    [count]
  );
  return (
    <>
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            '--tw-dur': s.dur,
            '--tw-delay': s.delay,
          }}
        />
      ))}
    </>
  );
};

/* ---------- lightning bolt silhouette (flickers with the flash) ---------- */

const Bolt = () => (
  <svg
    className="bolt"
    viewBox="0 0 60 130"
    style={{ left: '24%', top: '8%', width: 54, filter: 'drop-shadow(0 0 10px rgba(226,232,255,.9))' }}
    aria-hidden="true"
  >
    <path
      d="M38 2 L12 62 L27 64 L8 128 L52 52 L34 50 L56 2 Z"
      fill="#EAF2FF"
      stroke="#BFDCFF"
      strokeWidth="1.5"
    />
  </svg>
);

const WeatherEffects = ({ condition, isDay = true }) => {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden">
      {condition === 'clear' && isDay && (
        <>
          <div className="halo" />
          <div className="sunglow" />
        </>
      )}

      {condition === 'clear' && !isDay && (
        <>
          <Stars />
          <div className="moonglow" />
        </>
      )}

      {condition === 'cloudy' && <Clouds />}

      {condition === 'fog' &&
        [0, 1, 2].map((i) => (
          <span
            key={i}
            className="fogband"
            style={{
              top: `${16 + i * 27}%`,
              height: `${20 + ((i * 7) % 14)}vh`,
              animationDuration: `${9 + i * 4}s`,
              animationDirection: i % 2 ? 'reverse' : 'normal',
              opacity: 1 - i * 0.18,
            }}
          />
        ))}

      {condition === 'rain' && (
        <>
          <Clouds dense />
          <RainLayer count={54} slant={7} />
        </>
      )}

      {condition === 'snow' && (
        <>
          <Clouds dense />
          <Snow />
        </>
      )}

      {condition === 'storm' && (
        <>
          <Clouds dense />
          <Bolt />
          <RainLayer count={72} slant={12} />
        </>
      )}
    </div>
  );
};

export default WeatherEffects;
