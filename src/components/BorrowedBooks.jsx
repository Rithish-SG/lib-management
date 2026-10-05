import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import Button from './common/Button';
import { validateRenewal } from '../utils/validation';

/**
 * Experiment 4: BorrowedBooks Component with Renewal Validation
 * Topics: Form Validation, Reusable Components (4.f, 4.h)
 */
export default function BorrowedBooks() {
  const {
    borrowedBooks,
    returnBook,
    renewBook,
    clearBorrowing,
    overdueBooks,
    dueSoonBooks,
    showToast
  } = useLibrary();

  const maxRenewals = 2;
  const today = new Date().toISOString().split('T')[0];

  const calculateDaysRemaining = (dueDateStr) => {
    const due = new Date(dueDateStr);
    const now = new Date(today);
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleRenewWithValidation = (item) => {
    // f) Renewal request validation
    const validation = validateRenewal(item, maxRenewals);
    if (!validation.valid) {
      showToast(validation.message, 'error');
      return;
    }
    renewBook(item.borrowId);
  };

  return (
    <div className="borrowed-container">
      <div className="section-header">
        <div>
          <h2>My Borrowed Books</h2>
          <p className="section-desc">Manage active book loans, track due dates, renew on time, or return books.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {borrowedBooks.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearBorrowing}
              title="Return all borrowed books at once"
            >
              🧹 Clear All Loans
            </Button>
          )}
          <span className="badge-pill">
            Active: {borrowedBooks.length}
          </span>
        </div>
      </div>

      {/* Due date reminders */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {overdueBooks.length > 0 && (
          <div className="notice-box" style={{ flex: 1, backgroundColor: '#fef2f2', borderColor: '#ef4444', color: '#991b1b' }}>
            ⚠️ <strong>{overdueBooks.length} Overdue Loan(s):</strong> Please return overdue books immediately. Renewal is restricted.
          </div>
        )}
        {dueSoonBooks.length > 0 && (
          <div className="notice-box" style={{ flex: 1, backgroundColor: '#fffbeb', borderColor: '#f59e0b', color: '#92400e' }}>
            ⏳ <strong>{dueSoonBooks.length} Book(s) Due Soon:</strong> Due within the next 3 days. Renew now to avoid late fines.
          </div>
        )}
      </div>

      {borrowedBooks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📂</span>
          <h3>No borrowed books</h3>
          <p>You have no books currently issued. Browse the catalog to borrow books!</p>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map((item) => {
                const daysRemaining = calculateDaysRemaining(item.dueDate);
                const isOverdue = daysRemaining < 0;
                const canRenew = item.renewalCount < maxRenewals && !isOverdue;

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
                        <span className="status-pill pill-danger">
                          Overdue ({Math.abs(daysRemaining)} days)
                        </span>
                      ) : daysRemaining <= 3 ? (
                        <span className="status-pill pill-warning">
                          Due soon ({daysRemaining} days left)
                        </span>
                      ) : (
                        <span className="status-pill pill-success">
                          Active ({daysRemaining} days left)
                        </span>
                      )}
                    </td>
                    <td>
                      {item.renewalCount} / {maxRenewals}
                    </td>
                    <td>
                      <div className="table-actions">
                        {canRenew ? (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleRenewWithValidation(item)}
                            title="Extend due date by 7 days (Validated)"
                          >
                            🔄 Renew
                          </Button>
                        ) : (
                          <span
                            className="small text-muted"
                            title={isOverdue ? 'Overdue book' : 'Max renewals reached'}
                            style={{ display: 'inline-block', padding: '0.35rem 0.5rem', background: '#f1f5f9', borderRadius: '4px' }}
                          >
                            🚫 Renewal not available
                          </span>
                        )}

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => returnBook(item.borrowId)}
                        >
                          ↩️ Return
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
