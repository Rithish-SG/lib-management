import { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_BORROWED, INITIAL_HISTORY } from '../data/initialData';

/**
 * Experiment 2: Custom Hook - useBorrowing()
 * Responsibilities:
 *  - Manages active borrowed books, due dates, renewal counts, holds, and reading history.
 *  - Synchronizes all borrowing data with browser localStorage using useEffect.
 *  - Calculates:
 *      * Borrowed books count
 *      * Overdue books
 *      * Due-soon books
 *      * Reading statistics
 *  - Provides useCallback memoized operations:
 *      * borrowBook()
 *      * returnBook()
 *      * renewBook()
 *      * placeHold()
 *      * clearBorrowing()
 */
export function useBorrowing(adjustCopies, showToast) {
  // 1. Synchronized state with localStorage
  const [borrowedBooks, setBorrowedBooks] = useState(() => {
    try {
      const saved = localStorage.getItem('lib_borrowed');
      return saved ? JSON.parse(saved) : INITIAL_BORROWED;
    } catch (e) {
      console.error('Error loading borrowed books from storage:', e);
      return INITIAL_BORROWED;
    }
  });

  const [readingHistory, setReadingHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('lib_history');
      return saved ? JSON.parse(saved) : INITIAL_HISTORY;
    } catch (e) {
      console.error('Error loading reading history from storage:', e);
      return INITIAL_HISTORY;
    }
  });

  const [holdList, setHoldList] = useState(() => {
    try {
      const saved = localStorage.getItem('lib_holds');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading holds from storage:', e);
      return [];
    }
  });

  // g) useEffect: Synchronize borrowing information with browser storage (LocalStorage)
  useEffect(() => {
    try {
      localStorage.setItem('lib_borrowed', JSON.stringify(borrowedBooks));
      console.log('[useBorrowing Hook] Synchronized active loans to browser storage.');
    } catch (e) {
      console.error('Failed to sync borrowedBooks to localStorage:', e);
    }
  }, [borrowedBooks]);

  useEffect(() => {
    try {
      localStorage.setItem('lib_history', JSON.stringify(readingHistory));
    } catch (e) {
      console.error('Failed to sync readingHistory to localStorage:', e);
    }
  }, [readingHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('lib_holds', JSON.stringify(holdList));
    } catch (e) {
      console.error('Failed to sync holdList to localStorage:', e);
    }
  }, [holdList]);

  // Set of borrowed book IDs for fast lookup
  const borrowedBookIds = useMemo(() => {
    return new Set(borrowedBooks.map((b) => b.bookId));
  }, [borrowedBooks]);

  // e) useMemo Calculations:
  // 1. Overdue books calculation (dueDate < today)
  const overdueBooks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return borrowedBooks.filter((book) => book.dueDate < today);
  }, [borrowedBooks]);

  // 2. Due-soon books calculation (dueDate >= today && dueDate <= today + 3 days)
  const dueSoonBooks = useMemo(() => {
    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);

    const todayStr = today.toISOString().split('T')[0];
    const threeDaysStr = threeDaysLater.toISOString().split('T')[0];

    return borrowedBooks.filter(
      (book) => book.dueDate >= todayStr && book.dueDate <= threeDaysStr
    );
  }, [borrowedBooks]);

  // 3. Reading statistics calculation
  const readingStats = useMemo(() => {
    const totalBorrowedCount = borrowedBooks.length + readingHistory.length;
    const returnedCount = readingHistory.length;
    const activeCount = borrowedBooks.length;
    const overdueCount = overdueBooks.length;
    const onTimeReturnRate =
      totalBorrowedCount > 0
        ? Math.round(((totalBorrowedCount - overdueCount) / totalBorrowedCount) * 100)
        : 100;

    return {
      totalBorrowed: totalBorrowedCount,
      returned: returnedCount,
      activeLoans: activeCount,
      overdueLoans: overdueCount,
      onTimeRate: onTimeReturnRate
    };
  }, [borrowedBooks, readingHistory, overdueBooks]);

  // f) useCallback: Library Operations

  // 1. borrowBook()
  const borrowBook = useCallback(
    (book, memberInfo) => {
      if (!book) return false;

      // Check member maximum limit
      const maxAllowed = memberInfo?.maxAllowed || 4;
      if (borrowedBooks.length >= maxAllowed) {
        showToast?.(`Borrowing quota reached! You can borrow at most ${maxAllowed} books at a time.`, 'error');
        return false;
      }

      // Check if already borrowed
      if (borrowedBookIds.has(book.id)) {
        showToast?.(`You already have an active loan for "${book.title}".`, 'warning');
        return false;
      }

      // Check availability
      if (book.availableCopies <= 0) {
        showToast?.(`"${book.title}" is currently unavailable. Place a hold request instead.`, 'warning');
        return false;
      }

      const today = new Date();
      const borrowDateStr = today.toISOString().split('T')[0];
      const dueDate = new Date();
      dueDate.setDate(today.getDate() + 14); // 14-day loan
      const dueDateStr = dueDate.toISOString().split('T')[0];

      const newRecord = {
        borrowId: `BRW-${Date.now().toString().slice(-4)}`,
        bookId: book.id,
        title: book.title,
        author: book.author,
        category: book.category,
        borrowDate: borrowDateStr,
        dueDate: dueDateStr,
        renewalCount: 0,
        status: 'Active'
      };

      setBorrowedBooks((prev) => [newRecord, ...prev]);
      adjustCopies(book.id, -1);
      showToast?.(`Successfully borrowed "${book.title}"! Due date: ${dueDateStr}`, 'success');
      return true;
    },
    [borrowedBooks, borrowedBookIds, adjustCopies, showToast]
  );

  // 2. returnBook()
  const returnBook = useCallback(
    (borrowId) => {
      const item = borrowedBooks.find((b) => b.borrowId === borrowId);
      if (!item) return;

      const todayStr = new Date().toISOString().split('T')[0];

      // Restore book inventory copy
      adjustCopies(item.bookId, +1);

      // Remove from active loans
      setBorrowedBooks((prev) => prev.filter((b) => b.borrowId !== borrowId));

      // Add to reading history
      const historyEntry = {
        historyId: `HIST-${Date.now().toString().slice(-3)}`,
        bookId: item.bookId,
        title: item.title,
        author: item.author,
        borrowDate: item.borrowDate,
        returnDate: todayStr,
        feedback: 'Returned on schedule.'
      };
      setReadingHistory((prev) => [historyEntry, ...prev]);

      showToast?.(`Returned "${item.title}". Thank you!`, 'success');
    },
    [borrowedBooks, adjustCopies, showToast]
  );

  // 3. renewBook()
  const renewBook = useCallback(
    (borrowId, maxRenewals = 2) => {
      const item = borrowedBooks.find((b) => b.borrowId === borrowId);
      if (!item) return;

      const today = new Date().toISOString().split('T')[0];
      if (item.dueDate < today) {
        showToast?.('Book renewal is not available for overdue items. Please visit circulation desk.', 'error');
        return;
      }

      if (item.renewalCount >= maxRenewals) {
        showToast?.('Book renewal is not available: Maximum renewal limit (2 times) reached.', 'warning');
        return;
      }

      const currentDue = new Date(item.dueDate);
      currentDue.setDate(currentDue.getDate() + 7);
      const newDueDateStr = currentDue.toISOString().split('T')[0];

      setBorrowedBooks((prev) =>
        prev.map((b) =>
          b.borrowId === borrowId
            ? { ...b, dueDate: newDueDateStr, renewalCount: b.renewalCount + 1 }
            : b
        )
      );

      showToast?.(`Renewal granted! New due date: ${newDueDateStr}`, 'success');
    },
    [borrowedBooks, showToast]
  );

  // 4. placeHold()
  const placeHold = useCallback(
    (book) => {
      if (book.availableCopies > 0) {
        showToast?.(`"${book.title}" has available copies. You can borrow it directly!`, 'info');
        return;
      }

      const isAlreadyOnHold = holdList.some((h) => h.bookId === book.id);
      if (isAlreadyOnHold) {
        showToast?.(`You already have a hold placed for "${book.title}".`, 'warning');
        return;
      }

      const holdItem = {
        holdId: `HLD-${Date.now().toString().slice(-4)}`,
        bookId: book.id,
        title: book.title,
        requestDate: new Date().toISOString().split('T')[0],
        status: 'Queued'
      };

      setHoldList((prev) => [...prev, holdItem]);
      showToast?.(`Hold reservation placed for "${book.title}".`, 'success');
    },
    [holdList, showToast]
  );

  // 5. clearBorrowing()
  const clearBorrowing = useCallback(() => {
    // Restores copies for all active loans and clears list
    borrowedBooks.forEach((item) => {
      adjustCopies(item.bookId, +1);
    });
    setBorrowedBooks([]);
    showToast?.('All active borrowings have been cleared and restored to catalog inventory.', 'info');
  }, [borrowedBooks, adjustCopies, showToast]);

  return {
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
    clearBorrowing
  };
}
