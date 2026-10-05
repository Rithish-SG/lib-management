import React from 'react';
import { useLibrary } from '../context/LibraryContext';

// ReadingHistory Component consuming history directly from LibraryContext
export default function ReadingHistory() {
  const { readingHistory } = useLibrary();

  return (
    <div className="history-container">
      <div className="section-header">
        <div>
          <h2>Reading History</h2>
          <p className="section-desc">A log of all books you have previously borrowed and returned.</p>
        </div>
        <span className="badge-pill">Total Read: {readingHistory.length}</span>
      </div>

      {/* h) Conditional Rendering: "No reading history available" */}
      {readingHistory.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📖</span>
          <h3>No reading history available</h3>
          <p>When you borrow and return books, they will be archived here for your reference.</p>
        </div>
      ) : (
        <div className="history-grid">
          {readingHistory.map((record) => (
            <div key={record.historyId} className="history-card">
              <div className="history-header">
                <span className="history-id">{record.historyId}</span>
                <span className="status-pill pill-neutral">Returned</span>
              </div>
              <h4 className="history-title">{record.title}</h4>
              <p className="text-muted small">by {record.author}</p>

              <div className="history-timeline">
                <div className="timeline-item">
                  <span className="timeline-label">Borrowed on:</span>
                  <span className="timeline-val">{record.borrowDate}</span>
                </div>
                <div className="timeline-item">
                  <span className="timeline-label">Returned on:</span>
                  <span className="timeline-val text-success">{record.returnDate}</span>
                </div>
              </div>

              {record.feedback && (
                <div className="history-note">
                  <em>"{record.feedback}"</em>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
