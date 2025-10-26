const config = {
  // Development
  // API_BASE_URL: 'http://localhost:5000',
  
  // Production - replace with your Render/Heroku backend URL
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-weather-backend.onrender.com' 
    : 'http://localhost:5000'
};

export default config;