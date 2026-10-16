import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import {
  validateRequired,
  validateEmail,
  validatePassword,
  validateMemberId,
  validatePhone
} from '../utils/validation';

/**
 * Experiment 4: Login & Sign-Up Component with Controlled Components and Validation
 * Topics: Controlled Components, AuthContext, Form Validation, Protected Route Redirection (4.a, 4.b, 4.e, 4.f)
 */
export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);

  // Controlled form state
  const [formData, setFormData] = useState({
    identifier: '', // Email or Member ID for login
    name: '',
    email: '',
    memberId: '',
    phone: '',
    department: 'Computer Science & Engineering',
    password: ''
  });

  // Validation errors state
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');

  const { login, signup } = useAuth();
  const { setMemberInfo, showToast } = useLibrary();
  const navigate = useNavigate();
  const location = useLocation();

  // e) Destination to redirect to after successful authentication
  const destination = location.state?.from?.pathname || '/books';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (authError) setAuthError('');
  };

  const validateLoginForm = () => {
    const newErrors = {};
    const idErr = validateRequired(formData.identifier, 'Member ID or Email');
    if (idErr) newErrors.identifier = idErr;

    const passErr = validatePassword(formData.password);
    if (passErr) newErrors.password = passErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignUpForm = () => {
    const newErrors = {};
    const nameErr = validateRequired(formData.name, 'Full Name');
    if (nameErr) newErrors.name = nameErr;

    const emailErr = validateEmail(formData.email);
    if (emailErr) newErrors.email = emailErr;

    const idErr = validateMemberId(formData.memberId);
    if (idErr) newErrors.memberId = idErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const passErr = validatePassword(formData.password);
    if (passErr) newErrors.password = passErr;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (isSignUp) {
      if (!validateSignUpForm()) return;

      const result = signup({
        name: formData.name,
        email: formData.email,
        memberId: formData.memberId,
        password: formData.password,
        phone: formData.phone,
        department: formData.department
      });

      if (!result.success) {
        setAuthError(result.error);
        return;
      }

      // Sync member profile with signed up user
      setMemberInfo(result.user);
      showToast(`Welcome, ${result.user.name}! Your account has been registered.`, 'success');
      navigate(destination, { replace: true });
    } else {
      if (!validateLoginForm()) return;

      const result = login(formData.identifier, formData.password);

      if (!result.success) {
        setAuthError(result.error);
        return;
      }

      // Sync member profile with authenticated user
      setMemberInfo(result.user);
      showToast(`Welcome back, ${result.user.name}!`, 'success');
      navigate(destination, { replace: true });
    }
  };

  const handleFastDemoLogin = (cred, pass) => {
    const result = login(cred, pass);
    if (result.success) {
      setMemberInfo(result.user);
      showToast(`Logged in as ${result.user.name}!`, 'success');
      navigate(destination, { replace: true });
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🔐</div>
          <h2>Campus Central Library</h2>
          <p className="login-subtitle">
            {isSignUp ? 'Create your verified member account' : 'Sign in to access your protected library dashboard'}
          </p>
          <span className="exp-badge">Experiment 4: Authentication & Form Validation</span>
        </div>

        {location.state?.from && (
          <div className="notice-box" style={{ backgroundColor: '#fffbeb', borderColor: '#f59e0b', color: '#92400e', marginBottom: '1rem' }}>
            🔒 <strong>Protected Route:</strong> You must sign in to access <code>{location.state.from.pathname}</code>.
          </div>
        )}

        {authError && (
          <div className="notice-box" style={{ backgroundColor: '#fef2f2', borderColor: '#ef4444', color: '#991b1b', marginBottom: '1rem' }}>
            ❌ {authError}
          </div>
        )}

        <div className="auth-tab-switch">
          <button
            type="button"
            className={`auth-tab-btn ${!isSignUp ? 'active' : ''}`}
            onClick={() => {
              setIsSignUp(false);
              setErrors({});
              setAuthError('');
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${isSignUp ? 'active' : ''}`}
            onClick={() => {
              setIsSignUp(true);
              setErrors({});
              setAuthError('');
            }}
          >
            Sign Up (Register)
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          {isSignUp ? (
            <>
              {/* Sign Up Fields */}
              <Input
                label="Full Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rachel Adams"
                required
                error={errors.name}
                helperText="This name will appear on your Member Profile"
              />

              <Input
                label="Member / Student ID"
                id="memberId"
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                placeholder="e.g. MEM-2024-500"
                required
                error={errors.memberId}
              />

              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. rachel@college.edu"
                required
                error={errors.email}
              />

              <Input
                label="Phone Number (10 digits)"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
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

              <Input
                label="Password (min 6 characters)"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                error={errors.password}
              />
            </>
          ) : (
            <>
              {/* Login Fields */}
              <Input
                label="Member ID or Email Address"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="e.g. MEM-2024-001 or alex.johnson@college.edu"
                required
                error={errors.identifier}
              />

              <Input
                label="Password"
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                error={errors.password}
              />
            </>
          )}

          <Button type="submit" variant="primary" className="btn-block">
            {isSignUp ? '✨ Register & Sign In' : '🔑 Sign In & Proceed'}
          </Button>
        </form>

        <div className="login-footer">
          <p className="note-text">
            <strong>Default Demo Credentials:</strong><br />
            Student: <code>MEM-2024-001</code> / <code>password123</code><br />
            Faculty: <code>FAC-2024-088</code> / <code>faculty123</code>
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleFastDemoLogin('MEM-2024-001', 'password123')}
            >
              ⚡ Quick Sign In as Alex
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
