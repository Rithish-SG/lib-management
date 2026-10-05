import React, { createContext, useContext, useState, useEffect } from 'react';

// Default mock registered members
const DEFAULT_USERS = [
  {
    name: 'Alex Johnson',
    email: 'alex.johnson@college.edu',
    memberId: 'MEM-2024-001',
    password: 'password123',
    phone: '9876543210',
    department: 'Computer Science & Engineering',
    memberType: 'Student'
  },
  {
    name: 'Prof. David Miller',
    email: 'david.miller@college.edu',
    memberId: 'FAC-2024-088',
    password: 'faculty123',
    phone: '9876543211',
    department: 'Mathematics',
    memberType: 'Faculty'
  }
];

export const AuthContext = createContext(null);

/**
 * Experiment 4: AuthContext using Context API
 * Maintains member authentication status, registered users, login, signup, and logout.
 */
export function AuthProvider({ children }) {
  // Registered users stored in localStorage
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('lib_auth_users');
      return saved ? JSON.parse(saved) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  });

  // Current authenticated user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('lib_auth_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('lib_auth_is_authenticated') === 'true';
    } catch {
      return false;
    }
  });

  // Sync users list to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lib_auth_users', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  // Sync session to localStorage
  useEffect(() => {
    try {
      if (currentUser && isAuthenticated) {
        localStorage.setItem('lib_auth_current_user', JSON.stringify(currentUser));
        localStorage.setItem('lib_auth_is_authenticated', 'true');
      } else {
        localStorage.removeItem('lib_auth_current_user');
        localStorage.setItem('lib_auth_is_authenticated', 'false');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser, isAuthenticated]);

  /**
   * Login with credential and password verification
   */
  const login = (identifier, password) => {
    const idClean = identifier.trim().toLowerCase();
    const user = users.find(
      (u) =>
        u.email.toLowerCase() === idClean ||
        u.memberId.toLowerCase() === idClean
    );

    if (!user) {
      return { success: false, error: 'No member found with this Email or Member ID.' };
    }

    if (user.password !== password) {
      return { success: false, error: 'Invalid password. Please try again.' };
    }

    setCurrentUser(user);
    setIsAuthenticated(true);
    return { success: true, user };
  };

  /**
   * Register a new member and log in immediately
   */
  const signup = ({ name, email, memberId, password, phone, department }) => {
    const emailClean = email.trim().toLowerCase();
    const idClean = memberId.trim().toUpperCase();

    // Check duplicate
    const exists = users.some(
      (u) => u.email.toLowerCase() === emailClean || u.memberId.toUpperCase() === idClean
    );
    if (exists) {
      return { success: false, error: 'A member with this Email or Member ID already exists.' };
    }

    const newUser = {
      name: name.trim(),
      email: email.trim(),
      memberId: idClean,
      password: password,
      phone: phone?.trim() || '9876543210',
      department: department?.trim() || 'Computer Science & Engineering',
      memberType: 'Student'
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    return { success: true, user: newUser };
  };

  /**
   * Sign out
   */
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Update Profile Information
   */
  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    setUsers((prev) =>
      prev.map((u) => (u.memberId === currentUser.memberId ? updated : u))
    );
  };

  const contextValue = {
    currentUser,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
    users
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
