import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Alert, AIAssistant } from '../components/common';
import { processAlertInput, generateResponse, getSuggestions } from '../utils/aiAssistant';
import '../styles/RateAlerts.css';

const RateAlerts = () => {
  const { authAxios } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock data for initial display
  const [metals] = useState([
    { id: 'gold', name: 'Gold' },
    { id: 'silver', name: 'Silver' },
    { id: 'platinum', name: 'Platinum' },
    { id: 'palladium', name: 'Palladium' }
  ]);

  const [activeAlerts, setActiveAlerts] = useState([
    // Empty initially - will be populated from API in a real app
  ]);

  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMessages, setAIMessages] = useState([]);
  const [aiProcessing, setAIProcessing] = useState(false);

  const [formData, setFormData] = useState({
    metal: '',
    condition: 'above',
    value: '',
    currency: 'INR',
    notificationMethod: 'email'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call
      // await authAxios.post('/alerts', formData);

      // Simulate API delay and response
      setTimeout(() => {
        const newAlert = {
          id: Date.now().toString(),
          metal: formData.metal,
          metalName: metals.find(m => m.id === formData.metal).name,
          condition: formData.condition,
          value: parseFloat(formData.value),
          currency: formData.currency,
          notificationMethod: formData.notificationMethod,
          createdAt: new Date().toISOString()
        };

        setActiveAlerts(prev => [newAlert, ...prev]);
        setSuccessMessage('Price alert created successfully!');
        setFormData({
          metal: '',
          condition: 'above',
          value: '',
          currency: 'INR',
          notificationMethod: 'email'
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error creating alert:', err);
      setError('Failed to create price alert. Please try again later.');
      setLoading(false);
    }
  };

  const handleDeleteAlert = (alertId) => {
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setSuccessMessage('Alert deleted successfully');
  };

  // Handle AI Assistant message submission
  const handleAIMessage = async (message) => {
    // Add user message to chat
    setAIMessages(prev => [...prev, { sender: 'user', text: message }]);
    setAIProcessing(true);

    // Process the message
    setTimeout(() => {
      const result = processAlertInput(message);

      // Add assistant response
      setAIMessages(prev => [...prev, {
        sender: 'assistant',
        text: generateResponse(result, 'alert')
      }]);

      // If successful, create the alert
      if (result.success) {
        const data = result.data;
        const newAlert = {
          id: Date.now().toString(),
          metal: data.metal,
          metalName: metals.find(m => m.id === data.metal)?.name || data.metal.charAt(0).toUpperCase() + data.metal.slice(1),
          condition: data.condition,
          value: data.value,
          currency: data.currency,
          notificationMethod: data.notificationMethod,
          createdAt: new Date().toISOString()
        };

        setActiveAlerts(prev => [newAlert, ...prev]);
      }

      setAIProcessing(false);
    }, 1000); // Simulate processing delay
  };

  // Clear AI chat history
  const clearAIChat = () => {
    setAIMessages([]);
  };

  // Toggle between form and AI assistant
  const toggleAIAssistant = () => {
    setShowAIAssistant(prev => !prev);
  };

  return (
    <div className="rate-alerts-page">
      <header className="page-header">
        <h1>Rate Alerts</h1>
        <p>Get notified when metal prices reach your target</p>
        <div className="alerts-mode-toggle">
          <Button
            variant={showAIAssistant ? "secondary" : "primary"}
            onClick={toggleAIAssistant}
          >
            {showAIAssistant ? "Switch to Form" : "Use AI Assistant"}
          </Button>
        </div>
      </header>

      {error && <Alert type="error" message={error} />}
      {successMessage && <Alert type="success" message={successMessage} duration={5000} />}

      <div className="alerts-content">
        {showAIAssistant ? (
          <Card
            title="AI Alert Assistant"
            className="alert-ai-card"
          >
            <AIAssistant
              onSubmit={handleAIMessage}
              suggestions={getSuggestions('alert')}
              placeholder="Describe the alert you want to create..."
              loading={aiProcessing}
              assistantName="Zahav Alert Assistant"
              messages={aiMessages}
              onClear={clearAIChat}
              className="alert-assistant"
            />
          </Card>
        ) : (
          <Card
            title="Create New Alert"
            className="alert-form-card"
          >
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="metal">Metal</label>
                <select
                  id="metal"
                  name="metal"
                  value={formData.metal}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Metal</option>
                  {metals.map(metal => (
                    <option key={metal.id} value={metal.id}>{metal.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="condition">Condition</label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                  >
                    <option value="above">Price Goes Above</option>
                    <option value="below">Price Goes Below</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="currency">Currency</label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="value">Target Price</label>
                <input
                  type="number"
                  id="value"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="notificationMethod">Notification Method</label>
                <select
                  id="notificationMethod"
                  name="notificationMethod"
                  value={formData.notificationMethod}
                  onChange={handleChange}
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push Notification</option>
                  <option value="all">All Methods</option>
                </select>
              </div>

              <div className="form-actions">
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                >
                  Create Alert
                </Button>
              </div>
            </form>
          </Card>
        )}

        <Card
          title="Active Alerts"
          className="active-alerts-card"
        >
          {activeAlerts.length > 0 ? (
            <div className="alerts-list">
              {activeAlerts.map(alert => (
                <div key={alert.id} className="alert-item">
                  <div className="alert-info">
                    <div className="alert-primary">
                      <span className="alert-metal">{alert.metalName}</span>
                      <span className="alert-condition">
                        {alert.condition === 'above' ? '↑' : '↓'}
                        {alert.condition.charAt(0).toUpperCase() + alert.condition.slice(1)}
                      </span>
                    </div>
                    <div className="alert-value">
                      {alert.currency === 'INR' ? '₹' : alert.currency === 'USD' ? '$' : '€'}
                      {alert.value.toLocaleString()}
                    </div>
                  </div>
                  <div className="alert-actions">
                    <Button variant="text">Edit</Button>
                    <Button
                      variant="text"
                      className="text-danger"
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No active alerts</p>
              <p>Create an alert to get notified when prices reach your target</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RateAlerts;
