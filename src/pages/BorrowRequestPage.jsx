import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

/**
 * Experiment 4: Borrow Request & Confirmation Page with Form Validation
 * Topics: Form Validation, Protected Flow, Reusable Components (4.f, 4.h)
 */
export default function BorrowRequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books, borrowBook, placeHold, borrowedBookIds, showToast } = useLibrary();
  const { currentUser } = useAuth();

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreementError, setAgreementError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const book = books.find((b) => b.id === id);

  if (!book) {
    return (
      <div className="empty-state">
        <h3>Book Not Found</h3>
        <Link to="/books" className="btn btn-primary">Back to Catalog</Link>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;
  const isAlreadyBorrowed = borrowedBookIds.has(book.id);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 14);
  const dueDateStr = dueDate.toISOString().split('T')[0];

  const handleConfirmAction = () => {
    // f) Required field validation for borrow request
    if (!agreeTerms) {
      setAgreementError('You must agree to the library return policy before completing this request.');
      return;
    }
    setAgreementError('');

    setIsProcessing(true);

    setTimeout(() => {
      if (isAvailable) {
        borrowBook(book);
      } else {
        placeHold(book);
      }
      setIsProcessing(false);

      // Programmatic navigation to member dashboard
      navigate('/member/borrowed');
    }, 600);
  };

  return (
    <div className="borrow-request-page">
      <div className="breadcrumb-nav">
        <Link to="/books">Books</Link>
        <span> / </span>
        <Link to={`/book/${book.id}`}>{book.title}</Link>
        <span> / </span>
        <span className="breadcrumb-current">Borrow Confirmation</span>
      </div>

      <div className="flow-indicator">
        <div className="flow-step completed">1. Book Details</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step active">2. Borrow Request</div>
        <div className="flow-arrow">→</div>
        <div className="flow-step">3. Member Dashboard</div>
      </div>

      <div className="borrow-card">
        <div className="borrow-header">
          <h2>{isAvailable ? '📥 Confirm Book Borrow Request' : '⏳ Confirm Hold Reservation'}</h2>
          <p className="text-muted">
            Review transaction details and accept loan terms to proceed.
          </p>
        </div>

        <div className="confirmation-summary-grid">
          <div className="summary-section">
            <h4>📖 Book Information</h4>
            <div className="summary-row">
              <span className="summary-label">Title:</span>
              <span className="summary-val">{book.title}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Author:</span>
              <span className="summary-val">{book.author}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Category:</span>
              <span className="summary-val">{book.category}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Shelf Location:</span>
              <span className="summary-val">{book.shelfLocation}</span>
            </div>
          </div>

          <div className="summary-section">
            <h4>🧑‍🎓 Verified Borrower Details</h4>
            <div className="summary-row">
              <span className="summary-label">Member Name:</span>
              <span className="summary-val"><strong>{currentUser?.name || 'Verified Member'}</strong></span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Member ID:</span>
              <span className="summary-val"><code>{currentUser?.memberId || 'MEM-2024-001'}</code></span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Issue Date:</span>
              <span className="summary-val">{todayStr}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Due Date:</span>
              <span className="summary-val text-success"><strong>{dueDateStr}</strong> (14 Days)</span>
            </div>
          </div>
        </div>

        {isAlreadyBorrowed ? (
          <div className="notice-box" style={{ backgroundColor: '#fffbeb', borderColor: '#f59e0b', color: '#92400e' }}>
            ⚠️ You already have an active loan for this book.
          </div>
        ) : (
          <div className="terms-checkbox-box">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (e.target.checked) setAgreementError('');
                }}
              />
              <span>
                I agree to return this book on or before <strong>{dueDateStr}</strong> and acknowledge library late return regulations.
              </span>
            </label>
            {agreementError && <div className="error-message" style={{ marginTop: '0.5rem' }}>⚠️ {agreementError}</div>}
          </div>
        )}

        <div className="borrow-actions">
          <Button variant="secondary" onClick={() => navigate(`/book/${book.id}`)}>
            ← Back to Details
          </Button>

          {!isAlreadyBorrowed && (
            <Button
              variant={isAvailable ? 'primary' : 'warning'}
              disabled={isProcessing}
              onClick={handleConfirmAction}
            >
              {isProcessing
                ? 'Processing...'
                : isAvailable
                ? '✅ Confirm & Issue Book (useNavigate)'
                : '⏳ Confirm Hold Request (useNavigate)'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
