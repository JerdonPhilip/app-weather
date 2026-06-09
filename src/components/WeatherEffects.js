// src/WeatherEffects.js
import React from 'react';

const WeatherEffects = ({ condition }) => {
    if (condition === 'rainy') {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                { [...Array(50)].map((_, i) => (
                    <div
                        key={ i }
                        className="absolute top-0 h-8 w-0.5 bg-blue-300 opacity-60 animate-rain"
                        style={ {
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`,
                            animationDuration: `${0.5 + Math.random() * 0.5}s`,
                        } }
                    />
                )) }
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-200/10 to-blue-300/20 animate-pulse" />
            </div>
        );
    }

    if (condition === 'snowy') {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                { [...Array(30)].map((_, i) => (
                    <div
                        key={ i }
                        className="absolute top-0 text-white opacity-70 animate-snow"
                        style={ {
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${5 + Math.random() * 5}s`,
                        } }
                    >
                        ❄
                    </div>
                )) }
            </div>
        );
    }

    if (condition === 'cloudy') {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                { [...Array(5)].map((_, i) => (
                    <div
                        key={ i }
                        className="absolute text-white opacity-20 text-6xl animate-float"
                        style={ {
                            top: `${20 + Math.random() * 60}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${20 + Math.random() * 20}s`,
                        } }
                    >
                        ☁
                    </div>
                )) }
            </div>
        );
    }

    if (condition === 'sunny') {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-10 right-10 text-yellow-300 text-6xl opacity-30 animate-pulse">
                    ☀
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/10 via-transparent to-orange-200/10 animate-pulse" />
            </div>
        );
    }

    if (condition === 'stormy') {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-0 animate-lightning" />
                { [...Array(3)].map((_, i) => (
                    <div
                        key={ i }
                        className="absolute text-yellow-300 text-4xl opacity-0 animate-lightning-text"
                        style={ {
                            top: `${20 + i * 20}%`,
                            left: `${30 + i * 15}%`,
                            animationDelay: `${2 + i * 3}s`,
                        } }
                    >
                        ⚡
                    </div>
                )) }
            </div>
        );
    }

    if (condition === 'foggy') {
        return (
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-white/10 animate-pulse" />
            </div>
        );
    }

    return null;
};

export default WeatherEffects;