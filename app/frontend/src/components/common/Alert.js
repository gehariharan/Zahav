import React, { useState, useEffect } from 'react';
import '../../styles/common/Alert.css';

const Alert = ({ type = 'info', message, dismissible = true, duration = 0 }) => {
  const [visible, setVisible] = useState(true);

  // Auto-dismiss after duration (if specified)
  useEffect(() => {
    if (duration > 0 && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, visible]);

  if (!visible) return null;

  return (
    <div className={`alert-component alert-${type}`}>
      <div className="alert-content">{message}</div>
      {dismissible && (
        <button 
          className="alert-dismiss-btn" 
          onClick={() => setVisible(false)}
          aria-label="Close alert"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
