import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/common/PriceCard.css';

const PriceCard = ({
  metal,
  purity,
  bidPrice,
  askPrice,
  dayHigh,
  dayLow,
  currency = 'INR',
  lastUpdated,
  onRefresh,
  className = '',
  onClick
}) => {
  // Helper to determine currency symbol and appropriate unit
  const getCurrencySymbol = (curr) => curr === 'INR' ? '₹' : '$';
  const getUnit = (met, curr) => {
    if (met.toLowerCase() === 'gold') {
      return curr === 'INR' ? '10g' : 'oz';
    } else if (met.toLowerCase() === 'silver') {
      return curr === 'INR' ? 'kg' : 'oz';
    }
    return 'unit';
  };

  // Determine the appropriate CSS class based on metal type
  const metalClass = metal.toLowerCase();
  
  // Handle card click
  const handleCardClick = (e) => {
    // Don't trigger if the click was on refresh button or a link
    if (
      e.target.className === 'refresh-button' || 
      e.target.className === 'refresh-icon' ||
      e.target.tagName === 'A'
    ) {
      return;
    }
    
    if (onClick) {
      onClick();
    }
  };

  return (
    <div 
      className={`price-card-component ${metalClass} ${className}`}
      onClick={handleCardClick}
    >
      <div className="price-card-header">
        <h3 className="price-card-title">{metal} ({purity})</h3>
        <div className="price-refresh">
          <button 
            className="refresh-button" 
            onClick={(e) => {
              e.stopPropagation();
              onRefresh();
            }} 
            title="Refresh price"
          >
            <span className="refresh-icon">↻</span>
          </button>
          <span className="last-updated">{lastUpdated || 'Just now'}</span>
        </div>
      </div>
      
      <div className="price-card-body">
        <div className="price-row">
          <div className="price-label">Bid</div>
          <div className="price-value">
            {getCurrencySymbol(currency)} {bidPrice.toLocaleString()}
            <span className="price-unit">/{getUnit(metal, currency)}</span>
          </div>
        </div>
        
        <div className="price-row">
          <div className="price-label">Ask</div>
          <div className="price-value">
            {getCurrencySymbol(currency)} {askPrice.toLocaleString()}
            <span className="price-unit">/{getUnit(metal, currency)}</span>
          </div>
        </div>
        
        <div className="price-range">
          <div className="range-item">
            <span className="range-label">Day High:</span>
            <span className="range-value">
              {getCurrencySymbol(currency)} {dayHigh.toLocaleString()}
            </span>
          </div>
          <div className="range-item">
            <span className="range-label">Day Low:</span>
            <span className="range-value">
              {getCurrencySymbol(currency)} {dayLow.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="price-card-footer">
        <Link 
          to={`/booking?metal=${metal.toLowerCase()}`} 
          className="btn btn-primary btn-sm"
          onClick={(e) => e.stopPropagation()}
        >
          Book Now
        </Link>
        <Link 
          to={`/alerts?metal=${metal.toLowerCase()}`} 
          className="btn btn-secondary btn-sm"
          onClick={(e) => e.stopPropagation()}
        >
          Set Alert
        </Link>
      </div>
    </div>
  );
};

export default PriceCard;