import React from 'react';
import Button from './Button';

/**
 * Reusable BorrowButton Component
 * Conditionally renders Borrow, Hold, or Disabled button based on status
 * Topics: Reusable UI Components (Requirement 4.h)
 */
export default function BorrowButton({ book, isBorrowed, onBorrow, onHold }) {
  if (isBorrowed) {
    return (
      <Button variant="secondary" disabled title="You have already borrowed this book">
        Already Borrowed
      </Button>
    );
  }

  if (book.availableCopies > 0) {
    return (
      <Button variant="primary" onClick={() => onBorrow(book)}>
        📥 Borrow Book
      </Button>
    );
  }

  return (
    <Button variant="warning" onClick={() => onHold(book)} title="Out of stock - place a hold request">
      ⏳ Place Hold
    </Button>
  );
}
