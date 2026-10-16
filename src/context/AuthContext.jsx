import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginApi,
  registerApi,
  logoutApi,
  inspectToken,
  simulateTokenExpiration,
  simulateTokenCorruption,
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY
} from '../api/authApi';

export const AuthContext = createContext(null);

/**
 * Experiment 8: AuthContext with Token Management & Axios Interceptor Listeners
 * Topics: Auth API, Token Storage, Protected Operations, Invalid/Expired Token Handling (8.a - 8.f)
 */
export function AuthProvider({ children }) {
  // Store authentication token
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  // Store current authenticated user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [tokenStatus, setTokenStatus] = useState(() => inspectToken(token));

  // Sync token status whenever token changes
  useEffect(() => {
    setTokenStatus(inspectToken(token));
  }, [token]);

  // f) Handle invalid and expired tokens via Axios Interceptor event listener
  useEffect(() => {
    const handleTokenExpiredEvent = (e) => {
      console.warn('[AuthContext] ⚠️ Received auth-token-expired event:', e.detail);
      setToken(null);
      setCurrentUser(null);
      setTokenStatus({ status: 'EXPIRED', message: e.detail?.message || 'Token has expired.' });
    };

    window.addEventListener('auth-token-expired', handleTokenExpiredEvent);
    return () => window.removeEventListener('auth-token-expired', handleTokenExpiredEvent);
  }, []);

  /**
   * a & b) Member Login using authentication API and token storage
   */
  const login = async (identifier, password) => {
    const res = await loginApi(identifier, password);
    const { token: receivedToken, user } = res.data;

    // b) Store authentication token
    localStorage.setItem(TOKEN_STORAGE_KEY, receivedToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    setToken(receivedToken);
    setCurrentUser(user);
    setTokenStatus(inspectToken(receivedToken));
    return { success: true, user, token: receivedToken };
  };

  /**
   * Member Registration using authentication API and token storage
   */
  const signup = async (userData) => {
    const res = await registerApi(userData);
    const { token: receivedToken, user } = res.data;

    // b) Store authentication token
    localStorage.setItem(TOKEN_STORAGE_KEY, receivedToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

    setToken(receivedToken);
    setCurrentUser(user);
    setTokenStatus(inspectToken(receivedToken));
    return { success: true, user, token: receivedToken };
  };

  /**
   * e) Logout and token removal
   */
  const logout = async () => {
    await logoutApi();
    setToken(null);
    setCurrentUser(null);
    setTokenStatus({ status: 'MISSING', message: 'No authentication token found.' });
  };

  // Lab Testing Helper: Force expire token to demonstrate 401 handling
  const triggerExpireToken = () => {
    simulateTokenExpiration();
    const updated = localStorage.getItem(TOKEN_STORAGE_KEY);
    setToken(updated);
    setTokenStatus(inspectToken(updated));
  };

  // Lab Testing Helper: Corrupt token signature to demonstrate 403 handling
  const triggerCorruptToken = () => {
    simulateTokenCorruption();
    const updated = localStorage.getItem(TOKEN_STORAGE_KEY);
    setToken(updated);
    setTokenStatus(inspectToken(updated));
  };

  const isAuthenticated = Boolean(token && tokenStatus.status === 'VALID');

  const contextValue = {
    token,
    tokenStatus,
    currentUser,
    isAuthenticated,
    login,
    signup,
    logout,
    triggerExpireToken,
    triggerCorruptToken
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
