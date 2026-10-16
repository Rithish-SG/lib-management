import React from 'react';
import { Link } from 'react-router-dom';
import Button from './common/Button';

/**
 * Experiment 7: BookCard with CRUD Actions (Edit, Delete, Borrow)
 * Topics: PUT/PATCH, DELETE, Borrowing CRUD Operations (7.c, 7.d, 7.e)
 */
export default function BookCard({ book, onEditBook, onDeleteBook, onBorrowBook, isBorrowed }) {
  const isAvailable = book.availableCopies > 0;

  return (
    <div className={`book-card ${!isAvailable ? 'card-unavailable' : ''}`}>
      <div className="card-badge-row">
        <span className="category-tag">{book.category}</span>
        <span className={`status-pill ${isAvailable ? 'pill-success' : 'pill-danger'}`}>
          {isAvailable ? `${book.availableCopies} available` : 'Out of Stock'}
        </span>
      </div>

      <div className="card-body">
        <h3 className="book-title" title={book.title}>
          <Link to={`/book/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {book.title}
          </Link>
        </h3>
        <p className="book-author">by <strong>{book.author}</strong></p>
        <div className="book-meta">
          <span>📅 {book.publishedYear}</span>
          <span>📍 {book.shelfLocation}</span>
        </div>
      </div>

      <div className="card-actions" style={{ flexWrap: 'wrap', gap: '0.4rem' }}>
        {/* View Details */}
        <Link to={`/book/${book.id}`} className="btn btn-secondary btn-sm">
          👁️ Details
        </Link>

        {/* c) Edit Book (PUT/PATCH) */}
        <Button variant="secondary" size="sm" onClick={() => onEditBook?.(book)} title="Update book information via PUT/PATCH">
          ✏️ Edit
        </Button>

        {/* d) Delete Book (DELETE) */}
        <Button variant="danger" size="sm" onClick={() => onDeleteBook?.(book)} title="Delete book record via DELETE">
          🗑️ Del
        </Button>

        {/* e) Borrow Book (POST /api/borrow) */}
        {isBorrowed ? (
          <Button variant="secondary" size="sm" disabled>
            Borrowed
          </Button>
        ) : isAvailable ? (
          <Button variant="primary" size="sm" onClick={() => onBorrowBook?.(book)}>
            📥 Borrow
          </Button>
        ) : (
          <Button variant="warning" size="sm" disabled title="Out of stock">
            Out of Stock
          </Button>
        )}
      </div>
    </div>
  );
}
