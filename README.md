# Weather Dashboard

A professional weather dashboard built with React, Tailwind CSS, and Framer Motion. Uses the free Open-Meteo API for real-time weather data, forecasts, air quality, and activity recommendations. No backend or API keys required.

## Features

- Current weather with wind direction, humidity, precipitation, and UV index
- 3-day forecast with daily highs, lows, and conditions
- Next 12-hour hourly forecast
- Location search with autocomplete, debounce, and keyboard navigation
- Automatic geolocation detection
- Air Quality Index (AQI) with PM2.5 and PM10
- Sunrise and sunset countdown with progress bar
- Live precipitation radar map via RainViewer
- Laundry drying advisory with scoring and reasons
- Activity recommendations for running, picnic, cycling, and what to wear
- Weather-responsive animated backgrounds and effects
- Smooth transitions and layout animations with Framer Motion
- Skeleton loaders for loading states
- Toast notifications for errors and updates
- Pull-to-refresh gesture on mobile
- Accessible with ARIA labels, keyboard navigation, and good contrast
- Responsive design for all screen sizes

## Tech Stack

- React
- Tailwind CSS
- Framer Motion
- Axios
- Open-Meteo API (free, no key needed)
- RainViewer (free radar map)

## Getting Started

1. Clone the repository
2. Install dependencies: npm install
3. Start the development server: npm start
4. Open http://localhost:3000 in your browser

## Build for Production

npm run build

## API Usage

This app uses the free Open-Meteo API endpoints:
- Weather Forecast API
- Geocoding API
- Air Quality API

No API keys or authentication required.

## Project Structure

src/
  components/
    ActivityAdvisories.js
    AirQualityCard.js
    CurrentWeather.js
    ForecastCards.js
    HourlyForecast.js
    LaundryAdvisory.js
    LocationSearch.js
    PullToRefreshWrapper.js
    SkeletonLoader.js
    Spinner.js
    SunriseCountdown.js
    Toast.js
    WeatherEffects.js
    WindUVSummary.js
  hooks/
    useDebounce.js
  utils/
    weatherCodes.js
  App.js
  config.js
  index.js
  index.css