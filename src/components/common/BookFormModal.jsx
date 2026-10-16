import React, { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';

/**
 * Experiment 7: BookFormModal Component for POST (Add) and PUT (Edit)
 * Topics: POST /api/books, PUT /api/books/:id, Form Validation, Loading States (7.b, 7.c, 7.f)
 */
export default function BookFormModal({ isOpen, onClose, onSubmit, initialBook = null, isLoading = false }) {
  const isEditMode = Boolean(initialBook);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Computer Science',
    publishedYear: new Date().getFullYear(),
    isbn: '',
    shelfLocation: '',
    totalCopies: 3,
    description: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialBook) {
      setFormData({
        title: initialBook.title || '',
        author: initialBook.author || '',
        category: initialBook.category || 'Computer Science',
        publishedYear: initialBook.publishedYear || new Date().getFullYear(),
        isbn: initialBook.isbn || '',
        shelfLocation: initialBook.shelfLocation || '',
        totalCopies: initialBook.totalCopies || 3,
        description: initialBook.description || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        category: 'Computer Science',
        publishedYear: new Date().getFullYear(),
        isbn: '',
        shelfLocation: 'Rack-A1',
        totalCopies: 3,
        description: ''
      });
    }
    setErrors({});
  }, [initialBook, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Book title is required.';
    if (!formData.author.trim()) errs.author = 'Author name is required.';
    if (!formData.isbn.trim()) errs.isbn = 'ISBN identifier is required.';
    if (!formData.shelfLocation.trim()) errs.shelfLocation = 'Shelf location is required.';
    if (parseInt(formData.totalCopies, 10) < 1) errs.totalCopies = 'Must have at least 1 copy.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header">
          <div>
            <span className="category-tag">{isEditMode ? 'HTTP PUT / PATCH' : 'HTTP POST (201 Created)'}</span>
            <h2 className="modal-title">
              {isEditMode ? `Edit Book #${initialBook.id}` : 'Add New Book to Catalog'}
            </h2>
            <p className="modal-author">
              {isEditMode ? 'Update book details via REST API' : 'Create new catalog record via REST API'}
            </p>
          </div>
          <button type="button" className="close-btn" onClick={onClose} disabled={isLoading}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            <Input
              label="Book Title"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Clean Architecture"
              required
              error={errors.title}
            />

            <Input
              label="Author Name"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="e.g. Robert C. Martin"
              required
              error={errors.author}
            />

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category <span className="text-danger">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Science Fiction">Science Fiction</option>
                <option value="Literature">Literature</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Electronics">Electronics</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Input
                label="Published Year"
                id="publishedYear"
                name="publishedYear"
                type="number"
                value={formData.publishedYear}
                onChange={handleChange}
                required
              />

              <Input
                label="Total Copies"
                id="totalCopies"
                name="totalCopies"
                type="number"
                value={formData.totalCopies}
                onChange={handleChange}
                required
                error={errors.totalCopies}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Input
                label="ISBN Number"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="e.g. 978-0134494166"
                required
                error={errors.isbn}
              />

              <Input
                label="Shelf Location"
                id="shelfLocation"
                name="shelfLocation"
                value={formData.shelfLocation}
                onChange={handleChange}
                placeholder="e.g. CS-Rack-A5"
                required
                error={errors.shelfLocation}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">Description / Synopsis</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                placeholder="Brief summary of the book content..."
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading
                ? 'Processing API Request...'
                : isEditMode
                ? '💾 Save Changes (PUT /api/books)'
                : '➕ Create Book (POST /api/books)'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
