# Personal Pollution Exposure Risk System Documentation

## Overview

The **Personal Pollution Exposure Risk System** is an advanced feature that estimates individual health risks based on outdoor exposure duration, current air quality levels, dominant pollutants, and real-time weather conditions. This system provides personalized health recommendations to help users make informed decisions about outdoor activities.

---

## System Architecture

### Components

1. **exposureRisk.js** - Core module handling all risk calculations, weather API integration, and visualization
2. **HTML Interface** - Interactive user interface for time selection and results display
3. **CSS Styling** - Responsive design with dark mode support
4. **Open-Meteo Weather API** - Real-time weather data integration

---

## Features

### 1. **Exposure Time Selection**
Users can select their planned outdoor exposure duration:
- 15 minutes (0.25 hours)
- 30 minutes (0.5 hours)
- 1 hour
- 2 hours
- 4 hours

### 2. **Risk Score Calculation**

The system calculates exposure risk using the formula:

```
RiskScore = AQI × ExposureTime × PollutionFactor
```

#### Pollution Factors by Dominant Pollutant:
- **PM2.5** → 0.8 (Most harmful particulate matter)
- **PM10** → 0.7 (Coarse particulate matter)
- **O3** (Ozone) → 0.6 (Photochemical pollutant)
- **NO2** → 0.65 (Nitrogen dioxide)
- **SO2** → 0.7 (Sulfur dioxide)
- **CO** → 0.5 (Carbon monoxide)

### 3. **Risk Classification**

Risk scores are classified into four levels:

| Risk Score | Level | Color | Icon | Description |
|------------|-------|-------|------|-------------|
| 0-100 | Low Risk | Green | ✅ | Safe for outdoor activities |
| 101-200 | Moderate Risk | Orange | ⚠️ | Caution advised for sensitive groups |
| 201-300 | High Risk | Red | 🚨 | Limited outdoor exposure recommended |
| 300+ | Dangerous | Dark Red | ☠️ | Avoid outdoor exposure |

### 4. **Health Recommendations**

The system provides risk-based health advice:

#### Low Risk (0-100):
- ✅ Safe for outdoor activities
- 🏃 Exercise outdoors is okay
- 🚶 No special precautions needed
- **Outdoor Time:** No time limit

#### Moderate Risk (101-200):
- 😷 Consider wearing a mask if sensitive
- 🏃 Limit intense outdoor exercise
- 👶 Monitor children and elderly
- 🪟 Keep windows closed during peak hours
- **Outdoor Time:** Limit to 2-3 hours

#### High Risk (201-300):
- 😷 Wear N95 or KN95 mask outdoors
- 🚫 Avoid outdoor exercise
- ⏱️ Limit outdoor exposure to essentials
- 👨‍👩‍👧‍👦 Keep vulnerable groups indoors
- 💨 Use air purifiers indoors
- **Outdoor Time:** Max 1 hour, essential only

#### Dangerous (300+):
- 🚨 Stay indoors if possible
- 😷 N95 mask mandatory if going outside
- 🚫 No outdoor exercise
- ⚠️ Seek medical attention if breathing difficulty
- 🏥 High-risk groups should avoid all exposure
- 💨 Keep all windows closed, use air purifiers
- **Outdoor Time:** Avoid outdoor exposure

### 5. **Pollutant-Specific Advice**

The system provides additional recommendations based on the dominant pollutant:

- **PM2.5/PM10:** "Particulate matter is elevated - use HEPA filters"
- **Ozone (O3):** "Ozone levels high - avoid outdoor activities during afternoon"
- **Carbon Monoxide (CO):** "Carbon monoxide detected - avoid traffic areas"

### 6. **Weather Impact Analysis**

The system fetches real-time weather data from Open-Meteo API and analyzes its impact on air quality:

#### Weather Parameters Monitored:
- 🌡️ **Temperature** - High temperatures increase ozone formation
- 💧 **Humidity** - High humidity worsens respiratory symptoms
- 💨 **Wind Speed** - Low wind traps pollutants, high wind disperses them
- ☁️ **Weather Conditions** - Clear, cloudy, rainy, etc.

#### Impact Assessment:
- **Negative Impact** (Red): Weather conditions worsen air quality
- **Neutral Impact** (Gray): Weather has minimal effect
- **Positive Impact** (Green): Weather helps disperse pollutants

#### Weather-Based Warnings:
- "Low wind speed (< 5 km/h) may increase pollution concentration"
- "High humidity (> 80%) may worsen respiratory symptoms"
- "High temperature (> 30°C) increases heat stress and pollution formation"

### 7. **Interactive Visualizations**

