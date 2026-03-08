// Dashboard Module for updating UI

const Dashboard = {
  // Update all dashboard elements
  updateDashboard: async (data) => {
    Dashboard.updateAQIDisplay(data);
    await Dashboard.updatePollutants(data);
    Dashboard.updateLocationInfo(data);

    // Keep exposure-risk section in sync with every new AQI payload.
    if (typeof ExposureRisk !== 'undefined' && typeof ExposureRisk.updateFromAQIData === 'function') {
      ExposureRisk.updateFromAQIData(data);
    }
    
    // Automatically collect historical AQI data for predictions
    if (data.aqi !== undefined && data.city) {
      // Note: AQI data is already stored to MongoDB by API.getAQI() or API.getAQIByCoordinates()
      // No need to store again here to avoid duplicates
      
      // Update history and regenerate forecast for the same city
      Prediction.collectHistoricalAQI(data.aqi, data.city).then(() => {
        // Wait for history collection to complete before generating forecast
        Prediction.generateAndDisplayForecast('aqi', data.city);
      });
    }
  },

  // Update main AQI display
  updateAQIDisplay: (data) => {
    const { category, class: aqiClass } = Utils.getAQICategory(data.aqi);
    
    // Update AQI value
    document.getElementById('aqiValue').textContent = data.aqi;
    document.getElementById('aqiLabel').textContent = 'AQI';
    
    // Update circle styling
    const circle = document.getElementById('aqiCircle');
    circle.className = `aqi-circle ${aqiClass}`;
    
    // Update category and description
    document.getElementById('aqiCategory').textContent = category;
    document.getElementById('aqiDescription').textContent = Utils.getHealthWarning(data.aqi);
  },

  // Update pollutant cards
  updatePollutants: async (data) => {
    let pollutants = data.pollutants || {};
    
    console.log(`📊 Dashboard pollutants from current data:`, pollutants);
    
    // If we don't have pollutants from live data, try to fetch from MongoDB
    const hasValidPollutants = Object.values(pollutants).some(v => v !== null && v !== undefined);
    if (!hasValidPollutants && data.city) {
      console.log(`⚠️ No pollutant data in live response, fetching from MongoDB...`);
      try {
        const response = await fetch(
          `http://localhost:5001/api/aqi/history/${encodeURIComponent(data.city)}?days=1`
        );
        if (response.ok) {
          const result = await response.json();
          const latestRecord = Array.isArray(result?.data) && result.data.length > 0 ? result.data[result.data.length - 1] : null;
          if (latestRecord?.pollutants) {
            pollutants = latestRecord.pollutants;
            console.log(`✅ Loaded pollutants from MongoDB:`, pollutants);
          }
        }
      } catch (err) {
        console.warn('Could not fetch pollutants from MongoDB:', err.message);
      }
    }
    
    const pollutantMap = {
      'pm25Value': pollutants.pm25,
      'pm10Value': pollutants.pm10,
      'o3Value': pollutants.o3,
      'no2Value': pollutants.no2,
      'coValue': pollutants.co,
      'so2Value': pollutants.so2
    };

    for (const [elementId, value] of Object.entries(pollutantMap)) {
      const element = document.getElementById(elementId);
      if (element) {
        const displayValue = value !== null && value !== undefined ? Math.round(value) : '--';
        element.textContent = displayValue;
        console.log(`  ✓ ${elementId}: ${displayValue}`);
      } else {
        console.warn(`  ⚠️ Element not found: ${elementId}`);
      }
    }
  },

  // Update location information
  updateLocationInfo: (data) => {
    const locationName = document.getElementById('locationName');
    const locationTime = document.getElementById('locationTime');
    
    if (locationName) {
      locationName.textContent = data.city || 'Unknown Location';
    }
    
    if (locationTime) {
      locationTime.textContent = `Last updated: ${Utils.formatTime(new Date(data.timestamp))}`;
    }
  }
};
