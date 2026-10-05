import { useState, useMemo, useEffect } from 'react';
import { INITIAL_BOOKS } from '../data/initialData';

/**
 * Experiment 2: Custom Hook - useBooks()
 * Responsibilities:
 *  - Manages book dataset (with localStorage persistence)
 *  - Handles search keyword filtering (title, author)
 *  - Handles category filtering and author filtering
 *  - Handles availability status filtering
 *  - Calculates available books using useMemo
 */
export function useBooks() {
  // Load books from localStorage or fallback to INITIAL_BOOKS
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem('lib_books');
      return saved ? JSON.parse(saved) : INITIAL_BOOKS;
    } catch (e) {
      console.error('Error reading books from localStorage:', e);
      return INITIAL_BOOKS;
    }
  });

  // Search & Filter State
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAuthor, setSelectedAuthor] = useState('All');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Sync books with browser storage (LocalStorage)
  useEffect(() => {
    try {
      localStorage.setItem('lib_books', JSON.stringify(books));
    } catch (e) {
      console.error('Error saving books to localStorage:', e);
    }
  }, [books]);

  // useMemo: Extract unique categories for dropdown filter
  const categories = useMemo(() => {
    return Array.from(new Set(books.map((b) => b.category)));
  }, [books]);

  // useMemo: Extract unique authors for dropdown filter
  const authors = useMemo(() => {
    return Array.from(new Set(books.map((b) => b.author)));
  }, [books]);

  // useMemo: Calculate filtered books based on title, author, category, and availability
  const filteredBooks = useMemo(() => {
    console.log('[useBooks Hook] Recalculating filtered books...');
    return books.filter((book) => {
      const query = searchKeyword.toLowerCase().trim();
      const matchesSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === 'All' || book.category === selectedCategory;

      const matchesAuthor =
        selectedAuthor === 'All' || book.author === selectedAuthor;

      const matchesAvailability =
        !onlyAvailable || book.availableCopies > 0;

      return matchesSearch && matchesCategory && matchesAuthor && matchesAvailability;
    });
  }, [books, searchKeyword, selectedCategory, selectedAuthor, onlyAvailable]);

  // useMemo: Calculate available books list and total available copies count
  const availableBooks = useMemo(() => {
    return books.filter((b) => b.availableCopies > 0);
  }, [books]);

  const totalAvailableCopies = useMemo(() => {
    return books.reduce((sum, b) => sum + (b.availableCopies > 0 ? b.availableCopies : 0), 0);
  }, [books]);

  // Helper function to adjust book copies when borrowed or returned
  const adjustCopies = (bookId, delta) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) => {
        if (b.id === bookId) {
          const updated = Math.max(0, b.availableCopies + delta);
          return { ...b, availableCopies: updated };
        }
        return b;
      })
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchKeyword('');
    setSelectedCategory('All');
    setSelectedAuthor('All');
    setOnlyAvailable(false);
  };

  return {
    books,
    filteredBooks,
    categories,
    authors,
    searchKeyword,
    setSearchKeyword,
    selectedCategory,
    setSelectedCategory,
    selectedAuthor,
    setSelectedAuthor,
    onlyAvailable,
    setOnlyAvailable,
    resetFilters,
    availableBooks,
    totalAvailableCopies,
    adjustCopies
  };
}
