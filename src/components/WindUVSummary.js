import React from 'react';
import { motion } from 'framer-motion';

const WindUVSummary = ({ current, daily }) => {
    if (!current || !daily) return null;

    const windSpeed = current.windspeed;                 // km/h
    const windDirection = current.winddirection;         // degrees
    const uvIndex = daily.uv_index_max?.[0];             // UV index
    const windGust = current.windgusts;                  // if available, else ignore

    // Convert wind direction to compass point + arrow rotation
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const dirIndex = Math.round(windDirection / 45) % 8;
    const compass = dirs[dirIndex] || '';

    // UV category
    const getUVCategory = (uv) => {
        if (uv <= 2) return { label: 'Low', color: 'text-green-400' };
        if (uv <= 5) return { label: 'Moderate', color: 'text-yellow-400' };
        if (uv <= 7) return { label: 'High', color: 'text-orange-400' };
        if (uv <= 10) return { label: 'Very High', color: 'text-red-400' };
        return { label: 'Extreme', color: 'text-purple-400' };
    };

    const uvData = uvIndex !== undefined ? getUVCategory(uvIndex) : null;

    return (
        <motion.div
            initial={ { opacity: 0, y: 10 } }
            animate={ { opacity: 1, y: 0 } }
            className="bg-surface-light/50 backdrop-blur-md rounded-card p-5 border border-white/10 shadow-card"
        >
            <h3 className="text-lg font-semibold text-text-primary mb-4">💨 Wind & UV</h3>

            {/* Wind row */ }
            <div className="flex items-center justify-between mb-4">
                <div>
                    <span className="text-2xl mr-2">💨</span>
                    <span className="text-text-primary text-base font-medium">
                        { windSpeed } km/h
                    </span>
                    { windGust && (
                        <span className="text-text-secondary text-sm ml-1">gust { windGust } km/h</span>
                    ) }
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-text-secondary text-sm">{ compass }</span>
                    {/* Wind arrow */ }
                    <svg
                        className="w-5 h-5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        style={ { transform: `rotate(${windDirection}deg)` } }
                    >
                        <path d="M12 2 L12 22 M8 6 L12 2 L16 6" />
                    </svg>
                </div>
            </div>

            {/* UV row */ }
            { uvData ? (
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-2xl mr-2">🌞</span>
                        <span className="text-text-primary text-base font-medium">
                            UV Index { uvIndex }
                        </span>
                    </div>
                    <span className={ `text-sm font-semibold ${uvData.color}` }>
                        { uvData.label }
                    </span>
                </div>
            ) : (
                <div className="text-text-secondary text-sm">UV data not available</div>
            ) }
        </motion.div>
    );
};

export default WindUVSummary;