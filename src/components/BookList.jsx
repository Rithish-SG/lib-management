import React from 'react';
import { useLibrary } from '../context/LibraryContext';
import BookCard from './BookCard';

// BookList Component consuming filteredBooks from LibraryContext (Zero prop drilling)
export default function BookList() {
  const { filteredBooks } = useLibrary();

  return (
    <div className="book-list-container">
      <div className="list-header">
        <h2 className="list-title">Books Catalog</h2>
        <span className="results-count">
          Showing <strong>{filteredBooks.length}</strong> {filteredBooks.length === 1 ? 'book' : 'books'}
        </span>
      </div>

      {/* h) Conditional Rendering: "No books found" */}
      {filteredBooks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No books found</h3>
          <p>We couldn't find any books matching your search or filter criteria. Try resetting the filters.</p>
        </div>
      ) : (
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
