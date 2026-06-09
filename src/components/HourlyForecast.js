import React from 'react';
import { motion } from 'framer-motion';
import { weatherIcons } from '../utils/weatherCodes';

const HourlyForecast = ({ hourly }) => {
    if (!hourly) return null;

    const now = new Date();
    const currentHourIndex = hourly.time.findIndex(t => new Date(t) >= now);
    if (currentHourIndex === -1) return null;

    const next12 = hourly.time
        .slice(currentHourIndex, currentHourIndex + 12)
        .map((time, i) => ({
            time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            temp: Math.round(hourly.temperature_2m[i + currentHourIndex]),
            weathercode: hourly.weathercode[i + currentHourIndex],
            precipProb: hourly.precipitation_probability[i + currentHourIndex],
        }));

    return (
        <motion.div
            initial={ { opacity: 0, y: 10 } }
            animate={ { opacity: 1, y: 0 } }
            className="bg-surface-light/50 backdrop-blur-md rounded-card p-5 border border-white/10 shadow-card overflow-x-auto"
        >
            <h3 className="text-xl font-semibold text-text-primary mb-4">Next 12 Hours</h3>
            <div className="flex gap-4 min-w-max">
                { next12.map((hour, i) => (
                    <div key={ i } className="flex flex-col items-center gap-1 text-white">
                        <span className="text-sm text-text-secondary">{ hour.time }</span>
                        <span className="text-2xl">{ weatherIcons[hour.weathercode] || '🌤' }</span>
                        <span className="text-base font-medium">{ hour.temp }°</span>
                        { hour.precipProb !== undefined && (
                            <span className="text-sm text-blue-300">{ hour.precipProb }%</span>
                        ) }
                    </div>
                )) }
            </div>
        </motion.div>
    );
};

export default HourlyForecast;