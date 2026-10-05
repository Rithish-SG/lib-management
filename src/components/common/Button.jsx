import React from 'react';

/**
 * Reusable Button Component
 * Topics: Reusable UI Components (Requirement 4.h)
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  title = ''
}) {
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';

  return (
    <button
      type={type}
      className={`btn ${variantClass} ${sizeClass} ${disabled ? 'btn-disabled' : ''} ${className}`}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}
