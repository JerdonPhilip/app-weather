import {
  dryLaundryScore,
  bestDryDayIndex,
  dryLaundryReasons,
  laundryVerdict,
  activityVerdicts,
  wearAdvice,
} from './advisories';

const perfectDay = {
  tempMax: 26,
  tempMin: 18,
  precipSum: 0,
  windMax: 12,
  humidityAvg: 40,
  code: 0,
};

describe('dryLaundryScore', () => {
  test('perfect conditions cap at 10', () => {
    expect(dryLaundryScore(perfectDay)).toBe(10);
  });

  test('cold, wet, still day scores near zero', () => {
    const score = dryLaundryScore({
      tempMax: 4,
      tempMin: -1,
      precipSum: 6,
      windMax: 2,
      humidityAvg: 90,
      code: 61,
    });
    expect(score).toBeLessThanOrEqual(2);
  });

  test('null humidity gets neutral credit and does not crash', () => {
    const withNull = dryLaundryScore({ ...perfectDay, humidityAvg: null });
    expect(withNull).toBe(9);
  });

  test('score never exceeds 10', () => {
    expect(dryLaundryScore({ ...perfectDay, humidityAvg: 30 })).toBe(10);
  });
});

describe('bestDryDayIndex', () => {
  test('picks the day the scorer ranks highest', () => {
    const days = [
      perfectDay,
      { ...perfectDay, precipSum: 8 }, // rain kills it
      { ...perfectDay, code: 3, humidityAvg: null },
    ];
    expect(bestDryDayIndex(days)).toBe(0);
  });

  test('ties resolve to the earliest day', () => {
    const days = [
      { ...perfectDay, code: 1 },
      { ...perfectDay, code: 1 },
    ];
    expect(bestDryDayIndex(days)).toBe(0);
  });
});

describe('laundryVerdict', () => {
  test.each([
    [8, 'Hang it out'],
    [5, 'Risky, but possible'],
    [2, 'Dry indoors today'],
  ])('score %i → %s', (score, expected) => {
    expect(laundryVerdict(score).text).toBe(expected);
  });
});

describe('dryLaundryReasons', () => {
  test('reports rain as a blocking reason on wet days', () => {
    const reasons = dryLaundryReasons({ ...perfectDay, precipSum: 5 });
    expect(reasons.some((r) => !r.ok && /rain/i.test(r.text))).toBe(true);
  });

  test('all reasons positive on a perfect day', () => {
    expect(dryLaundryReasons(perfectDay).every((r) => r.ok)).toBe(true);
  });
});

describe('activityVerdicts', () => {
  const base = { temp: 22, windSpeed: 10, precipSum: 0, uv: 3, code: 1 };

  test('all go on a mild clear day', () => {
    expect(activityVerdicts({ ...base, usAqi: 40 }).every((v) => v.good)).toBe(true);
  });

  test('unknown AQI is treated as acceptable, high AQI blocks everything', () => {
    expect(activityVerdicts({ ...base, usAqi: null }).every((v) => v.good)).toBe(true);
    expect(activityVerdicts({ ...base, usAqi: 180 }).some((v) => v.good)).toBe(false);
  });

  test('high UV blocks picnics but not runs', () => {
    const v = activityVerdicts({ ...base, uv: 9 });
    const byKey = Object.fromEntries(v.map((x) => [x.key, x.good]));
    expect(byKey.picnic).toBe(false);
    expect(byKey.run).toBe(true);
  });
});

describe('wearAdvice', () => {
  test('layers by temperature bands', () => {
    expect(wearAdvice({ temp: 30, precipSum: 0, uv: 2 })).toMatch(/Light clothing/);
    expect(wearAdvice({ temp: 20, precipSum: 0, uv: 2 })).toMatch(/T-shirt/);
    expect(wearAdvice({ temp: 14, precipSum: 0, uv: 2 })).toMatch(/Light jacket/);
    expect(wearAdvice({ temp: 8, precipSum: 0, uv: 2 })).toMatch(/Warm jacket/);
    expect(wearAdvice({ temp: -2, precipSum: 0, uv: 2 })).toMatch(/Heavy coat/);
  });

  test('appends umbrella and sunglasses extras', () => {
    const advice = wearAdvice({ temp: 22, precipSum: 3, uv: 8 });
    expect(advice).toMatch(/umbrella/);
    expect(advice).toMatch(/sunglasses/);
  });
});
