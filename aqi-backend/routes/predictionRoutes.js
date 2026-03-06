// Prediction Routes

const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

/**
 * @route   GET /api/prediction/:city
 * @desc    Generate AQI predictions for a city
 * @access  Public
 * @param   city - City name
 * @query   days - Number of days to predict (1-90, default: 30)
 */
router.get('/:city', predictionController.getPredictions);

/**
 * @route   GET /api/prediction/:city/stats
 * @desc    Get prediction statistics for a city
 * @access  Public
 * @param   city - City name
 * @query   days - Number of days to predict (1-90, default: 30)
 */
router.get('/:city/stats', predictionController.getPredictionStats);

/**
 * @route   GET /api/prediction/:city/dangerous-days
 * @desc    Get dangerous days from predictions
 * @access  Public
 * @param   city - City name
 * @query   days - Number of days to predict (1-90, default: 30)
 * @query   threshold - AQI threshold for dangerous (default: 150)
 */
router.get('/:city/dangerous-days', predictionController.getDangerousDays);

/**
 * @route   GET /api/prediction/:city/accuracy
 * @desc    Get prediction accuracy metrics
 * @access  Public
 * @param   city - City name
 */
router.get('/:city/accuracy', predictionController.getAccuracyMetrics);

/**
 * @route   POST /api/prediction/compare
 * @desc    Compare predictions for multiple cities
 * @access  Public
 * @body    { cities: string[], days: number }
 */
router.post('/compare', predictionController.comparePredictions);

module.exports = router;
