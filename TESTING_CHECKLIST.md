# Testing Checklist - AI Environmental Intelligence Dashboard

## Pre-Testing Setup
- [ ] All files saved
- [ ] Browser cache cleared
- [ ] Console open for error monitoring

---

## 1. Basic Functionality Tests

### Page Load
- [ ] Page loads without JavaScript errors
- [ ] Loading overlay appears and disappears
- [ ] Navigation bar displays correctly
- [ ] Hero section visible with search box
- [ ] All sections render (dashboard, advisor, map, rankings, forecast, plants, tips)

### Search Functionality
- [ ] Location search works
- [ ] Geolocation button works
- [ ] Dashboard updates with AQI data
- [ ] Location name displays correctly
- [ ] Timestamp shows current time

---

## 2. Dashboard Section Tests

### Existing Features
- [ ] AQI circle displays value
- [ ] AQI category shown (Good, Moderate, etc.)
- [ ] Color coding correct
- [ ] Pollutant cards populate
- [ ] 4 charts render correctly
- [ ] Dark mode toggle works

---

## 3. New Feature Tests

### Pollution Advisor Section
**Health Advisory Card:**
- [ ] Card renders with correct AQI tier
- [ ] Icon displays (smile/meh/frown/skull)
- [ ] Recommendations list populated
- [ ] Activity status grid shows 6 activities
- [ ] Safe/unsafe icons color-coded (green/red)

**Pollution Source Card:**
- [ ] Dominant pollutant identified
- [ ] Source list displays (3-5 sources)
- [ ] Icons for each source (car/industry/fire/etc.)
- [ ] Health impact text shown
- [ ] Solutions list populated (checkmarks)

**Exposure Risk Card:**
- [ ] Risk percentage displays (large number)
- [ ] Risk level shown (Low/Moderate/High/Extreme)
- [ ] Risk bar fills to correct width
- [ ] Color matches risk level
- [ ] Safe outdoor time shown
- [ ] Mask recommendation displays
- [ ] Recommended actions listed

**Pollution Trend Card:**
- [ ] Trend detected (Increasing/Decreasing/Stable)
- [ ] Color coding correct (red/green/blue)
- [ ] Trend icon displays
- [ ] Change description shown
- [ ] Prediction statement included

### Global Rankings Section
**City Comparison Card:**
- [ ] User city name displays
- [ ] Percentile shows (e.g., "65%")
- [ ] Progress ring or bar visible
- [ ] Comparison text accurate

**Global Rankings Card:**
- [ ] Header shows "Top 10 Most Polluted Cities"
- [ ] Refresh button present and clickable
- [ ] Top 10 cities listed
- [ ] Medal icons for positions 1-3 (🏆🥈🥉)
- [ ] City name and country shown
- [ ] AQI badge color-coded
- [ ] Dominant pollutant tag displays

**Data Loading:**
- [ ] Fetches from 15 cities
- [ ] Loading state shown during fetch
- [ ] Demo data fallback works if API fails
- [ ] Refresh button re-fetches data

### Map Section
**Heatmap Feature:**
- [ ] "Toggle Pollution Heatmap" button visible
- [ ] Button has layer icon
- [ ] Click shows notification "Heatmap enabled"
- [ ] Colored circles appear on map
- [ ] Circle size varies by AQI
- [ ] Circle opacity varies by AQI
- [ ] Circle colors match AQI categories
- [ ] Second click hides heatmap ("Heatmap disabled")
- [ ] Heatmap updates when location changes

### Chatbot
**UI Elements:**
- [ ] Chatbot FAB button visible (bottom-right)
- [ ] FAB has robot/comment icon
- [ ] Green circular button with shadow
- [ ] Click opens chatbot window
- [ ] Chatbot window has header (green gradient)
- [ ] Close button in header works
- [ ] Messages area visible (scrollable)
- [ ] Quick question buttons display (4 buttons)
- [ ] Input field at bottom
- [ ] Send button present

**Functionality:**
- [ ] Type message and press Enter sends
- [ ] Type message and click Send button works
- [ ] Bot response appears (left-aligned, white background)
- [ ] User message appears (right-aligned, green background)
- [ ] Typing indicator shows during response generation
- [ ] Quick question buttons work on click
- [ ] Chat history persists during session

**Rule-Based Responses:**
- [ ] "Is it safe outside?" → Contextual safety answer
- [ ] "What plants should I get?" → Plant recommendations
- [ ] "Why is air quality bad?" → Pollutant explanation
- [ ] "Health tips?" → Health recommendations
- [ ] "Should I wear a mask?" → Mask guidance
- [ ] "How accurate are predictions?" → Forecast explanation
- [ ] "Air quality tips?" → General tips

**OpenAI Integration (if API key added):**
- [ ] GPT responses work
- [ ] Responses include current AQI context
- [ ] Error handling for invalid API key
- [ ] Fallback to rule-based if OpenAI fails

---

## 4. Forecast Section Tests

**Existing Features:**
- [ ] 30-day forecast chart displays
- [ ] Historical data (blue line)
- [ ] Predicted data (red dashed line)
- [ ] Model quality percentage shown
- [ ] High pollution days listed

---

## 5. Plant Recommendations Tests

