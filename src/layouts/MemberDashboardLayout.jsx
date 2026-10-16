import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';

/**
 * Experiment 3: Nested Routing for Member Dashboard
 * Routes:
 *  - /member/borrowed
 *  - /member/history
 *  - /member/recommendations
 *  - /member/profile
 * Topics: Nested Routes, NavLink, Outlet
 */
export default function MemberDashboardLayout() {
  const { memberInfo, borrowedBooks, overdueBooks } = useLibrary();

  return (
    <div className="member-dashboard-layout">
      {/* Dashboard Top Banner */}
      <div className="dashboard-banner">
        <div className="dashboard-banner-left">
          <div className="dashboard-avatar">🧑‍🎓</div>
          <div>
            <h2>{memberInfo.name}'s Library Dashboard</h2>
            <p className="text-muted">
              Member ID: <code>{memberInfo.id}</code> &bull; {memberInfo.department} ({memberInfo.memberType})
            </p>
          </div>
        </div>

        <div className="dashboard-stats-quick">
          <div className="quick-stat">
            <span className="quick-num">{borrowedBooks.length}</span>
            <span className="quick-label">Active Loans</span>
          </div>
          {overdueBooks.length > 0 && (
            <div className="quick-stat stat-danger">
              <span className="quick-num">{overdueBooks.length}</span>
              <span className="quick-label">Overdue</span>
            </div>
          )}
        </div>
      </div>

      {/* Sub-Navigation for Nested Routes using NavLink */}
      <div className="dashboard-subnav">
        <NavLink
          to="/member/borrowed"
          className={({ isActive }) => `subnav-btn ${isActive ? 'active' : ''}`}
        >
          📋 Active Loans ({borrowedBooks.length})
        </NavLink>
        <NavLink
          to="/member/history"
          className={({ isActive }) => `subnav-btn ${isActive ? 'active' : ''}`}
        >
          📜 Reading History
        </NavLink>
        <NavLink
          to="/member/recommendations"
          className={({ isActive }) => `subnav-btn ${isActive ? 'active' : ''}`}
        >
          ✨ Recommendations
        </NavLink>
        <NavLink
          to="/member/profile"
          className={({ isActive }) => `subnav-btn ${isActive ? 'active' : ''}`}
        >
          👤 Account Profile
        </NavLink>
      </div>

      {/* f) Outlet: Renders the matching nested child route component */}
      <div className="dashboard-nested-content">
        <Outlet />
      </div>
    </div>
  );
}
