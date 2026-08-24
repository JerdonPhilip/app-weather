// src/components/WeatherEffects.js — condition particles, memoized + reduced-motion aware
import React, { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';

const seeded = (count, make) => Array.from({ length: count }, (_, i) => make(i));

const Rain = () => {
  const drops = useMemo(
    () =>
      seeded(60, (i) => ({
        left: `${(i * 17.3) % 100}%`,
        delay: `${((i * 0.37) % 2).toFixed(2)}s`,
        duration: `${(0.55 + ((i * 0.13) % 0.5)).toFixed(2)}s`,
        opacity: 0.35 + ((i * 7) % 40) / 100,
        height: `${56 + ((i * 11) % 36)}px`,
      })),
    []
  );
  return (
    <>
      {drops.map((d, i) => (
        <span
          key={i}
          className="raindrop"
          style={{
            left: d.left,
            animationDelay: d.delay,
            animationDuration: d.duration,
            opacity: d.opacity,
            height: d.height,
          }}
        />
      ))}
    </>
  );
};

const Snow = () => {
  const flakes = useMemo(
    () =>
      seeded(34, (i) => ({
        left: `${(i * 29.7) % 100}%`,
        delay: `${((i * 0.53) % 6).toFixed(2)}s`,
        duration: `${(6 + ((i * 0.71) % 5)).toFixed(2)}s`,
        scale: 0.6 + ((i * 13) % 10) / 12,
      })),
    []
  );
  return (
    <>
      {flakes.map((f, i) => (
        <span
          key={i}
          className="snowflake"
          style={{
            left: f.left,
            animationDelay: f.delay,
            animationDuration: f.duration,
            transform: `scale(${f.scale})`,
          }}
        />
      ))}
    </>
  );
};

const Clouds = ({ dense = false }) => {
  const clouds = useMemo(
    () =>
      seeded(dense ? 7 : 4, (i) => ({
        top: `${8 + ((i * 19) % 70)}%`,
        width: `${180 + ((i * 97) % 260)}px`,
        delay: `${-((i * 7.3) % 30)}s`,
        duration: `${50 + ((i * 11) % 40)}s`,
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
        />
      ))}
    </>
  );
};

const WeatherEffects = ({ condition, isDay = true }) => {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden">
      {condition === 'clear' &&
        (isDay ? (
          <div className="sunglow" />
        ) : (
          <div className="moonglow" />
        ))}

      {condition === 'cloudy' && <Clouds />}

      {condition === 'fog' && (
        <>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="fogband"
              style={{ top: `${18 + i * 26}%`, animationDuration: `${9 + i * 4}s` }}
            />
          ))}
        </>
      )}

      {condition === 'rain' && (
        <>
          <Clouds dense />
          <Rain />
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
          <div className="lightning" />
          <Rain />
        </>
      )}
    </div>
  );
};

export default WeatherEffects;
