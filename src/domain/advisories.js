// src/domain/advisories.js — pure decision rules: one source of truth, zero React

// A dryable day shape: { tempMax, tempMin, precipSum, windMax, humidityAvg (number|null), code }

// The single laundry drying score (0–10). Used for both the "best dry day"
// badge and today's verdict — they can no longer disagree.
export function dryLaundryScore({ tempMax, tempMin, precipSum, windMax, humidityAvg, code }) {
  const avgTemp = (tempMax + tempMin) / 2;
  let score = 0;

  if (avgTemp >= 20 && avgTemp <= 30) score += 2;
  else if (avgTemp > 15) score += 1;

  if (precipSum <= 0.1) score += 3;
  else if (precipSum <= 0.5) score += 1;

  if (windMax >= 5 && windMax <= 25) score += 2;
  else if (windMax > 25) score += 1;

  if (humidityAvg == null) score += 1;
  else if (humidityAvg < 50) score += 2;
  else if (humidityAvg <= 80) score += 1;

  if ([0, 1, 2].includes(code)) score += 1;

  return Math.min(score, 10);
}

export function bestDryDayIndex(days) {
  const scores = days.map((d) => dryLaundryScore(d));
  return scores.reduce((best, s, i, arr) => (s > arr[best] ? i : best), 0);
}

export function dryLaundryReasons({ tempMax, tempMin, precipSum, windMax, humidityAvg, code }) {
  const avgTemp = (tempMax + tempMin) / 2;
  const reasons = [];

  if (avgTemp >= 20 && avgTemp <= 30) reasons.push({ ok: true, text: 'Warm enough for a quick dry' });
  else if (avgTemp > 15) reasons.push({ ok: true, text: 'Mild temperature — drying takes longer' });
  else reasons.push({ ok: false, text: 'Too cold for outdoor drying' });

  if (precipSum <= 0.1) reasons.push({ ok: true, text: 'No rain expected today' });
  else if (precipSum <= 0.5) reasons.push({ ok: false, text: 'Light drizzle possible — keep an eye out' });
  else reasons.push({ ok: false, text: `About ${Math.round(precipSum)} mm of rain expected` });

  if (windMax >= 5 && windMax <= 25) reasons.push({ ok: true, text: 'Good breeze for drying' });
  else if (windMax > 25) reasons.push({ ok: false, text: 'Strong wind — secure the clothesline' });
  else reasons.push({ ok: false, text: 'Barely any breeze today' });

  if (humidityAvg != null && humidityAvg < 50) reasons.push({ ok: true, text: 'Low humidity — fast drying' });
  else if (humidityAvg != null && humidityAvg > 80) reasons.push({ ok: false, text: 'Humid air slows drying' });

  if ([0, 1, 2].includes(code)) reasons.push({ ok: true, text: 'Sun or broken cloud helps' });

  return reasons;
}

export function laundryVerdict(score) {
  if (score >= 6)
    return { text: 'Hang it out', color: '#4ADE80', note: 'Conditions are on your side today.' };
  if (score >= 4)
    return { text: 'Risky, but possible', color: '#FBBF24', note: 'Watch the sky and bring it in early.' };
  return { text: 'Dry indoors today', color: '#F87171', note: 'The air is not on your side.' };
}

// Outdoor activity go/no-go verdicts
export function activityVerdicts({ temp, windSpeed, precipSum, uv, code, usAqi }) {
  const airOk = usAqi == null || usAqi <= 100;

  return [
    {
      key: 'run',
      good: temp >= 10 && temp <= 25 && precipSum <= 0.1 && windSpeed < 20 && airOk,
      yes: 'Great for a run',
      no: 'Skip the run today',
    },
    {
      key: 'picnic',
      // High UV blocks picnics regardless of sky clarity — clear skies are what create high UV.
      good:
        temp >= 18 &&
        temp <= 30 &&
        precipSum <= 0.1 &&
        (uv == null || uv < 6) &&
        airOk,
      yes: 'Picnic weather',
      no: 'Save the picnic',
    },
    {
      key: 'cycle',
      good: temp >= 12 && temp <= 28 && precipSum <= 0.2 && windSpeed < 25 && airOk,
      yes: 'Perfect cycling day',
      no: 'Cycling not advised',
    },
  ];
}

export function wearAdvice({ temp, precipSum, uv }) {
  let wear;
  if (temp >= 25) wear = 'Light clothing, stay cool';
  else if (temp >= 18) wear = 'T-shirt and shorts';
  else if (temp >= 12) wear = 'Light jacket or sweater';
  else if (temp >= 5) wear = 'Warm jacket';
  else wear = 'Heavy coat, gloves, scarf';

  const extras = [];
  if (precipSum > 0.5) extras.push('umbrella');
  if (uv != null && uv > 6) extras.push('sunglasses');

  return extras.length ? `${wear} · ${extras.join(' · ')}` : wear;
}
