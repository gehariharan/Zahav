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

  return (
    <div className={`price-card-component ${metalClass} ${className}`}>
      <div className="price-card-header">
        <h3 className="price-card-title">{metal} ({purity})</h3>
        <div className="price-refresh">
          <button className="refresh-button" onClick={onRefresh} title="Refresh price">
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
        <Link to={`/booking?metal=${metal.toLowerCase()}`} className="btn btn-primary btn-sm">
          Book Now
        </Link>
        <Link to={`/alerts?metal=${metal.toLowerCase()}`} className="btn btn-secondary btn-sm">
          Set Alert
        </Link>
      </div>
    </div>
  );
};

export default PriceCard;
