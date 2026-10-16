import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  getBooksApi,
  createBookApi,
  updateBookApi,
  deleteBookApi,
  createBorrowRecordApi,
  getBorrowRecordsApi
} from '../api/crudApi';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import BookCard from '../components/BookCard';
import BookFormModal from '../components/common/BookFormModal';
import DeleteConfirmModal from '../components/common/DeleteConfirmModal';
import HttpActivityLogger from '../components/common/HttpActivityLogger';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';

/**
 * Experiment 7: CatalogPage with Full CRUD REST API Operations
 * Topics: GET (7.a), POST (7.b), PUT/PATCH (7.c), DELETE (7.d), Borrow API (7.e), Loading & Error States (7.f)
 */
export default function CatalogPage() {
  const { currentUser } = useAuth();
  const {
    searchKeyword,
    selectedCategory,
    selectedAuthor,
    onlyAvailable,
    showToast
  } = useLibrary();

  const [books, setBooks] = useState([]);
  const [borrowedBookIds, setBorrowedBookIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  const [deletingBook, setDeletingBook] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const searchInputRef = useRef(null);

  // a) GET /api/books: Retrieve books using GET
  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await getBooksApi({
        search: searchKeyword,
        category: selectedCategory
      });

      let items = response.data;
      if (selectedAuthor !== 'All') {
        items = items.filter((b) => b.author === selectedAuthor);
      }
      if (onlyAvailable) {
        items = items.filter((b) => b.availableCopies > 0);
      }

      setBooks(items);

      // Load active loan IDs
      const borrowRes = await getBorrowRecordsApi();
      setBorrowedBookIds(new Set(borrowRes.data.map((b) => b.bookId)));
    } catch (err) {
      setApiError(err.message || 'Failed to retrieve books.');
    } finally {
      setIsLoading(false);
    }
  }, [searchKeyword, selectedCategory, selectedAuthor, onlyAvailable]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // b) POST /api/books: Add a new book using POST
  const handleCreateBook = async (bookData) => {
    setIsFormSubmitting(true);
    try {
      const res = await createBookApi(bookData);
      showToast(`Created "${res.data.title}" via HTTP POST (201 Created)!`, 'success');
      setIsFormModalOpen(false);
      fetchBooks();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // c) PUT /api/books/:id: Update book information using PUT
  const handleUpdateBook = async (bookData) => {
    if (!editingBook) return;
    setIsFormSubmitting(true);
    try {
      const res = await updateBookApi(editingBook.id, bookData);
      showToast(`Updated "${res.data.title}" via HTTP PUT (200 OK)!`, 'success');
      setEditingBook(null);
      setIsFormModalOpen(false);
      fetchBooks();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // d) DELETE /api/books/:id: Delete a book using DELETE
  const handleDeleteBook = async () => {
    if (!deletingBook) return;
    setIsDeleting(true);
    try {
      await deleteBookApi(deletingBook.id);
      showToast(`Deleted "${deletingBook.title}" via HTTP DELETE!`, 'success');
      setDeletingBook(null);
      fetchBooks();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // e) POST /api/borrow: Create borrowing record via API
  const handleBorrowBook = async (book) => {
    try {
      const member = currentUser || { id: 'MEM-2024-001', name: 'Alex Johnson' };
      await createBorrowRecordApi(book, member);
      showToast(`Borrowed "${book.title}" via HTTP POST /api/borrow!`, 'success');
      fetchBooks();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="catalog-layout">
      {/* Live REST API CRUD Request Logger */}
      <HttpActivityLogger />

      <div className="catalog-controls">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ flex: 1, minWidth: '280px' }}>
            <SearchBar searchRef={searchInputRef} />
          </div>

          {/* b) Add Book Button (Triggers POST) */}
          <Button
            variant="primary"
            onClick={() => {
              setEditingBook(null);
              setIsFormModalOpen(true);
            }}
          >
            ➕ Add New Book (POST)
          </Button>
        </div>

        <FilterPanel />
      </div>

      <div className="book-list-container">
        <div className="list-header">
          <div>
            <h2 className="list-title">Books Catalog (CRUD Managed)</h2>
            {!isLoading && !apiError && (
              <span className="results-count">
                Showing <strong>{books.length}</strong> {books.length === 1 ? 'book' : 'books'}
              </span>
            )}
          </div>
        </div>

        {/* f) Loading State */}
        {isLoading && (
          <Loading message="Executing GET /api/books to retrieve catalog records..." />
        )}

        {/* f) Error State */}
        {!isLoading && apiError && (
          <div className="empty-state" style={{ borderColor: '#f87171', backgroundColor: '#fef2f2' }}>
            <span className="empty-icon">⚠️</span>
            <h3 className="text-danger">Failed to Load Books (GET Error)</h3>
            <p className="text-muted">{apiError}</p>
            <Button variant="primary" onClick={fetchBooks} style={{ marginTop: '0.75rem' }}>
              🔄 Retry GET Request
            </Button>
          </div>
        )}

        {/* Success / Empty State */}
        {!isLoading && !apiError && (
          books.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h3>No books found</h3>
              <p>No titles matched your search query or the catalog is empty. Click "Add New Book" to insert one via POST!</p>
            </div>
          ) : (
            <div className="books-grid">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  isBorrowed={borrowedBookIds.has(book.id)}
                  onEditBook={(b) => {
                    setEditingBook(b);
                    setIsFormModalOpen(true);
                  }}
                  onDeleteBook={(b) => setDeletingBook(b)}
                  onBorrowBook={handleBorrowBook}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* Modal for POST (Add) and PUT (Edit) */}
      <BookFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingBook(null);
        }}
        onSubmit={editingBook ? handleUpdateBook : handleCreateBook}
        initialBook={editingBook}
        isLoading={isFormSubmitting}
      />

      {/* Modal for DELETE */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingBook)}
        onClose={() => setDeletingBook(null)}
        onConfirm={handleDeleteBook}
        book={deletingBook}
        isLoading={isDeleting}
      />
    </div>
  );
}
