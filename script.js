document.addEventListener('DOMContentLoaded', () => {
  console.log("✅ SeaWay frontend script loaded!");

  const API_BASE = 'https://seaway-backend.onrender.com';
  const loadingDiv = document.getElementById('loadingDiv');
  const resultsDiv = document.getElementById('resultsDiv');
  const locationInput = document.getElementById('locationInput');

  function showLoading() {
    loadingDiv.style.display = 'block';
    resultsDiv.innerHTML = '';
  }

  function hideLoading() {
    loadingDiv.style.display = 'none';
  }

  async function fetchWeather() {
    const location = locationInput.value.trim() || 'Lagos';
    showLoading();
    console.log("🌦️ Fetching weather for:", location);

    try {
      const response = await fetch(`${API_BASE}/weather?city=${encodeURIComponent(location)}`);
      const data = await response.json();
      hideLoading();
      displayWeather(data);
    } catch (error) {
      hideLoading();
      console.error('Weather fetch error:', error);
      displayError(`Failed to fetch weather data: ${error.message}`);
    }
  }

  async function fetchMap() {
    const location = locationInput.value.trim() || 'Lagos';
    showLoading();
    console.log("🗺️ Fetching map for:", location);

    try {
      const response = await fetch(`${API_BASE}/map?location=${encodeURIComponent(location)}`);
      const data = await response.json();
      hideLoading();
      displayMap(data);
    } catch (error) {
      hideLoading();
      console.error('Map fetch error:', error);
      displayError(`Failed to fetch coordinates: ${error.message}`);
    }
  }

  async function fetchBoth() {
    const location = locationInput.value.trim() || 'Lagos';
    showLoading();
    console.log("⚡ Fetching both weather & map for:", location);

    try {
      const response = await fetch(`${API_BASE}/weather-map?location=${encodeURIComponent(location)}`);
      const data = await response.json();
      hideLoading();
      displayBoth(data);
    } catch (error) {
      hideLoading();
      console.error('Combined fetch error:', error);
      displayError(`Failed to fetch data: ${error.message}`);
    }
  }

  function displayWeather(data) {
    if (data.error) {
      resultsDiv.innerHTML = `<div class="error">❌ ${data.error}</div>`;
      return;
    }

    resultsDiv.innerHTML = `
      <div class="card">
        <h2><span class="icon">🌤️</span> Weather Data</h2>
        <div class="data-row"><span class="data-label">City</span><span class="data-value">${data.city}</span></div>
        <div class="data-row"><span class="data-label">Temperature</span><span class="data-value temperature">${data.temperature}°C</span></div>
        <div class="data-row"><span class="data-label">Humidity</span><span class="data-value">${data.humidity}%</span></div>
        <div class="data-row"><span class="data-label">Description</span><span class="data-value">${data.description}</span></div>
      </div>`;
  }

  function displayMap(data) {
    if (data.error) {
      resultsDiv.innerHTML = `<div class="error">❌ ${data.error}</div>`;
      return;
    }

    resultsDiv.innerHTML = `
      <div class="card">
        <h2><span class="icon">🗺️</span> Location Data</h2>
        <div class="data-row"><span class="data-label">Latitude</span><span class="data-value">${data.latitude}</span></div>
        <div class="data-row"><span class="data-label">Longitude</span><span class="data-value">${data.longitude}</span></div>
        <div class="data-row"><span class="data-label">Location</span><span class="data-value">${data.display_name}</span></div>
      </div>`;
  }

  function displayBoth(data) {
    let html = '';

    if (data.weather && !data.weather.error) {
      html += `
        <div class="card">
          <h2><span class="icon">🌤️</span> Weather Data</h2>
          <div class="data-row"><span class="data-label">City</span><span class="data-value">${data.weather.city}</span></div>
          <div class="data-row"><span class="data-label">Temperature</span><span class="data-value temperature">${data.weather.temperature}°C</span></div>
          <div class="data-row"><span class="data-label">Humidity</span><span class="data-value">${data.weather.humidity}%</span></div>
          <div class="data-row"><span class="data-label">Description</span><span class="data-value">${data.weather.description}</span></div>
        </div>`;
    }

    if (data.coordinates && !data.coordinates.error) {
      html += `
        <div class="card">
          <h2><span class="icon">🗺️</span> Location Data</h2>
          <div class="data-row"><span class="data-label">Latitude</span><span class="data-value">${data.coordinates.latitude}</span></div>
          <div class="data-row"><span class="data-label">Longitude</span><span class="data-value">${data.coordinates.longitude}</span></div>
          <div class="data-row"><span class="data-label">Location</span><span class="data-value">${data.coordinates.display_name}</span></div>
        </div>`;
    }

    resultsDiv.innerHTML = html || `<div class="error">❌ No data available</div>`;
  }

  function displayError(message) {
    resultsDiv.innerHTML = `<div class="error">❌ ${message}</div>`;
  }

  // Event listeners
  document.querySelector('.btn-weather').addEventListener('click', fetchWeather);
  document.querySelector('.btn-map').addEventListener('click', fetchMap);
  document.querySelector('.btn-both').addEventListener('click', fetchBoth);
  locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') fetchBoth();
  });
});