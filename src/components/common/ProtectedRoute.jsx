import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Reusable ProtectedRoute Component
 * Topics: Protected Routes, React Router Navigation (Requirement 4.c, 4.d, 4.e, 4.h)
 * Checks authentication status; if unauthenticated, redirects to /login preserving the requested path.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // d & e) Redirect to login and save requested URL in location state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
