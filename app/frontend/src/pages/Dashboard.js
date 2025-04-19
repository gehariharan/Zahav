import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

// Mock data for initial display (will be replaced with API calls)
const mockPrices = {
  gold: {
    INR: { bid: 62425, ask: 62625, dayHigh: 62850, dayLow: 62300 },
    USD: { bid: 2425.80, ask: 2428.50, dayHigh: 2435.20, dayLow: 2415.50 }
  },
  silver: {
    INR: { bid: 78250, ask: 78450, dayHigh: 78800, dayLow: 78100 },
    USD: { bid: 30.25, ask: 30.45, dayHigh: 30.75, dayLow: 30.15 }
  }
};

const mockBookings = [
  { id: 1, metal: 'Gold', purity: '999', quantity: 100, unit: 'g', price: 62425, currency: 'INR', total: 6242500, status: 'completed', date: '2025-04-15' },
  { id: 2, metal: 'Silver', purity: '999', quantity: 5, unit: 'kg', price: 78250, currency: 'INR', total: 391250, status: 'pending', date: '2025-04-18' }
];

const mockAlerts = [
  { id: 1, metal: 'Gold', condition: 'above', value: 2450, currency: 'USD', active: true },
  { id: 2, metal: 'Silver', condition: 'below', value: 29.5, currency: 'USD', active: true }
];

