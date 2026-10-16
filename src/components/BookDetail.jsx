import React from 'react';

export default function BookDetail({ book, onClose, onBorrow, onPlaceHold, isBorrowedByMember }) {
  if (!book) return null;

  const isAvailable = book.availableCopies > 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="category-tag">{book.category}</span>
            <h2 className="modal-title">{book.title}</h2>
            <p className="modal-author">by {book.author}</p>
          </div>
          <button type="button" className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-meta-grid">
            <div className="meta-box"><span className="meta-label">Book ID</span><span className="meta-value">#{book.id}</span></div>
            <div className="meta-box"><span className="meta-label">ISBN</span><span className="meta-value">{book.isbn}</span></div>
            <div className="meta-box"><span className="meta-label">Published</span><span className="meta-value">{book.publishedYear}</span></div>
            <div className="meta-box"><span className="meta-label">Shelf Location</span><span className="meta-value">{book.shelfLocation}</span></div>
            <div className="meta-box"><span className="meta-label">Total Copies</span><span className="meta-value">{book.totalCopies}</span></div>
            <div className="meta-box"><span className="meta-label">Available Copies</span><span className={`meta-value ${isAvailable ? 'text-success' : 'text-danger'}`}>{book.availableCopies} of {book.totalCopies}</span></div>
          </div>

          <div className="detail-section">
            <h4>Description & Overview</h4>
            <p className="book-description">{book.description}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Back to List
          </button>

          {isBorrowedByMember ? (
            <button type="button" className="btn btn-disabled" disabled>
              ✓ Currently In Your Borrowed List
            </button>
          ) : isAvailable ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onBorrow(book);
                onClose();
              }}
            >
              📥 Borrow This Book
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => {
                onPlaceHold(book);
                onClose();
              }}
            >
              ⏳ Place a Hold Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