**Existing Features:**
- [ ] Plant cards display
- [ ] Filter buttons work (All/Good/Moderate/Unhealthy)
- [ ] Plant images load
- [ ] Efficiency percentages shown
- [ ] Pollutants reduced listed
- [ ] Side effects mentioned

---

## 6. Integration Tests

### Data Flow
- [ ] Search location → All modules update
  - [ ] Dashboard updates
  - [ ] Advisor cards populate
  - [ ] Chatbot context updates
  - [ ] Rankings show comparison
  - [ ] Heatmap refreshes (if enabled)
  - [ ] Charts update
  - [ ] Plants filter

### localStorage
- [ ] Historical AQI data saved
- [ ] Last location remembered on reload
- [ ] Dark mode preference persists

### API Calls
- [ ] WAQI API returns data (check console)
- [ ] Open-Meteo API returns data
- [ ] Error handling works when APIs fail
- [ ] Demo data fallback works

---

## 7. Responsive Design Tests

### Desktop (>768px)
- [ ] All sections full-width
- [ ] 4-column advisor grid
- [ ] 2-column rankings layout
- [ ] Chatbot 380px width

### Tablet (≤768px)
- [ ] Navigation hamburger menu works
- [ ] Single-column advisor
- [ ] Single-column rankings
- [ ] Chatbot 90% width

### Mobile (≤480px)
- [ ] Touch-friendly buttons
- [ ] Readable text sizes
- [ ] Chatbot 95% width
- [ ] Activity grid 2 columns
- [ ] Maps render correctly

---

## 8. Performance Tests

- [ ] Page loads in <3 seconds
- [ ] No console errors
- [ ] No console warnings (minor ones acceptable)
- [ ] Smooth animations (no jank)
- [ ] Charts render quickly
- [ ] API calls don't block UI
- [ ] Heatmap toggles instantly
- [ ] Chatbot opens/closes smoothly

---

## 9. Cross-Browser Tests

### Chrome
- [ ] All features work
- [ ] No layout issues

### Firefox
- [ ] All features work
- [ ] No layout issues

### Safari
- [ ] All features work
- [ ] No layout issues

### Edge
- [ ] All features work
- [ ] No layout issues

---

## 10. Error Handling Tests

### Network Errors
- [ ] API failures show fallback data
- [ ] Notifications display for errors
- [ ] No unhandled promise rejections

### User Input Errors
- [ ] Empty search shows notification
- [ ] Invalid location handled gracefully
- [ ] Chatbot handles empty messages

### Edge Cases
- [ ] No location data → Shows "Select a location"
- [ ] No historical data → Advisor adapts
- [ ] No nearby stations → Heatmap shows message
- [ ] API rate limit → Demo data loads

---

## Known Limitations

- [ ] WAQI API has rate limits (10,000 requests/month free tier)
- [ ] OpenAI API requires user key (optional feature)
- [ ] Global rankings fetch 15 cities (can be slow)
- [ ] Heatmap requires nearby stations in WAQI database
- [ ] Historical data requires 7+ days for trends

---

## Bug Reporting Template

If you find a bug, please report:

**Bug Description:**
_What happened?_

**Expected Behavior:**
_What should happen?_

**Steps to Reproduce:**
1. 
2. 
3. 

**Browser:**
_Chrome/Firefox/Safari/Edge + version_

**Console Errors:**
_Copy any red errors from browser console_

**Screenshots:**
_If applicable_

---

## Testing Results Summary

**Date Tested:** __________  
**Tested By:** __________  
**Browser(s):** __________  

**Total Tests:** ______  
**Passed:** ______  
**Failed:** ______  
**Skipped:** ______  

**Overall Status:** ✅ Pass / ⚠️ Issues Found / ❌ Critical Failures

**Notes:**
____________________________________________________________________
____________________________________________________________________
____________________________________________________________________

---

## Quick Test Command (Browser Console)

Paste this in browser console to verify modules loaded:

```javascript
console.log({
  Utils: typeof Utils !== 'undefined' ? '✅' : '❌',
  API: typeof API !== 'undefined' ? '✅' : '❌',
  Dashboard: typeof Dashboard !== 'undefined' ? '✅' : '❌',
  AQIMap: typeof AQIMap !== 'undefined' ? '✅' : '❌',
  Charts: typeof Charts !== 'undefined' ? '✅' : '❌',
  Prediction: typeof Prediction !== 'undefined' ? '✅' : '❌',
  PlantRecommendation: typeof PlantRecommendation !== 'undefined' ? '✅' : '❌',
  Advisor: typeof Advisor !== 'undefined' ? '✅' : '❌',
  GlobalRanking: typeof GlobalRanking !== 'undefined' ? '✅' : '❌',
  Chatbot: typeof Chatbot !== 'undefined' ? '✅' : '❌',
  App: typeof App !== 'undefined' ? '✅' : '❌'
});
```

Expected output: All ✅

---

**Testing Priority:**
1. **Critical**: Basic functionality (search, dashboard, charts)
2. **High**: New features (advisor, rankings, chatbot, heatmap)
3. **Medium**: Responsive design, error handling
4. **Low**: Cross-browser, edge cases

---

**Happy Testing! 🧪**
