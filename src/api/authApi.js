import axios from 'axios';

/**
 * Experiment 8: Authentication & Token Management Service
 * Topics: Authentication API, Token Storage, Request/Response Interceptors,
 *         Protected API Restrictions, Invalid/Expired Token Handling (8.a - 8.f)
 */

// Key constants
export const TOKEN_STORAGE_KEY = 'lib_auth_token';
export const USER_STORAGE_KEY = 'lib_auth_user';

// Create dedicated Axios client with base URL
export const apiClient = axios.create({
  baseURL: 'https://api.campuslibrary.edu/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to generate a realistic JWT Bearer Token structure
export function generateMockJwt(user, expiresInSeconds = 3600) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const expTime = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = btoa(
    JSON.stringify({
      sub: user.memberId || user.id,
      name: user.name,
      email: user.email,
      role: user.memberType || 'Student',
      iat: Math.floor(Date.now() / 1000),
      exp: expTime
    })
  );
  const signature = btoa(`sig_${Date.now()}_lib_secure`);
  return `${header}.${payload}.${signature}`;
}

// Helper to decode JWT payload safely
export function parseJwtPayload(token) {
  try {
    if (!token || !token.includes('.')) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const decoded = atob(parts[1]);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Token Verification
export function inspectToken(token) {
  if (!token) {
    return { status: 'MISSING', message: 'No authentication token found.', payload: null };
  }

  const payload = parseJwtPayload(token);
  if (!payload || token.includes('corrupted_signature')) {
    return { status: 'INVALID', message: 'Token format is corrupted or tampered with.', payload: null };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < nowSec) {
    return { status: 'EXPIRED', message: 'Token expired. Session has ended.', payload };
  }

  return { status: 'VALID', message: 'Token is valid and active.', payload };
}

// c) AXIOS REQUEST INTERCEPTOR: Automatically attaches Bearer Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`[Axios Interceptor] 🔑 Attached Authorization: Bearer ${token.slice(0, 24)}...`);
    } else {
      console.log('[Axios Interceptor] ⚠️ No Bearer Token attached (Public or unauthenticated request).');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// f) AXIOS RESPONSE INTERCEPTOR: Catches 401 Unauthorized / 403 Forbidden
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('[Axios Interceptor] 🛑 401/403 Token Error caught. Purging expired token...');
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('auth-token-expired', {
            detail: { status: error.response.status, message: error.response.data?.message || 'Session expired.' }
          })
        );
      }
    }
    return Promise.reject(error);
  }
);

// Default seed users
const SEED_USERS = [
  {
    name: 'Alex Johnson',
    email: 'alex.johnson@college.edu',
    memberId: 'MEM-2024-001',
    password: 'password123',
    phone: '9876543210',
    department: 'Computer Science & Engineering',
    memberType: 'Student',
    maxAllowed: 4
  },
  {
    name: 'Prof. David Miller',
    email: 'david.miller@college.edu',
    memberId: 'FAC-2024-088',
    password: 'faculty123',
    phone: '9876543211',
    department: 'Mathematics',
    memberType: 'Faculty',
    maxAllowed: 8
  }
];

function getRegisteredUsers() {
  try {
    const data = localStorage.getItem('lib_token_users');
    if (data) return JSON.parse(data);
    localStorage.setItem('lib_token_users', JSON.stringify(SEED_USERS));
    return SEED_USERS;
  } catch {
    return SEED_USERS;
  }
}

/**
 * a) Member Login using Authentication API
 * POST /api/auth/login
 */
export async function loginApi(identifier, password) {
  await new Promise((r) => setTimeout(r, 450)); // Network latency

  const users = getRegisteredUsers();
  const idClean = identifier.trim().toLowerCase();

  const user = users.find(
    (u) => u.email.toLowerCase() === idClean || u.memberId.toLowerCase() === idClean
  );

  if (!user) {
    const err = new Error('Invalid credentials: No account found with this Email or Member ID.');
    err.status = 404;
    throw err;
  }

  if (user.password !== password) {
    const err = new Error('Invalid credentials: Password does not match.');
    err.status = 401;
    throw err;
  }

  // Generate authentic Bearer JWT token (expires in 1 hour)
  const token = generateMockJwt(user, 3600);

  return {
    status: 200,
    data: {
      user,
      token,
      tokenType: 'Bearer',
      expiresIn: 3600
    }
  };
}

/**
 * Member Registration using Authentication API
 * POST /api/auth/register
 */
export async function registerApi(userData) {
  await new Promise((r) => setTimeout(r, 500));

  const users = getRegisteredUsers();
  const emailClean = userData.email.trim().toLowerCase();
  const idClean = userData.memberId.trim().toUpperCase();

  const exists = users.some(
    (u) => u.email.toLowerCase() === emailClean || u.memberId.toUpperCase() === idClean
  );

  if (exists) {
    const err = new Error('A member account with this Email or Member ID already exists.');
    err.status = 409;
    throw err;
  }

  const newUser = {
    name: userData.name.trim(),
    email: userData.email.trim(),
    memberId: idClean,
    password: userData.password,
    phone: userData.phone || '9876543210',
    department: userData.department || 'Computer Science & Engineering',
    memberType: 'Student',
    maxAllowed: 4
  };

  users.push(newUser);
  localStorage.setItem('lib_token_users', JSON.stringify(users));

  const token = generateMockJwt(newUser, 3600);
  return {
    status: 201,
    data: {
      user: newUser,
      token,
      tokenType: 'Bearer',
      expiresIn: 3600
    }
  };
}

/**
 * e) Logout and Token Removal API
 * POST /api/auth/logout
 */
export async function logoutApi() {
  await new Promise((r) => setTimeout(r, 200));
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  return { status: 200, message: 'Logged out successfully.' };
}

/**
 * d) Guard function for Protected Library API Endpoints
 * Throws 401 if token is missing, invalid, or expired
 */
export function verifyProtectedApiAccess() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const inspection = inspectToken(token);

  if (inspection.status === 'MISSING') {
    const err = new Error('HTTP 401 Unauthorized: Bearer authentication token is required to perform this action.');
    err.status = 401;
    throw err;
  }

  if (inspection.status === 'EXPIRED') {
    const err = new Error('HTTP 401 Token Expired: Your session token has expired. Please sign in again.');
    err.status = 401;
    throw err;
  }

  if (inspection.status === 'INVALID') {
    const err = new Error('HTTP 403 Forbidden: Invalid or malformed authentication token.');
    err.status = 403;
    throw err;
  }

  return inspection.payload;
}

// Lab Demonstration Testing Functions (Requirement 8.f)
export function simulateTokenExpiration() {
  const currentToken = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!currentToken) return false;
  const payload = parseJwtPayload(currentToken) || { sub: 'MEM-2024-001', name: 'User' };
  // Expired in past
  const expiredPayload = { ...payload, exp: Math.floor(Date.now() / 1000) - 300 };
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const token = `${header}.${btoa(JSON.stringify(expiredPayload))}.simulated_expired_sig`;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  return true;
}

export function simulateTokenCorruption() {
  localStorage.setItem(TOKEN_STORAGE_KEY, 'invalid_token_header.corrupted_payload.corrupted_signature');
}
