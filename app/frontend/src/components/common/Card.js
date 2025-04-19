import React from 'react';
import '../../styles/common/Card.css';

const Card = ({ 
  children, 
  title, 
  subtitle, 
  action, 
  footer, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`custom-card ${className}`} {...props}>
      {(title || action) && (
        <div className="card-header">
          <div className="card-header-content">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      
      <div className="card-body">
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
