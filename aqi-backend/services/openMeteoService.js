// Open-Meteo Service - Fetch historical pollution data from Open-Meteo Air Quality API

const axios = require('axios');

class OpenMeteoService {
  constructor() {
    this.baseURL = process.env.OPEN_METEO_BASE_URL || 'https://air-quality-api.open-meteo.com/v1';
  }

  /**
   * Convert PM2.5 to AQI using EPA standard breakpoints
   * @param {number} pm25 - PM2.5 concentration (μg/m³)
   * @returns {number} AQI value
   */
  convertPM25ToAQI(pm25) {
    const breakpoints = [
      { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },      // Good
      { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },   // Moderate
      { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },  // Unhealthy SG
      { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 }, // Unhealthy
      { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 }, // Very Unhealthy
      { cLow: 250.5, cHigh: 500.0, iLow: 301, iHigh: 500 }  // Hazardous
    ];

    // Find the appropriate breakpoint
    for (const bp of breakpoints) {
      if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
        // EPA AQI formula: I = [(IHigh - ILow) / (CHigh - CLow)] * (C - CLow) + ILow
        const aqi = ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (pm25 - bp.cLow) + bp.iLow;
        return Math.round(aqi);
      }
    }

    // If above 500, return 500 (hazardous)
    if (pm25 > 500) return 500;
    
