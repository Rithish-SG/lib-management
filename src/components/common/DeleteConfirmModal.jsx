import React from 'react';
import Button from './Button';

/**
 * Experiment 7: DeleteConfirmModal Component
 * Topics: DELETE /api/books/:id, Loading State (7.d, 7.f)
 */
export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, book, isLoading = false }) {
  if (!isOpen || !book) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
        <div className="modal-header">
          <div>
            <span className="category-tag pill-danger">HTTP DELETE /api/books/{book.id}</span>
            <h2 className="modal-title" style={{ marginTop: '0.35rem' }}>Confirm Book Deletion</h2>
          </div>
          <button type="button" className="close-btn" onClick={onClose} disabled={isLoading}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <p>
            Are you sure you want to delete <strong>"{book.title}"</strong> (Book #{book.id}) from the library catalog?
          </p>
          <div className="notice-box" style={{ backgroundColor: '#fef2f2', borderColor: '#ef4444', color: '#991b1b', marginTop: '0.85rem' }}>
            ⚠️ <strong>Irreversible Operation:</strong> This will send a <code>DELETE</code> request to the REST API and remove the title permanently.
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : '🗑️ Confirm Delete (DELETE)'}
          </Button>
        </div>
      </div>
    </div>
  );
}
