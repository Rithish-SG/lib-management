import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_BORROWED, INITIAL_HISTORY } from '../../data/initialData';

// Retrieve initial borrowing records from localStorage or initialData
const getSavedBorrowed = () => {
  try {
    const saved = localStorage.getItem('lib_redux_borrowed');
    return saved ? JSON.parse(saved) : INITIAL_BORROWED;
  } catch {
    return INITIAL_BORROWED;
  }
};

const getSavedHistory = () => {
  try {
    const saved = localStorage.getItem('lib_redux_history');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  } catch {
    return INITIAL_HISTORY;
  }
};

const getSavedHolds = () => {
  try {
    const saved = localStorage.getItem('lib_redux_holds');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const initialState = {
  borrowedBooks: getSavedBorrowed(),
  readingHistory: getSavedHistory(),
  holdList: getSavedHolds()
};

export const borrowSlice = createSlice({
  name: 'borrow',
  initialState,
  reducers: {
    // c) borrow action
    borrowBook: (state, action) => {
      const book = action.payload;
      const today = new Date();
      const borrowDateStr = today.toISOString().split('T')[0];
      const dueDate = new Date();
      dueDate.setDate(today.getDate() + 14);
      const dueDateStr = dueDate.toISOString().split('T')[0];

      const newBorrow = {
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

      state.borrowedBooks.unshift(newBorrow);
    },

    // c) return action
    returnBook: (state, action) => {
      const borrowId = action.payload;
      const itemToReturn = state.borrowedBooks.find((b) => b.borrowId === borrowId);
      if (itemToReturn) {
        state.borrowedBooks = state.borrowedBooks.filter((b) => b.borrowId !== borrowId);

        const historyEntry = {
          historyId: `HIST-${Date.now().toString().slice(-3)}`,
          bookId: itemToReturn.bookId,
          title: itemToReturn.title,
          author: itemToReturn.author,
          borrowDate: itemToReturn.borrowDate,
          returnDate: new Date().toISOString().split('T')[0],
          feedback: 'Returned on schedule.'
        };
        state.readingHistory.unshift(historyEntry);
      }
    },

    // c) renew action
    renewBook: (state, action) => {
      const { borrowId, maxRenewals = 2 } = action.payload;
      const item = state.borrowedBooks.find((b) => b.borrowId === borrowId);
      if (item && item.renewalCount < maxRenewals) {
        const currentDue = new Date(item.dueDate);
        currentDue.setDate(currentDue.getDate() + 7);
        item.dueDate = currentDue.toISOString().split('T')[0];
        item.renewalCount += 1;
      }
    },

    // c) hold action
    placeHold: (state, action) => {
      const book = action.payload;
      const alreadyHeld = state.holdList.some((h) => h.bookId === book.id);
      if (!alreadyHeld) {
        const holdItem = {
          holdId: `HLD-${Date.now().toString().slice(-4)}`,
          bookId: book.id,
          title: book.title,
          requestDate: new Date().toISOString().split('T')[0],
          status: 'Waiting in Queue'
        };
        state.holdList.push(holdItem);
      }
    },

    // Clear all borrowing records
    clearAllBorrowing: (state) => {
      state.borrowedBooks = [];
    }
  }
});

export const {
  borrowBook,
  returnBook,
  renewBook,
  placeHold,
  clearAllBorrowing
} = borrowSlice.actions;

// Selectors
export const selectBorrowedBooks = (state) => state.borrow.borrowedBooks;
export const selectReadingHistory = (state) => state.borrow.readingHistory;
export const selectHoldList = (state) => state.borrow.holdList;

export const selectBorrowedBookIds = (state) => {
  return new Set(state.borrow.borrowedBooks.map((b) => b.bookId));
};

export const selectOverdueBooks = (state) => {
  const today = new Date().toISOString().split('T')[0];
  return state.borrow.borrowedBooks.filter((b) => b.dueDate < today);
};

export const selectDueSoonBooks = (state) => {
  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);

  const todayStr = today.toISOString().split('T')[0];
  const threeDaysStr = threeDaysLater.toISOString().split('T')[0];

  return state.borrow.borrowedBooks.filter(
    (b) => b.dueDate >= todayStr && b.dueDate <= threeDaysStr
  );
};

export const selectReadingStats = (state) => {
  const totalBorrowed = state.borrow.borrowedBooks.length + state.borrow.readingHistory.length;
  const returned = state.borrow.readingHistory.length;
  const activeLoans = state.borrow.borrowedBooks.length;
  const today = new Date().toISOString().split('T')[0];
  const overdueLoans = state.borrow.borrowedBooks.filter((b) => b.dueDate < today).length;
  const onTimeRate = totalBorrowed > 0
    ? Math.round(((totalBorrowed - overdueLoans) / totalBorrowed) * 100)
    : 100;

  return {
    totalBorrowed,
    returned,
    activeLoans,
    overdueLoans,
    onTimeRate
  };
};

export default borrowSlice.reducer;