    // If below range, use simplified formula
    return Math.round(Math.min(500, Math.max(0, pm25 * 2.1)));
  }

  /**
   * Fetch historical pollution data
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @param {number} pastDays - Number of past days (default: 30)
   * @returns {Promise<Array>} Array of daily pollution data
   */
  async fetchHistoricalPollution(lat, lon, pastDays = 30) {
    try {
      console.log(`📡 Fetching historical pollution data for: ${lat}, ${lon} (past ${pastDays} days)`);
      
      const response = await axios.get(`${this.baseURL}/air-quality`, {
        params: {
          latitude: lat,
          longitude: lon,
          hourly: 'pm10,pm2_5,nitrogen_dioxide,sulphur_dioxide,ozone,carbon_monoxide',
          past_days: pastDays,
          timezone: 'auto'
        },
        timeout: 15000
      });

      if (!response.data || !response.data.hourly) {
        throw new Error('No historical data available from Open-Meteo');
      }

      const data = response.data;
      console.log(`✅ Received ${data.hourly.time.length} hours of pollution data`);

      // Process hourly data into daily averages
      const dailyData = this.processToDailyAverages(data.hourly);
      
      console.log(`✅ Processed ${dailyData.length} days of historical data`);
      return dailyData;

    } catch (error) {
      if (error.response) {
        console.error(`❌ Open-Meteo API error (${error.response.status}):`, error.response.data);
        throw new Error(`Open-Meteo API returned ${error.response.status}`);
      } else if (error.request) {
        console.error('❌ Open-Meteo API no response:', error.message);
        throw new Error('No response from Open-Meteo API');
      } else {
        console.error('❌ Error fetching historical pollution:', error.message);
        throw error;
      }
    }
  }

  /**
   * Process hourly data into daily averages
   * @param {Object} hourlyData - Hourly pollution data
   * @returns {Array} Array of daily pollution data
   */
  processToDailyAverages(hourlyData) {
    const dailyData = {};

    hourlyData.time.forEach((timestamp, index) => {
      const date = timestamp.split('T')[0]; // Extract date (YYYY-MM-DD)
      
      const pm25 = hourlyData.pm2_5?.[index] || 0;
      const pm10 = hourlyData.pm10?.[index] || 0;
      const no2 = hourlyData.nitrogen_dioxide?.[index] || 0;
      const so2 = hourlyData.sulphur_dioxide?.[index] || 0;
      const o3 = hourlyData.ozone?.[index] || 0;
      const co = hourlyData.carbon_monoxide?.[index] || 0;

      if (!dailyData[date]) {
        dailyData[date] = {
          pm25: [],
          pm10: [],
          no2: [],
          so2: [],
          o3: [],
          co: []
        };
      }

      dailyData[date].pm25.push(pm25);
      dailyData[date].pm10.push(pm10);
      dailyData[date].no2.push(no2);
      dailyData[date].so2.push(so2);
      dailyData[date].o3.push(o3);
      dailyData[date].co.push(co);
    });

    // Calculate daily averages and convert to AQI
    const historicalDataset = [];

    Object.keys(dailyData).sort().forEach(date => {
      const dayData = dailyData[date];
      
      // Calculate average for each pollutant
      const avgPM25 = this.calculateAverage(dayData.pm25);
      const avgPM10 = this.calculateAverage(dayData.pm10);
      const avgNO2 = this.calculateAverage(dayData.no2);
      const avgSO2 = this.calculateAverage(dayData.so2);
      const avgO3 = this.calculateAverage(dayData.o3);
      const avgCO = this.calculateAverage(dayData.co);
      
      // Convert PM2.5 to AQI
      const estimatedAQI = this.convertPM25ToAQI(avgPM25);
      
      // Determine dominant pollutant
      const dominantPollutant = this.getDominantPollutant({
        pm25: avgPM25,
        pm10: avgPM10,
        no2: avgNO2,
        so2: avgSO2,
        o3: avgO3,
        co: avgCO
      });

      historicalDataset.push({
        date: new Date(date),
        aqi: Math.round(estimatedAQI),
        pollutants: {
          pm25: Math.round(avgPM25 * 10) / 10,
          pm10: Math.round(avgPM10 * 10) / 10,
          no2: Math.round(avgNO2 * 10) / 10,
          so2: Math.round(avgSO2 * 10) / 10,
          o3: Math.round(avgO3 * 10) / 10,
          co: Math.round(avgCO * 10) / 10
        },
        dominantPollutant: dominantPollutant
      });
    });

    return historicalDataset;
  }

  /**
   * Calculate average of an array, ignoring zero values
   * @param {Array<number>} values - Array of values
   * @returns {number} Average value
   */
  calculateAverage(values) {
    const nonZeroValues = values.filter(v => v > 0);
    if (nonZeroValues.length === 0) return 0;
    return nonZeroValues.reduce((sum, val) => sum + val, 0) / nonZeroValues.length;
  }

  /**
   * Determine the dominant pollutant
   * @param {Object} pollutants - Object with pollutant values
   * @returns {string} Dominant pollutant name
   */
  getDominantPollutant(pollutants) {
    // Normalize pollutants to AQI scale for comparison
    const normalized = {
      pm25: this.convertPM25ToAQI(pollutants.pm25),
      pm10: this.convertPM25ToAQI(pollutants.pm10 * 0.6), // Approximate conversion
      no2: pollutants.no2 * 0.5,
      so2: pollutants.so2 * 0.4,
      o3: pollutants.o3 * 0.6,
      co: pollutants.co * 0.01
    };

    let maxPollutant = 'pm25';
    let maxValue = normalized.pm25;

    for (const [pollutant, value] of Object.entries(normalized)) {
      if (value > maxValue) {
        maxValue = value;
        maxPollutant = pollutant;
      }
    }

    return maxPollutant;
  }

  /**
   * Fetch current air quality forecast
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @param {number} forecastDays - Number of forecast days
   * @returns {Promise<Array>} Array of forecast data
   */
  async fetchAirQualityForecast(lat, lon, forecastDays = 7) {
    try {
      console.log(`📡 Fetching air quality forecast for: ${lat}, ${lon} (${forecastDays} days)`);
      
      const response = await axios.get(`${this.baseURL}/air-quality`, {
        params: {
          latitude: lat,
          longitude: lon,
          hourly: 'pm10,pm2_5,ozone',
          forecast_days: forecastDays,
          timezone: 'auto'
        },
        timeout: 15000
      });

      if (!response.data || !response.data.hourly) {
        throw new Error('No forecast data available');
      }

      const dailyForecast = this.processToDailyAverages(response.data.hourly);
      console.log(`✅ Processed ${dailyForecast.length} days of forecast data`);
      
      return dailyForecast;

    } catch (error) {
      console.error('❌ Error fetching air quality forecast:', error.message);
      throw error;
    }
  }

  /**
   * Get AQI category from AQI value
   * @param {number} aqi - AQI value
   * @returns {string} AQI category
   */
  getAQICategory(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }
}

module.exports = new OpenMeteoService();
