import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useBorrowing } from '../hooks/useBorrowing';
import { INITIAL_MEMBER } from '../data/initialData';

export const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  // Member profile state with localStorage persistence
  const [memberInfo, setMemberInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('lib_member');
      return saved ? JSON.parse(saved) : INITIAL_MEMBER;
    } catch {
      return INITIAL_MEMBER;
    }
  });

  // Login status (for Exp 3: credential check is bypassed, updates name on profile)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return localStorage.getItem('lib_isLoggedIn') === 'true';
    } catch {
      return false;
    }
  });

  // Save member profile updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lib_member', JSON.stringify(memberInfo));
    } catch (e) {
      console.error('Error saving member info to storage:', e);
    }
  }, [memberInfo]);

  // Toast notification state
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Custom hooks
  const booksHook = useBooks();
  const borrowingHook = useBorrowing(booksHook.adjustCopies, showToast);

  // User login/signup handler: updates name and member details without credential checks (Exp 3 requirement)
  const loginUser = ({ name, email, studentId }) => {
    const updatedMember = {
      ...memberInfo,
      id: studentId?.trim() || memberInfo.id,
      name: name?.trim() || memberInfo.name,
      email: email?.trim() || memberInfo.email,
    };
    setMemberInfo(updatedMember);
    setIsLoggedIn(true);
    try {
      localStorage.setItem('lib_member', JSON.stringify(updatedMember));
      localStorage.setItem('lib_isLoggedIn', 'true');
    } catch (e) {
      console.error(e);
    }
    showToast(`Welcome, ${updatedMember.name}! Signed in successfully.`, 'success');
  };

  const logoutUser = () => {
    setIsLoggedIn(false);
    try {
      localStorage.setItem('lib_isLoggedIn', 'false');
    } catch (e) {
      console.error(e);
    }
    showToast('You have been signed out.', 'info');
  };

  // Recommendations calculated via useMemo
  const recommendations = useMemo(() => {
    if (booksHook.books.length === 0) return [];

    const userCategories = new Set();
    borrowingHook.borrowedBooks.forEach((b) => userCategories.add(b.category));
    borrowingHook.readingHistory.forEach((h) => {
      const match = booksHook.books.find((b) => b.id === h.bookId);
      if (match) userCategories.add(match.category);
    });

    if (userCategories.size === 0) {
      userCategories.add('Computer Science');
    }

    return booksHook.books
      .filter(
        (book) =>
          userCategories.has(book.category) &&
          !borrowingHook.borrowedBookIds.has(book.id)
      )
      .slice(0, 3);
  }, [booksHook.books, borrowingHook.borrowedBooks, borrowingHook.readingHistory, borrowingHook.borrowedBookIds]);

  const contextValue = {
    // Member & Auth State
    memberInfo,
    setMemberInfo,
    isLoggedIn,
    loginUser,
    logoutUser,

    // Notifications
    notification,
    setNotification,
    showToast,

    // Books Data & Filters
    books: booksHook.books,
    filteredBooks: booksHook.filteredBooks,
    categories: booksHook.categories,
    authors: booksHook.authors,
    searchKeyword: booksHook.searchKeyword,
    setSearchKeyword: booksHook.setSearchKeyword,
    selectedCategory: booksHook.selectedCategory,
    setSelectedCategory: booksHook.setSelectedCategory,
    selectedAuthor: booksHook.selectedAuthor,
    setSelectedAuthor: booksHook.setSelectedAuthor,
    onlyAvailable: booksHook.onlyAvailable,
    setOnlyAvailable: booksHook.setOnlyAvailable,
    resetFilters: booksHook.resetFilters,
    availableBooks: booksHook.availableBooks,
    totalAvailableCopies: booksHook.totalAvailableCopies,

    // Borrowing Operations
    borrowedBooks: borrowingHook.borrowedBooks,
    readingHistory: borrowingHook.readingHistory,
    holdList: borrowingHook.holdList,
    borrowedBookIds: borrowingHook.borrowedBookIds,
    overdueBooks: borrowingHook.overdueBooks,
    dueSoonBooks: borrowingHook.dueSoonBooks,
    readingStats: borrowingHook.readingStats,
    borrowBook: (book) => borrowingHook.borrowBook(book, memberInfo),
    returnBook: borrowingHook.returnBook,
    renewBook: borrowingHook.renewBook,
    placeHold: borrowingHook.placeHold,
    clearBorrowing: borrowingHook.clearBorrowing,

    // Recommendations
    recommendations
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