#### Chart 1: Risk Score vs Exposure Duration
- Line chart showing how risk increases with exposure time
- Displays thresholds for Moderate Risk (100) and High Risk (200)
- Helps users visualize safe exposure limits

#### Chart 2: Pollutant Levels & Health Impact
- Bar chart showing current levels of all pollutants (PM2.5, PM10, O3, NO2, CO, SO2)
- Line overlay showing health impact factors
- Dual-axis chart for concentration (μg/m³) and impact score

---

## Technical Implementation

### Risk Calculation Algorithm

```javascript
// Step 1: Get pollution factor based on dominant pollutant
const pollutionFactor = getPollutionFactor(dominantPollutant);

// Step 2: Calculate risk score
const riskScore = AQI × exposureTime × pollutionFactor;

// Step 3: Classify risk level
if (riskScore <= 100) return 'Low Risk';
else if (riskScore <= 200) return 'Moderate Risk';
else if (riskScore <= 300) return 'High Risk';
else return 'Dangerous';
```

### Weather API Integration

```javascript
// Open-Meteo Weather API Endpoint
const url = `https://api.open-meteo.com/v1/forecast?` +
  `latitude=${lat}&longitude=${lon}&` +
  `current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&` +
  `timezone=auto`;

// Response includes:
// - temperature_2m: Temperature at 2 meters (°C)
// - relative_humidity_2m: Humidity (%)
// - wind_speed_10m: Wind speed at 10 meters (km/h)
// - weather_code: WMO weather code
```

### Data Flow

```
User selects exposure time
        ↓
Fetch current AQI data (WAQI API)
        ↓
Fetch weather data (Open-Meteo API)
        ↓
Calculate risk score
        ↓
Classify risk level
        ↓
Generate health recommendations
        ↓
Analyze weather impact
        ↓
Create visualizations
        ↓
Display results to user
```

---

## API Specifications

### Open-Meteo Weather API

**Endpoint:** `https://api.open-meteo.com/v1/forecast`

**Parameters:**
- `latitude`: Latitude coordinate
- `longitude`: Longitude coordinate
- `current`: Current weather parameters (comma-separated)
- `timezone`: Timezone (auto-detection)

**Rate Limit:** 10,000 requests/day (free tier)

**Authentication:** Not required

**Response Format:** JSON

**Sample Response:**
```json
{
  "current": {
    "time": "2024-03-05T14:30",
    "temperature_2m": 22.5,
    "relative_humidity_2m": 65,
    "wind_speed_10m": 12.3,
    "weather_code": 2
  }
}
```

---

## User Interface Components

### 1. Exposure Time Selector
- 5 interactive buttons for time selection
- Active state highlighting with green gradient
- Icon-based visual design
- Single selection (radio button behavior)
- Responsive grid layout

### 2. Risk Results Card
- Risk level header with color-coded border
- Large emoji icon representing risk level
- Risk score and exposure time summary
- Health warnings (if applicable)
- Recommended outdoor time
- Detailed health recommendations list
- Pollutant information
- Last updated timestamp

### 3. Weather Impact Card
- Weather impact header (Positive/Negative/Neutral)
- 4-item weather grid:
  - Temperature display
  - Humidity display
  - Wind speed display
  - Weather conditions display
- Weather analysis insights list

### 4. Visualization Charts
- Chart 1: Line chart (Risk vs Time)
  - Shows risk escalation over time
  - Threshold lines for reference
  - Interactive tooltips
- Chart 2: Bar chart with line overlay (Pollutant Impact)
  - Current pollutant levels
  - Health impact scores
  - Dual-axis display

### 5. Refresh Button
- Green gradient button
- Rotating sync icon
- Triggers complete risk recalculation
- Success notification on completion

---

## Responsive Design

### Desktop (> 768px)
- 2-column grid for results cards
- 2-column grid for charts
- 5-button horizontal time selector

### Tablet (768px)
- 1-column grid for results cards
- 1-column grid for charts
- Responsive time selector with wrapping

### Mobile (480px)
- Vertical stacking of all elements
- Smaller buttons (90px min-width)
- Reduced padding and font sizes
- 300px chart height (vs 350px desktop)

---

## Dark Mode Support

All components support dark mode:
- Translucent backgrounds with subtle borders
- Adjusted text colors for readability
- Maintained color-coded risk levels
- Enhanced chart visibility
- Consistent with app-wide dark mode theme

**Dark Mode Classes:**
```css
body.dark-mode .exposure-risk-section
body.dark-mode .exposure-selector
body.dark-mode .exposure-time-btn
body.dark-mode .exposure-card
body.dark-mode .weather-impact-header
body.dark-mode .chart-container
```

---

## Console Logging

The system provides detailed console output for debugging:

