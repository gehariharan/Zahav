import React from 'react';
import '../../styles/common/ProgressBar.css';

/**
 * ProgressBar component for showing loading states
 * 
 * @param {Object} props Component props
 * @param {string} [props.variant='primary'] - Color variant (primary, secondary, success, warning, danger)
 * @param {string} [props.size='medium'] - Size variant (small, medium, large)
 * @param {boolean} [props.indeterminate=true] - Whether the progress bar is indeterminate (animated)
 * @param {number} [props.value=0] - Progress value (0-100) for determinate progress bars
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element} ProgressBar component
 */
const ProgressBar = ({
  variant = 'primary',
  size = 'medium',
  indeterminate = true,
  value = 0,
  className = '',
  ...props
}) => {
  const progressClasses = [
    'progress-container',
    `progress-${variant}`,
    `progress-${size}`,
    className
  ].filter(Boolean).join(' ');

  const barClasses = [
    'progress-bar',
    indeterminate ? 'progress-indeterminate' : ''
  ].filter(Boolean).join(' ');

  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={progressClasses} {...props}>
      <div 
        className={barClasses}
        style={!indeterminate ? { width: `${normalizedValue}%` } : undefined}
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : normalizedValue}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : 100}
      />
    </div>
  );
};

export default ProgressBar;
