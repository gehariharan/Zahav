# Zahav Charts Documentation

This document provides detailed information about the chart components implemented in the Zahav frontend application.

## Table of Contents

1. [Historical Chart Component](#historical-chart-component)
2. [Gold Predictor Component](#gold-predictor-component)
3. [Data Flow and Integration](#data-flow-and-integration)
4. [Customization Options](#customization-options)
5. [Future Enhancements](#future-enhancements)

## Historical Chart Component

The `HistoricalChart` component (`src/components/charts/HistoricalChart.js`) displays historical price data for precious metals with an option to show AI-generated price predictions.

### Features

- Interactive line chart showing historical price data
- Multiple time range options (1W, 1M, 3M, 6M, 1Y, 5Y)
- Toggle for showing/hiding price predictions
- Confidence interval visualization for predictions
- Responsive design that adapts to different screen sizes
- Support for multiple currencies (INR/USD)

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `metal` | string | 'Gold' | The metal for which to display prices |
| `currentPrice` | number | - | The current price of the metal |
| `currency` | string | 'INR' | The currency to display (INR or USD) |
| `confidenceLevel` | number | 0.95 | Confidence level for prediction intervals (0-1) |
| `timeRange` | string | '1M' | Default time range to display (1W, 1M, 3M, 6M, 1Y, 5Y) |

### Implementation Details

- Uses Chart.js and react-chartjs-2 for rendering the chart
- Dynamically generates mock data for demonstration (will be replaced with API data)
- Handles currency formatting and unit conversions automatically
- Implements smooth animations for data transitions
- Provides user-friendly tooltips on data points

### Example Usage

```jsx
<HistoricalChart 
  metal="Gold"
  currentPrice={62500}
  currency="INR"
  timeRange="3M"
/>
```

## Gold Predictor Component

The `GoldPredictor` component (`src/components/charts/GoldPredictor.js`) provides AI-driven price predictions for gold.

### Features

- Multiple prediction timeframes (1 week, 1 month, 3 months)
- Confidence level indicators
- Key market factors affecting prediction
- Impact visualization for each factor
- AI-generated market insights

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPrice` | number | - | The current price of gold |
| `currency` | string | 'INR' | The currency to display (INR or USD) |

### Implementation Details

- Simulates a machine learning prediction model (to be replaced with actual API)
- Color-coded impact meters for influencing factors
- Responsive design for all screen sizes
- Adapts dynamically to currency changes
- Loading state handling for async operations

### Example Usage

```jsx
<GoldPredictor 
  currentPrice={62500}
  currency="INR"
/>
```

## Data Flow and Integration

In the current implementation, both components use mock data for demonstration purposes. In a production environment, the data flow would be:

1. The parent component (PriceDashboard) fetches real-time prices from backend API
2. Historical data is retrieved based on selected timeframe
3. Price prediction requests are sent to the AI prediction endpoint
4. Components render with the real data and update upon selection changes

### API Integration Points

The current mock data generation will be replaced with these API calls:

- `GET /api/prices/historical?metal={metal}&days={days}&currency={currency}`
- `GET /api/prices/prediction?metal={metal}&timeframe={timeframe}&currency={currency}`

## Customization Options

### Chart Appearance

The chart appearance can be customized via CSS (see `src/styles/charts/HistoricalChart.css` and `src/styles/charts/GoldPredictor.css`). Key customizable elements include:

- Chart colors and gradients
- Line thickness and style
- Point size and hover effects
- Tooltip formatting
- Time range button styling

### Behavior Configuration

Behavior can be adjusted in the component code:

- Default time ranges
- Confidence interval calculation
- Data point density
- Animation duration and easing

## Future Enhancements

Planned improvements for the chart components include:

1. **Data Export**: Allow users to export chart data as CSV
2. **Chart Comparison**: Enable overlaying multiple metals for comparison
3. **Technical Indicators**: Add moving averages, RSI, and other technical indicators
4. **Custom Annotations**: Enable users to add personal annotations to charts
5. **Advanced AI Insights**: Enhance the prediction model with more detailed analysis
6. **Live Data Streaming**: Implement WebSockets for real-time chart updates

## Troubleshooting

Common issues and their solutions:

- **Charts not rendering**: Ensure Chart.js and its dependencies are properly installed
- **Currency formatting issues**: Check the currency implementation in the component props
- **Responsiveness problems**: Adjust the container styles and chart options for better scaling
- **Performance concerns**: For large datasets, implement data downsampling for older time periods
