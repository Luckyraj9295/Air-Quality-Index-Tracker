# AirVanta — AQI Intelligence & Environmental Monitoring Platform

![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/API-Express.js-000000?logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb\&logoColor=white)
![Chart.js](https://img.shields.io/badge/DataViz-Chart.js-FF6384?logo=chartdotjs\&logoColor=white)
![Netlify](https://img.shields.io/badge/Frontend-Netlify-00C7B7?logo=netlify\&logoColor=white)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render\&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue)

AirVanta is a **full-stack environmental intelligence platform** that helps users monitor real-time air quality, predict pollution trends, and receive actionable health and plant recommendations.

The platform integrates real-world environmental data APIs and transforms them into **interactive dashboards, forecasting insights, and personalized environmental guidance**.

Live Demo
https://airvanta.netlify.app/

---

# What This Project Demonstrates

This project showcases **full-stack engineering skills expected in internships and junior developer roles**, including:

* REST API design and backend architecture
* Real-time data integration from external APIs
* Data visualization and interactive dashboards
* Environmental data analysis and forecasting logic
* Modular frontend architecture
* Production-style deployment

---

# Core Features

### Real-Time AQI Dashboard

Displays the current Air Quality Index along with pollutant breakdown including:

* PM2.5
* PM10
* O₃
* NO₂
* CO
* SO₂

### Interactive AQI Map

* Built using Leaflet.js
* Explore AQI levels by location
* Clickable markers for city-level insights

### 30-Day AQI Prediction

* Forecast pollution trends using regression-based modeling
* Highlights potential **high-risk pollution days**

### Exposure Risk Calculator

Estimates health risk based on:

* current AQI
* duration of outdoor exposure

### AI AQI Assistant

Interactive chatbot providing:

* air-quality explanations
* outdoor safety guidance
* plant recommendations

### Smart Plant Recommendation Engine

Suggests air-purifying plants based on:

* dominant pollutant
* purification efficiency
* environmental compatibility

### Global AQI Rankings

Compare pollution levels across major cities worldwide.

### Dark Mode & Mobile UI

Responsive design optimized for both desktop and mobile devices.

---

# Tech Stack

## Frontend

* HTML5
* CSS3
* Vanilla JavaScript
* Chart.js
* Leaflet.js

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* Axios
* node-cron

---

# External Data Sources

### WAQI (World Air Quality Index)

Provides real-time AQI data and pollutant measurements.

### Open-Meteo API

Provides environmental and weather data for forecasting context.

---

# Project Architecture

```
AirVanta/
│
├── index.html
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── api.js
│       ├── dashboard.js
│       ├── map.js
│       ├── charts.js
│       ├── prediction.js
│       ├── plantRecommendation.js
│       ├── advisor.js
│       ├── exposureRisk.js
│       ├── globalRanking.js
│       ├── chatbot.js
│       └── main.js
│
└── aqi-backend/
    ├── server.js
    ├── controllers/
    ├── routes/
    ├── services/
    ├── models/
    ├── cron/
    └── scripts/
```

---

# Example Backend API Endpoints

```
GET /api/aqi/:city
GET /api/aqi/coordinates/:lat/:lon
GET /api/aqi/history/:city?days=30
GET /api/prediction/:city?days=30
GET /api/prediction/:city/dangerous-days
GET /api/plants/recommend
GET /api/exposure-risk/:city
```

These endpoints power the dashboard, prediction system, and recommendation modules.

---

# Local Setup

### Clone Repository

```
git clone https://github.com/yourusername/airvanta
cd airvanta
```

---

### Install Backend Dependencies

```
cd aqi-backend
npm install
```

---

### Environment Variables

Create a `.env` file inside `aqi-backend`.

```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
WAQI_API_KEY=your_waqi_api_key
OPEN_METEO_BASE_URL=https://air-quality-api.open-meteo.com/v1
WAQI_BASE_URL=https://api.waqi.info
DEFAULT_CITIES=New York,London,Beijing,Delhi,Tokyo,Mumbai,Los Angeles,Paris,Sydney,Sao Paulo
CACHE_TTL=300
PREDICTION_DAYS=30
MIN_HISTORICAL_DAYS=15
```

---

### Run Backend Server

```
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

# Engineering Highlights

* Modular frontend architecture with reusable components
* Clean backend structure separating routes, controllers, and services
* Forecasting logic implemented with time-series regression
* Scheduled AQI data collection using cron jobs
* Graceful fallback handling for incomplete API responses
* Responsive UI with dark-mode support

---

# Resume-Ready Project Impact

You can summarize this project on your resume as:

* Built a full-stack AQI intelligence dashboard using **Node.js, Express, MongoDB, and JavaScript**, delivering real-time environmental insights and forecasting.
* Developed **REST APIs and data pipelines** integrating external air-quality services to power interactive dashboards.
* Implemented **interactive map visualization and chart-based trend analysis** using Leaflet.js and Chart.js.
* Designed **pollution-aware recommendation systems** for health advisory and air-purifying plant suggestions.

---

# Future Improvements

* User authentication and personalized dashboards
* Exportable environmental reports (CSV/PDF)
* Improved forecasting models with additional environmental factors
* CI/CD pipeline for automated deployment
* API testing and monitoring

---

# License

MIT License
