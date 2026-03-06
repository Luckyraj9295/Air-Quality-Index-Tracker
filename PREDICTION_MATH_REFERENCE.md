# Linear Regression Implementation Reference

## Mathematical Concepts

### Linear Regression Formula

**Objective**: Find the best-fit line that minimizes prediction error

$$\hat{y} = mx + b$$

Where:
- $m$ = slope (trend direction)
- $b$ = intercept (baseline)
- $\hat{y}$ = predicted AQI

### Least Squares Method

**Slope Calculation**:
$$m = \frac{n\sum xy - \sum x \sum y}{n\sum x^2 - (\sum x)^2}$$

**Intercept Calculation**:
$$b = \frac{\sum y - m\sum x}{n}$$

**Variables**:
- $n$ = number of observations (e.g., 30 days)
- $x$ = independent variable (day index: 0, 1, 2, ...)
- $y$ = dependent variable (AQI value)
- $\sum$ = summation (add all values)

### Model Quality (R²)

**R-squared Value**:
$$R^2 = 1 - \frac{SS_{res}}{SS_{tot}}$$

Where:
- $SS_{res} = \sum(y_i - \hat{y}_i)^2$ (residual sum of squares)
- $SS_{tot} = \sum(y_i - \bar{y})^2$ (total sum of squares)

**Interpretation**:
- $R^2 = 1$: Perfect fit (100% of variance explained)
- $R^2 = 0.75$: 75% of variance is predictable
- $R^2 = 0$: No linear relationship exists

## JavaScript Implementation

### 1. Training the Model

```javascript
trainLinearRegressionModel: (data) => {
  if (data.length < 2) return { slope: 0, intercept: 50, r2: 0 };

  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  // Calculate sums
  data.forEach((point, index) => {
    const x = index;
    const y = point.aqi || point;
    
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });

  // Calculate slope
  const denominator = (n * sumX2) - (sumX * sumX);
  const slope = denominator !== 0 
    ? ((n * sumXY) - (sumX * sumY)) / denominator
    : 0;
  
  // Calculate intercept
  const intercept = (sumY - (slope * sumX)) / n;

  // Calculate R²
  const yMean = sumY / n;
  let ssTotal = 0, ssRes = 0;
  
  data.forEach((point, index) => {
    const y = point.aqi || point;
    const yPred = slope * index + intercept;
    ssTotal += (y - yMean) ** 2;
    ssRes += (y - yPred) ** 2;
  });
  
  const r2 = ssTotal !== 0 ? 1 - (ssRes / ssTotal) : 0;

  return { slope, intercept, r2, dataPoints: n };
}
```

### 2. Making Predictions

```javascript
predictFutureAQI: (days = 30) => {
  const aqiValues = Prediction.historicalData.map(d => d.aqi);
  const model = Prediction.trainLinearRegressionModel(aqiValues);
  
  const predictions = [];
  const startDay = aqiValues.length;

  for (let i = 1; i <= days; i++) {
    const dayNumber = startDay + i;
    const date = new Date();
    date.setDate(date.getDate() + i);

    // Base prediction from regression
    let basePrediction = model.slope * dayNumber + model.intercept;

    // Seasonal adjustment (weekday patterns)
    const dayOfWeek = date.getDay();
    let seasonalAdjustment = 0;
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      seasonalAdjustment = -8;  // Weekends: cleaner
    } else if (dayOfWeek === 1) {
      seasonalAdjustment = 12;  // Monday: recovery effect
    }

    // Random natural variation
    const randomVariation = (Math.random() - 0.5) * 10;

    // Combine all components
    let aqi = basePrediction + seasonalAdjustment + randomVariation;
    aqi = Math.max(0, Math.min(500, Math.round(aqi)));

    predictions.push({
      day: i,
      date: Utils.formatDate(date),
      aqi: aqi,
      pm25: Math.round(aqi * 0.8),
      pm10: Math.round(aqi * 0.6)
    });
  }

  return predictions;
}
```

## Worked Example

### Input Data (7 days):
| Day | Index | AQI |
|-----|-------|-----|
| Mar 01 | 0 | 80 |
| Mar 02 | 1 | 78 |
| Mar 03 | 2 | 82 |
| Mar 04 | 3 | 75 |
| Mar 05 | 4 | 73 |
| Mar 06 | 5 | 70 |
| Mar 07 | 6 | 68 |

### Calculations:

**Sum Calculations**:
```
∑x = 0+1+2+3+4+5+6 = 21
∑y = 80+78+82+75+73+70+68 = 526
∑xy = 0(80) + 1(78) + 2(82) + 3(75) + 4(73) + 5(70) + 6(68) = 1827
∑x² = 0+1+4+9+16+25+36 = 91
```

**Slope**:
```
m = (7 × 1827 - 21 × 526) / (7 × 91 - 21²)
m = (12789 - 11046) / (637 - 441)
m = 1743 / 196
m ≈ -1.86 (decreasing trend)
```

**Intercept**:
```
b = (526 - (-1.86) × 21) / 7
b = (526 + 39.06) / 7
b ≈ 80.87
```

**Model Equation**:
```
AQI = -1.86 × day + 80.87
```

**R² Calculation**:
```
Mean AQI: ȳ = 526/7 ≈ 75.14

For each point:
- Day 0: ŷ = 80.87, residual² = (80-80.87)² = 0.76
- Day 1: ŷ = 79.01, residual² = (78-79.01)² = 1.02
... (continue for all)

SS_res ≈ 24.5
SS_tot = (80-75.14)² + (78-75.14)² + ... ≈ 181.43
R² = 1 - 24.5/181.43 ≈ 0.865
```

