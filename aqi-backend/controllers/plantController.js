// Plant Controller - Handle plant recommendation requests

const Plant = require('../models/Plant');

/**
 * Get plant recommendations based on pollutant type
 * @route GET /api/plants/recommend?pollutant=PM2.5&limit=5
 */
exports.getRecommendations = async (req, res) => {
  try {
    const { pollutant, limit = 5 } = req.query;

    if (!pollutant) {
      return res.status(400).json({
        error: 'Pollutant parameter is required',
        availablePollutants: ['PM2.5', 'PM10', 'CO2', 'Benzene', 'Formaldehyde', 'Trichloroethylene', 'Xylene', 'Ammonia', 'Toluene', 'VOC']
      });
    }

    console.log(`🌱 Fetching plant recommendations for pollutant: ${pollutant}`);

    // Find plants that reduce the specified pollutant
    const plants = await Plant.findByPollutant(pollutant, parseInt(limit));

    if (plants.length === 0) {
      return res.status(404).json({
        error: `No plants found for pollutant: ${pollutant}`,
        message: 'Try a different pollutant type'
      });
    }

    res.json({
      success: true,
      pollutant,
      count: plants.length,
      recommendations: plants.map(plant => ({
        plantName: plant.plantName,
        scientificName: plant.scientificName,
        efficiency: plant.efficiency,
        pollutantsReduced: plant.pollutantsReduced,
        careDifficulty: plant.careDifficulty,
        lightRequirement: plant.lightRequirement,
        waterRequirement: plant.waterRequirement,
        size: plant.size,
        compatibility: plant.compatibility,
        recommendationScore: plant.recommendationScore,
        benefits: plant.benefits,
        description: plant.description,
        imageUrl: plant.imageUrl
      }))
    });

  } catch (error) {
    console.error('❌ Error in getRecommendations:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch plant recommendations'
    });
  }
};

/**
 * Get all active plants
 * @route GET /api/plants
 */
exports.getAllPlants = async (req, res) => {
  try {
    const { sort = 'recommendationScore', order = 'desc', limit = 20 } = req.query;

    console.log('🌿 Fetching all plants');

    const sortOrder = order === 'asc' ? 1 : -1;
    
    const plants = await Plant.find({ isActive: true })
      .sort({ [sort]: sortOrder })
      .limit(parseInt(limit))
      .select('-__v -createdAt -updatedAt')
      .lean();

    res.json({
      success: true,
      count: plants.length,
      data: plants
    });

  } catch (error) {
    console.error('❌ Error in getAllPlants:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch plants'
    });
  }
};

/**
 * Get plant by ID
 * @route GET /api/plants/:id
 */
exports.getPlantById = async (req, res) => {
  try {
    const { id } = req.params;

    const plant = await Plant.findById(id).select('-__v');

    if (!plant) {
      return res.status(404).json({
        error: 'Plant not found'
      });
    }

    res.json({
      success: true,
      data: plant
    });

  } catch (error) {
    console.error('❌ Error in getPlantById:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch plant'
    });
  }
};

/**
 * Get top recommended plants (highest recommendation scores)
 * @route GET /api/plants/top
 */
exports.getTopPlants = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    console.log(`⭐ Fetching top ${limit} plants`);

    const plants = await Plant.getTopRecommended(parseInt(limit));

    res.json({
      success: true,
      count: plants.length,
      data: plants
    });

  } catch (error) {
    console.error('❌ Error in getTopPlants:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch top plants'
    });
  }
};

/**
 * Get plants by care difficulty
 * @route GET /api/plants/care/:difficulty
 */
exports.getPlantsByCareDifficulty = async (req, res) => {
  try {
    const { difficulty } = req.params;
    const { limit = 20 } = req.query;

    const validDifficulties = ['Easy', 'Moderate', 'Difficult'];
    
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        error: 'Invalid care difficulty',
        validOptions: validDifficulties
      });
    }

    const plants = await Plant.find({ 
      careDifficulty: difficulty,
      isActive: true 
    })
    .sort({ recommendationScore: -1 })
    .limit(parseInt(limit))
    .select('-__v -createdAt -updatedAt')
    .lean();

    res.json({
      success: true,
      careDifficulty: difficulty,
      count: plants.length,
      data: plants
    });

  } catch (error) {
    console.error('❌ Error in getPlantsByCareDifficulty:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch plants by care difficulty'
    });
  }
};

/**
 * Get pet-safe plants
 * @route GET /api/plants/pet-safe
 */
exports.getPetSafePlants = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    console.log('🐾 Fetching pet-safe plants');

    const plants = await Plant.find({
      'compatibility.petSafe': true,
      isActive: true
    })
    .sort({ recommendationScore: -1 })
    .limit(parseInt(limit))
    .select('-__v -createdAt -updatedAt')
    .lean();

    res.json({
      success: true,
      count: plants.length,
      data: plants
    });

  } catch (error) {
    console.error('❌ Error in getPetSafePlants:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to fetch pet-safe plants'
    });
  }
};

/**
 * Search plants by name
 * @route GET /api/plants/search?q=spider
 */
exports.searchPlants = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        error: 'Search query must be at least 2 characters'
      });
    }

    console.log(`🔍 Searching plants for: ${q}`);

    const plants = await Plant.find({
      $or: [
        { plantName: { $regex: new RegExp(q, 'i') } },
        { scientificName: { $regex: new RegExp(q, 'i') } },
        { description: { $regex: new RegExp(q, 'i') } }
      ],
      isActive: true
    })
    .sort({ recommendationScore: -1 })
    .limit(parseInt(limit))
    .select('-__v -createdAt -updatedAt')
    .lean();

    res.json({
      success: true,
      query: q,
      count: plants.length,
      data: plants
    });

  } catch (error) {
    console.error('❌ Error in searchPlants:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to search plants'
    });
  }
};

/**
 * Get plants by multiple criteria
 * @route POST /api/plants/filter
 */
exports.filterPlants = async (req, res) => {
  try {
    const {
      pollutants = [],
      careDifficulty,
      petSafe,
      childSafe,
      size,
      lightRequirement,
      minEfficiency,
      limit = 20
    } = req.body;

    console.log('🔍 Filtering plants with criteria:', req.body);

    // Build query
    const query = { isActive: true };

    if (pollutants.length > 0) {
      query.pollutantsReduced = { $in: pollutants };
    }

    if (careDifficulty) {
      query.careDifficulty = careDifficulty;
    }

    if (petSafe !== undefined) {
      query['compatibility.petSafe'] = petSafe;
    }

    if (childSafe !== undefined) {
      query['compatibility.childSafe'] = childSafe;
    }

    if (size) {
      query.size = size;
    }

    if (lightRequirement) {
      query.lightRequirement = lightRequirement;
    }

    if (minEfficiency) {
      query.efficiency = { $gte: parseInt(minEfficiency) };
    }

    const plants = await Plant.find(query)
      .sort({ recommendationScore: -1 })
      .limit(parseInt(limit))
      .select('-__v -createdAt -updatedAt')
      .lean();

    res.json({
      success: true,
      criteria: req.body,
      count: plants.length,
      data: plants
    });

  } catch (error) {
    console.error('❌ Error in filterPlants:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to filter plants'
    });
  }
};
