import React from 'react';

/**
 * Reusable Form Input Component with Validation Message Display
 * Topics: Controlled Components, Form Validation (Requirement 4.f & 4.h)
 */
export default function Input({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder = '',
  error = '',
  required = false,
  disabled = false,
  helperText = '',
  className = ''
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      <input
        id={id}
        name={name || id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`form-input ${error ? 'input-error' : ''}`}
      />

      {error ? (
        <span className="error-message">⚠️ {error}</span>
      ) : helperText ? (
        <small className="helper-text">{helperText}</small>
      ) : null}
    </div>
  );
}
