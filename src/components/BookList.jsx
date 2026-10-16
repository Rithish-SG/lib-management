import React from 'react';
import BookCard from './BookCard';

export default function BookList({ books, borrowedBookIds, onSelectBook, onBorrow, onPlaceHold }) {
  return (
    <div className="book-list-container">
      <div className="list-header">
        <h2 className="list-title">Books Catalog</h2>
        <span className="results-count">
          Showing <strong>{books.length}</strong> {books.length === 1 ? 'book' : 'books'}
        </span>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No Books Found</h3>
          <p>We couldn't find any books matching your search or filter criteria. Try resetting the filters.</p>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isBorrowedByMember={borrowedBookIds.has(book.id)}
              onSelectBook={onSelectBook}
              onBorrow={onBorrow}
              onPlaceHold={onPlaceHold}
            />
          ))}
        </div>
      )}
    </div>
  );
}
