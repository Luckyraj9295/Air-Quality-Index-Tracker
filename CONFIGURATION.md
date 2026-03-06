# Configuration Guide - AQI Tracker

## Overview
This guide explains how to customize and configure the AQI Tracker for your specific needs.

## Color Scheme Customization

Edit `assets/css/style.css` - Variables section:

```css
:root {
    /* Primary Colors */
    --primary-green: #10b981;      /* Main theme color */
    --primary-dark: #059669;       /* Darker green */
    --secondary-green: #34d399;    /* Accent green */
    --light-green: #d1fae5;        /* Light background */
    
    /* UI Colors */
    --off-white: #f8fafc;          /* Background */
    --dark-bg: #1e293b;            /* Dark mode bg */
    --card-bg: #ffffff;            /* Card background */
    --text-primary: #1e293b;       /* Main text */
    --text-secondary: #64748b;     /* Secondary text */
    --border-color: #e2e8f0;       /* Border color */
    
    /* AQI Colors */
    --aqi-good: #22c55e;           /* 0-50 */
    --aqi-moderate: #eab308;       /* 51-100 */
    --aqi-sensitive: #f97316;      /* 101-150 */
    --aqi-unhealthy: #ef4444;      /* 151-200 */
    --aqi-very-unhealthy: #a855f7; /* 201-300 */
    --aqi-hazardous: #7c2d12;      /* 300+ */
}
```

### Example: Change to Blue Theme
```css
:root {
    --primary-green: #3b82f6;      /* Blue */
    --primary-dark: #1e40af;       /* Dark blue */
    --secondary-green: #60a5fa;    /* Light blue */
    --light-green: #dbeafe;        /* Very light blue */
}
```

## Site Configuration

Edit `assets/js/main.js`:

### Default Location
```javascript
// Around line 20
setTimeout(() => {
    Map.getCurrentLocation();
}, 500);

// Change to:
setTimeout(() => {
    document.getElementById('locationInput').value = 'Paris, France';
    Map.searchLocation('Paris, France');
}, 500);
```

### Disable Auto-Location
```javascript
// Comment out this line:
// Map.getCurrentLocation();
```

## API Configuration

Edit `assets/js/api.js` - Line ~5:

### Using Your Own WAQI API Key
```javascript
// Free API key from: https://waqi.info/api/
const token = 'YOUR_WAQI_API_KEY_HERE';
```

### Switch between Real & Demo Data
```javascript
// In API.getAQI() - around line 20:

// Force demo data:
return API.getDemoData();

// Use real API:
// return API.parseAQIData(data.data);
```

## Chart Configuration

Edit `assets/js/charts.js`:

### Change Chart Colors
```javascript
borderColor: '#10b981',              // Change green
backgroundColor: 'rgba(16, 185, 129, 0.1)',  // Change green
```

### Adjust Chart Sizes
```javascript
// In each chart config, modify:
responsive: true,
maintainAspectRatio: true,

// Or set fixed height:
maintainAspectRatio: false,
```

### Add/Remove Datasets
```javascript
// In createAQITrendChart()
datasets: [
    {
        label: 'AQI Value',
        data: data.map(d => d.value),
        // ... config
    },
    // Add new dataset here
]
```

## Plant Database Customization

Edit `assets/data/plants.json`:

### Add New Plant
```json
{
    "id": 16,
    "name": "Your Plant Name",
    "emoji": "🌷",
    "pollutantsReduced": ["Benzene", "Formaldehyde"],
    "efficiency": 75,
    "sideEffects": "Non-toxic",
    "compatibility": "Works well with...",
    "bestFor": "Bedrooms",
    "difficulty": "Easy",
    "wateringFrequency": "Weekly"
}
```

### Modify Existing Plant
- Edit any plant entry
- Adjust efficiency percentages
- Change pollutants
- Update care instructions

### Remove Plant
- Delete the entire plant object
- Ensure valid JSON syntax

## Prediction Algorithm Customization

Edit `assets/js/prediction.js`:

### Change Smoothing Factor
```javascript
const alpha = 0.3; // Range: 0-1 (higher = more responsive)
// Lower = more stable predictions
// Higher = faster response to changes
```

### Adjust Forecast Days
```javascript
// Line ~15
generateForecast: (baseData = null, type = 'aqi', days = 30)
                                                         ↑
// Change 30 to your desired number of days
```

### Modify Seasonal Adjustment
```javascript
// Around line 30
if (dayOfWeek === 0 || dayOfWeek === 6) {
    seasonalAdjustment = -5;  // Reduce this value
}
```

## UI Text Customization

Edit `index.html`:

### Change Site Title
```html
<title>AQI Tracker - Environmental Monitoring Dashboard</title>
```

### Change Brand Name
```html
<span>AQI Tracker</span>  <!-- Change here -->
```

### Customize Section Titles
```html
<h2 class="section-title">Current Air Quality Dashboard</h2>
<!-- Change text inside h2 tags -->
```

### Modify Navigation Links
```html
<li><a href="#dashboard" class="nav-link">Dashboard</a></li>
<!-- Edit the text or href -->
```

## Map Configuration

Edit `assets/js/map.js`:

### Change Map Source
```javascript
// Line ~20
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // Change URL to different map provider
});
```

