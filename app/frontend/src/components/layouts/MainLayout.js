import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/MainLayout.css';

const MainLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="main-layout">
      {/* Header */}
      <header className="main-header">
        <div className="container">
          <div className="navbar-container">
            <div className="navbar-logo">
              <h1>
                <NavLink to="/dashboard">Zahav</NavLink>
              </h1>
            </div>

            {/* Mobile Menu Button */}
            <button className="mobile-menu-button" onClick={toggleMobileMenu}>
              <span className="menu-icon"></span>
            </button>

            {/* Desktop Navigation */}
            <nav className="navbar-links desktop-menu">
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                Dashboard
              </NavLink>
              <NavLink to="/prices" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                Prices
              </NavLink>
              <NavLink to="/booking" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                Book Metal
              </NavLink>
              <NavLink to="/alerts" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                Alerts
              </NavLink>
              <NavLink to="/tracking" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                Tracking
              </NavLink>
              <NavLink to="/tools" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                Tools
              </NavLink>
            </nav>

            {/* User Menu */}
            <div className="user-menu">
              <div className="user-info">
                <span>{currentUser?.username}</span>
                <div className="user-dropdown">
                  <NavLink to="/profile" className="dropdown-item">Profile</NavLink>
                  <button onClick={handleLogout} className="dropdown-item">Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <nav className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} onClick={toggleMobileMenu}>
          Dashboard
        </NavLink>
        <NavLink to="/prices" className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} onClick={toggleMobileMenu}>
          Prices
        </NavLink>
        <NavLink to="/booking" className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} onClick={toggleMobileMenu}>
          Book Metal
        </NavLink>
        <NavLink to="/alerts" className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} onClick={toggleMobileMenu}>
          Alerts
        </NavLink>
        <NavLink to="/tracking" className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} onClick={toggleMobileMenu}>
          Tracking
        </NavLink>
        <NavLink to="/tools" className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} onClick={toggleMobileMenu}>
          Tools
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'mobile-link active' : 'mobile-link'} onClick={toggleMobileMenu}>
          Profile
        </NavLink>
        <button onClick={handleLogout} className="mobile-link logout-link">
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="main-footer">
        <div className="container">
          <p className="copyright">© {new Date().getFullYear()} Zahav Refinery. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
