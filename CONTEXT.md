# CONTEXT.md — Domain Glossary

Shared vocabulary for the weather dashboard. Architecture reviews and refactors use these terms exactly.

## Terms

- **Condition key** — coarse sky state derived from a WMO weather code: `clear | cloudy | fog | rain | snow | storm`. Drives the atmosphere theme, particles, and glyph selection.
- **Atmosphere** — the page background model: gradient stops + aurora blob hues for a condition key and day/night part.
- **Drying score** — single 0–10 laundry-drying score computed from a **dryable day** (temperature max/min, precipitation sum, max wind, average humidity or null, WMO code). One algorithm in `src/domain/advisories.js` serves both today's verdict and the "best dry day" badge across the outlook.
- **Dryable day** — the plain-object input shape of the drying score: `{ tempMax, tempMin, precipSum, windMax, humidityAvg, code }`.
- **Advisory** — a go/no-go recommendation for an outdoor activity (run, picnic, cycle) or what to wear, derived from current conditions + air quality. Rules live only in `src/domain/advisories.js`; components present them.
- **Intake** — fetching forecast + air quality from Open-Meteo and shaping it for the UI. One deep seam: `src/hooks/useWeather.js` owns both API adapters and derives `nowIndex`, the humidity window, condition key, and day/night part once; components consume plain reads.

## Decisions

- The drying score is deliberately capped at 10 with neutral (+1) credit when humidity is unknown, so 3-day outlook rows (no hourly humidity) rank fairly against today.
- Picnic advisories block on high UV (≥6) regardless of sky clarity; the earlier `uv < 6 OR clear` rule was dropped because clear skies are the cause of high UV, making the escape hatch self-defeating.