### Adjust Default Zoom
```javascript
// Line ~15
Map.map = L.map('aqiMap').setView([20, 0], 3);
                           ↑      ↑  ↑  ↑
                        lat     lon zoom
// Change coordinates and zoom level
```

### Marker Customization
```javascript
// Around line 71
const icon = L.divIcon({
    html: `<div style="...; font-size: 14px;">`,
    // Change size, style, color
});
```

## Responsive Breakpoints

Edit `assets/css/style.css` - Media Queries section:

```css
@media (max-width: 768px) {
    /* Tablet and below */
}

@media (max-width: 480px) {
    /* Mobile phones */
}
```

### Add New Breakpoint
```css
@media (max-width: 1400px) {
    /* Large screens */
    .charts-grid {
        grid-template-columns: 1fr;
    }
}
```

## Dark Mode Customization

Edit `:root` variables in `assets/css/style.css`:

```css
body.dark-mode {
    --card-bg: #1e293b;           /* Change card color */
    --text-primary: #f8fafc;      /* Change text color */
    --text-secondary: #cbd5e1;    /* Change secondary text */
    --border-color: #334155;      /* Change border */
    --off-white: #0f172a;         /* Change background */
}
```

## Animation Customization

Edit animation duration in CSS:

```css
transition: all 0.3s ease;  /* Change 0.3s to 0.5s or 0.1s */
animation: slideUp 0.8s ease-out;  /* Change 0.8s */
```

### Disable Animations
```css
/* Add to style.css */
* {
    animation: none !important;
    transition: none !important;
}
```

## Font Customization

### Change Font Family
Edit `assets/css/style.css`:

```css
:root {
    --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    /* Or use: 'Arial', 'Georgia', 'Trebuchet MS', etc. */
}
```

### Add Google Fonts
Add to `index.html` `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
```

Then in CSS:
```css
--font-family: 'Poppins', sans-serif;
```

## Health Tips Customization

Edit `index.html` - Tips section:

```html
<section id="tips" class="tips-section">
    <div class="tip-card">
        <div class="tip-icon"><i class="fas fa-ICON"></i></div>
        <h3>Your Title</h3>
        <p>Your tip text here</p>
    </div>
</section>
```

Available icons: https://fontawesome.com/icons

## Notification Customization

Edit `assets/js/utils.js` - `showNotification()` function:

```javascript
notification.style.cssText = `
    position: fixed;
    top: 20px;              /* Change position */
    right: 20px;
    padding: 15px 20px;     /* Change padding */
    border-radius: 8px;
    /* ... modify other styles ... */
`;
```

## Performance Optimization

### Enable Caching
Add to `index.html` (in `<head>`):
```html
<meta http-equiv="Cache-Control" content="max-age=31536000">
```

### Lazy Load Images
In plant cards, replace emoji with:
```html
<img src="plant.png" loading="lazy" alt="Plant">
```

### Minify CSS/JS
Use online tools or build tools to minify files

## Accessibility Improvements

### Add ARIA Labels
```html
<button aria-label="Search for location">
    <i class="fas fa-search"></i>
</button>
```

### Add Skip Links
Add to top of HTML:
```html
<a href="#main-content" class="skip-link">Skip to content</a>
```

## Multi-Language Support

Create new translation file `assets/data/i18n.json`:
```json
{
    "en": {
        "title": "AQI Tracker",
        "search": "Search"
    },
    "fr": {
        "title": "Suivi AQI",
        "search": "Rechercher"
    }
}
```

## Storage Configuration

Edit localStorage keys in `assets/js/utils.js`:

```javascript
localStorage.setItem('darkMode', value);  // Change key name
localStorage.setItem('lastLocation', value);
```

## Rate Limiting

Modify search debounce in `assets/js/main.js`:

```javascript
const debouncedSearch = Utils.debounce(search, 500);
                                              ↑
// Change 500ms to desired delay
```

## Testing Configuration

### Enable Verbose Logging
Add to `assets/js/main.js`:

```javascript
// Add at top
const DEBUG = true;

// Use throughout:
if (DEBUG) console.log('Debug message');
```

### Test With Different Data
In `assets/js/api.js`, force demo data:

```javascript
getAQI: async (city) => {
    return API.getDemoData(); // Always use demo
}
```

## Backup Before Changes

1. **Version Control**: Use Git
   ```bash
   git add .
   git commit -m "Before customization"
   ```

2. **File Backup**: Duplicate files
   - `style.css` → `style.backup.css`
   - `main.js` → `main.backup.js`

3. **Test Changes**: Test in browser DevTools

## Common Customization Scenarios

### Add Your Logo
Replace in `index.html`:
```html
<div class="logo">
    <img src="logo.png" alt="Logo">
    <span>Your Brand</span>
</div>
```

### Change to Forecast Only App
Hide sections in CSS:
```css
#dashboard, #plants, #tips { display: none; }
```

### Add PDF Export Feature
Add button in `index.html` and use library like jsPDF

### Send Email Alerts
Integrate with email service API (Firebase, SendGrid, etc.)

## Rollback Changes

If something breaks:
1. Clear browser cache (Ctrl+Shift+Del)
2. Check browser console for errors
3. Revert to backup files
4. Clear localStorage: `localStorage.clear()`

---

**Happy Customizing!**

For more information, see README.md and QUICK_START.md
