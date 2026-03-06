// WAQI Service - Fetch real-time AQI data from World Air Quality Index API

const axios = require('axios');

class WAQIService {
  constructor() {
    this.baseURL = process.env.WAQI_BASE_URL || 'https://api.waqi.info';
    this.apiKey = process.env.WAQI_API_KEY;
    
    if (!this.apiKey) {
      console.warn('⚠️ WAQI_API_KEY not found in environment variables');
      console.warn(`   Available env vars: PORT=${process.env.PORT}, MONGODB_URI=${process.env.MONGODB_URI ? 'set' : 'not set'}`);
      console.warn(`   WAQI_BASE_URL=${process.env.WAQI_BASE_URL ? 'set' : 'not set'}`);
    } else {
      console.log('✅ WAQI_API_KEY initialized in constructor');
    }
  }

  /**
   * Fetch current AQI data for a city
   * @param {string} city - City name
   * @returns {Promise<Object>} AQI data object
   */
  async fetchCurrentAQI(city) {
    try {
      console.log(`📡 Fetching AQI data for: ${city}`);
      console.log(`   🔑 API Key: ${this.apiKey ? '✅ Present (' + this.apiKey.substring(0, 8) + '...' + this.apiKey.substring(this.apiKey.length - 4) + ')' : '❌ Missing'}`);
      
      if (!this.apiKey) {
        throw new Error('WAQI API key is not configured. Please set WAQI_API_KEY in .env');
      }
      
      const response = await axios.get(
        `${this.baseURL}/feed/${encodeURIComponent(city)}/`,
        {
          params: { token: this.apiKey },
          timeout: 10000
        }
      );

      if (response.data.status !== 'ok') {
        throw new Error(`WAQI API error: ${response.data.data || 'Unknown error'}`);
      }

      const data = response.data.data;
      
      // Parse and structure the response
      const aqiData = {
        aqi: data.aqi || 0,
        city: data.city?.name || city,
        country: data.city?.country || '',
        latitude: data.city?.geo?.[0] || 0,
        longitude: data.city?.geo?.[1] || 0,
        timestamp: data.time?.iso || new Date().toISOString(),
        pollutants: {
          pm25: data.iaqi?.pm25?.v || null,
          pm10: data.iaqi?.pm10?.v || null,
          o3: data.iaqi?.o3?.v || null,
          no2: data.iaqi?.no2?.v || null,
          co: data.iaqi?.co?.v || null,
          so2: data.iaqi?.so2?.v || null
        },
        dominantPollutant: this.normalizePollutant(data.dominentpol || 'unknown'),
        station: {
          name: data.city?.name,
          url: data.city?.url
        },
        attribution: data.attributions || []
      };

      console.log(`✅ AQI data fetched successfully: ${aqiData.city} - AQI: ${aqiData.aqi}`);
      return aqiData;

    } catch (error) {
      if (error.response) {
        console.error(`❌ WAQI API error (${error.response.status}):`, error.response.data);
        throw new Error(`WAQI API returned ${error.response.status}: ${error.response.statusText}`);
      } else if (error.request) {
        console.error('❌ WAQI API no response:', error.message);
        throw new Error('No response from WAQI API. Please check your internet connection.');
      } else {
        console.error('❌ Error fetching AQI:', error.message);
        throw error;
      }
    }
  }

