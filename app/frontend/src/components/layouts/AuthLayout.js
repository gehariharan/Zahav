import React from 'react';
import { Outlet } from 'react-router-dom';
import '../../styles/AuthLayout.css';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-brand">
          <h1>Zahav</h1>
          <p className="tagline">Your Digital Gateway to the Bullion Market</p>
        </div>
        
        <div className="auth-form-container">
          <Outlet />
        </div>
        
        <div className="auth-footer">
          <p>&copy; {new Date().getFullYear()} Zahav Refinery. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