```
🛡️ Initializing Exposure Risk System...
⏱️ Exposure time set to: 1 hours
📊 Fetching historical data for New York...
🌤️ Fetching weather data for lat=40.7128, lon=-74.0060...
✅ Weather data received: { temperature: 22, humidity: 65, ... }
📊 Risk Calculation: AQI=85, Time=1h, Factor=0.8, Score=68.0
✅ Exposure risk analysis complete
```

---

## Testing Guide

### Step 1: Open Application
Navigate to your AQI Tracker in a web browser

### Step 2: Search for a City
Enter a city name and search to load AQI data

### Step 3: Navigate to Exposure Risk Section
Click "Risk" in the navigation menu or scroll to the section

### Step 4: Select Exposure Time
Click one of the 5 time buttons (15min, 30min, 1h, 2h, 4h)

### Step 5: Calculate Risk
Click "Calculate Risk" button

### Step 6: Verify Results
- Check risk level display (Low/Moderate/High/Dangerous)
- Review health recommendations
- Examine weather impact analysis
- Inspect visualization charts

### Step 7: Test Different Scenarios
- Try different cities (high vs low AQI)
- Test different exposure times
- Check during different times of day
- Verify dark mode compatibility

### Expected Console Output:
1. "🛡️ Initializing Exposure Risk System..."
2. "⏱️ Exposure time set to: X hours"
3. "📊 Fetching historical data for [City]..."
4. "🌤️ Fetching weather data..."
5. "✅ Weather data received"
6. "📊 Risk Calculation: ..."
7. "✅ Exposure risk analysis complete"

---

## Troubleshooting

### Issue: "Unable to calculate exposure risk"
**Cause:** No location data available
**Solution:** Search for a city first to load AQI data

### Issue: Weather data shows errors
**Cause:** Open-Meteo API unavailable or rate limit exceeded
**Solution:** System uses fallback default values, risk calculation still works

### Issue: Charts not displaying
**Cause:** Chart.js library not loaded
**Solution:** Check browser console for errors, ensure Chart.js CDN is accessible

### Issue: Risk results not updating
**Cause:** Previous calculation still cached
**Solution:** Click "Calculate Risk" button again to force refresh

### Issue: Dark mode not working
**Cause:** CSS not loaded properly
**Solution:** Clear cache and reload page

---

## Future Enhancements

### Potential Improvements:
1. **User Profiles** - Save sensitive group status (children, elderly, asthma, etc.)
2. **Push Notifications** - Alert users when risk levels change
3. **Historical Risk Tracking** - Track exposure risk over time
4. **Activity-Specific Advice** - Recommendations for running, cycling, outdoor dining
5. **Indoor/Outdoor Comparison** - Compare risk levels for different activities
6. **Multi-Day Planning** - Risk forecasts for upcoming days
7. **Wearable Integration** - Sync with smartwatches for real-time alerts
8. **Social Sharing** - Share risk assessments with family/friends
9. **Machine Learning** - Personalized risk models based on user health data
10. **Geolocation Auto-Calculation** - Auto-calculate risk for current location

---

## API Credits

- **WAQI API** - Real-time AQI data
- **Open-Meteo Weather API** - Real-time weather data (free, no authentication)

---

## Code Structure

### Files Modified/Created:
1. `assets/js/exposureRisk.js` (NEW) - 650+ lines
2. `index.html` - Added exposure risk section and navigation
3. `assets/css/style.css` - Added 350+ lines of styling

### Module Dependencies:
- `api.js` - For fetching AQI data
- `utils.js` - For date formatting and storage
- `Chart.js` - For data visualization
- `Open-Meteo API` - For weather data

### Integration Points:
- Auto-initializes on page load
- Uses existing localStorage for location data
- Integrates with dark mode system
- Responsive to mobile devices
- Compatible with all existing features

---

## Educational Value

This system demonstrates:
- **Environmental Health Science** - Understanding air pollution health impacts
- **Risk Assessment** - Quantifying exposure risks
- **Data Integration** - Combining multiple API sources
- **Weather Science** - Impact of meteorological conditions on air quality
- **Public Health** - Evidence-based health recommendations
- **Visualization** - Effective data presentation for decision-making

---

## Summary

The Personal Pollution Exposure Risk System transforms the AQI Tracker from a simple monitoring tool into a comprehensive health advisory platform. By combining real-time air quality data, weather conditions, and exposure duration, it provides personalized, actionable health recommendations that empower users to make informed decisions about outdoor activities.

**Key Benefits:**
✅ Personalized risk assessment
✅ Real-time weather impact analysis
✅ Evidence-based health recommendations
✅ Interactive visualizations
✅ Mobile-responsive design
✅ Dark mode support
✅ No cost (free APIs)

**System is ready for production use!**
