import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './context/AuthContext';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import Loading from './components/common/Loading';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import CatalogPage from './pages/CatalogPage';
import Login from './pages/Login';
import PwaStatusBanner from './components/common/PwaStatusBanner';
import OptimizationDashboard from './components/common/OptimizationDashboard';
import './App.css';

/**
 * a) LAZY LOADING & CODE SPLITTING (Requirement 10.a, 10.b)
 * On-demand dynamic imports for heavy secondary routes to drastically reduce initial bundle size
 */
const BookDetailsPage = lazy(() => import('./pages/BookDetailsPage'));
const BorrowRequestPage = lazy(() => import('./pages/BorrowRequestPage'));
const MemberDashboardLayout = lazy(() => import('./layouts/MemberDashboardLayout'));
const BorrowedBooks = lazy(() => import('./components/BorrowedBooks'));
const ReadingHistory = lazy(() => import('./components/ReadingHistory'));
const Recommendations = lazy(() => import('./components/Recommendations'));
const Profile = lazy(() => import('./components/Profile'));

/**
 * Experiment 10: Optimize Library Application
 * Topics Demonstrated:
 *  - Lazy Loading for Book Details & Member Pages (10.a)
 *  - Code Splitting with Rollup manualChunks (10.b)
 *  - Image & Data Optimization (10.c)
 *  - Progressive Web App (PWA) Manifest & Service Worker (10.d)
 *  - WCAG Accessibility & Keyboard Navigation (10.e)
 *  - Secure Input Handling & API Practices (10.f)
 */

function AppRouter() {
  const { notification, setNotification } = useLibrary();

  return (
    <HashRouter>
      <div className="app-layout">
        {/* Toast Notification Banner */}
        {notification && (
          <div className={`toast-notification toast-${notification.type}`} role="alert">
            <span>{notification.message}</span>
            <button className="toast-close" onClick={() => setNotification(null)} aria-label="Close notification">✕</button>
          </div>
        )}

        {/* Global Header */}
        <Header />

        {/* Main Content Area - e) Accessibility: id="main-content" targets the skip link */}
        <main id="main-content" className="main-content" tabIndex="-1">
          {/* d) PWA Offline & Install Status Banner */}
          <PwaStatusBanner />

          {/* Interactive Production Optimizations Scorecard */}
          <OptimizationDashboard />

          {/* a & b) Suspense boundary fallback for lazy loaded route chunks */}
          <Suspense fallback={<Loading message="⚡ Loading on-demand route chunk via Code Splitting..." />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<CatalogPage />} />
              <Route path="/book/:id" element={<BookDetailsPage />} />

              <Route
                path="/book/:id/borrow"
                element={
                  <ProtectedRoute>
                    <BorrowRequestPage />
                  </ProtectedRoute>
                }
              />

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

              <Route path="*" element={<Navigate to="/books" replace />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </HashRouter>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <LibraryProvider>
            <AppRouter />
          </LibraryProvider>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  );
}
