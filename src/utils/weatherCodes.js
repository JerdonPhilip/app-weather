// src/utils/weatherCodes.js
export const weatherIcons = {
    0: '☀️',
    1: '🌤',
    2: '⛅',
    3: '☁️',
    45: '🌫',
    48: '🌫',
    51: '🌦',
    53: '🌦',
    55: '🌧',
    61: '🌧',
    63: '🌧',
    65: '🌧',
    71: '❄️',
    73: '❄️',
    75: '❄️',
    80: '🌦',
    81: '🌧',
    82: '🌧',
    95: '⛈',
    96: '⛈',
    99: '⛈',
};

export const weatherDescriptions = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing Rime Fog',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Dense Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    71: 'Slight Snow',
    73: 'Moderate Snow',
    75: 'Heavy Snow',
    80: 'Slight Rain Showers',
    81: 'Moderate Rain Showers',
    82: 'Violent Rain Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Slight Hail',
    99: 'Thunderstorm with Heavy Hail',
};

export const getWeatherBackground = (weatherCode) => {
    if ([0].includes(weatherCode)) return 'sunny';
    if ([1, 2, 3].includes(weatherCode)) return 'cloudy';
    if ([45, 48].includes(weatherCode)) return 'foggy';
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return 'rainy';
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return 'snowy';
    if ([95, 96, 99].includes(weatherCode)) return 'stormy';
    return 'default';
};