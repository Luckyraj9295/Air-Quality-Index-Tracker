// Exposure Risk Controller - Calculate pollution exposure risk

/**
 * Calculate pollution exposure risk
 * @route POST /api/exposure-risk
 */
exports.calculateRisk = async (req, res) => {
  try {
    const {
      aqi,
      exposureTime, // in hours
      dominantPollutant,
      age,
      hasRespiratoryConditions = false,
      hasHeartConditions = false,
      isPregnant = false,
      activityLevel = 'moderate' // low, moderate, high
    } = req.body;

    // Validation
    if (!aqi || !exposureTime) {
      return res.status(400).json({
        error: 'AQI and exposure time are required',
        example: {
          aqi: 150,
          exposureTime: 8,
          dominantPollutant: 'PM2.5',
          age: 30,
          hasRespiratoryConditions: false,
          hasHeartConditions: false,
          isPregnant: false,
          activityLevel: 'moderate'
        }
      });
    }

    console.log(`⚠️ Calculating exposure risk - AQI: ${aqi}, Time: ${exposureTime}h`);

    // Calculate base risk
    const baseRisk = this.calculateBaseRisk(aqi, exposureTime);

    // Calculate pollutant-specific risk
    const pollutantRisk = this.calculatePollutantRisk(dominantPollutant, aqi);

    // Calculate vulnerability factor
    const vulnerabilityFactor = this.calculateVulnerabilityFactor({
      age,
      hasRespiratoryConditions,
      hasHeartConditions,
      isPregnant
    });

    // Calculate activity multiplier
    const activityMultiplier = this.getActivityMultiplier(activityLevel);

    // Calculate total risk score (0-100)
    const totalRiskScore = Math.min(100, 
      (baseRisk * vulnerabilityFactor * activityMultiplier) + pollutantRisk
    );

    // Determine risk level
    const riskLevel = this.getRiskLevel(totalRiskScore);
    const riskCategory = this.getRiskCategory(totalRiskScore);

    // Generate health recommendations
    const recommendations = this.getHealthRecommendations({
      aqi,
      totalRiskScore,
      dominantPollutant,
      hasRespiratoryConditions,
      hasHeartConditions,
      isPregnant,
      activityLevel
    });

    // Calculate safe exposure time
    const safeExposureTime = this.calculateSafeExposureTime(aqi, vulnerabilityFactor);

    // Calculate health impact
    const healthImpact = this.calculateHealthImpact({
      aqi,
      exposureTime,
      totalRiskScore,
      dominantPollutant
    });

    res.json({
      success: true,
      exposureAnalysis: {
        totalRiskScore: Math.round(totalRiskScore),
        riskLevel,
        riskCategory,
        baseRisk: Math.round(baseRisk),
        vulnerabilityFactor: vulnerabilityFactor.toFixed(2),
        activityMultiplier: activityMultiplier.toFixed(2)
      },
      inputData: {
        aqi,
        exposureTime,
        dominantPollutant: dominantPollutant || 'Unknown',
        age: age || 'Not specified',
        conditions: {
          respiratory: hasRespiratoryConditions,
          heart: hasHeartConditions,
          pregnant: isPregnant
        },
        activityLevel
      },
      safeExposureTime: {
        hours: safeExposureTime,
        exceeded: exposureTime > safeExposureTime,
        message: exposureTime > safeExposureTime
          ? `Recommended safe exposure time exceeded by ${(exposureTime - safeExposureTime).toFixed(1)} hours`
          : `Within safe exposure limits`
      },
      healthImpact,
      recommendations,
      calculatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in calculateRisk:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to calculate exposure risk'
    });
  }
};

/**
 * Get risk assessment for a city
 * @route GET /api/exposure-risk/:city
 */
exports.getCityRiskAssessment = async (req, res) => {
  try {
    const { city } = req.params;
    const { exposureTime = 8 } = req.query;

    if (!city) {
      return res.status(400).json({
        error: 'City parameter is required'
      });
    }

    console.log(`🌍 Getting risk assessment for city: ${city}`);

    // Import services here to avoid circular dependencies
    const waqiService = require('../services/waqiService');

    // Fetch current AQI
    const aqiData = await waqiService.fetchCurrentAQI(city);

    // Calculate base risk for general population
    const baseRisk = this.calculateBaseRisk(aqiData.aqi, parseFloat(exposureTime));
    const riskLevel = this.getRiskLevel(baseRisk);

    // Risk for different population groups
    const populationRisks = {
      general: {
        riskScore: Math.round(baseRisk),
        riskLevel: this.getRiskLevel(baseRisk)
      },
      children: {
        riskScore: Math.round(baseRisk * 1.5),
        riskLevel: this.getRiskLevel(baseRisk * 1.5)
      },
      elderly: {
        riskScore: Math.round(baseRisk * 1.6),
        riskLevel: this.getRiskLevel(baseRisk * 1.6)
      },
      sensitiveGroups: {
        riskScore: Math.round(baseRisk * 2.0),
        riskLevel: this.getRiskLevel(baseRisk * 2.0)
      }
    };

    res.json({
      success: true,
      city: aqiData.city,
      currentAQI: aqiData.aqi,
      category: waqiService.getAQICategory(aqiData.aqi),
      dominantPollutant: aqiData.dominantPollutant,
      exposureTime: parseFloat(exposureTime),
      populationRisks,
      recommendations: waqiService.getHealthRecommendations(aqiData.aqi),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in getCityRiskAssessment:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to get city risk assessment'
    });
  }
};