const Dashboard = () => {
  const { currentUser, authAxios } = useAuth();
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState(mockPrices);
  const [recentBookings, setRecentBookings] = useState(mockBookings);
  const [activeAlerts, setActiveAlerts] = useState(mockAlerts);
  const [currency, setCurrency] = useState('INR');
  const [error, setError] = useState(null);

  // Fetch data effect
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, these would be actual API calls
        // const pricesResponse = await authAxios.get('/prices/current');
        // const bookingsResponse = await authAxios.get('/bookings?limit=3');
        // const alertsResponse = await authAxios.get('/alerts?is_active=true&limit=3');

        // setPrices(pricesResponse.data);
        // setRecentBookings(bookingsResponse.data);
        // setActiveAlerts(alertsResponse.data);

        // For now, simulate API delay with mock data
        setTimeout(() => {
          setPrices(mockPrices);
          setRecentBookings(mockBookings);
          setActiveAlerts(mockAlerts);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authAxios]);

  const toggleCurrency = () => {
    setCurrency(prevCurrency => prevCurrency === 'INR' ? 'USD' : 'INR');
  };

  if (loading) {
    return <div className="loading-spinner">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Welcome, {currentUser?.company_name || currentUser?.username}</h1>
        <p className="date-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>

      <div className="currency-toggle">
        <button 
          className={`currency-btn ${currency === 'INR' ? 'active' : ''}`} 
          onClick={() => setCurrency('INR')}
        >
          ₹ INR
        </button>
        <button 
          className={`currency-btn ${currency === 'USD' ? 'active' : ''}`} 
          onClick={() => setCurrency('USD')}
        >
          $ USD
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Price Cards */}
        <section className="price-cards">
          <div className="card price-card gold">
            <div className="card-header">
              <h3 className="card-title">Gold (999 Fine)</h3>
              <div className="refresh-timestamp">
                <button className="refresh-btn" title="Refresh prices">
                  ↻
                </button>
                <span className="timestamp">Last updated: just now</span>
              </div>
            </div>
            <div className="price-details">
              <div className="price-row">
                <div className="price-label">Bid</div>
                <div className="price-value">
                  {currency === 'INR' ? '₹' : '$'} 
                  {prices.gold[currency].bid.toLocaleString()}
                  <span className="price-unit">/{currency === 'INR' ? '10g' : 'oz'}</span>
                </div>
              </div>
              <div className="price-row">
                <div className="price-label">Ask</div>
                <div className="price-value">
                  {currency === 'INR' ? '₹' : '$'} 
                  {prices.gold[currency].ask.toLocaleString()}
                  <span className="price-unit">/{currency === 'INR' ? '10g' : 'oz'}</span>
                </div>
              </div>
              <div className="price-range">
                <div>
                  <span className="range-label">Day High:</span> 
                  {currency === 'INR' ? '₹' : '$'} 
                  {prices.gold[currency].dayHigh.toLocaleString()}
                </div>
                <div>
                  <span className="range-label">Day Low:</span> 
                  {currency === 'INR' ? '₹' : '$'} 
                  {prices.gold[currency].dayLow.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="card-actions">
              <Link to="/booking?metal=gold" className="btn btn-primary">Book Now</Link>
              <Link to="/alerts?metal=gold" className="btn btn-secondary">Set Alert</Link>
            </div>
          </div>

          <div className="card price-card silver">
            <div className="card-header">
              <h3 className="card-title">Silver (999 Fine)</h3>
              <div className="refresh-timestamp">
                <button className="refresh-btn" title="Refresh prices">
                  ↻
                </button>
                <span className="timestamp">Last updated: just now</span>
              </div>
            </div>
            <div className="price-details">
              <div className="price-row">
                <div className="price-label">Bid</div>
                <div className="price-value">
                  {currency === 'INR' ? '₹' : '$'} 
                  {prices.silver[currency].bid.toLocaleString()}
                  <span className="price-unit">/{currency === 'INR' ? 'kg' : 'oz'}</span>
                </div>
              </div>
              <div className="price-row">
                <div className="price-label">Ask</div>
                <div className="price-value">
                  {currency === 'INR' ? '₹' : '$'} 
                  {prices.silver[currency].ask.toLocaleString()}
                  <span className="price-unit">/{currency === 'INR' ? 'kg' : 'oz'}</span>
                </div>
              </div>
              <div className="price-range">
                <div>
                  <span className="range-label">Day High:</span> 
                  {currency === 'INR' ? '₹' : '$'} 
                  {prices.silver[currency].dayHigh.toLocaleString()}
                </div>
                <div>
                  <span className="range-label">Day Low:</span> 
                  {currency === 'INR' ? '₹' : '$'} 
                  {prices.silver[currency].dayLow.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="card-actions">
              <Link to="/booking?metal=silver" className="btn btn-primary">Book Now</Link>
              <Link to="/alerts?metal=silver" className="btn btn-secondary">Set Alert</Link>
            </div>
          </div>
        </section>

        {/* Recent Bookings */}
        <section className="card recent-bookings">
          <div className="card-header">
            <h3 className="card-title">Recent Bookings</h3>
            <Link to="/booking" className="view-all-link">View All</Link>
          </div>
          
          {recentBookings.length > 0 ? (
            <div className="bookings-list">
              {recentBookings.map(booking => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-info">
                    <div className="booking-primary">
                      <span className="booking-metal">{booking.metal}</span>
                      <span className="booking-quantity">{booking.quantity} {booking.unit}</span>
                    </div>
                    <div className="booking-secondary">
                      <span className="booking-date">{booking.date}</span>
                      <span className={`booking-status status-${booking.status}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="booking-price">
                    {booking.currency === 'INR' ? '₹' : '$'} {booking.total.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No recent bookings found</p>
              <Link to="/booking" className="btn btn-primary">Make Your First Booking</Link>
            </div>
          )}
        </section>

        {/* Active Alerts */}
        <section className="card active-alerts">
          <div className="card-header">
            <h3 className="card-title">Active Alerts</h3>
            <Link to="/alerts" className="view-all-link">View All</Link>
          </div>
          
          {activeAlerts.length > 0 ? (
            <div className="alerts-list">
              {activeAlerts.map(alert => (
                <div key={alert.id} className="alert-item">
                  <div className="alert-info">
                    <div className="alert-primary">
                      <span className="alert-metal">{alert.metal}</span>
                      <span className="alert-condition">
                        {alert.condition === 'above' ? '↑' : '↓'} 
                        {alert.condition.charAt(0).toUpperCase() + alert.condition.slice(1)}
                      </span>
                    </div>
                    <div className="alert-value">
                      {alert.currency === 'INR' ? '₹' : '$'} {alert.value.toLocaleString()}
                    </div>
                  </div>
                  <div className="alert-actions">
                    <button className="btn btn-link">Edit</button>
                    <button className="btn btn-link text-danger">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No active alerts found</p>
              <Link to="/alerts" className="btn btn-primary">Set New Alert</Link>
            </div>
          )}
        </section>

        {/* Market News Snapshot */}
        <section className="card market-news">
          <div className="card-header">
            <h3 className="card-title">Market News</h3>
            <Link to="/news" className="view-all-link">View All</Link>
          </div>
          
          <div className="news-list">
            <div className="news-item">
              <h4 className="news-title">Gold prices steady as investors await US inflation data</h4>
              <p className="news-meta">Financial Times • 2 hours ago</p>
            </div>
            <div className="news-item">
              <h4 className="news-title">Silver outpaces gold as industrial demand rises</h4>
              <p className="news-meta">Reuters • 5 hours ago</p>
            </div>
            <div className="news-item">
              <h4 className="news-title">Central banks continue gold buying streak in Q1 2025</h4>
              <p className="news-meta">Bloomberg • Yesterday</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
