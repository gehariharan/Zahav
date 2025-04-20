# Zahav Frontend

The frontend for the Zahav Gold Trading Platform provides a responsive and intuitive user interface for gold and bullion dealers with real-time price tracking, historical charts, price predictions, and booking management.

## Features

- **Real-time Price Dashboard**: Track gold, silver, platinum, and palladium prices in real-time with configurable currency display (INR/USD)
- **Historical Price Charts**: View historical price data with interactive timelines from 1 week to 5 years
- **AI-Powered Price Prediction**: Utilize machine learning models to predict future gold prices with confidence intervals
- **Rate Alerts**: Set customizable alerts for price points
- **Booking System**: Streamlined process for metal purchases
- **Dealer Tools**: Specialized calculators and utilities for dealers

## Technology Stack

- **React.js**: Component-based UI development
- **React Router**: For navigation and routing
- **Axios**: API communication with backend
- **Chart.js**: Data visualization for price charts
- **CSS**: Custom styling for components

## Project Structure

```
frontend/
├── public/                  # Static files
├── src/                     # Source code
│   ├── assets/              # Images, icons, etc.
│   ├── components/          # Reusable components
│   │   ├── charts/          # Chart components
│   │   │   ├── HistoricalChart.js   # Historical price charts
│   │   │   └── GoldPredictor.js     # AI prediction component
│   │   ├── common/          # Common UI components
│   │   ├── layouts/         # Page layouts
│   │   └── ...
│   ├── context/             # React context providers
│   ├── pages/               # Main application pages
│   │   ├── PriceDashboard.js  # Price dashboard with charts
│   │   ├── BookingSystem.js   # Metal booking system
│   │   ├── RateAlerts.js      # Alert configuration
│   │   └── ...
│   ├── services/            # API and service functions
│   ├── styles/              # CSS styles
│   │   ├── charts/          # Chart-specific styles
│   │   └── ...
│   ├── utils/               # Utility functions
│   ├── App.js               # Root component
│   └── index.js             # Application entry point
└── package.json             # Dependencies and scripts
```

## New Features

### Historical Price Charts

The application now includes historical price charts for precious metals with the following capabilities:

- Multiple time range selections (1W, 1M, 3M, 6M, 1Y, 5Y)
- Interactive tooltips showing price data
- Smooth animations and transitions
- Support for multiple currencies (INR/USD)

### AI-Powered Gold Price Prediction

A new Gold Price Predictor component provides price forecasting with:

- Machine learning-based prediction model
- Configurable prediction timeframes (1 week, 1 month, 3 months)
- Confidence intervals for predictions
- Key influencing factors analysis
- AI-generated market insights

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/username/Zahav.git
   ```

2. Navigate to the frontend directory:
   ```
   cd Zahav/app/frontend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Access the application at `http://localhost:3000`

## Usage

### Price Dashboard

- The Price Dashboard displays current prices for multiple precious metals
- Click on a metal card to view its historical chart
- Toggle between INR and USD currency display
- For gold, an AI prediction component will show forecasted prices
- Use the time range selector to adjust the historical data period
- Toggle the prediction visibility with the "Show AI Prediction" switch

### Rate Alerts

- Configure price alerts for specific metals
- Set custom thresholds for notifications
- Manage and view all active alerts

## Contributing

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Commit your changes: `git commit -m 'Add new feature'`
3. Push to the branch: `git push origin feature/new-feature`
4. Submit a pull request

## License

This project is proprietary and confidential.
