// Test script to verify dotenv is loading correctly

const path = require('path');
const dotenv = require('dotenv');

console.log('🧪 Testing dotenv configuration...\n');

// Load .env file explicitly
const envPath = path.resolve(__dirname, '.env');
console.log(`📍 Checking for .env at: ${envPath}`);

const fs = require('fs');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found\n');
} else {
  console.log('❌ .env file NOT found\n');
  process.exit(1);
}

// Load with verbose output
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.log('❌ Error loading .env:', result.error);
  process.exit(1);
}

console.log('✅ dotenv.config() called successfully\n');

// Display all loaded variables
console.log('📋 Loaded Environment Variables:');
console.log('================================');
console.log(`PORT: ${process.env.PORT}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Present' : '❌ Missing'}`);
console.log(`WAQI_API_KEY: ${process.env.WAQI_API_KEY ? '✅ Present (' + process.env.WAQI_API_KEY.substring(0, 10) + '...' + process.env.WAQI_API_KEY.substring(process.env.WAQI_API_KEY.length - 4) + ')' : '❌ Missing'}`);
console.log(`OPEN_METEO_BASE_URL: ${process.env.OPEN_METEO_BASE_URL ? '✅ Present' : '❌ Missing'}`);
console.log(`WAQI_BASE_URL: ${process.env.WAQI_BASE_URL ? '✅ Present' : '❌ Missing'}`);
console.log(`DEFAULT_CITIES: ${process.env.DEFAULT_CITIES ? '✅ Present' : '❌ Missing'}`);
console.log('================================\n');

if (!process.env.WAQI_API_KEY) {
  console.log('❌ WAQI_API_KEY is NOT loaded!\n');
  console.log('Raw .env file contents:');
  console.log(fs.readFileSync(envPath, 'utf8'));
  process.exit(1);
} else {
  console.log('✅ All required variables are loaded!');
  process.exit(0);
}
