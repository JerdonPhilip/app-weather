import React from 'react';
import { motion } from 'framer-motion';
import { weatherIcons, weatherDescriptions } from '../utils/weatherCodes';

const CurrentWeather = ({ forecast, locationName }) => {
    if (!forecast) return null;

    const current = forecast.current_weather;
    const daily = forecast.daily;
    const hourly = forecast.hourly;

    const weatherCode = current.weathercode;
    const temperature = Math.round(current.temperature);
    const windSpeed = current.windspeed;
    const windDirection = current.winddirection;
    const humidity = hourly?.relativehumidity_2m?.[0] ?? '--';
    const uvIndex = daily?.uv_index_max?.[0] ?? '--';
    const precipProb = hourly?.precipitation_probability?.[0] ?? '--';

    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const windDirStr = windDirection !== undefined
        ? dirs[Math.round(windDirection / 45) % 8]
        : '';

    return (
        <motion.div
            layout
            initial={ { opacity: 0, y: 20 } }
            animate={ { opacity: 1, y: 0 } }
            exit={ { opacity: 0, scale: 0.95 } }
            transition={ { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
            className="bg-surface-light/60 backdrop-blur-md rounded-card p-6 shadow-card border border-white/10"
        >
            {/* Location + Time */ }
            <div className="text-center mb-5">
                <h2 className="text-2xl font-bold text-text-primary">{ locationName }</h2>
                <p className="text-lg text-text-secondary mt-1">Now</p>
            </div>

            {/* Main temp + icon */ }
            <div className="flex items-center justify-center gap-5 mb-6">
                <span className="text-7xl">{ weatherIcons[weatherCode] || '🌤' }</span>
                <div>
                    <div className="text-6xl font-bold text-text-primary">{ temperature }°C</div>
                    <div className="text-xl text-text-secondary mt-2">
                        { weatherDescriptions[weatherCode] || 'Clear' }
                    </div>
                </div>
            </div>

            {/* Detail cards – 3 columns on mobile, 5 on sm+ */ }
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                { [
                    { label: 'Wind', value: `${windSpeed} km/h ${windDirStr}` },
                    { label: 'Humidity', value: `${humidity}%` },
                    { label: 'Precip.', value: precipProb !== '--' ? `${precipProb}%` : '--' },
                    { label: 'UV Index', value: uvIndex },
                    { label: 'Feels Like', value: `${temperature}°` },
                ].map((item, i) => (
                    <div
                        key={ i }
                        className="bg-white/5 rounded-lg p-3 text-center border border-white/5"
                    >
                        <div className="text-sm text-text-secondary">{ item.label }</div>
                        <div className="text-lg font-semibold text-text-primary mt-1">{ item.value }</div>
                    </div>
                )) }
            </div>
        </motion.div>
    );
};

export default CurrentWeather;