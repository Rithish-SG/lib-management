import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INITIAL_BOOKS } from '../../data/initialData';

// Asynchronous thunk to simulate fetching books with loading state
export const fetchBooksAsync = createAsyncThunk(
  'books/fetchBooks',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate network request delay (400ms)
      await new Promise((resolve) => setTimeout(resolve, 400));
      const saved = localStorage.getItem('lib_redux_books');
      return saved ? JSON.parse(saved) : INITIAL_BOOKS;
    } catch (err) {
      return rejectWithValue('Failed to load books catalog.');
    }
  }
);

// Retrieve saved books from localStorage or default
const getSavedBooks = () => {
  try {
    const saved = localStorage.getItem('lib_redux_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  } catch {
    return INITIAL_BOOKS;
  }
};

const initialState = {
  items: getSavedBooks(),
  searchKeyword: '',
  selectedCategory: 'All',
  selectedAuthor: 'All',
  onlyAvailable: false,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedAuthor: (state, action) => {
      state.selectedAuthor = action.payload;
    },
    setOnlyAvailable: (state, action) => {
      state.onlyAvailable = action.payload;
    },
    resetFilters: (state) => {
      state.searchKeyword = '';
      state.selectedCategory = 'All';
      state.selectedAuthor = 'All';
      state.onlyAvailable = false;
    },
    decrementCopies: (state, action) => {
      const bookId = action.payload;
      const book = state.items.find((b) => b.id === bookId);
      if (book && book.availableCopies > 0) {
        book.availableCopies -= 1;
      }
    },
    incrementCopies: (state, action) => {
      const bookId = action.payload;
      const book = state.items.find((b) => b.id === bookId);
      if (book) {
        book.availableCopies += 1;
      }
    },
    restoreAllInventory: (state, action) => {
      // action.payload is array of bookIds to restore
      const bookIds = action.payload || [];
      bookIds.forEach((id) => {
        const book = state.items.find((b) => b.id === id);
        if (book) book.availableCopies += 1;
      });
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooksAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooksAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchBooksAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch books';
      });
  }
});

export const {
  setSearchKeyword,
  setSelectedCategory,
  setSelectedAuthor,
  setOnlyAvailable,
  resetFilters,
  decrementCopies,
  incrementCopies,
  restoreAllInventory
} = booksSlice.actions;

// Selectors
export const selectAllBooks = (state) => state.books.items;
export const selectBooksStatus = (state) => state.books.status;
export const selectBooksError = (state) => state.books.error;
export const selectSearchKeyword = (state) => state.books.searchKeyword;
export const selectSelectedCategory = (state) => state.books.selectedCategory;
export const selectSelectedAuthor = (state) => state.books.selectedAuthor;
export const selectOnlyAvailable = (state) => state.books.onlyAvailable;

export const selectFilteredBooks = (state) => {
  const { items, searchKeyword, selectedCategory, selectedAuthor, onlyAvailable } = state.books;
  const query = searchKeyword.toLowerCase().trim();

  return items.filter((book) => {
    const matchesSearch =
      !query ||
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === 'All' || book.category === selectedCategory;

    const matchesAuthor =
      selectedAuthor === 'All' || book.author === selectedAuthor;

    const matchesAvailability =
      !onlyAvailable || book.availableCopies > 0;

    return matchesSearch && matchesCategory && matchesAuthor && matchesAvailability;
  });
};

export const selectCategories = (state) => {
  return Array.from(new Set(state.books.items.map((b) => b.category)));
};

export const selectAuthors = (state) => {
  return Array.from(new Set(state.books.items.map((b) => b.author)));
};

export const selectTotalAvailableCopies = (state) => {
  return state.books.items.reduce((sum, b) => sum + (b.availableCopies > 0 ? b.availableCopies : 0), 0);
};

export default booksSlice.reducer;
