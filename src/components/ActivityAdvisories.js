import React from 'react';
import { motion } from 'framer-motion';

const ActivityAdvisories = ({ current, daily, aqiData }) => {
    // Extract data
    const temp = current.temperature;
    const precip = daily?.precipitation_sum?.[0] || 0;
    const wind = current.windspeed;
    const uv = daily?.uv_index_max?.[0];
    const weatherCode = current.weathercode;
    const aqi = aqiData?.usAqi || 50; // default moderate

    const isClear = [0, 1, 2].includes(weatherCode);

    // Running
    const runningGood = (temp >= 10 && temp <= 25) && precip <= 0.1 && wind < 20 && aqi <= 100;
    const runningMsg = runningGood ? 'Great for a run 🏃' : 'Not ideal for running';
    const runningColor = runningGood ? 'text-green-400' : 'text-text-secondary';

    // Picnic
    const picnicGood = (temp >= 18 && temp <= 30) && precip <= 0.1 && (uv < 6 || isClear) && aqi <= 100;
    const picnicMsg = picnicGood ? 'Picnic weather! 🧺' : 'Better save picnic for another day';
    const picnicColor = picnicGood ? 'text-green-400' : 'text-text-secondary';

    // Cycling
    const cyclingGood = (temp >= 12 && temp <= 28) && precip <= 0.2 && wind < 25 && aqi <= 100;
    const cyclingMsg = cyclingGood ? 'Perfect cycling day 🚴' : 'Cycling not recommended';
    const cyclingColor = cyclingGood ? 'text-green-400' : 'text-text-secondary';

    // What to wear
    let wear;
    if (temp < 5) wear = '🧥 Heavy coat, gloves, scarf';
    else if (temp < 12) wear = '🧥 Warm jacket';
    else if (temp < 18) wear = '👕 Light jacket or sweater';
    else if (temp < 25) wear = '👕 T‑shirt and shorts';
    else wear = '🩳 Light clothing, stay cool';

    if (precip > 0.5) wear += ', ☔ umbrella';
    if (uv > 6) wear += ', 🕶️ sunglasses';

    return (
        <motion.div
            initial={ { opacity: 0, y: 10 } }
            animate={ { opacity: 1, y: 0 } }
            className="bg-surface-light/50 backdrop-blur-md rounded-card p-5 border border-white/10 shadow-card space-y-4"
        >
            <h3 className="text-lg font-semibold text-text-primary mb-3">📋 Today's Activities</h3>
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🏃</span>
                    <span className={ `text-base ${runningColor}` }>{ runningMsg }</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl">🧺</span>
                    <span className={ `text-base ${picnicColor}` }>{ picnicMsg }</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl">🚴</span>
                    <span className={ `text-base ${cyclingColor}` }>{ cyclingMsg }</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xl">🧥</span>
                    <span className="text-base text-text-secondary">{ wear }</span>
                </div>
            </div>
        </motion.div>
    );
};

export default ActivityAdvisories;