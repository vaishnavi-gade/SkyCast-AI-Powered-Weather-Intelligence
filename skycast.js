const apiKey = "c3d4f8c9b6e0d1abdffa388d6e86652c";

const weatherResult = document.getElementById("weatherResult");
const forecastResult = document.getElementById("forecastResult");
const insightBox = document.getElementById("weatherInsight");
const alertBanner = document.getElementById("alertBanner");
const alertMessage = document.getElementById("alertMessage");

let tempChart;

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return alert("Please enter a city");

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      displayWeather(data);
      fetchForecast(data.coord.lat, data.coord.lon);
      checkSevereWeather(data);
    });
}

function getWeatherByLocation() {
  if (!navigator.geolocation) return alert("Geolocation not supported.");

  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;

    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
      .then(res => res.json())
      .then(data => {
        displayWeather(data);
        fetchForecast(latitude, longitude);
        checkSevereWeather(data);
      });
  });
}

function useVoiceInput() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice recognition not supported.");
    return;
  }

  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";
  recognition.start();

  recognition.onresult = e => {
    document.getElementById("cityInput").value = e.results[0][0].transcript;
    getWeather();
  };
}


function displayWeather(data) {
  const temp = Math.round(data.main.temp);
  const percent = (temp + 10) * 2;
  const condition = data.weather[0].main.toLowerCase();
  const hour = new Date().getHours();

  const emoji = getWeatherEmoji(condition, hour);
  const gaugeColor = getGaugeColor(temp);

  toggleRainAnimation(condition);

  weatherResult.innerHTML = `
    <div class="current-weather">
      <div>
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>${data.weather[0].description}</p>
      </div>

      <div class="temp-gauge">
        <svg width="180" height="180">
          <circle cx="90" cy="90" r="80"
            stroke="rgba(255,255,255,0.1)"
            stroke-width="15"
            fill="none" />
          <circle cx="90" cy="90" r="80"
            stroke="${gaugeColor}"
            stroke-width="15"
            fill="none"
            stroke-dasharray="502"
            stroke-dashoffset="${502 - percent * 5}"
            stroke-linecap="round"/>
        </svg>

        <div class="temp-text">
          <span class="weather-emoji">${emoji}</span>
          ${temp}°C
        </div>
      </div>
    </div>

    <div class="weather-stats">
      <div class="stat-card">
        <h4>💧 Humidity</h4>
        <p>${data.main.humidity}%</p>
      </div>

      <div class="stat-card">
        <h4>💨 Wind Speed</h4>
        <p>${data.wind.speed} m/s</p>
      </div>

      <div class="stat-card">
        <h4>🌡 Feels Like</h4>
        <p>${Math.round(data.main.feels_like)}°C</p>
      </div>
    </div>
  `;

  generateInsight(data);
}

function fetchForecast(lat, lon) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {

      const daily = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
      );

      forecastResult.innerHTML = `
        <h3>5-Day Forecast</h3>
        <div class="forecast-grid">
          ${daily.map(d => `
            <div class="forecast-card">
              <h4>${new Date(d.dt * 1000).toLocaleDateString(undefined, { weekday: "short" })}</h4>
              <img src="https://openweathermap.org/img/wn/${d.weather[0].icon}.png">
              <p>${Math.round(d.main.temp)}°C</p>
            </div>
          `).join("")}
        </div>
      `;

      renderChart(daily);
    });
}

function renderChart(daily) {
  const ctx = document.getElementById("tempChart").getContext("2d");
  if (tempChart) tempChart.destroy();

  tempChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: daily.map(d =>
        new Date(d.dt * 1000).toLocaleDateString(undefined, { weekday: "short" })
      ),
      datasets: [{
        label: "Temperature (°C)",
        data: daily.map(d => d.main.temp),
        borderColor: "#4facfe",
        backgroundColor: "rgba(79,172,254,0.2)",
        fill: true,
        tension: 0.4
      }]
    }
  });
}


