import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create the booking context
const BookingContext = createContext();

// Custom hook to use the booking context
export const useBookings = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const { authAxios, currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load bookings from localStorage on initial render
  useEffect(() => {
    const loadBookings = () => {
      try {
        const savedBookings = localStorage.getItem('zahav_bookings');
        if (savedBookings) {
          setBookings(JSON.parse(savedBookings));
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading bookings from localStorage:', err);
        setError('Failed to load bookings. Please try again later.');
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem('zahav_bookings', JSON.stringify(bookings));
    }
  }, [bookings]);

  // Add a new booking
  const addBooking = async (bookingData) => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // const response = await authAxios.post('/bookings', bookingData);
      // const newBooking = response.data;
      
      // For now, create a mock booking with the submitted data
      const newBooking = {
        id: Date.now().toString(), // Generate a unique ID
        metal: bookingData.metal.charAt(0).toUpperCase() + bookingData.metal.slice(1),
        purity: bookingData.purity,
        quantity: parseFloat(bookingData.quantity),
        unit: bookingData.unit,
        price: bookingData.metal === 'gold' ? 62425 : 78250, // Mock price based on metal
        currency: 'INR',
        total: bookingData.metal === 'gold' 
          ? parseFloat(bookingData.quantity) * 62425 
          : parseFloat(bookingData.quantity) * 78250,
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
        user_id: currentUser?.id || 'guest',
        notes: bookingData.notes,
        deliveryDate: bookingData.deliveryDate
      };
      
      // Add the new booking to the state
      setBookings(prevBookings => [newBooking, ...prevBookings]);
      setLoading(false);
      
      return { success: true, booking: newBooking };
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking. Please try again later.');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Get recent bookings
  const getRecentBookings = (limit = 5) => {
    // Sort bookings by date (newest first) and return the specified number
    return [...bookings]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  // Get a specific booking by ID
  const getBookingById = (id) => {
    return bookings.find(booking => booking.id === id);
  };

  // Update a booking
  const updateBooking = async (id, updatedData) => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // await authAxios.put(`/bookings/${id}`, updatedData);
      
      // Update the booking in state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === id ? { ...booking, ...updatedData } : booking
        )
      );
      
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Error updating booking:', err);
      setError('Failed to update booking. Please try again later.');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Delete a booking
  const deleteBooking = async (id) => {
    try {
      setLoading(true);
      
      // In a real app, this would be an API call
      // await authAxios.delete(`/bookings/${id}`);
      
      // Remove the booking from state
      setBookings(prevBookings => 
        prevBookings.filter(booking => booking.id !== id)
      );
      
      setLoading(false);
      return { success: true };
    } catch (err) {
      console.error('Error deleting booking:', err);
      setError('Failed to delete booking. Please try again later.');
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Clear all bookings (for testing/development)
  const clearAllBookings = () => {
    localStorage.removeItem('zahav_bookings');
    setBookings([]);
  };

  // Context value
  const value = {
    bookings,
    loading,
    error,
    addBooking,
    getRecentBookings,
    getBookingById,
    updateBooking,
    deleteBooking,
    clearAllBookings
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export default BookingContext;
