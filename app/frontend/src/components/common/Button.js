import React from 'react';
import '../../styles/common/Button.css';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  onClick,
  ...props
}) => {
  const buttonClasses = [
    'custom-button',
    `button-${variant}`,
    `button-${size}`,
    fullWidth ? 'button-full-width' : '',
    loading ? 'button-loading' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && <span className="progress-bar"></span>}
      <span className={loading ? 'button-text-with-loader' : ''}>{children}</span>
    </button>
  );
};

export default Button;
