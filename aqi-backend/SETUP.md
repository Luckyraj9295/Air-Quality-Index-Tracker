# 🚀 Quick Setup Guide

## Step-by-Step Setup (5 minutes)

### 1. Install Dependencies
```bash
cd aqi-backend
npm install
```

### 2. Set Up MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster (M0 Free tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string

**Example connection string**:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/aqi-dashboard?retryWrites=true&w=majority
```

### 3. Configure Environment

Edit `server/.env` file:
```env
MONGODB_URI=paste_your_mongodb_connection_string_here
```

**Note**: WAQI_API_KEY is already configured with your existing key.

### 4. Network Access (Important!)

In MongoDB Atlas:
1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Or add your specific IP for better security

### 5. Seed Plant Database
```bash
npm run seed
```

**Expected output**:
```
✅ Successfully inserted 15 plants
📈 Plant Statistics:
   Total Plants: 15
   Pet-Safe Plants: 5
   Easy Care Plants: 10
```

### 6. Start Server
```bash
npm start
```

**Server starts on**: http://localhost:5000

### 7. Test API

Open browser or use curl:
```bash
# Health check
curl http://localhost:5000/health

# Get AQI for New York
curl http://localhost:5000/api/aqi/New%20York

# Get plant recommendations
curl http://localhost:5000/api/plants/recommend?pollutant=PM2.5
```

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] MongoDB Atlas cluster created
- [ ] Connection string added to `.env`
- [ ] Network access configured (0.0.0.0/0)
- [ ] Plants seeded successfully (`npm run seed`)
- [ ] Server started without errors (`npm start`)
- [ ] Health check responds: `http://localhost:5000/health`
- [ ] AQI endpoint works: `http://localhost:5000/api/aqi/London`

## 🎯 Next Steps

### Collect Initial Data
```bash
# Manually collect AQI data for all cities
npm run collect
```

This will:
- Fetch current AQI for all DEFAULT_CITIES
- Store data in MongoDB
- Display collection summary

**Wait 15+ days** to accumulate enough historical data for accurate predictions.

### Test Predictions (After 15+ Days)
```bash
curl http://localhost:5000/api/prediction/Beijing?days=30
```

### Check Database Statistics
```bash
npm run stats
```

## 🔧 Common Issues & Solutions

### Issue: "MongoNetworkError: connection refused"
**Solution**: 
- Check MONGODB_URI in `.env`
- Verify network access allows your IP
- Test connection string in MongoDB Compass

### Issue: "WAQI API Error: 401 Unauthorized"
**Solution**: 
- Your WAQI_API_KEY is already configured
- If issues persist, verify key at: https://aqicn.org/data-platform/token/

### Issue: "No historical data found"
**Solution**: 
- Run: `npm run collect`
- Wait for cron job (runs daily at midnight UTC)
- Or manually trigger collection

### Issue: "Predictions require minimum 15 days of data"
**Solution**: 
- Run `npm run collect` daily for 15 days
- Or wait for automatic cron collection

## 📱 Frontend Integration

Update your frontend to point to backend:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';

// Example fetch
fetch(`${API_BASE_URL}/aqi/New York`)
  .then(res => res.json())
  .then(data => console.log(data));
```

## 🌐 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
```

### Enable CORS for Your Frontend
Edit `server/server.js` if needed:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

## 📊 Monitoring

### View Logs
```bash
# Server logs show detailed information:
# 📡 Fetching data...
# ✅ Success
# ❌ Errors

# Watch logs in real-time
npm start
```

### Database Statistics
```bash
npm run stats
```

Shows:
- Total records collected
- Unique cities tracked  
- Latest collection timestamp
- Date range of historical data

## 🎉 You're All Set!

Your backend is now running with:
- ✅ Real-time AQI data
- ✅ Plant recommendations
- ✅ Daily automated data collection
- ✅ 30-day predictions (after 15+ days of data)
- ✅ Exposure risk calculations

## 📚 More Information

- See `README.md` for full API documentation
- Check `.env.example` for all configuration options
- Review controller files for endpoint details

## 💬 Support

If you encounter issues:
1. Check troubleshooting section in README.md
2. Verify all environment variables
3. Check server logs for error details
4. Ensure MongoDB Atlas network access is configured
