import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SunriseCountdown = ({ sunriseISO, sunsetISO }) => {
    const [now, setNow] = useState(new Date());
    const sunrise = new Date(sunriseISO);
    const sunset = new Date(sunsetISO);

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const isDay = now >= sunrise && now < sunset;
    const nextEvent = isDay ? sunset : sunrise;
    const diffMs = nextEvent - now;
    if (diffMs < 0) return null; // should not happen if dates are valid

    const totalMs = isDay
        ? sunset - sunrise
        : (new Date(sunrise.getTime() + 86400000) - sunrise); // assume tomorrow sunrise

    const progressPercent = isDay
        ? ((now - sunrise) / (sunset - sunrise)) * 100
        : 0;

    const formatCountdown = (ms) => {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        return `${hours}h ${minutes}m`;
    };

    return (
        <motion.div
            initial={ { opacity: 0, y: 10 } }
            animate={ { opacity: 1, y: 0 } }
            className="bg-surface-light/50 backdrop-blur-md rounded-card p-5 border border-white/10 shadow-card"
        >
            <h3 className="text-lg font-semibold text-text-primary mb-3">
                { isDay ? '🌞 Daylight Remaining' : '🌙 Next Sunrise' }
            </h3>
            <div className="text-3xl font-bold text-white mb-2">
                { formatCountdown(diffMs) }
            </div>
            <p className="text-sm text-text-secondary mb-3">
                { isDay
                    ? `Sunset at ${sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                    : `Sunrise at ${sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` }
            </p>
            { isDay && (
                <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                        className="bg-accent h-2 rounded-full"
                        initial={ { width: 0 } }
                        animate={ { width: `${progressPercent}%` } }
                        transition={ { duration: 0.5 } }
                    />
                </div>
            ) }
        </motion.div>
    );
};

export default SunriseCountdown;