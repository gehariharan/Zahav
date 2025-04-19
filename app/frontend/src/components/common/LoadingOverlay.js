import React from 'react';
import ProgressBar from './ProgressBar';
import '../../styles/common/LoadingOverlay.css';

/**
 * LoadingOverlay component for showing loading states over content
 * 
 * @param {Object} props Component props
 * @param {boolean} [props.loading=true] - Whether the overlay is visible
 * @param {string} [props.message='Loading...'] - Message to display
 * @param {string} [props.variant='primary'] - Color variant for the progress bar
 * @param {boolean} [props.fullScreen=false] - Whether to cover the entire screen
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element|null} LoadingOverlay component or null if not loading
 */
const LoadingOverlay = ({
  loading = true,
  message = 'Loading...',
  variant = 'primary',
  fullScreen = false,
  className = '',
  children,
  ...props
}) => {
  if (!loading) {
    return children || null;
  }

  const overlayClasses = [
    'loading-overlay',
    fullScreen ? 'loading-overlay-fullscreen' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="loading-overlay-container">
      {children}
      
      <div className={overlayClasses} {...props}>
        <div className="loading-overlay-content">
          <div className="loading-progress-container">
            <ProgressBar variant={variant} />
          </div>
          {message && <div className="loading-message">{message}</div>}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
