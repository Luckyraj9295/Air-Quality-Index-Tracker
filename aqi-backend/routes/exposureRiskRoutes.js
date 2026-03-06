// Exposure Risk Routes

const express = require('express');
const router = express.Router();
const exposureRiskController = require('../controllers/exposureRiskController');

/**
 * @route   POST /api/exposure-risk
 * @desc    Calculate pollution exposure risk
 * @access  Public
 * @body    { 
 *            aqi: number, 
 *            exposureTime: number, 
 *            dominantPollutant: string,
 *            age: number,
 *            hasRespiratoryConditions: boolean,
 *            hasHeartConditions: boolean,
 *            isPregnant: boolean,
 *            activityLevel: 'low' | 'moderate' | 'high'
 *          }
 */
router.post('/', exposureRiskController.calculateRisk);

/**
 * @route   GET /api/exposure-risk/:city
 * @desc    Get risk assessment for a city
 * @access  Public
 * @param   city - City name
 * @query   exposureTime - Expected exposure time in hours (default: 8)
 */
router.get('/:city', exposureRiskController.getCityRiskAssessment);

module.exports = router;