### Results:
- **Slope**: -1.86 (AQI decreasing ~2 points/day)
- **Intercept**: 80.87 (baseline)
- **R²**: 0.865 (excellent fit, 86.5% of variation explained)

### Predictions (next 3 days):
```
Day 7 (Mar 08, Wednesday):
- Base: -1.86(7) + 80.87 = 67.8
- Seasonal: 0 (weekday)
- Variation: +2.3
- Final: 70 AQI

Day 8 (Mar 09, Thursday):
- Base: -1.86(8) + 80.87 = 65.94
- Seasonal: 0
- Variation: -1.8
- Final: 64 AQI

Day 9 (Mar 10, Friday):
- Base: -1.86(9) + 80.87 = 64.08
- Seasonal: 0
- Variation: +3.1
- Final: 67 AQI
```

## Visualization Formulas

### Chart Y-Axis Normalization
```javascript
const normalized = (aqi - minAQI) / (maxAQI - minAQI);
const yCoord = chartHeight * (1 - normalized);
```

### Pollutant Estimation
```
PM2.5 = AQI × 0.8 + noise(-5 to 5)
PM10 = AQI × 0.6 + noise(-4 to 4)
O3 = AQI × 0.4 + noise(-3 to 3)
NO2 = AQI × 0.35 + noise(-2 to 2)
```

## Advanced Topics

### Confidence Intervals

For predicting a **range** instead of a point:

```javascript
const standardError = Math.sqrt(ssRes / (n - 2));
const margin = 1.96 * standardError;  // 95% confidence

const lower = prediction - margin;
const upper = prediction + margin;
```

### Seasonal Decomposition

Breaking down the time series into components:

```
AQI(t) = Trend(t) + Seasonal(t) + Residual(t)

Where:
- Trend: -1.86t (decreasing)
- Seasonal: Weekly cycle (-8 on weekends, +12 on Monday)
- Residual: Random variation
```

### Auto-correlation Analysis

Detecting repeating patterns:

```javascript
// Check if day-of-week pattern exists
const weekdayValues = data.filter((v, i) => i % 7 === 0);
const weekendValues = data.filter((v, i) => i % 7 >= 5);

const weekdayMean = weekdayValues.reduce((a,b) => a+b) / weekdayValues.length;
const weekendMean = weekendValues.reduce((a,b) => a+b) / weekendValues.length;

console.log(`Weekday avg: ${weekdayMean}, Weekend avg: ${weekendMean}`);
```

## Limitations & Considerations

### When Linear Regression Works Well:
- ✅ AQI shows clear trending pattern
- ✅ Seasonal patterns are regular
- ✅ No major pollution events
- ✅ At least 7 days of data

### When Results May Be Weak:
- ❌ Chaotic/variable AQI (industrial area)
- ❌ Recent major pollution event
- ❌ Less than 7 days of data
- ❌ Seasonal transitions (spring/fall)

### Model Improvements:
To enhance accuracy, consider:
1. **Polynomial Regression**: For curved trends
2. **Moving Average**: Smoothing noise
3. **ARIMA**: Seasonal patterns
4. **Neural Networks**: Complex patterns
5. **External Variables**: Temperature, humidity, wind

## Testing & Validation

### Unit Tests:
```javascript
// Test 1: Constant data
const constData = [50, 50, 50, 50];
const model = Prediction.trainLinearRegressionModel(constData);
console.assert(model.slope === 0, 'Slope should be 0');
console.assert(model.r2 === 0, 'R² should be 0 for constant data');

// Test 2: Perfect linear
const linearData = [10, 20, 30, 40, 50];
const model2 = Prediction.trainLinearRegressionModel(linearData);
console.assert(model2.slope === 10, 'Slope should be 10');
console.assert(Math.abs(model2.r2 - 1) < 0.0001, 'R² should be 1');
```

### Validation Metrics:
```javascript
// Mean Absolute Error
const mae = predictions.reduce((sum, pred, i) => {
  return sum + Math.abs(pred.aqi - actual[i].aqi);
}, 0) / predictions.length;

// Root Mean Square Error
const rmse = Math.sqrt(
  predictions.reduce((sum, pred, i) => {
    return sum + (pred.aqi - actual[i].aqi) ** 2;
  }, 0) / predictions.length
);

console.log(`MAE: ${mae.toFixed(2)}, RMSE: ${rmse.toFixed(2)}`);
```

## References

- **Linear Regression**: https://en.wikipedia.org/wiki/Linear_regression
- **Least Squares**: https://en.wikipedia.org/wiki/Least_squares
- **Time Series Analysis**: https://en.wikipedia.org/wiki/Time_series
- **R²**: https://en.wikipedia.org/wiki/Coefficient_of_determination

## Quick Function Reference

```javascript
// Collect data
Prediction.collectHistoricalAQI(aqi, city);

// Train model
const model = Prediction.trainLinearRegressionModel(data);
// Returns: { slope, intercept, r2, dataPoints }

// Predict
const predictions = Prediction.predictFutureAQI(days);
// Returns: Array of { day, date, aqi, pm25, pm10 }

// Format for display
const formatted = Prediction.generateForecastData(predictions);

// Display on chart
Prediction.generateAndDisplayForecast(type);
// type: 'aqi', 'pm25', or 'pm10'

// Get dangerous days
const dangerous = Prediction.getDangerousDays(predictions);
```
