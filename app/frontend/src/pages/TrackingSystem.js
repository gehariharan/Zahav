import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import '../styles/TrackingSystem.css';

const TrackingSystem = () => {
  const { authAxios } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [trackingId, setTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  
  // Mock shipment data
  const mockShipments = [
    {
      id: 'ZHV-12345',
      status: 'In Transit',
      customer: 'ABC Jewellers',
      product: 'Gold Bars (999 Fine)',
      quantity: '500g',
      origin: 'Mumbai',
      destination: 'Delhi',
      estimatedDelivery: '2025-04-25',
      lastUpdated: '2025-04-20',
      timeline: [
        { date: '2025-04-18', status: 'Order Processed', location: 'Mumbai' },
        { date: '2025-04-19', status: 'Shipped', location: 'Mumbai' },
        { date: '2025-04-20', status: 'In Transit', location: 'Nagpur' }
      ]
    },
    {
      id: 'ZHV-67890',
      status: 'Delivered',
      customer: 'XYZ Traders',
      product: 'Silver Coins (999 Fine)',
      quantity: '10 kg',
      origin: 'Chennai',
      destination: 'Bangalore',
      estimatedDelivery: '2025-04-15',
      lastUpdated: '2025-04-15',
      timeline: [
        { date: '2025-04-12', status: 'Order Processed', location: 'Chennai' },
        { date: '2025-04-13', status: 'Shipped', location: 'Chennai' },
        { date: '2025-04-14', status: 'In Transit', location: 'Hosur' },
        { date: '2025-04-15', status: 'Delivered', location: 'Bangalore' }
      ]
    }
  ];

  const handleTrackingSubmit = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
    setLoading(true);
    setError(null);
    setTrackingResult(null);
    
    try {
      // In a real app, this would be an API call
      // const response = await authAxios.get(`/shipments/track/${trackingId}`);
      
      // Simulate API delay
      setTimeout(() => {
        const result = mockShipments.find(
          shipment => shipment.id.toLowerCase() === trackingId.toLowerCase()
        );
        
        if (result) {
          setTrackingResult(result);
        } else {
          setError(`No shipment found with tracking ID: ${trackingId}`);
        }
        
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error tracking shipment:', err);
      setError('Failed to retrieve tracking information. Please try again later.');
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'in transit':
        return 'status-transit';
      case 'processing':
        return 'status-processing';
      case 'delayed':
        return 'status-delayed';
      default:
        return '';
    }
  };

  return (
    <div className="tracking-system-page">
      <header className="page-header">
        <h1>Shipment Tracking</h1>
        <p>Track your precious metal shipments in real-time</p>
      </header>

      {error && <Alert type="error" message={error} />}
      {successMessage && <Alert type="success" message={successMessage} />}

      <Card className="tracking-search-card">
        <form onSubmit={handleTrackingSubmit} className="tracking-form">
          <div className="tracking-input-group">
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter tracking ID (e.g., ZHV-12345)"
              required
            />
            <Button 
              type="submit" 
              variant="primary" 
              loading={loading}
            >
              Track
            </Button>
          </div>
          <p className="tracking-hint">Enter your Zahav tracking ID to get real-time status updates</p>
        </form>
      </Card>

      {trackingResult && (
        <Card className="tracking-result-card">
          <div className="tracking-header">
            <div>
              <h2>Tracking ID: {trackingResult.id}</h2>
              <p>Last Updated: {new Date(trackingResult.lastUpdated).toLocaleDateString()}</p>
            </div>
            <div className={`shipment-status ${getStatusClass(trackingResult.status)}`}>
              {trackingResult.status}
            </div>
          </div>
          
          <div className="tracking-details">
            <div className="detail-row">
              <div className="detail-item">
                <span className="detail-label">Product:</span>
                <span className="detail-value">{trackingResult.product}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Quantity:</span>
                <span className="detail-value">{trackingResult.quantity}</span>
              </div>
            </div>
            
            <div className="detail-row">
              <div className="detail-item">
                <span className="detail-label">Origin:</span>
                <span className="detail-value">{trackingResult.origin}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Destination:</span>
                <span className="detail-value">{trackingResult.destination}</span>
              </div>
            </div>
            
            <div className="detail-row">
              <div className="detail-item">
                <span className="detail-label">Estimated Delivery:</span>
                <span className="detail-value">{new Date(trackingResult.estimatedDelivery).toLocaleDateString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Customer:</span>
                <span className="detail-value">{trackingResult.customer}</span>
              </div>
            </div>
          </div>
          
          <div className="tracking-timeline">
            <h3>Shipment Timeline</h3>
            <div className="timeline">
              {trackingResult.timeline.map((event, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <div className="timeline-date">{new Date(event.date).toLocaleDateString()}</div>
                    <div className="timeline-status">{event.status}</div>
                    <div className="timeline-location">{event.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      <Card title="Recent Shipments" className="recent-shipments-card">
        {mockShipments.length > 0 ? (
          <div className="shipments-list">
            {mockShipments.map(shipment => (
              <div key={shipment.id} className="shipment-item">
                <div className="shipment-info">
                  <div className="shipment-id">{shipment.id}</div>
                  <div className="shipment-product">{shipment.product}</div>
                  <div className="shipment-route">
                    {shipment.origin} → {shipment.destination}
                  </div>
                </div>
                <div className="shipment-meta">
                  <div className={`shipment-status ${getStatusClass(shipment.status)}`}>
                    {shipment.status}
                  </div>
                  <Button 
                    variant="text" 
                    onClick={() => {
                      setTrackingId(shipment.id);
                      setTrackingResult(shipment);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No recent shipments found</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TrackingSystem;
