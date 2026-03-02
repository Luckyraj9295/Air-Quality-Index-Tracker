🌿 AirMonitor – Real-Time Air Quality Monitoring Web Application

AirMonitor is a responsive web application that provides real-time Air Quality Index (AQI) data based on user location and recommends air-purifying plants according to pollution levels.

The project demonstrates API integration, dynamic UI updates, data-driven recommendations, and responsive frontend design.

📌 Problem Statement

Air pollution varies significantly across locations, and most users are unaware of real-time AQI levels and practical indoor solutions.

AirMonitor solves this by:

Fetching live AQI data

Classifying pollution severity

Displaying an interactive AQI map

Suggesting indoor plants based on pollution level

🚀 Features

Real-time AQI data using WAQI API

Dynamic AQI category classification

Location-based interactive AQI map

Smart plant recommendations

Persistent location storage using localStorage

Responsive UI with Bootstrap

Contact form integration

Clean modular project structure

🛠 Tech Stack

HTML5

CSS3

Bootstrap 5

JavaScript (ES6)

Fetch API

WAQI (World Air Quality Index) API

Leaflet.js

📂 Project Structure
AirMonitor/
│
├── index.html        # Main UI structure
├── style.css         # Custom styling
├── script.js         # AQI logic & API handling
├── plants.json       # Structured plant dataset
└── README.md
Source Files

Main UI Layout → 

index

AQI Logic & API Handling → 

script

Plant Dataset → 

plants

Styling → 

style

⚙ System Architecture Overview
1️⃣ User Input Module

User enters a location.

Input is validated.

Enter key also triggers search.

2️⃣ AQI Fetching Module

The application sends a request:

fetch(`https://api.waqi.info/feed/${location}/?token=YOUR_API_TOKEN`)

The system:

Validates API response

Extracts AQI value

Categorizes AQI level

Dynamically updates UI

AQI Categories
AQI Range	Category
0–50	Good
51–100	Moderate
101–150	Unhealthy for Sensitive Groups
151–200	Unhealthy
201–300	Very Unhealthy
300+	Hazardous
3️⃣ Map Integration

The AQI map updates dynamically using:

https://www.aqicn.org/map/{location}/

Selected location and map URL are stored in localStorage and restored when the page reloads.

4️⃣ Plant Recommendation Logic

Plant suggestions are based on AQI severity.

AQI Range	Recommended Plants
0–50	Snake Plant, Aloe Vera
51–100	Areca Palm, Bamboo Palm, Peace Lily
101–200	Spider Plant, Boston Fern
200+	Rubber Plant, Hardy Plants

The plant dataset includes:

Pollutants reduced

Reduction efficiency percentage

Side effects

Compatibility notes

This allows structured data-driven recommendations.

🔄 Workflow

User enters location

AQI API call is made

AQI value is received

Category is determined

UI is updated dynamically

Map updates

Plant recommendation displayed

Location saved in localStorage

💡 Key Concepts Demonstrated

Third-party API integration

Asynchronous JavaScript

Error handling

Dynamic DOM manipulation

Data-driven UI updates

Responsive design

Local storage management

📦 Installation & Setup

Clone the repository:

git clone https://github.com/your-username/airmonitor.git

Navigate to the project folder:

cd airmonitor

Open index.html in your browser.

No backend setup required.

🔑 API Token Setup

Inside script.js, replace the API token with your own:

?token=YOUR_API_TOKEN

You can generate a free token from:
https://aqicn.org/data-platform/token/

📈 Future Improvements

30-day AQI prediction using ML model

Backend integration for contact form storage

User authentication system

Dark mode support

Progressive Web App implementation

Advanced plant filtering based on pollutants

🎯 Learning Outcomes

Through this project, you gain practical experience in:

API consumption

Real-time data rendering

Frontend architecture design

User experience enhancement

Environmental tech applications

📚 Conclusion

AirMonitor successfully integrates real-time environmental data with an intuitive frontend interface. The project highlights strong understanding of API integration, conditional rendering, structured data handling, and responsive web development.
