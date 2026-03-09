// Plant Model - Air purifying plants database

const mongoose = require('mongoose');

const PlantSchema = new mongoose.Schema({
  // Plant identification
  plantName: {
    type: String,
    required: [true, 'Plant name is required'],
    unique: true,
    trim: true,
    index: true
  },
  
  scientificName: {
    type: String,
    trim: true
  },
  
  // Pollutants this plant can reduce
  pollutantsReduced: {
    type: [String],
    required: [true, 'Pollutants reduced is required'],
    enum: ['PM2.5', 'PM10', 'CO2', 'Benzene', 'Formaldehyde', 'Trichloroethylene', 'Xylene', 'Ammonia', 'Toluene', 'VOC'],
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'At least one pollutant must be specified'
    }
  },
  
  // Efficiency rating (1-10 scale)
  efficiency: {
    type: Number,
    required: [true, 'Efficiency rating is required'],
    min: 1,
    max: 10,
    default: 5
  },
  
  // Care difficulty (Easy, Moderate, Difficult)
  careDifficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Difficult'],
    default: 'Moderate'
  },
  
  // Light requirements
  lightRequirement: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Variable'],
    default: 'Medium'
  },
  
  // Water requirements
  waterRequirement: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  
  // Plant size
  size: {
    type: String,
    enum: ['Small', 'Medium', 'Large'],
    default: 'Medium'
  },
  
  // Compatibility (pet-friendly, child-friendly)
  compatibility: {
    petSafe: {
      type: Boolean,
      default: true
    },
    childSafe: {
      type: Boolean,
      default: true
    }
  },
  
  // Side effects or warnings
  sideEffects: {
    type: [String],
    default: []
  },
  
  // Benefits
  benefits: {
    type: [String],
    default: []
  },
  
  // Description
  description: {
    type: String,
    trim: true
  },
  
  // Care instructions
  careInstructions: {
    type: String,
    trim: true
  },
  
  // Image URL
  imageUrl: {
    type: String,
    trim: true
  },
  
  // Recommendation score (calculated field)
  recommendationScore: {
    type: Number,
    default: 0
  },
  
  // Active status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient pollutant-based queries
PlantSchema.index({ pollutantsReduced: 1, efficiency: -1 });
PlantSchema.index({ recommendationScore: -1 });

// Static method to find plants by pollutant
PlantSchema.statics.findByPollutant = async function(pollutant, limit = 10) {
  return this.find({
    pollutantsReduced: { $in: [pollutant.toUpperCase()] },
    isActive: true
  })
  .sort({ efficiency: -1, recommendationScore: -1 })
  .limit(limit);
};

// Static method to get top recommended plants
PlantSchema.statics.getTopRecommended = async function(limit = 15) {
  return this.find({ isActive: true })
    .sort({ recommendationScore: -1, efficiency: -1 })
    .limit(limit);
};

// Instance method to calculate recommendation score
PlantSchema.methods.calculateRecommendationScore = function() {
  let score = this.efficiency * 10; // Base score from efficiency
  
  // Bonus for easy care
  if (this.careDifficulty === 'Easy') score += 15;
  if (this.careDifficulty === 'Moderate') score += 5;
  
  // Bonus for safety
  if (this.compatibility.petSafe) score += 10;
  if (this.compatibility.childSafe) score += 10;
  
  // Bonus for multiple pollutants
  score += this.pollutantsReduced.length * 3;
  
  // Penalty for side effects
  score -= this.sideEffects.length * 5;
  
  return Math.max(0, Math.min(100, score)); // Normalize to 0-100
};

// Pre-save middleware to calculate recommendation score
PlantSchema.pre('save', function() {
  this.recommendationScore = this.calculateRecommendationScore();
});

// Virtual for display name
PlantSchema.virtual('displayName').get(function() {
  return this.scientificName 
    ? `${this.plantName} (${this.scientificName})`
    : this.plantName;
});

// Ensure virtuals are included in JSON
PlantSchema.set('toJSON', { virtuals: true });
PlantSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Plant', PlantSchema);
