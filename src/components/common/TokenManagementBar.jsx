import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';
import Button from './Button';

/**
 * TokenManagementBar Component
 * Displays live JWT Bearer token health and provides controls to simulate expired/invalid tokens
 * Topics: Token Management, Protected APIs, Invalid/Expired Token Handling (8.b, 8.c, 8.f)
 */
export default function TokenManagementBar() {
  const {
    token,
    tokenStatus,
    currentUser,
    isAuthenticated,
    triggerExpireToken,
    triggerCorruptToken,
    logout
  } = useAuth();
  const { showToast } = useLibrary();

  const [isOpen, setIsOpen] = useState(true);

  if (!isAuthenticated && !token) {
    return (
      <div className="token-bar-unauth" style={{
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: '8px',
        padding: '0.65rem 1rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.825rem',
        color: '#92400e'
      }}>
        <span>
          🔒 <strong>Token Status:</strong> Unauthenticated. Protected operations (Borrow, Renew, Profile) are restricted.
        </span>
        <a href="/login" className="btn btn-sm btn-primary" style={{ textDecoration: 'none' }}>
          🔑 Sign In to Acquire Token
        </a>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (tokenStatus?.status) {
      case 'VALID':
        return <span className="status-pill pill-success">🟢 Active (Bearer JWT)</span>;
      case 'EXPIRED':
        return <span className="status-pill pill-danger">🔴 Expired Token (401)</span>;
      case 'INVALID':
        return <span className="status-pill pill-warning">⚠️ Malformed Token (403)</span>;
      default:
        return <span className="status-pill pill-neutral">⚪ No Token</span>;
    }
  };

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard?.writeText(token);
      showToast('JWT Bearer Token copied to clipboard!', 'info');
    }
  };

  const handleSimulateExpired = () => {
    triggerExpireToken();
    showToast('Simulated expired token (exp < now). Attempting a protected action will trigger HTTP 401!', 'warning');
  };

  const handleSimulateCorrupt = () => {
    triggerCorruptToken();
    showToast('Simulated corrupted token signature. Protected action will trigger HTTP 403!', 'error');
  };

  return (
    <div className="token-management-bar" style={{
      background: '#1e293b',
      color: '#f8fafc',
      borderRadius: '8px',
      padding: '0.75rem 1rem',
      marginBottom: '1.25rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
      fontSize: '0.85rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '1.1rem' }}>🎫</span>
          <strong>Authentication Token Manager (Experiment 8)</strong>
          {getStatusBadge()}
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <Button variant="secondary" size="sm" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? '▲ Hide Token Details' : '▼ View Token'}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div style={{ marginTop: '0.75rem', borderTop: '1px solid #334155', paddingTop: '0.65rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                Bearer Token (Attached to Axios Request Headers via Interceptor):
              </div>
              <code style={{
                display: 'block',
                background: '#0f172a',
                padding: '0.4rem 0.6rem',
                borderRadius: '4px',
                color: '#38bdf8',
                fontSize: '0.75rem',
                wordBreak: 'break-all',
                fontFamily: 'monospace'
              }}>
                {token ? `Bearer ${token.slice(0, 48)}...` : 'None'}
              </code>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <Button variant="secondary" size="sm" onClick={handleCopyToken} title="Copy full JWT token">
                📋 Copy
              </Button>
              {/* f) Test Expired Token */}
              <Button
                variant="warning"
                size="sm"
                onClick={handleSimulateExpired}
                title="Force token timestamp into the past to test 401 handling"
              >
                ⏳ Expire Token
              </Button>
              {/* f) Test Corrupted Token */}
              <Button
                variant="danger"
                size="sm"
                onClick={handleSimulateCorrupt}
                title="Corrupt token signature to test 403 handling"
              >
                💥 Corrupt Token
              </Button>
            </div>
          </div>

          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
            💡 <em>Try clicking <strong>"Expire Token"</strong> or <strong>"Corrupt Token"</strong>, then attempt to Borrow or Renew a book below. The Axios response interceptor will catch the 401/403 and handle the expired session!</em>
          </div>
        </div>
      )}
    </div>
  );
}
