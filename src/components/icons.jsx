// src/components/icons.jsx — stroke icon set + WMO weather glyphs (replaces all emoji)
import React from 'react';

const n = (v) => Math.round(v * 100) / 100;

const Icon = ({ children, className = 'w-5 h-5', ...rest }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...rest}
  >
    {children}
  </svg>
);

/* ---------- UI icons ---------- */

export const SearchIcon = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </Icon>
);

export const LocateIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="7" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </Icon>
);

export const PinIcon = (p) => (
  <Icon {...p}>
    <path d="M12 21s-6.5-5.3-6.5-10.2A6.4 6.4 0 0 1 12 4.5a6.4 6.4 0 0 1 6.5 6.3C18.5 15.7 12 21 12 21Z" />
    <circle cx="12" cy="10.8" r="2.2" />
  </Icon>
);

export const RefreshIcon = (p) => (
  <Icon {...p}>
    <path d="M20.5 8A9 9 0 0 0 4.6 7.2L3.5 9" />
    <path d="M3.5 16a9 9 0 0 0 15.9.8l1.1-1.8" />
    <path d="M17.5 3.5 20.5 8l-4.6 1.1M6.5 20.5 3.5 16l4.6-1.1" />
  </Icon>
);

export const WindIcon = (p) => (
  <Icon {...p}>
    <path d="M3 8h9.5a2.5 2.5 0 1 0-2.4-3.2" />
    <path d="M4 12h13.5a2.8 2.8 0 1 1-2.6 3.6" />
    <path d="M6 16h6a2.2 2.2 0 1 1-2.1 2.8" />
  </Icon>
);

export const DropletIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3.5s6 6.2 6 10a6 6 0 0 1-12 0c0-3.8 6-10 6-10Z" />
  </Icon>
);

export const UmbrellaIcon = (p) => (
  <Icon {...p}>
    <path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9Z" />
    <path d="M12 12v6.2a2.3 2.3 0 0 0 4.6 0" />
  </Icon>
);

export const SunIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3 19 19M19 5l-1.7 1.7M6.7 17.3 5 19" />
  </Icon>
);

export const UvIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3.4" />
    <path d="M12 4V2.6M12 21.4V20M4 12H2.6M21.4 12H20M6.3 6.3l-1-1M18.7 18.7l-1-1M17.7 6.3l1-1M5.3 18.7l1-1" />
  </Icon>
);

export const LeafIcon = (p) => (
  <Icon {...p}>
    <path d="M5 19C5 9 12 4 20 4c0 8-5 15-15 15Z" />
    <path d="M5 19c2.5-5.5 6-9 11-11" />
  </Icon>
);

export const SunriseIcon = (p) => (
  <Icon {...p}>
    <path d="M12 9a4.5 4.5 0 0 1 4.5 4.5h-9A4.5 4.5 0 0 1 12 9Z" />
    <path d="M12 3.5V6M4.6 7.6 6 9M19.4 7.6 18 9M2 16.5h3.5M18.5 16.5H22M7 16.5a5 5 0 0 1 10 0" />
    <path d="M3 20.5h18" />
  </Icon>
);

export const SunsetIcon = (p) => (
  <Icon {...p}>
    <path d="M12 16.5A4.5 4.5 0 0 0 7.5 12h9A4.5 4.5 0 0 0 12 16.5Z" />
    <path d="M12 6.5V4M4.6 7.6 6 9M19.4 7.6 18 9M2 16.5h3.5M18.5 16.5H22M7 16.5a5 5 0 0 1 10 0" />
    <path d="M3 20.5h18" />
  </Icon>
);

export const HangerIcon = (p) => (
  <Icon {...p}>
    <path d="M12 8.5a2.2 2.2 0 1 1 2.2-2.2" />
    <path d="M12 8.5v2L4.2 16a1.8 1.8 0 0 0 1 3.3h13.6a1.8 1.8 0 0 0 1-3.3L12 10.5" />
  </Icon>
);

