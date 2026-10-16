import React, { useState, useEffect, useCallback } from 'react';
import { getBorrowRecordsApi, updateBorrowRecordApi } from '../api/crudApi';
import Button from './common/Button';
import Loading from './common/Loading';
import { useLibrary } from '../context/LibraryContext';

/**
 * Experiment 7: BorrowedBooks Component using REST API Operations
 * Topics: Create and update borrowing records using API operations (PUT/PATCH, DELETE) (7.e, 7.f)
 */
export default function BorrowedBooks() {
  const { showToast } = useLibrary();

  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  const maxRenewals = 2;
  const today = new Date().toISOString().split('T')[0];

  const fetchLoans = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const res = await getBorrowRecordsApi();
      setLoans(res.data);
    } catch (err) {
      setApiError(err.message || 'Failed to retrieve active loans via API.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const calculateDaysRemaining = (dueDateStr) => {
    const due = new Date(dueDateStr);
    const now = new Date(today);
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // e) Update borrowing record for Renewal via API (PUT/PATCH /api/borrow/:id)
  const handleRenew = async (item) => {
    if (item.renewalCount >= maxRenewals) {
      showToast('Maximum renewals (2 times) reached for this loan.', 'warning');
      return;
    }
    if (item.dueDate < today) {
      showToast('Overdue loans cannot be renewed online.', 'error');
      return;
    }

    setProcessingId(item.borrowId);
    try {
      const res = await updateBorrowRecordApi(item.borrowId, 'RENEW');
      showToast(`Renewed until ${res.data.dueDate} via PATCH /api/borrow/${item.borrowId}!`, 'success');
      fetchLoans();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  // e) Update borrowing record for Return via API (DELETE/PATCH /api/borrow/:id)
  const handleReturn = async (borrowId) => {
    setProcessingId(borrowId);
    try {
      await updateBorrowRecordApi(borrowId, 'RETURN');
      showToast('Book returned and copy restored via API operation!', 'success');
      fetchLoans();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return <Loading message="Executing GET /api/borrow to load member loans..." />;
  }

  if (apiError) {
    return (
      <div className="empty-state" style={{ borderColor: '#f87171', backgroundColor: '#fef2f2' }}>
        <span className="empty-icon">⚠️</span>
        <h3 className="text-danger">Borrow API Request Failed</h3>
        <p className="text-muted">{apiError}</p>
        <Button variant="primary" onClick={fetchLoans} style={{ marginTop: '0.75rem' }}>
          🔄 Retry GET /api/borrow
        </Button>
      </div>
    );
  }

  return (
    <div className="borrowed-container">
      <div className="section-header">
        <div>
          <h2>My Borrowed Books (REST API Managed)</h2>
          <p className="section-desc">Track active loans. Renewals and returns execute live REST API transactions.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button variant="secondary" size="sm" onClick={fetchLoans}>
            🔄 Refresh Loans
          </Button>
          <span className="badge-pill">
            Active: {loans.length}
          </span>
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📂</span>
          <h3>No borrowed books</h3>
          <p>No active loan records found in the database. Browse the catalog to borrow a book via POST /api/borrow!</p>
        </div>
      ) : (
        <div className="borrowed-table-wrapper">
          <table className="borrowed-table">
            <thead>
              <tr>
                <th>Borrow ID</th>
                <th>Book Title</th>
                <th>Category</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Renewals</th>
                <th>API Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((item) => {
                const daysRemaining = calculateDaysRemaining(item.dueDate);
                const isOverdue = daysRemaining < 0;
                const canRenew = item.renewalCount < maxRenewals && !isOverdue;
                const isItemProcessing = processingId === item.borrowId;

                return (
                  <tr key={item.borrowId} className={isOverdue ? 'row-overdue' : ''}>
                    <td><code>{item.borrowId}</code></td>
                    <td>
                      <strong>{item.title}</strong>
                      <div className="text-muted small">by {item.author}</div>
                    </td>
                    <td><span className="category-tag">{item.category}</span></td>
                    <td>{item.borrowDate}</td>
                    <td>
                      <span className={isOverdue ? 'text-danger font-bold' : ''}>
                        {item.dueDate}
                      </span>
                    </td>
                    <td>
                      {isOverdue ? (
                        <span className="status-pill pill-danger">Overdue ({Math.abs(daysRemaining)} days)</span>
                      ) : daysRemaining <= 3 ? (
                        <span className="status-pill pill-warning">Due soon ({daysRemaining} days left)</span>
                      ) : (
                        <span className="status-pill pill-success">Active ({daysRemaining} days left)</span>
                      )}
                    </td>
                    <td>{item.renewalCount} / {maxRenewals}</td>
                    <td>
                      <div className="table-actions">
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={!canRenew || isItemProcessing}
                          onClick={() => handleRenew(item)}
                          title="PATCH /api/borrow/:id"
                        >
                          {isItemProcessing ? '...' : '🔄 Renew (PATCH)'}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={isItemProcessing}
                          onClick={() => handleReturn(item.borrowId)}
                          title="DELETE /api/borrow/:id"
                        >
                          {isItemProcessing ? '...' : '↩️ Return'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
