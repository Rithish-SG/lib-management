import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fetchBooksApi } from '../api/bookApi';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import BookCard from '../components/BookCard';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import ApiStatusBar from '../components/common/ApiStatusBar';
import { useLibrary } from '../context/LibraryContext';

/**
 * Experiment 5: CatalogPage with REST API Integration via Axios
 * Topics: REST API, Axios, Async Data, Search & Category Filtering, Loading & Error States (5.a, 5.b, 5.d, 5.e)
 */
export default function CatalogPage() {
  const {
    searchKeyword,
    selectedCategory,
    selectedAuthor,
    onlyAvailable
  } = useLibrary();

  // Asynchronous REST API state
  const [apiBooks, setApiBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const searchInputRef = useRef(null);

  // d) Handle asynchronous API request with Axios
  const loadBooksFromApi = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      console.log(`[REST API GET /api/books] Querying: search="${searchKeyword}", category="${selectedCategory}"`);
      const response = await fetchBooksApi({
        search: searchKeyword,
        category: selectedCategory,
        author: selectedAuthor
      });

      let results = response.data;
      if (onlyAvailable) {
        results = results.filter((b) => b.availableCopies > 0);
      }
      setApiBooks(results);
    } catch (err) {
      console.error('[REST API Error]:', err);
      setApiError(err.message || 'Failed to fetch books from REST API.');
    } finally {
      setIsLoading(false);
    }
  }, [searchKeyword, selectedCategory, selectedAuthor, onlyAvailable]);

  // Fetch when search keyword, category, or filter changes (debounced or triggered)
  useEffect(() => {
    const timer = setTimeout(() => {
      loadBooksFromApi();
    }, 300); // 300ms debounce for live search

    return () => clearTimeout(timer);
  }, [loadBooksFromApi]);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  return (
    <div className="catalog-layout">
      {/* REST API Status Bar with Error Simulation Toggle */}
      <ApiStatusBar onRefresh={loadBooksFromApi} />

      <div className="catalog-controls">
        <SearchBar searchRef={searchInputRef} />
        <FilterPanel />
      </div>

      <div className="book-list-container">
        <div className="list-header">
          <h2 className="list-title">Books Catalog (REST API: /api/books)</h2>
          {!isLoading && !apiError && (
            <span className="results-count">
              Showing <strong>{apiBooks.length}</strong> {apiBooks.length === 1 ? 'book' : 'books'}
            </span>
          )}
        </div>

        {/* e) Display Loading State */}
        {isLoading && (
          <Loading message="Fetching books from REST API gateway (/api/books)..." />
        )}

        {/* e) Display Error State */}
        {!isLoading && apiError && (
          <div className="empty-state" style={{ borderColor: '#f87171', backgroundColor: '#fef2f2' }}>
            <span className="empty-icon">⚠️</span>
            <h3 className="text-danger">REST API Request Failed</h3>
            <p className="text-muted" style={{ marginBottom: '1rem' }}>{apiError}</p>
            <Button variant="primary" onClick={loadBooksFromApi}>
              🔄 Retry API Request
            </Button>
          </div>
        )}

        {/* Success / Empty State */}
        {!isLoading && !apiError && (
          apiBooks.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h3>No books found</h3>
              <p>No titles matched your search query on the REST API endpoint. Try clearing the filter.</p>
            </div>
          ) : (
            <div className="books-grid">
              {apiBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
