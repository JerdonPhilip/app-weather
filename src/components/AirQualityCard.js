import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import { motion } from 'framer-motion';

const aqiColors = {
    good: 'text-green-400',
    moderate: 'text-yellow-400',
    unhealthy: 'text-orange-400',
    hazardous: 'text-red-400',
};

const getAqiCategory = (usAqi) => {
    if (usAqi <= 50) return 'good';
    if (usAqi <= 100) return 'moderate';
    if (usAqi <= 150) return 'unhealthy';
    return 'hazardous';
};

const AirQualityCard = ({ lat, lon }) => {
    const [aqiData, setAqiData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAQI = async () => {
            try {
                const res = await axios.get(
                    `${config.AIR_QUALITY_API}?latitude=${lat}&longitude=${lon}&current=us_aqi,pm2_5,pm10,european_aqi`
                );
                const current = res.data.current;
                setAqiData({
                    usAqi: current.us_aqi,
                    pm25: current.pm2_5,
                    pm10: current.pm10,
                });
            } catch (err) {
                console.error('AQI fetch failed', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAQI();
    }, [lat, lon]);

    if (loading) {
        return (
            <div className="bg-surface-light/50 backdrop-blur-md rounded-card p-5 border border-white/10 animate-pulse h-32" />
        );
    }
    if (!aqiData) return null;

    const category = getAqiCategory(aqiData.usAqi);
    const colorClass = aqiColors[category];

    return (
        <motion.div
            initial={ { opacity: 0, y: 10 } }
            animate={ { opacity: 1, y: 0 } }
            className="bg-surface-light/50 backdrop-blur-md rounded-card p-5 border border-white/10 shadow-card"
        >
            <h3 className="text-lg font-semibold text-text-primary mb-2">🌬️ Air Quality</h3>
            <div className={ `text-2xl font-bold ${colorClass}` }>
                AQI { aqiData.usAqi } - { category.charAt(0).toUpperCase() + category.slice(1) }
            </div>
            <div className="flex gap-4 mt-3 text-sm text-text-secondary">
                <span>PM2.5: { aqiData.pm25 } µg/m³</span>
                <span>PM10: { aqiData.pm10 } µg/m³</span>
            </div>
        </motion.div>
    );
};

export default AirQualityCard;