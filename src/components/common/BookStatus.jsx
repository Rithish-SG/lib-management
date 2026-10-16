import React from 'react';

/**
 * Reusable BookStatus Badge Component
 * Topics: Reusable UI Components, Conditional Rendering (Requirement 4.h)
 */
export default function BookStatus({ availableCopies, totalCopies, isBorrowed = false }) {
  if (isBorrowed) {
    return <span className="status-pill pill-neutral">✓ Borrowed by You</span>;
  }

  if (availableCopies > 0) {
    return (
      <span className="status-pill pill-success">
        ✓ {availableCopies} of {totalCopies} Available
      </span>
    );
  }

  return <span className="status-pill pill-danger">✕ Book currently unavailable</span>;
}
