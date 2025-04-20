import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import '../../styles/charts/HistoricalChart.css';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Mock data for historical prices - will be replaced with API data
const generateMockHistoricalData = (days = 30, startPrice, currency) => {
  const data = [];
  const today = new Date();
  
  let price = startPrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Add some randomness to create realistic price movements
    // More volatility for longer timeframes
    const volatility = Math.min(0.01, 0.005 * Math.sqrt(days / 30));
    const change = price * (Math.random() * volatility * 2 - volatility);
    
    price += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: currency === 'INR' ? Math.round(price) : parseFloat(price.toFixed(2))
    });
  }
  
  return data;
};

// Generate mock prediction data
const generatePredictionData = (historicalData, days = 7, currency) => {
  const data = [];
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  const lastPrice = historicalData[historicalData.length - 1].price;
  
  let predictedPrice = lastPrice;
  
  // Generate AI prediction with an upward trend (based on pitch slide mockup)
  // In a real app, this would come from an AI model
  for (let i = 1; i <= days; i++) {
    const date = new Date(lastDate);
    date.setDate(lastDate.getDate() + i);
    
    // Add slight upward trend with some randomness
    const upwardBias = 0.001; // 0.1% upward bias per day
    const volatility = 0.003; // 0.3% daily volatility
    const change = predictedPrice * (upwardBias + (Math.random() * volatility * 2 - volatility));
    
    predictedPrice += change;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: currency === 'INR' ? Math.round(predictedPrice) : parseFloat(predictedPrice.toFixed(2))
    });
  }
  
  return data;
};

const HistoricalChart = ({ 
  metal = 'Gold', 
  currentPrice, 
  currency = 'INR',
  confidenceLevel = 0.95, // 95% confidence interval
  timeRange = '1M'  // default to 1 month
}) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [enablePrediction, setEnablePrediction] = useState(true);
  
  // Helper function to determine the number of days based on timeRange
  const getDaysFromTimeRange = (range) => {
    switch (range) {
      case '1W': return 7;
      case '1M': return 30;
      case '3M': return 90;
      case '6M': return 180;
      case '1Y': return 365;
      case '5Y': return 365 * 5;
      default: return 30;
    }
  };
  
  // Generate chart data based on time range and currency
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // In a real app, this would be an API call:
        // const response = await fetch(`/api/prices/historical?metal=${metal.toLowerCase()}&days=${getDaysFromTimeRange(selectedTimeRange)}&currency=${currency}`);
        // const data = await response.json();
        
        // For now, use mock data
        const days = getDaysFromTimeRange(selectedTimeRange);
        const mockStartPrice = currency === 'INR' ? 62500 : 2425;
        const mockHistoricalData = generateMockHistoricalData(days, mockStartPrice, currency);
        const mockPredictionData = generatePredictionData(mockHistoricalData, 7, currency);
        
        // Format data for Chart.js
        const dates = mockHistoricalData.map(item => item.date);
        const prices = mockHistoricalData.map(item => item.price);
        
        // Add prediction dates and prices if enabled
        const predictionDates = enablePrediction ? mockPredictionData.map(item => item.date) : [];
        const predictionPrices = enablePrediction ? mockPredictionData.map(item => item.price) : [];
        
        // Calculate confidence intervals for predictions (simplified)
        const confidenceIntervalUpper = predictionPrices.map(price => 
          price * (1 + (1 - confidenceLevel))
        );
        
        const confidenceIntervalLower = predictionPrices.map(price => 
          price * (1 - (1 - confidenceLevel))
        );
        
        setChartData({
          labels: [...dates, ...predictionDates],
          datasets: [
            {
              label: `Historical ${metal} Price`,
              data: [...prices, ...Array(predictionDates.length).fill(null)],
              borderColor: '#d4af37',
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              borderWidth: 2,
              pointRadius: 1,
              pointHoverRadius: 5,
              tension: 0.3,
              fill: false
            },
            {
              label: `AI Predicted ${metal} Price`,
              data: [...Array(dates.length).fill(null), ...predictionPrices],
              borderColor: '#8a6eaf',
              borderDash: [5, 5],
              backgroundColor: 'rgba(138, 110, 175, 0.1)',
              borderWidth: 2,
              pointRadius: 1,
              pointHoverRadius: 5,
              tension: 0.3,
              fill: false
            },
            {
              label: `Upper Confidence Bound (${confidenceLevel * 100}%)`,
              data: [...Array(dates.length).fill(null), ...confidenceIntervalUpper],
              borderColor: 'rgba(138, 110, 175, 0.3)',
              backgroundColor: 'rgba(138, 110, 175, 0.05)',
              borderWidth: 1,
              pointRadius: 0,
              pointHoverRadius: 0,
              tension: 0.3,
              fill: false
            },
            {
              label: `Lower Confidence Bound (${confidenceLevel * 100}%)`,
              data: [...Array(dates.length).fill(null), ...confidenceIntervalLower],
              borderColor: 'rgba(138, 110, 175, 0.3)',
              backgroundColor: 'rgba(138, 110, 175, 0.05)',
              borderWidth: 1,
              pointRadius: 0,
              pointHoverRadius: 0,
              tension: 0.3,
              fill: 2 // Fill between this dataset and the dataset at index 2 (Upper bound)
            }
          ]
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [metal, currency, selectedTimeRange, enablePrediction, confidenceLevel]);
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += currency === 'INR' 
                ? `₹${context.parsed.y.toLocaleString()}`
                : `$${context.parsed.y.toLocaleString()}`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxTicksLimit: 12,
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        position: 'right',
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          callback: function(value) {
            return currency === 'INR' 
              ? `₹${value.toLocaleString()}`
              : `$${value.toLocaleString()}`;
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      line: {
        tension: 0.3
      }
    }
  };

  return (
    <div className="historical-chart-container">
      <div className="chart-header">
        <h3>{metal} Price History & Prediction</h3>
        
        <div className="chart-controls">
          <div className="time-range-selector">
            {['1W', '1M', '3M', '6M', '1Y', '5Y'].map(range => (
              <button
                key={range}
                className={`time-range-btn ${selectedTimeRange === range ? 'active' : ''}`}
                onClick={() => setSelectedTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
          
          <div className="prediction-toggle">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={enablePrediction}
                onChange={() => setEnablePrediction(!enablePrediction)}
              />
              <span className="toggle-slider"></span>
            </label>
            <span>Show AI Prediction</span>
          </div>
        </div>
      </div>
      
      <div className="chart-body">
        {loading ? (
          <div className="chart-loading">Loading chart data...</div>
        ) : chartData ? (
          <div className="chart-wrapper">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="chart-error">Unable to load chart data</div>
        )}
      </div>
      
      <div className="chart-footer">
        <div className="chart-insights">
          <h4>AI Market Insights</h4>
          <p>
            Our AI analysis indicates a potential {Math.random() > 0.5 ? 'upward' : 'sideways'} trend for {metal} prices over the next 7 days,
            based on technical analysis and market sentiment. Key factors include central bank policies, 
            inflation data, and current geopolitical tensions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoricalChart;