import React from 'react';
import { Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import Recommendations from './Recommendations';

/**
 * Experiment 5: Home Component
 * Stats pulled from LibraryContext which syncs with REST API data layer
 */
export default function Home() {
  const {
    memberInfo,
    books,
    totalAvailableCopies,
    borrowedBooks,
    overdueBooks,
    dueSoonBooks,
    isLoggedIn
  } = useLibrary();

  return (
    <div className="home-container">
      {/* Welcome Banner */}
      <section className="welcome-banner">
        <div className="banner-content">
          <h2>Welcome back, {memberInfo.name}! 👋</h2>
          <p>
            Campus Central Library Management Portal.
            Explore our curated catalog, view book details via dynamic routing, and manage your member dashboard.
          </p>
          <div className="banner-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Link to /books */}
            <Link to="/books" className="btn btn-primary">
              🔍 Explore Entire Catalog
            </Link>
            {/* Link to /member/borrowed */}
            <Link to="/member/borrowed" className="btn btn-secondary">
              📋 My Member Dashboard
            </Link>
            {!isLoggedIn && (
              <Link to="/login" className="btn btn-secondary">
                🔑 Switch User / Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Statistics Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <span className="stat-number">{books.length}</span>
            <span className="stat-label">Total Titles</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-number">{totalAvailableCopies}</span>
            <span className="stat-label">Available Copies</span>
          </div>
        </div>

        <Link to="/member/borrowed" className="stat-card" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="stat-icon">📖</div>
          <div className="stat-info">
            <span className="stat-number">{borrowedBooks.length}</span>
            <span className="stat-label">Active Loans (Click to View)</span>
          </div>
        </Link>

        <div className={`stat-card ${overdueBooks.length > 0 ? 'stat-card-alert' : ''}`}>
          <div className="stat-icon">{overdueBooks.length > 0 ? '⚠️' : '🎉'}</div>
          <div className="stat-info">
            <span className="stat-number">{overdueBooks.length}</span>
            <span className="stat-label">Overdue Loans</span>
          </div>
        </div>
      </section>

      {/* Due soon alert if applicable */}
      {dueSoonBooks.length > 0 && (
        <section className="notice-box" style={{ backgroundColor: '#fffbeb', borderColor: '#f59e0b', color: '#92400e' }}>
          <div className="notice-header">
            <span>⏰ Upcoming Due Dates Reminder</span>
          </div>
          <p>
            You have <strong>{dueSoonBooks.length}</strong> book(s) due within the next 3 days.{' '}
            <Link to="/member/borrowed" style={{ color: '#b45309', fontWeight: 600 }}>
              Renew them now →
            </Link>
          </p>
        </section>
      )}

      {/* Recommendations Section */}
      <section className="home-recommendations">
        <Recommendations />
      </section>
    </div>
  );
}
