// Plant Data Seeding Script
// Seeds the database with air-purifying plant data

require('dotenv').config();
const mongoose = require('mongoose');
const Plant = require('../models/Plant');
const connectDB = require('../config/db');

// Air-purifying plants data
const plantsData = [
  {
    plantName: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    pollutantsReduced: ['Formaldehyde', 'Benzene', 'Trichloroethylene', 'Xylene', 'Toluene'],
    efficiency: 9,
    careDifficulty: 'Easy',
    lightRequirement: 'Low',
    waterRequirement: 'Low - Water every 2-3 weeks',
    size: 'Medium',
    compatibility: {
      petSafe: false,
      childSafe: true
    },
    sideEffects: ['Toxic to cats and dogs if ingested'],
    benefits: ['Releases oxygen at night', 'Extremely low maintenance', 'Tolerates neglect'],
    description: 'One of the best air-purifying plants that converts CO2 to oxygen at night. Perfect for bedrooms.',
    careInstructions: 'Prefers indirect light but tolerates low light. Water sparingly, allowing soil to dry between waterings. Avoid overwatering.',
    imageUrl: '/images/plants/snake-plant.jpg',
    isActive: true
  },
  {
    plantName: 'Spider Plant',
    scientificName: 'Chlorophytum comosum',
    pollutantsReduced: ['Formaldehyde', 'Xylene', 'Toluene', 'CO2'],
    efficiency: 8,
    careDifficulty: 'Easy',
    lightRequirement: 'Medium',
    waterRequirement: 'Moderate - Water 2-3 times per week',
    size: 'Small',
    compatibility: {
      petSafe: true,
      childSafe: true
    },
    sideEffects: [],
    benefits: ['Safe for pets', 'Easy to propagate', 'Removes 90% of formaldehyde'],
    description: 'Safe for pets and highly effective at removing formaldehyde from the air.',
    careInstructions: 'Thrives in indirect bright light. Keep soil moist but not waterlogged. Produces baby plants that can be propagated.',
    imageUrl: '/images/plants/spider-plant.jpg',
    isActive: true
  },
  {
    plantName: 'Peace Lily',
    scientificName: 'Spathiphyllum',
    pollutantsReduced: ['Ammonia', 'Benzene', 'Formaldehyde', 'Trichloroethylene', 'Xylene'],
    efficiency: 10,
    careDifficulty: 'Easy',
    lightRequirement: 'Low',
    waterRequirement: 'Moderate - Water when soil feels dry',
    size: 'Medium',
    compatibility: {
      petSafe: false,
      childSafe: false
    },
    sideEffects: ['Toxic to pets and humans if ingested', 'May cause skin irritation'],
    benefits: ['Removes mold spores', 'Beautiful white flowers', 'Indicates when it needs water'],
    description: 'Top-rated NASA air purifier. Removes ammonia, formaldehyde, and other VOCs.',
    careInstructions: 'Prefers shade or indirect light. Water when leaves start to droop. Mist leaves occasionally.',
    imageUrl: '/images/plants/peace-lily.jpg',
    isActive: true
  },
  {
    plantName: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    pollutantsReduced: ['Formaldehyde', 'Benzene'],
    efficiency: 7,
    careDifficulty: 'Easy',
    lightRequirement: 'High',
    waterRequirement: 'Low - Water every 2-3 weeks',
    size: 'Small',
    compatibility: {
      petSafe: false,
      childSafe: true
    },
    sideEffects: ['Mildly toxic to pets'],
    benefits: ['Medicinal gel for burns', 'Low maintenance', 'Drought tolerant'],
    description: 'Purifies air while providing medicinal benefits. Great for sunny spots.',
    careInstructions: 'Needs bright, direct sunlight. Water deeply but infrequently. Well-draining soil essential.',
    imageUrl: '/images/plants/aloe-vera.jpg',
    isActive: true
  },
  {
    plantName: 'Boston Fern',
    scientificName: 'Nephrolepis exaltata',
    pollutantsReduced: ['Formaldehyde', 'Xylene', 'Toluene'],
    efficiency: 9,
    careDifficulty: 'Moderate',
    lightRequirement: 'Medium',
    waterRequirement: 'High - Keep soil consistently moist',
    size: 'Medium',
    compatibility: {
      petSafe: true,
      childSafe: true
    },
    sideEffects: [],
    benefits: ['Natural humidifier', 'Safe for pets and children', 'Removes formaldehyde effectively'],
    description: 'Acts as a natural humidifier while removing formaldehyde. Perfect for bathrooms.',
    careInstructions: 'Requires high humidity and consistent moisture. Mist daily in dry climates. Indirect bright light.',
    imageUrl: '/images/plants/boston-fern.jpg',
    isActive: true
  },
  {
    plantName: 'Bamboo Palm',
    scientificName: 'Chamaedorea seifrizii',
    pollutantsReduced: ['Formaldehyde', 'Benzene', 'Trichloroethylene', 'Xylene'],
    efficiency: 8,
    careDifficulty: 'Easy',
    lightRequirement: 'Medium',
    waterRequirement: 'Moderate - Water when top inch is dry',
    size: 'Large',
    compatibility: {
      petSafe: true,
      childSafe: true
    },
    sideEffects: [],
    benefits: ['Natural humidifier', 'Safe for pets', 'Adds tropical aesthetic'],
    description: 'NASA-approved air purifier that thrives indoors. Safe for pets.',
    careInstructions: 'Prefers bright, indirect light. Keep soil moist but not soggy. Tolerates low light.',
    imageUrl: '/images/plants/bamboo-palm.jpg',
    isActive: true
  },
  {
    plantName: 'Rubber Plant',
    scientificName: 'Ficus elastica',
    pollutantsReduced: ['Formaldehyde', 'CO2'],
    efficiency: 8,
    careDifficulty: 'Easy',
    lightRequirement: 'Medium',
    waterRequirement: 'Moderate - Water weekly',
    size: 'Large',
    compatibility: {
      petSafe: false,
      childSafe: false
    },
    sideEffects: ['Toxic to pets and children', 'Sap may cause skin irritation'],
    benefits: ['Fast-growing', 'Low maintenance', 'Excellent formaldehyde remover'],
    description: 'Powerful formaldehyde remover with attractive glossy leaves.',
    careInstructions: 'Bright indirect light preferred. Water when top 2 inches of soil are dry. Wipe leaves to remove dust.',
    imageUrl: '/images/plants/rubber-plant.jpg',
    isActive: true
  },
  {
    plantName: 'Areca Palm',
    scientificName: 'Dypsis lutescens',
    pollutantsReduced: ['Formaldehyde', 'Xylene', 'Toluene', 'CO2'],
    efficiency: 9,
    careDifficulty: 'Moderate',
    lightRequirement: 'High',
    waterRequirement: 'Moderate - Water regularly',
    size: 'Large',
    compatibility: {
      petSafe: true,
      childSafe: true
    },
    sideEffects: [],
    benefits: ['Excellent humidifier', 'Removes CO2 efficiently', 'Safe for pets'],
    description: 'Top-rated air purifier and humidifier. Releases moisture into the air.',
    careInstructions: 'Needs bright indirect light. Water when soil surface is dry. Mist regularly for humidity.',
    imageUrl: '/images/plants/areca-palm.jpg',
    isActive: true
  },
  {
    plantName: 'Dracaena',
    scientificName: 'Dracaena marginata',
    pollutantsReduced: ['Benzene', 'Formaldehyde', 'Trichloroethylene', 'Xylene'],
    efficiency: 9,
    careDifficulty: 'Easy',
    lightRequirement: 'Medium',
    waterRequirement: 'Low - Water every 1-2 weeks',
    size: 'Large',
    compatibility: {
      petSafe: false,
      childSafe: true
    },
    sideEffects: ['Toxic to cats and dogs'],
    benefits: ['Removes multiple toxins', 'Low maintenance', 'Stylish appearance'],
    description: 'Excellent at removing toxins from varnished wood and paint.',
    careInstructions: 'Tolerates low light but prefers indirect bright light. Allow soil to dry between waterings.',
    imageUrl: '/images/plants/dracaena.jpg',
    isActive: true
  },
  {
    plantName: 'English Ivy',
    scientificName: 'Hedera helix',
    pollutantsReduced: ['Formaldehyde', 'Benzene', 'Xylene', 'Toluene'],
    efficiency: 8,
    careDifficulty: 'Easy',
    lightRequirement: 'Medium',
    waterRequirement: 'Moderate - Keep soil moist',
    size: 'Small',
    compatibility: {
      petSafe: false,
      childSafe: false
    },
    sideEffects: ['Toxic to pets and children if ingested', 'May cause skin irritation'],
    benefits: ['Reduces airborne mold', 'Filters fecal particles', 'Easy to grow'],
    description: 'Proven to reduce airborne fecal matter and mold. Great for bathrooms.',
    careInstructions: 'Prefers bright indirect light. Keep soil moist but not soggy. Prune regularly.',
    imageUrl: '/images/plants/english-ivy.jpg',
    isActive: true
  },
  {
    plantName: 'Pothos',
    scientificName: 'Epipremnum aureum',
    pollutantsReduced: ['Formaldehyde', 'Benzene', 'Xylene', 'Toluene'],
    efficiency: 8,
    careDifficulty: 'Easy',
    lightRequirement: 'Low',
    waterRequirement: 'Low - Water when soil is dry',
    size: 'Medium',
    compatibility: {
      petSafe: false,
      childSafe: false
    },
    sideEffects: ['Toxic to pets and children'],
    benefits: ['Nearly impossible to kill', 'Grows in water or soil', 'Fast-growing'],
    description: 'One of the easiest plants to grow. Excellent for beginners.',
    careInstructions: 'Tolerates low light and neglect. Water when soil is completely dry. Prune to control growth.',
    imageUrl: '/images/plants/pothos.jpg',
    isActive: true
  },
  {
    plantName: 'Chrysanthemum',
    scientificName: 'Chrysanthemum morifolium',
    pollutantsReduced: ['Ammonia', 'Benzene', 'Formaldehyde', 'Xylene'],
    efficiency: 10,
    careDifficulty: 'Moderate',
    lightRequirement: 'High',
    waterRequirement: 'High - Water daily',
    size: 'Small',
    compatibility: {
      petSafe: false,
      childSafe: false
    },
    sideEffects: ['Toxic to pets', 'May cause skin allergies'],
    benefits: ['Beautiful flowers', 'Removes ammonia effectively', 'NASA-approved'],
    description: 'Top air purifier with colorful blooms. Filters out ammonia from cleaning products.',
    careInstructions: 'Needs bright direct light and frequent watering. Deadhead flowers regularly.',
    imageUrl: '/images/plants/chrysanthemum.jpg',
    isActive: true
  },
  {
    plantName: 'Gerbera Daisy',
    scientificName: 'Gerbera jamesonii',
    pollutantsReduced: ['Benzene', 'Trichloroethylene', 'Formaldehyde'],
    efficiency: 9,
    careDifficulty: 'Moderate',
    lightRequirement: 'High',
    waterRequirement: 'Moderate - Water regularly',
    size: 'Small',
    compatibility: {
      petSafe: true,
      childSafe: true
    },
    sideEffects: [],
    benefits: ['Beautiful colorful flowers', 'Releases oxygen at night', 'Safe for pets'],
    description: 'Colorful flowers that purify air and release oxygen at night.',
    careInstructions: 'Needs bright light and good air circulation. Keep soil moist but well-drained.',
    imageUrl: '/images/plants/gerbera-daisy.jpg',
    isActive: true
  },
  {
    plantName: 'Philodendron',
    scientificName: 'Philodendron hederaceum',
    pollutantsReduced: ['Formaldehyde', 'VOC'],
    efficiency: 7,
    careDifficulty: 'Easy',
    lightRequirement: 'Low',
    waterRequirement: 'Moderate - Water weekly',
    size: 'Medium',
    compatibility: {
      petSafe: false,
      childSafe: false
    },
    sideEffects: ['Toxic to pets and children'],
    benefits: ['Fast-growing', 'Tolerates neglect', 'Attractive foliage'],
    description: 'Heart-shaped leaves filter formaldehyde from the air.',
    careInstructions: 'Tolerates low light. Water when top inch of soil is dry. Easy to propagate.',
    imageUrl: '/images/plants/philodendron.jpg',
    isActive: true
  },
  {
    plantName: 'ZZ Plant',
    scientificName: 'Zamioculcas zamiifolia',
    pollutantsReduced: ['Benzene', 'Toluene', 'Xylene'],
    efficiency: 7,
    careDifficulty: 'Easy',
    lightRequirement: 'Low',
    waterRequirement: 'Low - Water every 2-3 weeks',
    size: 'Medium',
    compatibility: {
      petSafe: false,
      childSafe: false
    },
    sideEffects: ['Toxic if ingested'],
    benefits: ['Extremely drought-tolerant', 'Tolerates low light', 'Low maintenance'],
    description: 'Perfect for low-light areas and forgetful waterers.',
    careInstructions: 'Thrives in low light. Water sparingly - prefers dry soil. Very low maintenance.',
    imageUrl: '/images/plants/zz-plant.jpg',
    isActive: true
  }
];

