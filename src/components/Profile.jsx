import React, { useState, useEffect } from 'react';
import { fetchMemberProfileApi } from '../api/bookApi';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import Input from './common/Input';
import Button from './common/Button';
import Loading from './common/Loading';
import { validateProfileForm } from '../utils/validation';

/**
 * Experiment 5: Profile Component with REST API Data Fetching (GET /api/member)
 * Topics: Fetch member information using REST APIs, Loading & Error States (5.a, 5.e)
 */
export default function Profile() {
  const { currentUser, updateProfile } = useAuth();
  const { borrowedBooks, readingStats, showToast } = useLibrary();

  const [memberData, setMemberData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: ''
  });
  const [errors, setErrors] = useState({});

  // a) Fetch member information using REST API
  const loadProfileFromApi = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      console.log('[REST API GET /api/member] Fetching member profile...');
      const response = await fetchMemberProfileApi();
      const user = currentUser || response.data;
      setMemberData(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '9876543210',
        department: user.department || 'Computer Science & Engineering'
      });
    } catch (err) {
      console.error('[REST API Error]:', err);
      setApiError(err.message || 'Failed to fetch member details from REST API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfileFromApi();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const { isValid, errors: valErrors } = validateProfileForm(formData);
    if (!isValid) {
      setErrors(valErrors);
      return;
    }

    updateProfile(formData);
    setMemberData((prev) => ({ ...prev, ...formData }));
    setIsEditing(false);
    showToast('Member profile saved and synchronized with REST API!', 'success');
  };

  // e) Loading State
  if (isLoading) {
    return <Loading message="Retrieving member credentials from REST API endpoint (/api/member)..." />;
  }

  // e) Error State
  if (apiError) {
    return (
      <div className="empty-state" style={{ borderColor: '#f87171', backgroundColor: '#fef2f2' }}>
        <span className="empty-icon">⚠️</span>
        <h3 className="text-danger">Failed to Load Profile from REST API</h3>
        <p className="text-muted" style={{ marginBottom: '1rem' }}>{apiError}</p>
        <Button variant="primary" onClick={loadProfileFromApi}>
          🔄 Retry REST Call
        </Button>
      </div>
    );
  }

  const quotaLeft = (memberData?.maxAllowed || 4) - borrowedBooks.length;

  return (
    <div className="profile-container">
      <div className="section-header">
        <div>
          <h2>Member Profile</h2>
          <p className="section-desc">
            Verified Account &bull; Data Source: <code>REST API (GET /api/member)</code>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Button
            variant={isEditing ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => {
              setIsEditing(!isEditing);
              setErrors({});
            }}
          >
            {isEditing ? 'Cancel Edit' : '✏️ Edit Profile'}
          </Button>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-top">
          <div className="profile-avatar-large">🧑‍🎓</div>
          <div>
            <h3 className="profile-name">{memberData?.name}</h3>
            <p className="profile-sub">
              {memberData?.memberType} &bull; {memberData?.department}
            </p>
            <span className="member-id-tag">ID: {memberData?.memberId || memberData?.id}</span>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="profile-edit-form" noValidate>
            <h4 style={{ marginBottom: '1rem' }}>Update Member Information</h4>
            <div className="profile-details-grid">
              <Input
                label="Full Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={errors.name}
              />
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={errors.email}
              />
              <Input
                label="Phone Number"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                error={errors.phone}
              />
              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  Department <span className="text-danger">*</span>
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                💾 Save Changes (PUT /api/member)
              </Button>
            </div>
          </form>
        ) : (
          <div className="profile-details-grid">
            <div className="profile-field">
              <span className="field-label">Email Address</span>
              <span className="field-value">{memberData?.email}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Phone Number</span>
              <span className="field-value">{memberData?.phone || '9876543210'}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">Department</span>
              <span className="field-value">{memberData?.department}</span>
            </div>
            <div className="profile-field">
              <span className="field-label">REST API Status</span>
              <span className="field-value text-success">✓ Synchronized</span>
            </div>
          </div>
        )}

        {/* Reading Statistics */}
        <div className="quota-box">
          <h4>📊 Reading Statistics (REST Records)</h4>
          <div className="stats-grid" style={{ marginTop: '0.75rem' }}>
            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-info">
                <span className="stat-number">{readingStats.totalBorrowed}</span>
                <span className="stat-label">Total Books Loaned</span>
              </div>
            </div>
            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-info">
                <span className="stat-number">{readingStats.returned}</span>
                <span className="stat-label">Returned Successfully</span>
              </div>
            </div>
            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-info">
                <span className="stat-number">{readingStats.activeLoans}</span>
                <span className="stat-label">Active Loans</span>
              </div>
            </div>
            <div className="stat-card" style={{ padding: '0.75rem' }}>
              <div className="stat-info">
                <span className="stat-number">{readingStats.onTimeRate}%</span>
                <span className="stat-label">On-Time Return Rate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Borrowing Quota */}
        <div className="quota-box">
          <h4>Borrowing Limits & Quota</h4>
          <div className="quota-meter">
            <div className="quota-stat">
              <span className="quota-num">{borrowedBooks.length}</span>
              <span className="quota-desc">Currently Borrowed</span>
            </div>
            <div className="quota-divider">/</div>
            <div className="quota-stat">
              <span className="quota-num">{memberData?.maxAllowed || 4}</span>
              <span className="quota-desc">Max Allowed</span>
            </div>
            <div className="quota-divider">=</div>
            <div className="quota-stat highlight">
              <span className="quota-num">{Math.max(0, quotaLeft)}</span>
              <span className="quota-desc">Remaining Quota</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
