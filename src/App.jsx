import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import CatalogPage from './pages/CatalogPage';
import BookDetailsPage from './pages/BookDetailsPage';
import BorrowRequestPage from './pages/BorrowRequestPage';
import Login from './pages/Login';
import MemberDashboardLayout from './layouts/MemberDashboardLayout';
import BorrowedBooks from './components/BorrowedBooks';
import ReadingHistory from './components/ReadingHistory';
import Recommendations from './components/Recommendations';
import Profile from './components/Profile';
import ErrorTrigger from './components/ErrorTrigger';
import './App.css';

/**
 * Experiment 5: Develop Library Application with Book REST API
 * Topics Demonstrated:
 *  - REST API with Axios: All book catalog, book details, member profile, and recommendations
 *    are fetched via async REST API calls (simulated with realistic network delays).
 *  - Async Data Handling: async/await with try/catch throughout all API calls.
 *  - Loading States: <Loading /> spinner shown while API requests are in-flight.
 *  - Error States: Error messages with "Retry" button shown on API failure.
 *  - API-based Recommendations: GET /api/recommendations from REST endpoint.
 *  - Search & Category Filtering: Live search and filter triggers debounced API calls.
 *  - Error Simulation: ApiStatusBar toggle lets you simulate HTTP 500 errors to test error states.
 */

function AppRouter() {
  const { notification, setNotification } = useLibrary();

  return (
    <BrowserRouter>
      <div className="app-layout">
        {/* Toast Notification Banner */}
        {notification && (
          <div className={`toast-notification toast-${notification.type}`}>
            <span>{notification.message}</span>
            <button className="toast-close" onClick={() => setNotification(null)}>✕</button>
          </div>
        )}

        {/* Global Header */}
        <Header />

        {/* Main Content Area */}
        <main className="main-content">
          <Routes>
            {/* 1. Public Authentication Route */}
            <Route path="/login" element={<Login />} />

            {/* 2. Public Home Route (with Lab ErrorBoundary demonstration trigger) */}
            <Route
              path="/"
              element={
                <>
                  <Home />
                  <ErrorTrigger />
                </>
              }
            />

            {/* 3. Public Catalog Route: /books */}
            <Route path="/books" element={<CatalogPage />} />

            {/* 4. Public Dynamic Route: /book/:id */}
            <Route path="/book/:id" element={<BookDetailsPage />} />

            {/* 5. Protected Borrow Flow: /book/:id/borrow */}
            <Route
              path="/book/:id/borrow"
              element={
                <ProtectedRoute>
                  <BorrowRequestPage />
                </ProtectedRoute>
              }
            />

            {/* 6. c & d) Protected Member Dashboard Routes (/member) */}
            <Route
              path="/member"
              element={
                <ProtectedRoute>
                  <MemberDashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="borrowed" replace />} />
              <Route path="borrowed" element={<BorrowedBooks />} />
              <Route path="history" element={<ReadingHistory />} />
              <Route path="recommendations" element={<Recommendations />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Protected aliases as per syllabus */}
            <Route
              path="/borrowed"
              element={
                <ProtectedRoute>
                  <Navigate to="/member/borrowed" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <Navigate to="/member/history" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Navigate to="/member/profile" replace />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/books" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    // g & h) Reusable ErrorBoundary wrapping entire tree
    <ErrorBoundary>
      {/* b) AuthContext Provider */}
      <AuthProvider>
        {/* LibraryContext Provider */}
        <LibraryProvider>
          <AppRouter />
        </LibraryProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
