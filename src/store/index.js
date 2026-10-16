import { configureStore } from '@reduxjs/toolkit';
import booksReducer from './slices/booksSlice';
import borrowReducer from './slices/borrowSlice';
import memberReducer from './slices/memberSlice';
import { actionMonitoringMiddleware, storageSyncMiddleware } from './middleware/libraryMiddleware';

/**
 * Experiment 6: Global Library Store with Redux Toolkit
 * Topics: Global Library Store, Middleware, State Synchronization (6.a, 6.d, 6.e)
 */
export const store = configureStore({
  reducer: {
    books: booksReducer,
    borrow: borrowReducer,
    member: memberReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(actionMonitoringMiddleware, storageSyncMiddleware),
  devTools: true // Enables Redux DevTools extension integration
});

export default store;