// Helper functions

/**
 * Calculate base risk from AQI and exposure time
 */
exports.calculateBaseRisk = (aqi, exposureTime) => {
  // AQI risk factor (0-500 scale mapped to 0-100)
  const aqiRiskFactor = Math.min(100, (aqi / 500) * 100);

  // Exposure time risk factor (exponential - longer exposure = higher risk)
  const exposureRiskFactor = Math.min(100, exposureTime * 5);

  // Combined base risk (weighted average)
  const baseRisk = (aqiRiskFactor * 0.7) + (exposureRiskFactor * 0.3);

  return baseRisk;
};

/**
 * Calculate pollutant-specific risk
 */
exports.calculatePollutantRisk = (pollutant, aqi) => {
  if (!pollutant) return 0;

  const pollutantRiskFactors = {
    'PM2.5': 1.5,    // Most dangerous - fine particulate matter
    'PM10': 1.2,     // Coarse particulate matter
    'O3': 1.3,       // Ozone
    'NO2': 1.1,      // Nitrogen dioxide
    'SO2': 1.2,      // Sulfur dioxide
    'CO': 1.0        // Carbon monoxide
  };

  const normalizedPollutant = pollutant.toUpperCase().replace(/\./g, '');
  const factor = pollutantRiskFactors[normalizedPollutant] || 1.0;

  return (aqi / 500) * 20 * factor; // Additional risk based on pollutant type
};

/**
 * Calculate vulnerability factor based on health conditions
 */
exports.calculateVulnerabilityFactor = (conditions) => {
  let factor = 1.0;

  // Age factor
  if (conditions.age) {
    if (conditions.age < 5 || conditions.age > 65) {
      factor *= 1.5; // Children and elderly more vulnerable
    } else if (conditions.age < 12 || conditions.age > 55) {
      factor *= 1.3;
    }
  }

  // Health conditions
  if (conditions.hasRespiratoryConditions) {
    factor *= 1.8; // Significant increase for respiratory issues
  }

  if (conditions.hasHeartConditions) {
    factor *= 1.6;
  }

  if (conditions.isPregnant) {
    factor *= 1.4;
  }

  return factor;
};

/**
 * Get activity level multiplier
 */
exports.getActivityMultiplier = (activityLevel) => {
  const multipliers = {
    'low': 0.8,      // Sedentary, indoor
    'moderate': 1.0,  // Normal daily activities
    'high': 1.5       // Outdoor exercise, heavy exertion
  };

  return multipliers[activityLevel] || 1.0;
};

/**
 * Determine risk level from score
 */
exports.getRiskLevel = (score) => {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Moderate';
  if (score >= 20) return 'Low';
  return 'Minimal';
};

/**
 * Get risk category description
 */
exports.getRiskCategory = (score) => {
  if (score >= 80) return 'Hazardous - Avoid outdoor exposure';
  if (score >= 60) return 'Unhealthy - Limit outdoor activities';
  if (score >= 40) return 'Moderate Risk - Sensitive groups should be cautious';
  if (score >= 20) return 'Low Risk - Safe for most people';
  return 'Minimal Risk - Safe for all';
};

/**
 * Calculate safe exposure time
 */
exports.calculateSafeExposureTime = (aqi, vulnerabilityFactor) => {
  // Base safe exposure time (hours) inversely proportional to AQI
  let safeTime = 24 * (1 - (aqi / 500));

  // Adjust for vulnerability
  safeTime = safeTime / vulnerabilityFactor;

  // AQI-specific recommendations
  if (aqi <= 50) safeTime = 24;        // Good - unlimited
  else if (aqi <= 100) safeTime = 16;  // Moderate
  else if (aqi <= 150) safeTime = 8;   // Unhealthy for SG
  else if (aqi <= 200) safeTime = 4;   // Unhealthy
  else if (aqi <= 300) safeTime = 2;   // Very Unhealthy
  else safeTime = 0.5;                 // Hazardous

  // Apply vulnerability adjustment
  safeTime = safeTime / vulnerabilityFactor;

  return Math.max(0.5, Math.round(safeTime * 10) / 10);
};

/**
 * Calculate health impact
 */
exports.calculateHealthImpact = (data) => {
  const { aqi, exposureTime, totalRiskScore, dominantPollutant } = data;

  const impacts = {
    respiratory: this.getRespiratoryImpact(aqi, exposureTime),
    cardiovascular: this.getCardiovascularImpact(aqi, exposureTime),
    eyes: this.getEyesImpact(aqi),
    skin: this.getSkinImpact(aqi),
    overall: this.getOverallImpact(totalRiskScore)
  };

  return {
    ...impacts,
    dominantPollutantEffects: this.getPollutantEffects(dominantPollutant)
  };
};