export const RunIcon = (p) => (
  <Icon {...p}>
    <circle cx="14.5" cy="4.8" r="1.8" />
    <path d="M6 20.5 9.4 16l-.9-4 2.8-2.8 2.7 3 3.5 1" />
    <path d="m11.3 9.2 2.4-1.7 2.8 1.5 1 2.8M8.5 12l-.4-3 3-1.5" />
  </Icon>
);

export const BikeIcon = (p) => (
  <Icon {...p}>
    <circle cx="5.5" cy="17" r="3.3" />
    <circle cx="18.5" cy="17" r="3.3" />
    <path d="M5.5 17 9 9.5h6M9 9.5 13.5 17h-8M15 6h2.6l2 6.5" />
  </Icon>
);

export const BasketIcon = (p) => (
  <Icon {...p}>
    <path d="m5 10 3.5-6M19 10l-3.5-6" />
    <rect x="3.5" y="10" width="17" height="10" rx="2.2" />
    <path d="M9.5 13.5v3M14.5 13.5v3" />
  </Icon>
);

export const ShirtIcon = (p) => (
  <Icon {...p}>
    <path d="M8.5 4.5 5 6.8l-1.6 4 2.9 1 .4-1.8v9.5h10.6V10l.4 1.8 2.9-1L19 6.8l-3.5-2.3a3.6 3.6 0 0 1-7 0Z" />
  </Icon>
);

export const AlertIcon = (p) => (
  <Icon {...p}>
    <path d="M12 4 2.8 19.5h18.4L12 4Z" />
    <path d="M12 10v4.2M12 17.2v.1" />
  </Icon>
);

export const CheckIcon = (p) => (
  <Icon {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Icon>
);

export const XIcon = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const ArrowDownIcon = (p) => (
  <Icon {...p}>
    <path d="M12 4v16M6 14l6 6 6-6" />
  </Icon>
);

export const GaugeIcon = (p) => (
  <Icon {...p}>
    <path d="M5 19a9 9 0 1 1 14 0" />
    <path d="M12 14l4-4.5" />
    <circle cx="12" cy="14.5" r="1.4" />
  </Icon>
);

export const ClockIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </Icon>
);

export const CalendarIcon = (p) => (
  <Icon {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
  </Icon>
);

export const RadarIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.8" />
    <circle cx="12" cy="12" r="1.2" />
    <path d="M12 12 17.5 6" />
  </Icon>
);

export const EyeOffIcon = (p) => (
  <Icon {...p}>
    <path d="M4 4l16 16" />
    <path d="M9.9 5.2A9.8 9.8 0 0 1 12 5c5.5 0 9.5 5 9.5 7 0 .9-.7 2.2-1.9 3.4M6.3 6.9C3.8 8.4 2.5 10.8 2.5 12c0 2 4 7 9.5 7 1.5 0 2.8-.35 4-.93" />
    <path d="M9.9 10.1a3 3 0 0 0 4.1 4.3" />
  </Icon>
);

/* ---------- weather glyphs ---------- */

const Glyph = ({ children, className = 'w-10 h-10', ...rest }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
    {...rest}
  >
    {children}
  </svg>
);

const SunDisc = ({ cx = 24, cy = 22, r = 7 }) => (
  <>
    <circle cx={cx} cy={cy} r={r} />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i * Math.PI) / 4;
      const x1 = n(cx + Math.cos(a) * (r + 3));
      const y1 = n(cy + Math.sin(a) * (r + 3));
      const x2 = n(cx + Math.cos(a) * (r + 6));
      const y2 = n(cy + Math.sin(a) * (r + 6));
      return <path key={i} d={`M${x1} ${y1}L${x2} ${y2}`} />;
    })}
  </>
);