function generateInsight(data) {

  const temp = data.main.temp;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;
  const condition = data.weather[0].main.toLowerCase();

  let comfortLevel = "";
  let comfortClass = "";
  let riskLevel = "";
  let riskClass = "";
  let recommendation = "";
  let activity = "";

  if (temp >= 20 && temp <= 28 && humidity < 65) {
    comfortLevel = "Highly Comfortable";
    comfortClass = "good";
  } else if (temp > 35 || temp < 8) {
    comfortLevel = "Extreme Conditions";
    comfortClass = "danger";
  } else {
    comfortLevel = "Moderately Comfortable";
    comfortClass = "warning";
  }

  if (condition.includes("thunderstorm")) {
    riskLevel = "High Storm Risk";
    riskClass = "danger";
  } else if (condition.includes("rain") && humidity > 80) {
    riskLevel = "Elevated Rainfall Risk";
    riskClass = "warning";
  } else if (wind > 12) {
    riskLevel = "Wind Advisory";
    riskClass = "warning";
  } else {
    riskLevel = "Low Environmental Risk";
    riskClass = "good";
  }

  recommendation = temp > 35
    ? "Limit outdoor exposure. Stay hydrated."
    : temp < 8
    ? "Wear insulated clothing."
    : condition.includes("rain")
    ? "Carry an umbrella."
    : "Conditions favorable for outdoor plans.";

  activity = condition.includes("rain")
    ? "Indoor productivity recommended."
    : "Ideal for sports or light outdoor activities.";

  insightBox.innerHTML = `
    <div class="ai-panel">
      <div class="ai-header">
        <div>
          <h3>🧠 AI Weather Intelligence</h3>
          <p class="ai-subtitle">Advanced Environmental Analysis</p>
        </div>
      </div>

      <div class="ai-grid">
        <div class="ai-card ${comfortClass}">
          <div class="ai-card-title">🌡 Comfort Index</div>
          <div class="ai-card-value">${comfortLevel}</div>
        </div>

        <div class="ai-card ${riskClass}">
          <div class="ai-card-title">⚠ Risk Assessment</div>
          <div class="ai-card-value">${riskLevel}</div>
        </div>

        <div class="ai-card">
          <div class="ai-card-title">🎯 Recommendation</div>
          <div class="ai-card-desc">${recommendation}</div>
        </div>

        <div class="ai-card">
          <div class="ai-card-title">📈 Activity Outlook</div>
          <div class="ai-card-desc">${activity}</div>
        </div>
      </div>
    </div>
  `;
}

function getWeatherEmoji(condition, hour) {
  const isNight = hour < 6 || hour >= 18;
  if (condition.includes("clear")) return isNight ? "🌙" : "☀️";
  if (condition.includes("cloud")) return "☁️";
  if (condition.includes("rain")) return "🌧";
  if (condition.includes("snow")) return "❄️";
  if (condition.includes("thunderstorm")) return "⛈";
  return "🌍";
}

function getGaugeColor(temp) {
  if (temp >= 35) return "#ff4e50";
  if (temp <= 5) return "#4facfe";
  if (temp >= 20 && temp <= 30) return "#00f2fe";
  return "#f9d423";
}

function toggleRainAnimation(condition) {
  let rainLayer = document.querySelector(".rain-overlay");
  if (condition.includes("rain")) {
    if (!rainLayer) {
      rainLayer = document.createElement("div");
      rainLayer.classList.add("rain-overlay");
      document.body.appendChild(rainLayer);
    }
  } else if (rainLayer) {
    rainLayer.remove();
  }
}


function checkSevereWeather(data) {
  const temp = data.main.temp;
  const wind = data.wind.speed;
  const condition = data.weather[0].main.toLowerCase();

  let message = null;

  if (condition.includes("thunderstorm"))
    message = "⛈ Severe Thunderstorm Warning!";
  else if (temp > 40)
    message = "🔥 Extreme Heat Alert!";
  else if (condition.includes("snow"))
    message = "❄ Snow Alert!";
  else if (wind > 15)
    message = "💨 High Wind Warning!";

  if (message) {
    alertMessage.textContent = message;
    alertBanner.classList.remove("hidden");
  } else {
    alertBanner.classList.add("hidden");
  }
}

function closeAlert() {
  alertBanner.classList.add("hidden");
}