exports.getRespiratoryImpact = (aqi, exposureTime) => {
  const impact = (aqi / 100) * (exposureTime / 8);
  if (impact >= 3) return 'Severe - Difficulty breathing, coughing, wheezing likely';
  if (impact >= 2) return 'Moderate - May experience irritation, shortness of breath';
  if (impact >= 1) return 'Mild - Slight irritation possible';
  return 'Minimal - No significant effects expected';
};

exports.getCardiovascularImpact = (aqi, exposureTime) => {
  const impact = (aqi / 120) * (exposureTime / 8);
  if (impact >= 2.5) return 'High - Increased heart rate, blood pressure elevation';
  if (impact >= 1.5) return 'Moderate - Possible cardiovascular stress';
  if (impact >= 0.8) return 'Low - Minor effects possible';
  return 'Minimal - No significant effects expected';
};

exports.getEyesImpact = (aqi) => {
  if (aqi >= 200) return 'Severe irritation, watering, redness';
  if (aqi >= 150) return 'Moderate irritation, discomfort';
  if (aqi >= 100) return 'Mild irritation possible';
  return 'No significant effects';
};

exports.getSkinImpact = (aqi) => {
  if (aqi >= 200) return 'Possible skin irritation, dryness';
  if (aqi >= 150) return 'Mild skin sensitivity possible';
  return 'No significant effects';
};

exports.getOverallImpact = (riskScore) => {
  if (riskScore >= 80) return 'Severe health effects likely - immediate action required';
  if (riskScore >= 60) return 'Significant health effects possible - take precautions';
  if (riskScore >= 40) return 'Moderate effects - monitor symptoms';
  if (riskScore >= 20) return 'Minor effects - be aware';
  return 'Minimal effects expected';
};

exports.getPollutantEffects = (pollutant) => {
  const effects = {
    'PM2.5': 'Penetrates deep into lungs and bloodstream. Can cause heart attacks, strokes, and lung disease.',
    'PM10': 'Causes respiratory irritation and inflammation. Aggravates asthma and lung conditions.',
    'O3': 'Damages airways, triggers asthma attacks, reduces lung function.',
    'NO2': 'Irritates airways, increases respiratory infections, aggravates asthma.',
    'SO2': 'Causes breathing difficulties, especially for asthmatics. Irritates eyes and throat.',
    'CO': 'Reduces oxygen delivery to organs. Can cause dizziness, confusion, and heart problems.'
  };

  const normalized = pollutant ? pollutant.toUpperCase().replace(/\./g, '') : 'UNKNOWN';
  return effects[normalized] || 'Pollutant-specific effects not available';
};

/**
 * Get health recommendations based on risk profile
 */
exports.getHealthRecommendations = (profile) => {
  const recommendations = [];

  // AQI-based recommendations
  if (profile.aqi >= 200) {
    recommendations.push('🚨 Stay indoors with windows closed');
    recommendations.push('⚠️ Avoid all outdoor physical activities');
    recommendations.push('😷 Wear N95 mask if you must go outside');
    recommendations.push('🏃 Use air purifiers indoors');
  } else if (profile.aqi >= 150) {
    recommendations.push('🏠 Limit outdoor time to essential activities only');
    recommendations.push('😷 Wear mask when outdoors');
    recommendations.push('🚫 Avoid strenuous outdoor activities');
  } else if (profile.aqi >= 100) {
    recommendations.push('👥 Sensitive groups should limit prolonged outdoor activities');
    recommendations.push('🏃 Reduce prolonged or heavy outdoor exertion');
    recommendations.push('😷 Consider wearing mask during outdoor activities');
  }

  // Condition-specific recommendations
  if (profile.hasRespiratoryConditions) {
    recommendations.push('💊 Keep rescue medications readily available');
    recommendations.push('🏥 Monitor symptoms closely and seek medical help if worsening');
  }

  if (profile.hasHeartConditions) {
    recommendations.push('❤️ Avoid strenuous activities - take it easy');
    recommendations.push('📞 Contact doctor if experiencing chest pain or discomfort');
  }

  if (profile.isPregnant) {
    recommendations.push('🤰 Take extra precautions - stay indoors when possible');
    recommendations.push('👶 Minimize outdoor exposure for fetal health');
  }

  // Activity-specific recommendations
  if (profile.activityLevel === 'high') {
    recommendations.push('🏋️ Consider moving workout indoors');
    recommendations.push('⏰ Schedule outdoor activities during lower pollution hours (early morning)');
  }

  // General recommendations
  recommendations.push('💧 Stay hydrated');
  recommendations.push('🍎 Eat antioxidant-rich foods (fruits and vegetables)');
  recommendations.push('🌱 Consider indoor air-purifying plants');

  return recommendations;
};
