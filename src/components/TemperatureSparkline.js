// src/components/TemperatureSparkline.js
import React from 'react';

const TemperatureSparkline = ({ hourlyTemps }) => {
    if (!hourlyTemps || hourlyTemps.length < 2) return null;

    const width = 150;
    const height = 40;
    const minTemp = Math.min(...hourlyTemps);
    const maxTemp = Math.max(...hourlyTemps);
    const range = maxTemp - minTemp || 1;

    const points = hourlyTemps
        .slice(0, 6)
        .map((temp, i) => {
            const x = (i / 5) * width;
            const y = height - ((temp - minTemp) / range) * height;
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <div className="bg-surface-light/50 backdrop-blur-md rounded-card p-5 border border-white/10 shadow-card">
            <h3 className="text-lg font-semibold text-text-primary mb-3">📈 Temperature Trend</h3>
            {/* Fixed aspect ratio so the SVG never stretches */ }
            <div className="aspect-[150/40]">
                <svg
                    viewBox={ `0 0 ${width} ${height}` }
                    className="w-full h-full"
                    role="img"
                    aria-label="Temperature trend"
                >
                    <polyline
                        points={ points }
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    { hourlyTemps.slice(0, 6).map((temp, i) => {
                        const x = (i / 5) * width;
                        const y = height - ((temp - minTemp) / range) * height;
                        return (
                            <circle
                                key={ i }
                                cx={ x }
                                cy={ y }
                                r="2.5"
                                fill="#3b82f6"
                            />
                        );
                    }) }
                </svg>
            </div>
        </div>
    );
};

export default TemperatureSparkline;