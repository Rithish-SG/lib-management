import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import Button from './common/Button';

/**
 * Experiment 4: Header Component with AuthContext and Protected Navigation
 */
export default function Header() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { borrowedBooks, overdueBooks, memberInfo, showToast } = useLibrary();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully.', 'info');
    navigate('/login');
  };

  const displayName = currentUser?.name || memberInfo?.name || 'Guest';
  const displayRole = currentUser?.memberType || memberInfo?.memberType || 'Visitor';

  return (
    <header className="app-header">
      <div className="header-container">
        {/* Brand / Logo */}
        <Link to="/" className="logo-section" style={{ textDecoration: 'none' }}>
          <div className="library-icon">📚</div>
          <div>
            <h1 className="library-title">Campus Central Library</h1>
            <p className="library-subtitle">Web Technology Lab - Experiment 5 (REST API & Axios)</p>
          </div>
        </Link>

        {/* Navigation links using NavLink */}
        <nav className="nav-tabs">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
            end
          >
            🏠 Home
          </NavLink>
          <NavLink
            to="/books"
            className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
          >
            📖 Book Catalog
          </NavLink>
          <NavLink
            to="/member/borrowed"
            className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
          >
            📋 Borrowed
            {borrowedBooks.length > 0 && <span className="badge">{borrowedBooks.length}</span>}
            {overdueBooks.length > 0 && <span className="badge badge-danger">!</span>}
          </NavLink>
          <NavLink
            to="/member/history"
            className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
          >
            📜 History
          </NavLink>
          <NavLink
            to="/member/profile"
            className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}
          >
            👤 Profile
          </NavLink>
        </nav>

        {/* Member Authentication Status & Sign In/Out */}
        <div className="header-right-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <>
              <Link to="/member/profile" className="member-quick-info" style={{ textDecoration: 'none' }}>
                <span className="member-avatar">🧑‍🎓</span>
                <div className="member-text">
                  <span className="member-name">{displayName}</span>
                  <span className="member-role" style={{ color: '#10b981', fontWeight: 600 }}>
                    ● {displayRole}
                  </span>
                </div>
              </Link>
              <Button variant="secondary" size="sm" onClick={handleLogout} title="Sign Out of Session">
                🚪 Sign Out
              </Button>
            </>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary">
              🔑 Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
