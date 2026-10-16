import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchBookByIdApi } from '../api/bookApi';
import { useLibrary } from '../context/LibraryContext';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';

/**
 * Experiment 5: Dynamic Book Details with REST API (GET /api/books/:id)
 * Topics: Fetch individual book details dynamically, Async Handling, Loading & Error States (5.c, 5.d, 5.e)
 */
export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { borrowedBookIds } = useLibrary();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // c & d) Asynchronously fetch individual book record by ID from REST API
  const loadBookDetails = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`[REST API GET /api/books/${id}] Fetching record...`);
      const response = await fetchBookByIdApi(id);
      setBook(response.data);
    } catch (err) {
      console.error('[REST API Error]:', err);
      setError(err.message || `Failed to fetch book #${id} from REST API.`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookDetails();
  }, [id]);

  // e) Loading State
  if (isLoading) {
    return (
      <div className="book-details-page">
        <Loading message={`Querying REST API for book #${id} details...`} />
      </div>
    );
  }

  // e) Error State
  if (error || !book) {
    return (
      <div className="empty-state" style={{ borderColor: '#f87171', backgroundColor: '#fef2f2' }}>
        <span className="empty-icon">❌</span>
        <h2 className="text-danger">REST API Error</h2>
        <p className="text-muted" style={{ marginBottom: '1rem' }}>{error}</p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <Button variant="primary" onClick={loadBookDetails}>
            🔄 Retry API Call
          </Button>
          <Link to="/books" className="btn btn-secondary">
            ← Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = book.availableCopies > 0;
  const isBorrowed = borrowedBookIds.has(book.id);

  return (
    <div className="book-details-page">
      <div className="breadcrumb-nav">
        <Link to="/books">← Books Catalog</Link>
        <span> / </span>
        <span>{book.category}</span>
        <span> / </span>
        <span className="breadcrumb-current">{book.title}</span>
      </div>

      <div className="details-card">
        <div className="details-header">
          <div className="category-row">
            <span className="category-tag">{book.category}</span>
            <span className="dynamic-route-badge">
              REST Endpoint: <code>GET /api/books/{book.id}</code>
            </span>
          </div>
          <h1 className="details-title">{book.title}</h1>
          <p className="details-author">Authored by <strong>{book.author}</strong></p>
        </div>

        {/* Status Alert Banner */}
        {isBorrowed ? (
          <div className="notice-box" style={{ backgroundColor: '#eff6ff', borderColor: '#2563eb', color: '#1e40af' }}>
            ℹ️ <strong>Active Loan:</strong> You currently have this book issued to your account.
          </div>
        ) : !isAvailable ? (
          <div className="notice-box" style={{ backgroundColor: '#fef2f2', borderColor: '#ef4444', color: '#991b1b' }}>
            ⚠️ <strong>Book currently unavailable:</strong> Out of stock on the library server. Hold request available.
          </div>
        ) : (
          <div className="notice-box" style={{ backgroundColor: '#ecfdf5', borderColor: '#10b981', color: '#065f46' }}>
            ✅ <strong>In Stock & Ready:</strong> {book.availableCopies} available copy for checkout.
          </div>
        )}

        <div className="detail-meta-grid">
          <div className="meta-box">
            <span className="meta-label">REST API ID</span>
            <span className="meta-value">#{book.id}</span>
          </div>
          <div className="meta-box">
            <span className="meta-label">ISBN</span>
            <span className="meta-value">{book.isbn}</span>
          </div>
          <div className="meta-box">
            <span className="meta-label">Published</span>
            <span className="meta-value">{book.publishedYear}</span>
          </div>
          <div className="meta-box">
            <span className="meta-label">Shelf Location</span>
            <span className="meta-value">{book.shelfLocation}</span>
          </div>
          <div className="meta-box">
            <span className="meta-label">Total Copies</span>
            <span className="meta-value">{book.totalCopies}</span>
          </div>
          <div className="meta-box">
            <span className="meta-label">Available Copies</span>
            <span className={`meta-value ${isAvailable ? 'text-success' : 'text-danger'}`}>
              {book.availableCopies} of {book.totalCopies}
            </span>
          </div>
          <div className="meta-box">
            <span className="meta-label">Data Source</span>
            <span className="meta-value">Axios REST Client</span>
          </div>
          <div className="meta-box">
            <span className="meta-label">Loan Duration</span>
            <span className="meta-value">14 Days</span>
          </div>
        </div>

        <div className="detail-section">
          <h3>Description & Overview</h3>
          <p className="book-description">{book.description}</p>
        </div>

        <div className="details-actions">
          <Link to="/books" className="btn btn-secondary">
            ← Back to Books
          </Link>

          {isBorrowed ? (
            <Link to="/member/borrowed" className="btn btn-primary">
              📋 View in My Borrowed Books
            </Link>
          ) : (
            <Button
              variant={isAvailable ? 'primary' : 'warning'}
              onClick={() => navigate(`/book/${book.id}/borrow`)}
            >
              {isAvailable ? '📥 Proceed to Borrow Request →' : '⏳ Place Hold Request →'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
