import React from 'react';

/**
 * Reusable Loading Spinner Component
 * Topics: Reusable UI Components (Requirement 4.h)
 */
export default function Loading({ message = 'Loading library records...' }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
}
