// Prediction Service - Linear Regression AQI Forecasting

const AQIHistory = require('../models/AQIHistory');

class PredictionService {
  constructor() {
    this.minHistoricalDays = parseInt(process.env.MIN_HISTORICAL_DAYS) || 15;
    this.predictionDays = parseInt(process.env.PREDICTION_DAYS) || 30;
  }

  /**
   * Generate AQI predictions using linear regression
   * @param {string} city - City name
   * @param {number} days - Number of days to predict (default: 30)
   * @returns {Promise<Object>} Prediction results with model info
   */
  async generatePredictions(city, days = this.predictionDays) {
    try {
      console.log(`📊 Generating predictions for ${city}...`);

      // Fetch historical data from database
      const historicalData = await this.getHistoricalData(city);

      if (historicalData.length < this.minHistoricalDays) {
        throw new Error(
          `Insufficient historical data. Need at least ${this.minHistoricalDays} days, ` +
          `found ${historicalData.length} days.`
        );
      }

      console.log(`📈 Training model on ${historicalData.length} days of historical data`);

      // Train linear regression model
      const model = this.trainLinearRegression(historicalData);

      // Generate realistic predictions using trend + noise + smoothing + bounds
      const predictions = this.predictFuture(model, days, historicalData);

      console.log(`✅ Generated ${predictions.length} days of predictions`);

      return {
        success: true,
        city: city,
        historicalDays: historicalData.length,
        predictionDays: predictions.length,
        model: {
          slope: model.slope,
          intercept: model.intercept,
          r2: model.r2,
          accuracy: this.getAccuracyLabel(model.r2, historicalData.length)
        },
        predictions,
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Error generating predictions:', error.message);
      throw error;
    }
  }

  /**
   * Get historical AQI data from database
   * @param {string} city - City name
   * @param {number} days - Number of days to retrieve
   * @returns {Promise<Array>} Array of historical AQI data
   */
  async getHistoricalData(city, days = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const historicalData = await AQIHistory.find({
        city: { $regex: new RegExp(city, 'i') },
        date: { $gte: cutoffDate }
      })
      .sort({ date: 1 })
      .lean()
      .exec();

      return historicalData.map(record => ({
        date: record.date,
        aqi: record.aqi,
        pollutants: record.pollutants,
        dominantPollutant: record.dominantPollutant
      }));

    } catch (error) {
      console.error('❌ Error fetching historical data:', error.message);
      throw error;
    }
  }

  /**
   * Train linear regression model on historical data
   * @param {Array} data - Historical AQI data points
   * @returns {Object} Trained model with slope, intercept, and R²
   */
  trainLinearRegression(data) {
    const n = data.length;
    
    // Create x (day index) and y (AQI) arrays
    const x = Array.from({ length: n }, (_, i) => i);
    const y = data.map(d => d.aqi);

    // Calculate sums needed for linear regression
    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
    const sumY2 = y.reduce((sum, val) => sum + val * val, 0);

    // Calculate slope (m) and intercept (b)
    // Formula: slope = (n*Σxy - Σx*Σy) / (n*Σx² - (Σx)²)
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    // Formula: intercept = (Σy - slope*Σx) / n
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R² (coefficient of determination)
    const yMean = sumY / n;
    const ssTot = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
    const ssRes = y.reduce((sum, val, i) => {
      const predicted = slope * x[i] + intercept;
      return sum + Math.pow(val - predicted, 2);
    }, 0);
    const r2 = 1 - (ssRes / ssTot);

    console.log(`📐 Model trained - Slope: ${slope.toFixed(3)}, Intercept: ${intercept.toFixed(2)}, R²: ${r2.toFixed(3)}`);

    return {
      slope: parseFloat(slope.toFixed(3)),
      intercept: parseFloat(intercept.toFixed(2)),
      r2: parseFloat(r2.toFixed(3)),
      dataPoints: n
    };
  }

  /**
   * Generate future predictions using trained model
   * @param {Object} model - Trained linear regression model
   * @param {number} days - Number of days to predict
   * @param {Array} historicalData - Historical data for context
   * @returns {Array} Array of predictions
   */
  predictFuture(model, days, historicalData) {
    const predictions = [];
    const n = historicalData.length;
    const lastDate = new Date(historicalData[n - 1].date);
    const lastKnownAQI = historicalData[n - 1].aqi;

    for (let i = 1; i <= days; i++) {
      const dayIndex = n + i;

      // 1) Linear regression trend
      const regression = model.slope * dayIndex + model.intercept;

      // 2) Random variation (+/- 10 around trend)
      const variation = (Math.random() - 0.5) * 20;
      const withNoise = regression + variation;

      // 3) Moving-average style smoothing against last known AQI
      let predictedAQI = (0.7 * withNoise) + (0.3 * lastKnownAQI);

      // 4) Clamp to realistic AQI bounds
      predictedAQI = Math.max(50, Math.min(350, predictedAQI));

      const predictionDate = new Date(lastDate);
      predictionDate.setDate(predictionDate.getDate() + i);

      const roundedAQI = Math.round(predictedAQI);

      predictions.push({
        date: predictionDate.toISOString().split('T')[0],
        aqi: roundedAQI,
        confidence: this.calculateConfidence(model.r2, i),
        category: this.getAQICategory(roundedAQI),
        isDangerous: roundedAQI > 150
      });
    }

    return predictions;
  }

  /**
   * Calculate prediction confidence based on R² and days ahead
   * @param {number} r2 - R² value from model
   * @param {number} daysAhead - Number of days ahead
   * @returns {string} Confidence level
   */
  calculateConfidence(r2, daysAhead) {
    let confidence = r2 * 100;
    
    // Reduce confidence for predictions further in the future
    const decayFactor = Math.exp(-daysAhead / 30); // Exponential decay
    confidence *= decayFactor;

    if (confidence >= 75) return 'High';
    if (confidence >= 50) return 'Medium';
    if (confidence >= 25) return 'Low';
    return 'Very Low';
  }

  /**
   * Get accuracy label based on R² and data points
   * @param {number} r2 - R² value
   * @param {number} dataPoints - Number of data points used
   * @returns {string} Accuracy label
   */
  getAccuracyLabel(r2, dataPoints) {
    if (dataPoints >= 25 && r2 >= 0.7) return 'Excellent';
    if (dataPoints >= 15 && r2 >= 0.5) return 'Good';
    if (dataPoints >= 10 && r2 >= 0.3) return 'Fair';
    return 'Limited';
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
   * Get day of year (1-365)
   * @param {Date} date - Date object
   * @returns {number} Day of year
   */
  getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }

  /**
   * Get dangerous days from predictions
   * @param {Array} predictions - Array of predictions
   * @param {number} threshold - AQI threshold for "dangerous" (default: 150)
   * @returns {Array} Array of dangerous days
   */
  getDangerousDays(predictions, threshold = 150) {
    return predictions.filter(pred => pred.aqi > threshold);
  }

  /**
   * Get prediction statistics
   * @param {Array} predictions - Array of predictions
   * @returns {Object} Statistics object
   */
  getPredictionStatistics(predictions) {
    const aqiValues = predictions.map(p => p.aqi);
    
    return {
      min: Math.min(...aqiValues),
      max: Math.max(...aqiValues),
      average: Math.round(aqiValues.reduce((sum, val) => sum + val, 0) / aqiValues.length),
      dangerousDays: this.getDangerousDays(predictions).length,
      trend: predictions[predictions.length - 1].aqi > predictions[0].aqi ? 'Increasing' : 'Decreasing'
    };
  }
}

module.exports = new PredictionService();
