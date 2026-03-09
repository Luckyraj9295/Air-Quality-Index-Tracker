// AQI History Model - Stores historical air quality data

const mongoose = require('mongoose');

const AQIHistorySchema = new mongoose.Schema({
  // Location information
  city: {
    type: String,
    required: [true, 'City name is required'],
    trim: true,
    index: true
  },
  country: {
    type: String,
    trim: true
  },
  latitude: {
    type: Number,
    required: [true, 'Latitude is required']
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required']
  },
  
  // Air Quality Index
  aqi: {
    type: Number,
    required: [true, 'AQI value is required'],
    min: 0,
    max: 500
  },
  
  // Pollutant measurements (μg/m³)
  pollutants: {
    pm25: {
      type: Number,
      default: null
    },
    pm10: {
      type: Number,
      default: null
    },
    o3: {
      type: Number,
      default: null
    },
    no2: {
      type: Number,
      default: null
    },
    so2: {
      type: Number,
      default: null
    },
    co: {
      type: Number,
      default: null
    }
  },
  
  // Dominant pollutant
  dominantPollutant: {
    type: String,
    enum: ['pm25', 'pm10', 'o3', 'no2', 'so2', 'co', 'unknown'],
    default: 'unknown'
  },
  
  // AQI category
  category: {
    type: String,
    enum: ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous'],
    required: true
  },
  
  // Date of measurement
  date: {
    type: Date,
    required: [true, 'Date is required'],
    index: true
  },
  
  // Metadata
  source: {
    type: String,
    default: 'WAQI',
    enum: ['WAQI', 'Open-Meteo', 'Manual']
  },
  
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
AQIHistorySchema.index({ city: 1, date: -1 });
AQIHistorySchema.index({ latitude: 1, longitude: 1, date: -1 });

// Static method to get AQI category from AQI value
AQIHistorySchema.statics.getAQICategory = function(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

// Instance method to calculate health impact score
AQIHistorySchema.methods.getHealthImpactScore = function() {
  const weights = {
    pm25: 0.8,
    pm10: 0.7,
    o3: 0.6,
    no2: 0.65,
    so2: 0.7,
    co: 0.5
  };
  
  let totalImpact = 0;
  let count = 0;
  
  for (const [pollutant, value] of Object.entries(this.pollutants)) {
    if (value !== null && value > 0) {
      totalImpact += value * (weights[pollutant] || 0.5);
      count++;
    }
  }
  
  return count > 0 ? Math.round(totalImpact / count) : 0;
};

// Pre-save middleware to set category
AQIHistorySchema.pre('save', function() {
  if (this.isModified('aqi')) {
    this.category = this.constructor.getAQICategory(this.aqi);
  }
  this.lastUpdated = Date.now();
});

// Virtual for formatted date
AQIHistorySchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Ensure virtuals are included in JSON
AQIHistorySchema.set('toJSON', { virtuals: true });
AQIHistorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('AQIHistory', AQIHistorySchema);
