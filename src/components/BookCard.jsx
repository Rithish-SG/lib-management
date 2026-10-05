import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';

/**
 * Experiment 3: BookCard Component with React Router Link
 * Directs users to dynamic route /book/:id without page reload
 */
export default function BookCard({ book }) {
  const { borrowBook, placeHold, borrowedBookIds } = useLibrary();
  const navigate = useNavigate();

  const isAvailable = book.availableCopies > 0;
  const isBorrowed = borrowedBookIds.has(book.id);

  return (
    <div className={`book-card ${!isAvailable ? 'card-unavailable' : ''}`}>
      <div className="card-badge-row">
        <span className="category-tag">{book.category}</span>
        <span className={`status-pill ${isAvailable ? 'pill-success' : 'pill-danger'}`}>
          {isAvailable ? `${book.availableCopies} available` : 'Book currently unavailable'}
        </span>
      </div>

      <div className="card-body">
        {/* b) Use Link for SPA navigation to dynamic route /book/:id */}
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

      <div className="card-actions">
        {/* b & c) Link to dynamic route /book/:id */}
        <Link to={`/book/${book.id}`} className="btn btn-secondary">
          👁️ Details
        </Link>

        {isBorrowed ? (
          <button type="button" className="btn btn-disabled" disabled>
            Already Borrowed
          </button>
        ) : isAvailable ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              // Direct quick borrow or navigate to request flow
              navigate(`/book/${book.id}/borrow`);
            }}
          >
            📥 Borrow
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-warning"
            onClick={() => {
              navigate(`/book/${book.id}/borrow`);
            }}
          >
            ⏳ Place Hold
          </button>
        )}
      </div>
    </div>
  );
}
