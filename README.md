# 🌤 SkyCast – AI-Powered Weather Intelligence Dashboard

SkyCast is a premium, interactive weather analytics web application that provides real-time weather data, 5-day forecasts, environmental risk analysis, and AI-powered insights using the OpenWeather API.

Designed with a modern SaaS-style UI, smooth animations, and intelligent weather analytics, this project demonstrates advanced frontend engineering concepts and API integration.

---

## 🚀 Live Features

### 🌍 Real-Time Weather Data
- Current temperature
- Weather condition & description
- Humidity
- Wind speed
- Feels-like temperature

### 📅 5-Day Forecast
- Daily forecast cards
- Weather icons
- Temperature trend chart (Chart.js)

### 🧠 AI Weather Intelligence
- Comfort Index analysis
- Risk assessment (storm, wind, rainfall, heat)
- Smart recommendations
- Activity suggestions
- Visual status indicators (Good / Warning / Danger)

### 🚨 Severe Weather Alert System
- Thunderstorm warnings
- Heat alerts
- Snow alerts
- High wind warnings
- Animated alert banner

### 🎤 Voice Assistant
- Search city using speech recognition

### 📍 Geolocation Support
- Auto-detect current location weather

### 🎨 Premium UI Enhancements
- Animated gradient background
- Glassmorphism card design
- Circular temperature gauge
- Dynamic gauge color based on temperature
- Emoji bounce animation
- Rain overlay animation
- Fully responsive layout

---

## 🛠 Tech Stack

- **HTML5**
- **CSS3 (Glassmorphism + Animations)**
- **JavaScript (Vanilla JS)**
- **OpenWeatherMap API**
- **Chart.js**
- **Web Speech API**
- **Geolocation API**

---

## 📂 Project Structure

SkyCast/
│
├── skycast.html
├── skycast.css
├── skycast.js
└── README.md


---

## 🔑 API Setup

1. Go to https://openweathermap.org/
2. Create a free account.
3. Generate an API key.
4. Replace inside `weather.js`:

```js
const apiKey = "YOUR_API_KEY_HERE";
