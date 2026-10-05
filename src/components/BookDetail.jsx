import React from 'react';
import { useLibrary } from '../context/LibraryContext';

// BookDetail Modal Component consuming selectedBook and actions directly from LibraryContext
export default function BookDetail() {
  const {
    selectedBook,
    setSelectedBook,
    borrowBook,
    placeHold,
    borrowedBookIds
  } = useLibrary();

  if (!selectedBook) return null;

  const isAvailable = selectedBook.availableCopies > 0;
  const isBorrowed = borrowedBookIds.has(selectedBook.id);

  const handleClose = () => setSelectedBook(null);

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="category-tag">{selectedBook.category}</span>
            <h2 className="modal-title">{selectedBook.title}</h2>
            <p className="modal-author">by {selectedBook.author}</p>
          </div>
          <button type="button" className="close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* h) Conditional Rendering: Alert banner when book is currently unavailable */}
          {!isAvailable && (
            <div className="notice-box" style={{ backgroundColor: '#fef2f2', borderColor: '#ef4444', color: '#991b1b' }}>
              <strong>Notice:</strong> Book currently unavailable. You can reserve this title by placing a hold request below.
            </div>
          )}

          <div className="detail-meta-grid">
            <div className="meta-box">
              <span className="meta-label">Book ID</span>
              <span className="meta-value">#{selectedBook.id}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">ISBN</span>
              <span className="meta-value">{selectedBook.isbn}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Published</span>
              <span className="meta-value">{selectedBook.publishedYear}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Shelf Location</span>
              <span className="meta-value">{selectedBook.shelfLocation}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Total Copies</span>
              <span className="meta-value">{selectedBook.totalCopies}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Available Copies</span>
              <span className={`meta-value ${isAvailable ? 'text-success' : 'text-danger'}`}>
                {isAvailable ? `${selectedBook.availableCopies} of ${selectedBook.totalCopies}` : 'Book currently unavailable'}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h4>Description & Overview</h4>
            <p className="book-description">{selectedBook.description}</p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleClose}>
            Back to Catalog
          </button>

          {isBorrowed ? (
            <button type="button" className="btn btn-disabled" disabled>
              ✓ Currently In Your Borrowed List
            </button>
          ) : isAvailable ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                borrowBook(selectedBook);
                handleClose();
              }}
            >
              📥 Borrow This Book
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-warning"
              onClick={() => {
                placeHold(selectedBook);
                handleClose();
              }}
            >
              ⏳ Place Hold Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
