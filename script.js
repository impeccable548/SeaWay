<script>
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 5 + 2 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            document.body.appendChild(particle);
        }
    </script>

    <div class="container">
        <div class="header">
            <div class="logo">
                <div class="logo-icon">🌊</div>
                <div class="logo-text">
                    <span class="logo-wave">S</span><span class="logo-wave">e</span><span class="logo-wave">a</span><span class="logo-wave">W</span><span class="logo-wave">a</span><span class="logo-wave">y</span>
                </div>
            </div>
            <div class="ocean-waves">
                <div class="wave"></div>
                <div class="wave"></div>
            </div>
            <h1>Weather & Location Portal</h1>
            <p>Real-time weather data and coordinates at your fingertips</p>
        </div>

        <div class="controls">
            <div class="input-group">
                <input type="text" id="locationInput" placeholder="Enter city or location (e.g., Lagos, New York)" value="Lagos">
            </div>
            <div class="button-group">
                <button class="btn-weather" onclick="fetchWeather()">
                    <span>🌤️ Get Weather</span>
                </button>
                <button class="btn-map" onclick="fetchMap()">
                    <span>🗺️ Get Coordinates</span>
                </button>
                <button class="btn-both" onclick="fetchBoth()">
                    <span>⚡ Get Both</span>
                </button>
            </div>
        </div>

        <div id="loadingDiv" style="display: none;" class="loading">
            ⏳ Loading data...
        </div>

        <div id="resultsDiv" class="results"></div>
    </div>

    <script>
        const API_BASE = 'https://seaway-backend.onrender.com';

        function showLoading() {
            document.getElementById('loadingDiv').style.display = 'block';
            document.getElementById('resultsDiv').innerHTML = '';
        }

        function hideLoading() {
            document.getElementById('loadingDiv').style.display = 'none';
        }

        async function fetchWeather() {
            const location = document.getElementById('locationInput').value.trim() || 'Lagos';
            showLoading();

            try {
                const response = await fetch(`${API_BASE}/weather?city=${encodeURIComponent(location)}`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
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
            const location = document.getElementById('locationInput').value.trim() || 'Lagos';
            showLoading();

            try {
                const response = await fetch(`${API_BASE}/map?location=${encodeURIComponent(location)}`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
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
            const location = document.getElementById('locationInput').value.trim() || 'Lagos';
            showLoading();

            try {
                const response = await fetch(`${API_BASE}/weather-map?location=${encodeURIComponent(location)}`);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
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
            const resultsDiv = document.getElementById('resultsDiv');
            
            if (data.error) {
                resultsDiv.innerHTML = `<div class="error">❌ ${data.error}</div>`;
                return;
            }

            resultsDiv.innerHTML = `
                <div class="card">
                    <h2><span class="icon">🌤️</span> Weather Data</h2>
                    <div class="data-row">
                        <span class="data-label">City</span>
                        <span class="data-value">${data.city || 'N/A'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Temperature</span>
                        <span class="data-value temperature">${data.temperature !== undefined ? data.temperature + '°C' : 'N/A'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Humidity</span>
                        <span class="data-value">${data.humidity !== undefined ? data.humidity + '%' : 'N/A'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Description</span>
                        <span class="data-value">${data.description || 'N/A'}</span>
                    </div>
                </div>
            `;
        }

        function displayMap(data) {
            const resultsDiv = document.getElementById('resultsDiv');
            
            if (data.error) {
                resultsDiv.innerHTML = `<div class="error">❌ ${data.error}</div>`;
                return;
            }

            resultsDiv.innerHTML = `
                <div class="card">
                    <h2><span class="icon">🗺️</span> Location Data</h2>
                    <div class="data-row">
                        <span class="data-label">Latitude</span>
                        <span class="data-value">${data.latitude || 'N/A'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Longitude</span>
                        <span class="data-value">${data.longitude || 'N/A'}</span>
                    </div>
                    <div class="data-row">
                        <span class="data-label">Location</span>
                        <span class="data-value" style="font-size: 0.9rem;">${data.display_name || 'N/A'}</span>
                    </div>
                </div>
            `;
        }

        function displayBoth(data) {
            const resultsDiv = document.getElementById('resultsDiv');
            
            if (data.weather && data.weather.error && data.coordinates && data.coordinates.error) {
                resultsDiv.innerHTML = `<div class="error">❌ Failed to fetch data for this location</div>`;
                return;
            }

            let html = '';

            if (data.weather && !data.weather.error) {
                html += `
                    <div class="card">
                        <h2><span class="icon">🌤️</span> Weather Data</h2>
                        <div class="data-row">
                            <span class="data-label">City</span>
                            <span class="data-value">${data.weather.city || 'N/A'}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Temperature</span>
                            <span class="data-value temperature">${data.weather.temperature !== undefined ? data.weather.temperature + '°C' : 'N/A'}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Humidity</span>
                            <span class="data-value">${data.weather.humidity !== undefined ? data.weather.humidity + '%' : 'N/A'}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Description</span>
                            <span class="data-value">${data.weather.description || 'N/A'}</span>
                        </div>
                    </div>
                `;
            }

            if (data.coordinates && !data.coordinates.error) {
                html += `
                    <div class="card">
                        <h2><span class="icon">🗺️</span> Location Data</h2>
                        <div class="data-row">
                            <span class="data-label">Latitude</span>
                            <span class="data-value">${data.coordinates.latitude || 'N/A'}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Longitude</span>
                            <span class="data-value">${data.coordinates.longitude || 'N/A'}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Location</span>
                            <span class="data-value" style="font-size: 0.9rem;">${data.coordinates.display_name || 'N/A'}</span>
                        </div>
                    </div>
                `;
            }

            resultsDiv.innerHTML = html || `<div class="error">❌ No data available</div>`;
        }

        function displayError(message) {
            const resultsDiv = document.getElementById('resultsDiv');
            resultsDiv.innerHTML = `<div class="error">❌ ${message}</div>`;
        }

        // Allow Enter key to trigger search
        document.getElementById('locationInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                fetchBoth();
            }
        });
    </script>
</body>
</html>