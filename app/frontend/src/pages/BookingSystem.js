import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { LoadingOverlay } from '../components/common';
import '../styles/BookingSystem.css';

const BookingSystem = () => {
  const { authAxios, currentUser } = useAuth();
  const { addBooking, getRecentBookings, loading: bookingsLoading, error: bookingsError } = useBookings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [recentBookings, setRecentBookings] = useState([]);

  // Mock data for initial display
  const [metals] = useState([
    { id: 'gold', name: 'Gold', purity: ['999 Fine', '995 Fine', '916 (22K)'] },
    { id: 'silver', name: 'Silver', purity: ['999 Fine', '925 Sterling'] },
    { id: 'platinum', name: 'Platinum', purity: ['999 Fine'] },
    { id: 'palladium', name: 'Palladium', purity: ['999 Fine'] }
  ]);

  const [formData, setFormData] = useState({
    metal: '',
    purity: '',
    quantity: '',
    unit: 'grams',
    deliveryDate: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Load recent bookings when component mounts
  useEffect(() => {
    const loadRecentBookings = () => {
      const bookings = getRecentBookings(3); // Get 3 most recent bookings
      setRecentBookings(bookings);
    };

    loadRecentBookings();
  }, [getRecentBookings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Add the booking using the BookingContext
      const result = await addBooking(formData);

      if (result.success) {
        setSuccessMessage('Booking request submitted successfully! Our team will contact you shortly.');
        setFormData({
          metal: '',
          purity: '',
          quantity: '',
          unit: 'grams',
          deliveryDate: '',
          notes: ''
        });

        // Refresh the recent bookings list
        setRecentBookings(getRecentBookings(3));
      } else {
        setError(result.error || 'Failed to submit booking request. Please try again later.');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to submit booking request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-system-page">
      <header className="page-header">
        <h1>Metal Booking System</h1>
        <p>Reserve your precious metals at today's prices</p>
      </header>

      {error && <Alert type="error" message={error} />}
      {successMessage && <Alert type="success" message={successMessage} />}

      <div className="booking-content">
        <Card
          title="Create New Booking"
          className="booking-form-card"
          data-testid="booking-form"
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="metal">Metal Type</label>
              <select
                id="metal"
                name="metal"
                value={formData.metal}
                onChange={handleChange}
                required
                data-testid="booking-metal"
              >
                <option value="">Select Metal</option>
                {metals.map(metal => (
                  <option key={metal.id} value={metal.id}>{metal.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="purity">Purity</label>
              <select
                id="purity"
                name="purity"
                value={formData.purity}
                onChange={handleChange}
                required
                disabled={!formData.metal}
              >
                <option value="">Select Purity</option>
                {formData.metal && metals.find(m => m.id === formData.metal)?.purity.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="1"
                  required
                  data-testid="booking-amount"
                />
              </div>

              <div className="form-group">
                <label htmlFor="unit">Unit</label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  <option value="grams">Grams</option>
                  <option value="ounces">Troy Ounces</option>
                  <option value="kilos">Kilograms</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="deliveryDate">Preferred Delivery Date</label>
              <input
                type="date"
                id="deliveryDate"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
              ></textarea>
            </div>

            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                data-testid="submit-booking"
              >
                Submit Booking Request
              </Button>
            </div>
          </form>
        </Card>

        <Card
          title="Booking Calendar"
          className="booking-calendar-card"
          data-testid="booking-calendar"
        >
          <div className="calendar-placeholder">
            <p>Calendar view will be available soon.</p>
            <p>Our booking system allows you to reserve metals at current market prices with flexible delivery options.</p>
          </div>
        </Card>
      </div>

      <Card title="Your Recent Bookings" className="recent-bookings-card">
        {recentBookings.length > 0 ? (
          <div className="bookings-list" data-testid="booking-list">
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
          <div className="empty-state" data-testid="booking-list">
            <p>You don't have any recent bookings</p>
            <p>Fill out the form above to make your first booking</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default BookingSystem;
