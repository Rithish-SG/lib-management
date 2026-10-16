/**
 * Form Validation Utilities for Experiment 4
 * Topics: Form Validation (Requirement 4.f)
 */

// Required field validation
export function validateRequired(value, fieldName = 'This field') {
  if (!value || !value.toString().trim()) {
    return `${fieldName} is required.`;
  }
  return '';
}

// Email format validation
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return 'Email address is required.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address (e.g. name@college.edu).';
  }
  return '';
}

// Phone number validation (10 digits)
export function validatePhone(phone) {
  if (!phone || !phone.trim()) {
    return 'Phone number is required.';
  }
  const digits = phone.replace(/[\s-]/g, '');
  if (!/^[0-9]{10}$/.test(digits)) {
    return 'Phone number must be exactly 10 digits.';
  }
  return '';
}

// Password validation (min 6 characters)
export function validatePassword(password) {
  if (!password) {
    return 'Password is required.';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }
  return '';
}

// Member ID validation
export function validateMemberId(memberId) {
  if (!memberId || !memberId.trim()) {
    return 'Member ID is required.';
  }
  if (memberId.trim().length < 4) {
    return 'Member ID must be at least 4 characters long (e.g. MEM-2024-001).';
  }
  return '';
}

// Renewal Request validation
export function validateRenewal(borrowItem, maxRenewals = 2) {
  const today = new Date().toISOString().split('T')[0];
  if (borrowItem.dueDate < today) {
    return {
      valid: false,
      message: 'Book renewal is not available: This loan is overdue. Please visit the circulation desk.'
    };
  }
  if (borrowItem.renewalCount >= maxRenewals) {
    return {
      valid: false,
      message: `Book renewal is not available: Maximum renewal limit (${maxRenewals} times) reached.`
    };
  }
  return { valid: true, message: '' };
}

// Profile Information validation
export function validateProfileForm({ name, email, phone, department }) {
  const errors = {};

  const nameErr = validateRequired(name, 'Full Name');
  if (nameErr) errors.name = nameErr;

  const emailErr = validateEmail(email);
  if (emailErr) errors.email = emailErr;

  const phoneErr = validatePhone(phone);
  if (phoneErr) errors.phone = phoneErr;

  const deptErr = validateRequired(department, 'Department');
  if (deptErr) errors.department = deptErr;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
