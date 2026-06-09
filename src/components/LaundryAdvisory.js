import React from 'react';
import { motion } from 'framer-motion';

const LaundryAdvisory = ({ today }) => {
    if (!today) return null;

    const {
        temperature_2m_max,
        temperature_2m_min,
        precipitation_sum,
        windspeed_10m_max,
        relativehumidity_2m,
        weathercode,
    } = today;

    let score = 0;
    const reasons = [];

    const avgTemp = (temperature_2m_max + temperature_2m_min) / 2;
    if (avgTemp >= 20 && avgTemp <= 30) {
        score += 2;
        reasons.push('Warm temperature 🌡️');
    } else if (avgTemp > 15) score += 1;

    if (precipitation_sum <= 0.1) {
        score += 3;
        reasons.push('No rain expected ☀️');
    } else if (precipitation_sum <= 0.5) {
        score += 1;
        reasons.push('Light drizzle possible 🌦️');
    } else {
        reasons.push('Rain expected ☔');
    }

    if (windspeed_10m_max >= 5 && windspeed_10m_max <= 25) {
        score += 2;
        reasons.push('Good breeze for drying 💨');
    } else if (windspeed_10m_max > 25) {
        reasons.push('Strong wind – secure clothes ⚠️');
    }

    const avgHumidity = relativehumidity_2m?.length
        ? relativehumidity_2m.reduce((a, b) => a + b, 0) / relativehumidity_2m.length
        : 60;
    if (avgHumidity < 50) {
        score += 1;
        reasons.push('Low humidity – fast drying 🌵');
    } else if (avgHumidity > 80) {
        reasons.push('High humidity – slow drying 💧');
    }

    if ([0, 1, 2].includes(weathercode)) {
        score += 1;
        reasons.push('Sunny or partly cloudy ⛅');
    }

    let advisory;
    if (score >= 6) {
        advisory = { text: 'Perfect day to hang laundry!', emoji: '👕✨', color: 'text-green-400' };
    } else if (score >= 4) {
        advisory = { text: 'Okay, but keep an eye on the sky', emoji: '👀', color: 'text-yellow-400' };
    } else {
        advisory = { text: 'Better dry indoors today', emoji: '🏠', color: 'text-red-400' };
    }

    return (
        <motion.div
            initial={ { opacity: 0, y: 10 } }
            animate={ { opacity: 1, y: 0 } }
            className="bg-surface-light/50 backdrop-blur-md rounded-card p-5 border border-white/10 shadow-card"
        >
            <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🧺</span>
                <h3 className="text-xl font-semibold text-text-primary">Laundry Drying Forecast</h3>
            </div>
            <div className={ `flex items-center gap-2 text-2xl font-bold ${advisory.color}` }>
                <span>{ advisory.emoji }</span>
                <span>{ advisory.text }</span>
            </div>
            <ul className="mt-4 space-y-2">
                { reasons.map((r, i) => (
                    <li key={ i } className="flex items-center gap-3 text-base text-text-secondary">
                        <span className="w-2 h-2 bg-accent rounded-full"></span>
                        { r }
                    </li>
                )) }
            </ul>
        </motion.div>
    );
};

export default LaundryAdvisory;