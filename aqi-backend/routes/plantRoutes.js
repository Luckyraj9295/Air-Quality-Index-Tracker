// Plant Routes

const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');

/**
 * @route   GET /api/plants
 * @desc    Get all active plants
 * @access  Public
 * @query   sort - Field to sort by (default: recommendationScore)
 * @query   order - Sort order: asc/desc (default: desc)
 * @query   limit - Max results (default: 20)
 */
router.get('/', plantController.getAllPlants);

/**
 * @route   GET /api/plants/recommend
 * @desc    Get plant recommendations based on pollutant type
 * @access  Public
 * @query   pollutant - Pollutant type (PM2.5, PM10, CO2, etc.)
 * @query   limit - Max results (default: 5)
 */
router.get('/recommend', plantController.getRecommendations);

/**
 * @route   GET /api/plants/top
 * @desc    Get top recommended plants
 * @access  Public
 * @query   limit - Max results (default: 10)
 */
router.get('/top', plantController.getTopPlants);

/**
 * @route   GET /api/plants/pet-safe
 * @desc    Get pet-safe plants
 * @access  Public
 * @query   limit - Max results (default: 20)
 */
router.get('/pet-safe', plantController.getPetSafePlants);

/**
 * @route   GET /api/plants/search
 * @desc    Search plants by name
 * @access  Public
 * @query   q - Search query (min 2 characters)
 * @query   limit - Max results (default: 20)
 */
router.get('/search', plantController.searchPlants);

/**
 * @route   GET /api/plants/care/:difficulty
 * @desc    Get plants by care difficulty
 * @access  Public
 * @param   difficulty - Easy, Moderate, or Difficult
 * @query   limit - Max results (default: 20)
 */
router.get('/care/:difficulty', plantController.getPlantsByCareDifficulty);

/**
 * @route   GET /api/plants/:id
 * @desc    Get plant by ID
 * @access  Public
 * @param   id - Plant MongoDB ObjectId
 */
router.get('/:id', plantController.getPlantById);

/**
 * @route   POST /api/plants/filter
 * @desc    Filter plants by multiple criteria
 * @access  Public
 * @body    { pollutants[], careDifficulty, petSafe, childSafe, size, lightRequirement, minEfficiency, limit }
 */
router.post('/filter', plantController.filterPlants);

module.exports = router;
