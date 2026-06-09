import React from 'react';
import { motion } from 'framer-motion';
import { weatherIcons } from '../utils/weatherCodes';

const ForecastCards = ({ forecast }) => {
    if (!forecast || !forecast.daily) return null;

    const days = forecast.daily.time.slice(0, 3).map((date, i) => {
        const maxTemp = Math.round(forecast.daily.temperature_2m_max[i]);
        const minTemp = Math.round(forecast.daily.temperature_2m_min[i]);
        const weathercode = forecast.daily.weathercode?.[i] || 0;
        const precip = forecast.daily.precipitation_sum[i];
        const wind = forecast.daily.windspeed_10m_max[i];
        const avgTemp = (maxTemp + minTemp) / 2;
        // Simple laundry score
        let laundryScore = 0;
        if (avgTemp >= 20 && avgTemp <= 30) laundryScore += 2;
        if (precip <= 0.1) laundryScore += 3;
        if (wind >= 5 && wind <= 25) laundryScore += 1;
        return { date, maxTemp, minTemp, weathercode, precip, wind, laundryScore };
    });

    const bestDayIndex = days.reduce((best, day, i, arr) =>
        day.laundryScore > arr[best].laundryScore ? i : best, 0);

    return (
        <motion.div
            layout
            initial={ { opacity: 0, y: 20 } }
            animate={ { opacity: 1, y: 0 } }
            exit={ { opacity: 0, scale: 0.95 } }
            transition={ { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
            className="bg-surface-light/60 backdrop-blur-md rounded-card p-6 shadow-card border border-white/10"
        >
            <h3 className="text-xl font-bold text-text-primary mb-5">3‑Day Forecast</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                { days.map((day, i) => (
                    <div
                        key={ day.date }
                        className={ `bg-white/5 rounded-card p-4 text-center border border-white/5 transition-colors ${i === bestDayIndex ? 'ring-2 ring-green-400/60 bg-green-400/10' : ''
                            }` }
                    >
                        { i === bestDayIndex && (
                            <span className="text-sm text-green-400 block mb-1 font-medium">🧺 Best for laundry</span>
                        ) }
                        <h4 className="font-semibold text-text-primary text-base mb-2">
                            { new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) }
                        </h4>
                        <span className="text-4xl mb-2 block">{ weatherIcons[day.weathercode] || '🌤' }</span>
                        <div className="text-text-primary font-bold text-xl">
                            { day.maxTemp }° <span className="text-text-secondary text-base">{ day.minTemp }°</span>
                        </div>
                        <div className="text-sm text-text-secondary mt-2 space-y-0.5">
                            <div>💧 { day.precip } mm</div>
                            <div>💨 { day.wind } km/h</div>
                        </div>
                    </div>
                )) }
            </div>
        </motion.div>
    );
};

export default ForecastCards;