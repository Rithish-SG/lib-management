import React, { useState } from 'react';
import { toggleNetworkError, isNetworkErrorSimulated } from '../../api/bookApi';
import Button from './Button';

/**
 * ApiStatusBar Component
 * Displays REST API status and allows simulating network errors to test loading & error states
 */
export default function ApiStatusBar({ onRefresh }) {
  const [isErrorMode, setIsErrorMode] = useState(isNetworkErrorSimulated());

  const handleToggle = () => {
    const nextState = !isErrorMode;
    toggleNetworkError(nextState);
    setIsErrorMode(nextState);
    onRefresh?.();
  };

  return (
    <div className="api-status-bar" style={{
      background: isErrorMode ? '#fef2f2' : '#f8fafc',
      border: `1px solid ${isErrorMode ? '#fca5a5' : '#e2e8f0'}`,
      borderRadius: '8px',
      padding: '0.75rem 1rem',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '0.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
        <span style={{ fontSize: '1.1rem' }}>{isErrorMode ? '🔴' : '🟢'}</span>
        <span>
          <strong>REST API Gateway (Axios):</strong>{' '}
          {isErrorMode ? (
            <span className="text-danger font-bold">Simulating Network Error (HTTP 500)</span>
          ) : (
            <span className="text-success font-bold">Connected (Latency: ~500ms)</span>
          )}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          variant={isErrorMode ? 'primary' : 'warning'}
          size="sm"
          onClick={handleToggle}
        >
          {isErrorMode ? '✅ Restore Normal API' : '⚡ Simulate API Error'}
        </Button>
      </div>
    </div>
  );
}
