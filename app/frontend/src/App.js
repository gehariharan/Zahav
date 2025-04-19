import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PriceDashboard from './pages/PriceDashboard';
import BookingSystem from './pages/BookingSystem';
import RateAlerts from './pages/RateAlerts';
import TrackingSystem from './pages/TrackingSystem';
import DealerTools from './pages/DealerTools';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public route component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="register" element={<PublicRoute><Register /></PublicRoute>} />
      </Route>

      {/* Protected Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="prices" element={<ProtectedRoute><PriceDashboard /></ProtectedRoute>} />
        <Route path="booking" element={<ProtectedRoute><BookingSystem /></ProtectedRoute>} />
        <Route path="alerts" element={<ProtectedRoute><RateAlerts /></ProtectedRoute>} />
        <Route path="tracking" element={<ProtectedRoute><TrackingSystem /></ProtectedRoute>} />
        <Route path="tools" element={<ProtectedRoute><DealerTools /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