  /**
   * Fetch AQI data by coordinates
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise<Object>} AQI data object
   */
  async fetchAQIByCoordinates(lat, lon) {
    try {
      console.log(`📡 Fetching AQI data for coordinates: ${lat}, ${lon}`);
      
      const response = await axios.get(
        `${this.baseURL}/feed/geo:${lat};${lon}/`,
        {
          params: { token: this.apiKey },
          timeout: 10000
        }
      );

      if (response.data.status !== 'ok') {
        throw new Error(`WAQI API error: ${response.data.data || 'Unknown error'}`);
      }

      const data = response.data.data;
      
      const aqiData = {
        aqi: data.aqi || 0,
        city: data.city?.name || 'Unknown',
        country: data.city?.country || '',
        latitude: data.city?.geo?.[0] || lat,
        longitude: data.city?.geo?.[1] || lon,
        timestamp: data.time?.iso || new Date().toISOString(),
        pollutants: {
          pm25: data.iaqi?.pm25?.v || null,
          pm10: data.iaqi?.pm10?.v || null,
          o3: data.iaqi?.o3?.v || null,
          no2: data.iaqi?.no2?.v || null,
          co: data.iaqi?.co?.v || null,
          so2: data.iaqi?.so2?.v || null
        },
        dominantPollutant: this.normalizePollutant(data.dominentpol || 'unknown')
      };

      console.log(`✅ AQI data fetched by coordinates: ${aqiData.city} - AQI: ${aqiData.aqi}`);
      return aqiData;

    } catch (error) {
      console.error('❌ Error fetching AQI by coordinates:', error.message);
      throw error;
    }
  }

  /**
   * Search for cities
   * @param {string} query - Search query
   * @returns {Promise<Array>} Array of city suggestions
   */
  async searchCities(query) {
    try {
      const response = await axios.get(
        `${this.baseURL}/search/`,
        {
          params: { 
            token: this.apiKey,
            keyword: query
          },
          timeout: 10000
        }
      );

      if (response.data.status !== 'ok') {
        return [];
      }

      return response.data.data.map(station => ({
        uid: station.uid,
        name: station.station.name,
        aqi: station.aqi,
        coordinates: {
          lat: station.lat,
          lon: station.lon
        }
      }));

    } catch (error) {
      console.error('❌ Error searching cities:', error.message);
      return [];
    }
  }

  /**
   * Normalize pollutant names to standard format
   * @param {string} pollutant - Raw pollutant name
   * @returns {string} Normalized pollutant name
   */
  normalizePollutant(pollutant) {
    const mapping = {
      'pm25': 'pm25',
      'pm2.5': 'pm25',
      'pm10': 'pm10',
      'o3': 'o3',
      'ozone': 'o3',
      'no2': 'no2',
      'so2': 'so2',
      'co': 'co'
    };

    return mapping[pollutant.toLowerCase()] || 'unknown';
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

  /**
   * Get health recommendations based on AQI
   * @param {number} aqi - AQI value
   * @returns {Array<string>} Health recommendations
   */
  getHealthRecommendations(aqi) {
    if (aqi <= 50) {
      return [
        'Air quality is satisfactory',
        'Outdoor activities are safe',
        'No special precautions needed'
      ];
    } else if (aqi <= 100) {
      return [
        'Air quality is acceptable',
        'Sensitive individuals should consider limiting prolonged outdoor exertion',
        'Everyone else can enjoy outdoor activities'
      ];
    } else if (aqi <= 150) {
      return [
        'Sensitive groups should reduce prolonged outdoor exertion',
        'Everyone else should limit prolonged outdoor exertion',
        'Consider wearing a mask if sensitive'
      ];
    } else if (aqi <= 200) {
      return [
        'Everyone should avoid prolonged outdoor exertion',
        'Sensitive groups should avoid all outdoor exertion',
        'Wear N95 mask when outdoors',
        'Keep windows closed'
      ];
    } else if (aqi <= 300) {
      return [
        'Everyone should avoid all outdoor exertion',
        'Stay indoors if possible',
        'Wear N95 mask if going outside',
        'Use air purifiers indoors',
        'Limit ventilation from outside'
      ];
    } else {
      return [
        'Health alert: everyone may experience serious effects',
        'Remain indoors and keep activity levels low',
        'Use air purifiers with HEPA filters',
        'Seal windows and doors',
        'Seek medical attention if experiencing symptoms'
      ];
    }
  }
}

module.exports = new WAQIService();