/**
 * Seed plants data into database
 */
async function seedPlants() {
  try {
    console.log('🌱 Starting plant data seeding...\n');

    // Connect to database
    await connectDB();

    // Clear existing plants
    console.log('🗑️  Clearing existing plant data...');
    const deleteResult = await Plant.deleteMany({});
    console.log(`   Deleted ${deleteResult.deletedCount} existing records\n`);

    // Insert new plants
    console.log('📥 Inserting plant data...');
    const plants = await Plant.insertMany(plantsData);
    console.log(`✅ Successfully inserted ${plants.length} plants\n`);

    // Display summary
    console.log('📊 Seeding Summary:');
    console.log('='.repeat(60));
    
    plants.forEach((plant, index) => {
      console.log(`${index + 1}. ${plant.plantName} (${plant.scientificName})`);
      console.log(`   Efficiency: ${plant.efficiency}/10`);
      console.log(`   Removes: ${plant.pollutantsReduced.join(', ')}`);
      console.log(`   Pet Safe: ${plant.compatibility.petSafe ? '✅' : '❌'}`);
      console.log(`   Recommendation Score: ${plant.recommendationScore}\n`);
    });

    console.log('='.repeat(60));
    console.log(`\n✅ Database seeded successfully with ${plants.length} plants!`);
    
    // Get statistics
    const stats = {
      total: plants.length,
      petSafe: plants.filter(p => p.compatibility.petSafe).length,
      easycare: plants.filter(p => p.careDifficulty === 'Easy').length,
      highEfficiency: plants.filter(p => p.efficiency >= 8).length
    };

    console.log('\n📈 Plant Statistics:');
    console.log(`   Total Plants: ${stats.total}`);
    console.log(`   Pet-Safe Plants: ${stats.petSafe}`);
    console.log(`   Easy Care Plants: ${stats.easycare}`);
    console.log(`   High Efficiency (≥8): ${stats.highEfficiency}`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding plants:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run seeding
seedPlants();
