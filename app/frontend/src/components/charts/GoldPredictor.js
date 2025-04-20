import React, { useState } from 'react';
import '../../styles/charts/GoldPredictor.css';
import Card from '../common/Card';

const GoldPredictor = ({ currentPrice, currency = 'INR' }) => {
  const [timeHorizon, setTimeHorizon] = useState('1w'); // 1w, 1m, 3m
  const [loading, setLoading] = useState(false);
  
  // Mock prediction data - would be replaced with API calls
  const predictions = {
    '1w': {
      predictedPrice: currency === 'INR' ? 63250 : 2450.75,
      changePercent: 1.32,
      confidence: 92,
      factors: [
        { name: 'US Dollar Strength', impact: -0.4, importance: 'high' },
        { name: 'Inflation Data', impact: 0.8, importance: 'critical' },
        { name: 'Market Sentiment', impact: 0.65, importance: 'medium' },
        { name: 'Central Bank Policy', impact: 0.27, importance: 'high' }
      ]
    },
    '1m': {
      predictedPrice: currency === 'INR' ? 64700 : 2510.25,
      changePercent: 3.64,
      confidence: 87,
      factors: [
        { name: 'Global Recession Risk', impact: 0.95, importance: 'high' },
        { name: 'Bond Yields', impact: -0.35, importance: 'medium' },
        { name: 'ETF Flows', impact: 0.46, importance: 'medium' },
        { name: 'Geopolitical Tensions', impact: 0.75, importance: 'high' }
      ]
    },
    '3m': {
      predictedPrice: currency === 'INR' ? 67200 : 2605.50,
      changePercent: 7.64,
      confidence: 78,
      factors: [
        { name: 'Monetary Policy Outlook', impact: 0.85, importance: 'critical' },
        { name: 'Physical Demand', impact: 0.55, importance: 'medium' },
        { name: 'Inflation Trajectory', impact: 0.78, importance: 'high' },
        { name: 'Dollar Index', impact: -0.45, importance: 'high' }
      ]
    }
  };
  
  // Helper function to get impact color
  const getImpactColor = (impact) => {
    if (impact > 0.6) return '#4CAF50'; // Strong positive - green
    if (impact > 0.2) return '#8BC34A'; // Positive - light green
    if (impact > -0.2) return '#FFD700'; // Neutral - gold
    if (impact > -0.6) return '#FFA726'; // Negative - orange
    return '#F44336'; // Strong negative - red
  };
  
  // Helper function to get importance badge style
  const getImportanceBadge = (importance) => {
    switch (importance) {
      case 'critical':
        return { className: 'importance-badge critical', label: 'Critical' };
      case 'high':
        return { className: 'importance-badge high', label: 'High' };
      case 'medium':
        return { className: 'importance-badge medium', label: 'Medium' };
      case 'low':
        return { className: 'importance-badge low', label: 'Low' };
      default:
        return { className: 'importance-badge medium', label: 'Medium' };
    }
  };
  
  const formatTimeHorizon = (horizon) => {
    switch (horizon) {
      case '1w': return '1 Week';
      case '1m': return '1 Month';
      case '3m': return '3 Months';
      default: return horizon;
    }
  };
  
  const handleTimeHorizonChange = (horizon) => {
    setLoading(true);
    setTimeHorizon(horizon);
    
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };
  
  const prediction = predictions[timeHorizon];
  const currencySymbol = currency === 'INR' ? '₹' : '$';
  
  return (
    <Card title="AI Gold Price Predictor" className="gold-predictor-card">
      <div className="predictor-content">
        <div className="time-horizon-selector">
          <span>Prediction timeframe:</span>
          <div className="selector-buttons">
            <button 
              className={`horizon-btn ${timeHorizon === '1w' ? 'active' : ''}`}
              onClick={() => handleTimeHorizonChange('1w')}
            >
              1 Week
            </button>
            <button 
              className={`horizon-btn ${timeHorizon === '1m' ? 'active' : ''}`}
              onClick={() => handleTimeHorizonChange('1m')}
            >
              1 Month
            </button>
            <button 
              className={`horizon-btn ${timeHorizon === '3m' ? 'active' : ''}`}
              onClick={() => handleTimeHorizonChange('3m')}
            >
              3 Months
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="predictor-loading">Generating AI prediction...</div>
        ) : (
          <>
            <div className="prediction-summary">
              <div className="prediction-header">
                <h4>{formatTimeHorizon(timeHorizon)} Gold Price Prediction</h4>
                <div className="confidence-indicator">
                  <span>AI Confidence:</span>
                  <div className="confidence-meter">
                    <div 
                      className="confidence-level" 
                      style={{ width: `${prediction.confidence}%` }}
                    ></div>
                  </div>
                  <span className="confidence-percent">{prediction.confidence}%</span>
                </div>
              </div>
              
              <div className="price-prediction">
                <div className="current-price">
                  <span>Current:</span>
                  <span className="price">{currencySymbol}{currentPrice.toLocaleString()}</span>
                </div>
                <div className="arrow-icon">
                  {prediction.changePercent >= 0 ? '↗' : '↘'}
                </div>
                <div className="predicted-price">
                  <span>Predicted:</span>
                  <span className="price">{currencySymbol}{prediction.predictedPrice.toLocaleString()}</span>
                  <span className={`change-percent ${prediction.changePercent >= 0 ? 'positive' : 'negative'}`}>
                    {prediction.changePercent >= 0 ? '+' : ''}{prediction.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div className="key-factors">
              <h4>Key Influencing Factors</h4>
              <div className="factors-list">
                {prediction.factors.map((factor, index) => (
                  <div key={index} className="factor-item">
                    <div className="factor-name">
                      <span>{factor.name}</span>
                      <span className={getImportanceBadge(factor.importance).className}>
                        {getImportanceBadge(factor.importance).label}
                      </span>
                    </div>
                    <div className="factor-impact">
                      <div className="impact-meter">
                        <div 
                          className="impact-level" 
                          style={{ 
                            width: `${Math.abs(factor.impact) * 100}%`, 
                            backgroundColor: getImpactColor(factor.impact),
                            marginLeft: factor.impact < 0 ? `${(1 - Math.abs(factor.impact)) * 100}%` : '0'
                          }}
                        ></div>
                      </div>
                      <span 
                        className="impact-value"
                        style={{ color: getImpactColor(factor.impact) }}
                      >
                        {factor.impact >= 0 ? '+' : ''}{factor.impact.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="ai-insight">
              <h4>AI Analysis Summary</h4>
              <p>
                Based on our AI analysis of {prediction.factors.length} key market factors, 
                gold prices are projected to {prediction.changePercent >= 0 ? 'increase' : 'decrease'} by 
                approximately {Math.abs(prediction.changePercent).toFixed(2)}% over the next {formatTimeHorizon(timeHorizon).toLowerCase()}. 
                {prediction.confidence >= 90 
                  ? ' Our model shows high confidence in this projection based on current market conditions.'
                  : prediction.confidence >= 80 
                    ? ' Our model shows good confidence in this trend direction, though magnitude may vary.'
                    : ' This projection has moderate confidence due to potential market volatility.'}
              </p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default GoldPredictor;