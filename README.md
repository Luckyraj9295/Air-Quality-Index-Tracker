🌿 AirMonitor – Real-Time Air Quality Monitoring Web Application

AirMonitor is a responsive web application that provides real-time Air Quality Index (AQI) data based on user location and recommends air-purifying plants according to pollution levels.

This project demonstrates API integration, asynchronous JavaScript, dynamic DOM manipulation, structured JSON data handling, and responsive frontend development.

![HTML5](https://img.shields.io/badge/HTML-5-orange)
![CSS3](https://img.shields.io/badge/CSS-3-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple)
![API](https://img.shields.io/badge/API-WAQI-green)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

📌 Overview

Air pollution levels vary significantly by location. Many users are unaware of current AQI conditions and practical steps they can take indoors to improve air quality.

AirMonitor helps by:

• Fetching live AQI data
• Classifying pollution severity
• Displaying an interactive AQI map
• Suggesting air-purifying plants
• Saving user location using localStorage

🚀 Features

• Real-time AQI data using WAQI API
• Location-based interactive AQI map
• Smart plant recommendations
• AQI category classification logic
• LocalStorage persistence
• Responsive UI using Bootstrap 5
• Contact form integration
• Dynamic UI updates without page reload

🛠 Tech Stack

• HTML5
• CSS3
• Bootstrap 5
• JavaScript (ES6)
• Fetch API
• WAQI (World Air Quality Index) API
• Leaflet.js

📂 Project Structure

AirMonitor/

index.html
style.css
script.js
plants.json
README.md

Source Files:

Main UI Structure → 

index


AQI Logic & API Handling → 

script


Plant Dataset → 

plants


Custom Styling → 

style

⚙ System Working

User enters a location.

The application validates input.

An API request is sent to WAQI.

AQI value is received.

Pollution category is determined.

AQI result is displayed.

AQI map updates dynamically.

Plant recommendation is shown.

Location is stored in localStorage.

📊 AQI Classification

0–50 → Good
51–100 → Moderate
101–150 → Unhealthy for Sensitive Groups
151–200 → Unhealthy
201–300 → Very Unhealthy
300+ → Hazardous

🌱 Plant Recommendation Logic

Based on AQI severity:

0–50 → Snake Plant, Aloe Vera
51–100 → Areca Palm, Bamboo Palm, Peace Lily
101–200 → Spider Plant, Boston Fern
200+ → Rubber Plant and hardy indoor plants

The plants.json dataset includes:

• Pollutants reduced
• Reduction efficiency percentage
• Side effects
• Compatibility notes

This allows structured and scalable recommendations.

💡 Concepts Demonstrated

• Third-party API integration
• Asynchronous JavaScript
• Promise handling
• Error handling
• Conditional rendering
• Data-driven UI updates
• Local storage management
• Responsive web design

📦 Installation

Clone the repository.

Open the project folder.

Open index.html in a browser.

Replace the WAQI API token inside script.js with your own token.

No backend setup required.

🔮 Future Improvements

• 30-day AQI prediction using Machine Learning
• Backend integration for contact form storage
• User authentication system
• Dark mode toggle
• Progressive Web App support
• Advanced pollutant-based filtering

🎯 Learning Outcome

This project strengthens understanding of:

• Real-world API consumption
• Dynamic frontend architecture
• Environmental data visualization
• Structured JSON data usage
• Clean UI/UX implementation

If you want, I can now give you:

• A version optimized strictly for GitHub recruiters
• A version written for college viva explanation
• Or a stronger “System Design Explanation” version

Tell me where you plan to use it.
