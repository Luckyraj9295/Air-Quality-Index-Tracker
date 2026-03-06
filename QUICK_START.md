# Quick Start Guide - AQI Tracker

## Installation & Setup

### Option 1: Direct Browser Access
1. Open `index.html` in your web browser
2. Grant location permissions when prompted
3. The app will load automatically

**Note**: If running locally from file system, some features may require a local server due to CORS and geolocation restrictions.

### Option 2: Local Development Server (Recommended)

#### Using Python (Any Version)
```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

#### Using Node.js
```bash
# Install http-server globally
npm install -g http-server

# Run server in project directory
http-server
```

Then open: `http://localhost:8080`

#### Using Live Server (VS Code Extension)
1. Install "Live Server" extension in VS Code
2. Right-click `index.html` → "Open with Live Server"
3. Browser opens automatically

## Testing Checklist

### 🌍 Geolocation & Search
- [ ] Click "Use Location" button (browser will prompt for permission)
- [ ] Verify current location loads automatically
- [ ] Search for a city (e.g., "New York", "London", "Tokyo")
- [ ] Verify search results update the dashboard

### 📊 Dashboard Display
- [ ] AQI value displays correctly
- [ ] Category shows correct color
- [ ] Health warning message relevant to AQI
- [ ] 6 pollutant cards show values
- [ ] Location name and time update

### 🗺️ Interactive Map
- [ ] Map loads and centers on your location
- [ ] Click marker to see popup
- [ ] Nearby stations appear as secondary markers
- [ ] Map is responsive and draggable

### 📈 Charts
- [ ] 4 charts load without errors
- [ ] Line chart shows 7-day trend
- [ ] Doughnut chart shows pollutant breakdown
- [ ] Bar chart shows hourly variation
- [ ] Line chart shows 30-day history

### 🔮 30-Day Forecast
- [ ] Forecast chart displays
- [ ] Switching between AQI/PM2.5/PM10 works
- [ ] Dangerous days are listed
- [ ] Chart updates when button clicked

### 🌿 Plant Recommendations
- [ ] Plants load and display
- [ ] Plant cards show all information
- [ ] Filter buttons work (All, Good, Moderate, Unhealthy)
- [ ] Plant emojis display correctly

### 💡 Health Tips & Awareness
- [ ] Health tips section displays correctly
- [ ] Environmental awareness cards show
- [ ] All text is readable

### 🌙 Dark Mode
- [ ] Dark mode toggle button visible
- [ ] Click toggle to switch themes
- [ ] Theme persists after page refresh
- [ ] All elements visible in both modes

### 📱 Responsive Design
Test on different screen sizes:
- [ ] Desktop (1200px+)
- [ ] Tablet (768px - 1199px)
- [ ] Mobile (Below 768px)
- [ ] Navigation menu collapses on mobile
- [ ] Touch-friendly button sizes

### 🔍 Browser Console
- [ ] No JavaScript errors
- [ ] API calls complete successfully
- [ ] Geolocation logs confirm location

## Sample Locations to Test

```
US Cities:
- New York, USA
- Los Angeles, USA
- Chicago, USA
- San Francisco, USA

International:
- London, UK
- Paris, France
- Tokyo, Japan
- Sydney, Australia
- Shanghai, China
- Delhi, India
- São Paulo, Brazil
```

## Troubleshooting

### Maps not visible?
```
Solutions:
1. Check browser console (F12) for errors
2. Verify internet connection
3. Clear browser cache (Ctrl+Shift+Del or Cmd+Shift+Del)
4. Try different browser
5. Check if Leaflet CDN is accessible
```

### API not responding?
```
Solutions:
1. Check internet connection
2. Try with different city
3. Check WAQI API status
4. Wait a few minutes (rate limit)
5. Check browser console for CORS errors
```

### Charts not displaying?
```
Solutions:
1. Ensure JavaScript is enabled
2. Check if Chart.js CDN is accessible
3. Clear browser cache
4. Try Firefox/Chrome instead
5. Check console for JavaScript errors
```

