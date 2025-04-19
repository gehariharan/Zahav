import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PriceCard from '../components/common/PriceCard';
import Card from '../components/common/Card';
import Alert from '../components/common/Alert';
import '../styles/PriceDashboard.css';

// Mock data for initial display (will be replaced with API calls)
const mockPrices = {
  gold: {
    INR: { bid: 62425, ask: 62625, dayHigh: 62850, dayLow: 62300 },
    USD: { bid: 2425.80, ask: 2428.50, dayHigh: 2435.20, dayLow: 2415.50 }
  },
  silver: {
    INR: { bid: 78250, ask: 78450, dayHigh: 78800, dayLow: 78100 },
    USD: { bid: 30.25, ask: 30.45, dayHigh: 30.75, dayLow: 30.15 }
  },
  platinum: {
    INR: { bid: 35625, ask: 35825, dayHigh: 36000, dayLow: 35500 },
    USD: { bid: 1385.50, ask: 1388.20, dayHigh: 1395.00, dayLow: 1380.25 }
  },
  palladium: {
    INR: { bid: 81250, ask: 81600, dayHigh: 82100, dayLow: 80900 },
    USD: { bid: 3160.75, ask: 3175.25, dayHigh: 3190.00, dayLow: 3145.50 }
  }
};

const currencyRates = {
  USD_INR: 81.45,
  EUR_INR: 88.25,
  GBP_INR: 104.30,
  JPY_INR: 0.61
};