const MoonDisc = ({ cx = 24, cy = 22, r = 8 }) => (
  <>
    <path
      d={`M${cx + r * 0.55} ${cy - r} a ${r} ${r} 0 1 0 ${r * 0.62} ${r * 1.75} ${r * 1.15} ${r * 1.15} 0 1 1 -${r * 0.62} -${r * 1.75} Z`}
    />
    <path d={`M${n(cx + r + 4)} ${n(cy - r)}v3M${n(cx + r + 2.5)} ${n(cy - r + 1.5)}h3`} strokeWidth="1.6" />
  </>
);

const Cloud = ({ x = 0, y = 0, s = 1 }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M14 32a6.5 6.5 0 0 1 .8-12.95A9.5 9.5 0 0 1 33 21.6 5.8 5.8 0 0 1 33 33H14Z"
  />
);

const Drops = ({ xs = [20, 27], y = 37 }) =>
  xs.map((x, i) => <path key={i} d={`M${x} ${y} l-1.6 4`} strokeWidth="2.2" />);

const Flakes = ({ xs = [20, 27], y = 39 }) =>
  xs.map((x, i) => (
    <g key={i} strokeWidth="1.8">
      <path d={`M${x - 2.4} ${y}h4.8M${x - 1.2} ${y - 2}l2.4 4M${x - 1.2} ${y + 2}l2.4-4`} />
    </g>
  ));

const Bolt = () => <path d="M26 30l-4.5 7h4l-2 6 7-9h-4l2.5-4z" fill="currentColor" stroke="none" />;

export const SkyGlyph = ({ code = 0, isDay = true, className, ...rest }) => {
  if ([95, 96, 99].includes(code)) {
    return (
      <Glyph className={className} {...rest}>
        <Cloud x={-1} y={-2} s={0.92} />
        <Bolt />
        {code > 95 && <circle cx="17" cy="38" r="1.4" fill="currentColor" stroke="none" />}
      </Glyph>
    );
  }
  if ([51, 53, 55, 56, 57].includes(code)) {
    return (
      <Glyph className={className} {...rest}>
        <Cloud x={-1} y={-2} s={0.92} />
        <Drops xs={[20]} y={36} />
      </Glyph>
    );
  }
  if ([61, 63, 66, 80].includes(code)) {
    return (
      <Glyph className={className} {...rest}>
        <Cloud x={-1} y={-2} s={0.92} />
        <Drops xs={[19, 26]} y={37} />
      </Glyph>
    );
  }
  if ([65, 67, 81, 82].includes(code)) {
    return (
      <Glyph className={className} {...rest}>
        <Cloud x={-1} y={-2} s={0.92} />
        <Drops xs={[17, 23, 29]} y={37} />
      </Glyph>
    );
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return (
      <Glyph className={className} {...rest}>
        <Cloud x={-1} y={-2} s={0.92} />
        <Flakes xs={[19, 26]} y={41} />
      </Glyph>
    );
  }
  if ([45, 48].includes(code)) {
    return (
      <Glyph className={className} {...rest}>
        <Cloud x={-1} y={-6} s={0.85} />
        <path d="M12 34h24M15 39h18" strokeWidth="2.2" />
      </Glyph>
    );
  }
  if (code === 3) {
    return (
      <Glyph className={className} {...rest}>
        <Cloud x={-2} y={-6} s={0.78} />
        <Cloud x={8} y={2} s={0.72} />
      </Glyph>
    );
  }
  if (code === 1 || code === 2) {
    return (
      <Glyph className={className} {...rest}>
        {isDay ? <SunDisc cx={31} cy={15} r={5.5} /> : <MoonDisc cx={31} cy={15} r={6} />}
        <Cloud x={-3} y={4} s={0.88} />
      </Glyph>
    );
  }
  // code 0 — clear
  return (
    <Glyph className={className} {...rest}>
      {isDay ? <SunDisc /> : <MoonDisc />}
    </Glyph>
  );
};
