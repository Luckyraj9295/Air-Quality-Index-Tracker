// AQI Routes

const express = require('express');
const router = express.Router();
const aqiController = require('../controllers/aqiController');

/**
 * @route   GET /api/aqi/:city
 * @desc    Get current AQI data for a city
 * @access  Public
 */
router.get('/:city', aqiController.getCurrentAQI);

/**
 * @route   GET /api/aqi/coordinates/:lat/:lon
 * @desc    Get AQI by coordinates
 * @access  Public
 */
router.get('/coordinates/:lat/:lon', aqiController.getAQIByCoordinates);

/**
 * @route   GET /api/aqi/history/:city
 * @desc    Get historical AQI data from database
 * @access  Public
 * @query   days - Number of days of history (default: 30)
 */
router.get('/history/:city', aqiController.getHistoricalAQI);

/**
 * @route   GET /api/aqi/pollution-history/:lat/:lon
 * @desc    Get historical pollution data from Open-Meteo
 * @access  Public
 * @query   days - Number of days of history (default: 30)
 */
router.get('/pollution-history/:lat/:lon', aqiController.getPollutionHistory);

/**
 * @route   GET /api/aqi/statistics/:city
 * @desc    Get AQI statistics for a city
 * @access  Public
 * @query   days - Number of days to analyze (default: 30)
 */
router.get('/statistics/:city', aqiController.getAQIStatistics);

/**
 * @route   POST /api/aqi/store
 * @desc    Store current AQI data in database
 * @access  Public
 * @body    { city: string }
 */
router.post('/store', aqiController.storeAQI);

module.exports = router;