const PriceDashboard = () => {
  const { authAxios } = useAuth();
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState(mockPrices);
  const [rates, setRates] = useState(currencyRates);
  const [displayCurrency, setDisplayCurrency] = useState('INR');
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data on initial load
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        // In a real app, these would be actual API calls
        // const pricesResponse = await authAxios.get('/prices/current');
        // const ratesResponse = await authAxios.get('/prices/currency-rates');
        
        // setPrices(pricesResponse.data);
        // setRates(ratesResponse.data);

        // For now, simulate API delay with mock data
        setTimeout(() => {
          setPrices(mockPrices);
          setRates(currencyRates);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching prices:', error);
        setError('Failed to load price data. Please try again later.');
        setLoading(false);
      }
    };

    fetchPrices();
  }, [authAxios]);

  // Function to refresh prices
  const handleRefresh = async (metal) => {
    setRefreshing(true);
    
    try {
      // In a real app, this would be an actual API call
      // const response = await authAxios.get(`/prices/current?metal=${metal}`);
      // const updatedPrice = response.data;
      
      // Simulate API call with slight variations to prices
      setTimeout(() => {
        // Create a random adjustment between -1% and 1%
        const adjustmentFactor = 1 + (Math.random() * 0.02 - 0.01);
        
        setPrices(prevPrices => ({
          ...prevPrices,
          [metal]: {
            INR: {
              bid: Math.round(prevPrices[metal].INR.bid * adjustmentFactor),
              ask: Math.round(prevPrices[metal].INR.ask * adjustmentFactor),
              dayHigh: prevPrices[metal].INR.dayHigh,
              dayLow: prevPrices[metal].INR.dayLow,
            },
            USD: {
              bid: parseFloat((prevPrices[metal].USD.bid * adjustmentFactor).toFixed(2)),
              ask: parseFloat((prevPrices[metal].USD.ask * adjustmentFactor).toFixed(2)),
              dayHigh: prevPrices[metal].USD.dayHigh,
              dayLow: prevPrices[metal].USD.dayLow,
            }
          }
        }));
        
        setRefreshing(false);
      }, 500);
    } catch (error) {
      console.error('Error refreshing prices:', error);
      setError('Failed to refresh prices. Please try again.');
      setRefreshing(false);
    }
  };

  const toggleCurrency = () => {
    setDisplayCurrency(prevCurrency => prevCurrency === 'INR' ? 'USD' : 'INR');
  };

  if (loading) {
    return <div className="loading-spinner">Loading prices...</div>;
  }

  return (
    <div className="price-dashboard-page">
      <header className="page-header">
        <h1>Price Dashboard</h1>
        <p className="timestamp">Last updated: {new Date().toLocaleString()}</p>
      </header>

      {error && <Alert type="error" message={error} />}

      <div className="controls">
        <div className="currency-toggle">
          <button 
            className={`currency-btn ${displayCurrency === 'INR' ? 'active' : ''}`} 
            onClick={() => setDisplayCurrency('INR')}
          >
            ₹ INR
          </button>
          <button 
            className={`currency-btn ${displayCurrency === 'USD' ? 'active' : ''}`} 
            onClick={() => setDisplayCurrency('USD')}
          >
            $ USD
          </button>
        </div>
        
        <button 
          className={`refresh-all-btn ${refreshing ? 'refreshing' : ''}`}
          onClick={() => {
            handleRefresh('gold');
            handleRefresh('silver');
            handleRefresh('platinum');
            handleRefresh('palladium');
          }}
          disabled={refreshing}
        >
          Refresh All Prices
        </button>
      </div>

      <div className="price-cards-grid">
        <PriceCard 
          metal="Gold"
          purity="999 Fine"
          bidPrice={prices.gold[displayCurrency].bid}
          askPrice={prices.gold[displayCurrency].ask}
          dayHigh={prices.gold[displayCurrency].dayHigh}
          dayLow={prices.gold[displayCurrency].dayLow}
          currency={displayCurrency}
          lastUpdated="Just now"
          onRefresh={() => handleRefresh('gold')}
        />

        <PriceCard 
          metal="Silver"
          purity="999 Fine"
          bidPrice={prices.silver[displayCurrency].bid}
          askPrice={prices.silver[displayCurrency].ask}
          dayHigh={prices.silver[displayCurrency].dayHigh}
          dayLow={prices.silver[displayCurrency].dayLow}
          currency={displayCurrency}
          lastUpdated="Just now"
          onRefresh={() => handleRefresh('silver')}
        />

        <PriceCard 
          metal="Platinum"
          purity="999 Fine"
          bidPrice={prices.platinum[displayCurrency].bid}
          askPrice={prices.platinum[displayCurrency].ask}
          dayHigh={prices.platinum[displayCurrency].dayHigh}
          dayLow={prices.platinum[displayCurrency].dayLow}
          currency={displayCurrency}
          lastUpdated="Just now"
          onRefresh={() => handleRefresh('platinum')}
        />

        <PriceCard 
          metal="Palladium"
          purity="999 Fine"
          bidPrice={prices.palladium[displayCurrency].bid}
          askPrice={prices.palladium[displayCurrency].ask}
          dayHigh={prices.palladium[displayCurrency].dayHigh}
          dayLow={prices.palladium[displayCurrency].dayLow}
          currency={displayCurrency}
          lastUpdated="Just now"
          onRefresh={() => handleRefresh('palladium')}
        />
      </div>

      <div className="additional-info">
        <Card title="Currency Exchange Rates" className="rates-card">
          <div className="rates-grid">
            <div className="rate-item">
              <div className="rate-pair">USD/INR</div>
              <div className="rate-value">{rates.USD_INR.toFixed(2)}</div>
            </div>
            <div className="rate-item">
              <div className="rate-pair">EUR/INR</div>
              <div className="rate-value">{rates.EUR_INR.toFixed(2)}</div>
            </div>
            <div className="rate-item">
              <div className="rate-pair">GBP/INR</div>
              <div className="rate-value">{rates.GBP_INR.toFixed(2)}</div>
            </div>
            <div className="rate-item">
              <div className="rate-pair">JPY/INR</div>
              <div className="rate-value">{rates.JPY_INR.toFixed(2)}</div>
            </div>
          </div>
        </Card>

        <Card title="Market Overview" className="market-overview-card">
          <p className="market-info">
            The precious metals market is showing stability today, with gold maintaining support at key price levels. Silver continues to perform well due to increased industrial demand.
          </p>
          <div className="price-change-indicators">
            <div className="indicator up">
              <span className="indicator-label">Gold 24h Change</span>
              <span className="indicator-value">+0.35%</span>
            </div>
            <div className="indicator up">
              <span className="indicator-label">Silver 24h Change</span>
              <span className="indicator-value">+0.68%</span>
            </div>
            <div className="indicator down">
              <span className="indicator-label">Platinum 24h Change</span>
              <span className="indicator-value">-0.12%</span>
            </div>
            <div className="indicator up">
              <span className="indicator-label">Palladium 24h Change</span>
              <span className="indicator-value">+0.24%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PriceDashboard;