### Geolocation not working?
```
Solutions:
1. Allow location access when prompted
2. Check browser location settings
3. Try "Use Location" button multiple times
4. Check if running on HTTPS (geolocation requires HTTPS or localhost)
5. Disable VPN/proxy
```

### Dark mode not saving?
```
Solutions:
1. Check if localStorage is enabled
2. Check browser privacy settings
3. Clear site data in browser settings
4. Disable privacy mode/incognito
5. Try different browser
```

## Performance Tips

1. **First Load**: May take 2-3 seconds for all resources
2. **Map Loading**: Takes ~1-2 seconds to fully render
3. **Search**: Should respond within 1 second
4. **Chart Updates**: Instant after data loads

## Feature Highlights

### Real-Time Data
- Updates AQI data from WAQI API
- Shows 30+ pollutants globally
- Covers 4000+ monitoring stations

### Smart Recommendations
- 15 plant types with care info
- Matched to your air quality
- Efficiency ratings included

### Advanced Predictions
- 30-day AQI forecast
- Exponential smoothing algorithm
- Seasonal pattern analysis

### Professional Design
- Modern glassmorphism UI
- Environmental green theme
- Fully responsive layout
- Dark mode support

## File Sizes (Approximate)

```
index.html          ~15 KB
assets/css/style.css   ~35 KB
assets/js/utils.js      ~3 KB
assets/js/api.js        ~4 KB
assets/js/dashboard.js  ~2 KB
assets/js/map.js        ~4 KB
assets/js/charts.js     ~5 KB
assets/js/prediction.js ~5 KB
assets/js/plantRec.js   ~4 KB
assets/js/main.js       ~3 KB
assets/data/plants.json ~5 KB

Total: ~85 KB (without libraries)
With CDN libs: ~2-3 MB (cached after first visit)
```

## Browser Requirements

| Browser | Min Version | Status |
|---------|------------|--------|
| Chrome  | 90+        | ✅ Fully Supported |
| Firefox | 88+        | ✅ Fully Supported |
| Safari  | 14+        | ✅ Fully Supported |
| Edge    | 90+        | ✅ Fully Supported |
| Mobile Safari | 14+ | ✅ Full Support |
| Chrome Mobile | 90+ | ✅ Full Support |

## API Credits

- **WAQI API** - World Air Quality Index API
  - Free tier: 10,000 requests/month
  - Website: https://waqi.info
  - API: https://api.waqi.info

- **Leaflet.js** - Open Street Map
  - Free and open source
  - Website: https://leafletjs.com

- **Chart.js** - Data visualization
  - Free and open source
  - Website: https://www.chartjs.org

## Getting Help

### Check Browser Console
Press F12 → Console tab to see:
- Any JavaScript errors
- API request logs
- Performance metrics

### Common Error Messages

```
"CORS error" 
→ Usually CORS policy, try running on localhost

"API token invalid"
→ Check internet connection or API rate limit

"Cannot read property 'setView' of null"
→ Map container not found, check HTML

"Chart is not defined"
→ Chart.js library not loaded
```

## Advanced Configuration

### Change API Token
Edit `assets/js/api.js` line ~5:
```javascript
const token = 'YOUR_WAQI_TOKEN';
```

Get your own token at: https://waqi.info/api/

### Modify Default Location
Edit `assets/js/main.js` around line 30 to set default city

### Customize Plant Database
Edit `assets/data/plants.json` to add/remove plants

### Adjust Color Scheme
Edit `assets/css/style.css` CSS variables at top:
```css
:root {
    --primary-green: #10b981;
    /* ... other colors ... */
}
```

## Next Steps

1. ✅ Open `index.html` in browser
2. ✅ Test search functionality
3. ✅ Explore interactive features
4. ✅ Try dark mode
5. ✅ Check mobile responsiveness
6. ✅ Review developer console
7. ✅ Share feedback or suggestions!

---

**For Issues or Questions:**
1. Check browser console (F12)
2. Review this guide's troubleshooting section
3. Check README.md for more details
