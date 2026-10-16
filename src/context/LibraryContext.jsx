import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectAllBooks,
  selectFilteredBooks,
  selectCategories,
  selectAuthors,
  selectSearchKeyword,
  selectSelectedCategory,
  selectSelectedAuthor,
  selectOnlyAvailable,
  selectTotalAvailableCopies,
  setSearchKeyword,
  setSelectedCategory,
  setSelectedAuthor,
  setOnlyAvailable,
  resetFilters,
  decrementCopies,
  incrementCopies,
  restoreAllInventory
} from '../store/slices/booksSlice';
import {
  selectBorrowedBooks,
  selectReadingHistory,
  selectHoldList,
  selectBorrowedBookIds,
  selectOverdueBooks,
  selectDueSoonBooks,
  selectReadingStats,
  borrowBook as borrowAction,
  returnBook as returnAction,
  renewBook as renewAction,
  placeHold as holdAction,
  clearAllBorrowing as clearAction
} from '../store/slices/borrowSlice';
import {
  selectMemberInfo,
  updateMemberProfile as updateMemberAction
} from '../store/slices/memberSlice';

export const LibraryContext = createContext(null);

/**
 * Experiment 6: LibraryProvider powered by Redux Toolkit Global Store
 * Topics: Global Library Store, Actions, Middleware, LocalStorage Synchronization (6.a - 6.e)
 */
export function LibraryProvider({ children }) {
  const dispatch = useDispatch();

  // Redux Selectors for Books State
  const books = useSelector(selectAllBooks);
  const filteredBooks = useSelector(selectFilteredBooks);
  const categories = useSelector(selectCategories);
  const authors = useSelector(selectAuthors);
  const searchKeyword = useSelector(selectSearchKeyword);
  const selectedCategory = useSelector(selectSelectedCategory);
  const selectedAuthor = useSelector(selectSelectedAuthor);
  const onlyAvailable = useSelector(selectOnlyAvailable);
  const totalAvailableCopies = useSelector(selectTotalAvailableCopies);

  // Redux Selectors for Borrowing State
  const borrowedBooks = useSelector(selectBorrowedBooks);
  const readingHistory = useSelector(selectReadingHistory);
  const holdList = useSelector(selectHoldList);
  const borrowedBookIds = useSelector(selectBorrowedBookIds);
  const overdueBooks = useSelector(selectOverdueBooks);
  const dueSoonBooks = useSelector(selectDueSoonBooks);
  const readingStats = useSelector(selectReadingStats);

  // Redux Selectors for Member State
  const memberInfo = useSelector(selectMemberInfo);

  // UI Toast notification state
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // c) Dispatched Actions via Redux Toolkit
  const borrowBook = (book) => {
    if (borrowedBooks.length >= (memberInfo.maxAllowed || 4)) {
      showToast(`Borrowing limit reached (${memberInfo.maxAllowed} books).`, 'error');
      return false;
    }
    if (borrowedBookIds.has(book.id)) {
      showToast(`You have already borrowed "${book.title}".`, 'warning');
      return false;
    }
    if (book.availableCopies <= 0) {
      showToast(`"${book.title}" is currently out of stock.`, 'warning');
      return false;
    }

    // Dispatch Redux actions (Intercepted by Middleware)
    dispatch(borrowAction(book));
    dispatch(decrementCopies(book.id));
    showToast(`Successfully borrowed "${book.title}"! (Redux action dispatched)`, 'success');
    return true;
  };

  const returnBook = (borrowId) => {
    const item = borrowedBooks.find((b) => b.borrowId === borrowId);
    if (!item) return;

    dispatch(returnAction(borrowId));
    dispatch(incrementCopies(item.bookId));
    showToast(`Returned "${item.title}". (Redux action dispatched)`, 'success');
  };

  const renewBook = (borrowId) => {
    dispatch(renewAction({ borrowId, maxRenewals: 2 }));
    showToast('Book renewed! (Redux action dispatched)', 'success');
  };

  const placeHold = (book) => {
    dispatch(holdAction(book));
    showToast(`Hold requested for "${book.title}". (Redux action dispatched)`, 'success');
  };

  const clearBorrowing = () => {
    const ids = borrowedBooks.map((b) => b.bookId);
    dispatch(restoreAllInventory(ids));
    dispatch(clearAction());
    showToast('All active borrowings cleared and returned to inventory. (Redux action dispatched)', 'info');
  };

  const setMemberInfo = (updatedInfo) => {
    dispatch(updateMemberAction(updatedInfo));
  };

  // Recommendations calculated via useMemo from Redux state
  const recommendations = useMemo(() => {
    if (books.length === 0) return [];
    const userCategories = new Set();
    borrowedBooks.forEach((b) => userCategories.add(b.category));
    readingHistory.forEach((h) => {
      const match = books.find((b) => b.id === h.bookId);
      if (match) userCategories.add(match.category);
    });
    if (userCategories.size === 0) userCategories.add('Computer Science');

    return books
      .filter((book) => userCategories.has(book.category) && !borrowedBookIds.has(book.id))
      .slice(0, 3);
  }, [books, borrowedBooks, readingHistory, borrowedBookIds]);

  const contextValue = {
    // Redux Books State & Actions
    books,
    filteredBooks,
    categories,
    authors,
    searchKeyword,
    setSearchKeyword: (val) => dispatch(setSearchKeyword(val)),
    selectedCategory,
    setSelectedCategory: (val) => dispatch(setSelectedCategory(val)),
    selectedAuthor,
    setSelectedAuthor: (val) => dispatch(setSelectedAuthor(val)),
    onlyAvailable,
    setOnlyAvailable: (val) => dispatch(setOnlyAvailable(val)),
    resetFilters: () => dispatch(resetFilters()),
    totalAvailableCopies,

    // Redux Borrow State & Actions
    borrowedBooks,
    readingHistory,
    holdList,
    borrowedBookIds,
    overdueBooks,
    dueSoonBooks,
    readingStats,
    borrowBook,
    returnBook,
    renewBook,
    placeHold,
    clearBorrowing,

    // Redux Member State & Actions
    memberInfo,
    setMemberInfo,

    // Recommendations & Notifications
    recommendations,
    notification,
    setNotification,
    showToast
  };

  return (
    <LibraryContext.Provider value={contextValue}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}
