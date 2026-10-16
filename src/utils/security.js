/**
 * Experiment 10: Security and Input Sanitization Utilities
 * Topics: Secure Input Handling, XSS Prevention, API Communication Security (Requirement 10.f)
 */

/**
 * f) Sanitize user text inputs to prevent Cross-Site Scripting (XSS)
 * Converts dangerous characters to their safe HTML entities
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  const reg = /[&<>"'/]/ig;
  return input.replace(reg, (match) => map[match]);
}

/**
 * f) Secure password strength validation
 */
export function validateSecurePassword(password) {
  if (!password) return 'Password is required.';
  if (password.length < 8) return 'Password must be at least 8 characters long.';
  if (!/[A-Za-z]/.test(password)) return 'Password must contain at least one letter.';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';
  return null;
}

/**
 * Mask sensitive data for display (e.g. JWT tokens or IDs)
 */
export function maskSensitiveData(str, visibleChars = 6) {
  if (!str || str.length <= visibleChars) return str;
  return str.slice(0, visibleChars) + '••••••••' + str.slice(-4);
}
