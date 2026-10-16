import React, { useState, useEffect } from 'react';
import { httpLogs } from '../../api/crudApi';

/**
 * HttpActivityLogger Component
 * Live monitor displaying real-time REST API CRUD requests and HTTP response codes
 * Topics: CRUD REST Operations (Requirement 7.a - 7.e)
 */
export default function HttpActivityLogger() {
  const [logs, setLogs] = useState([...httpLogs]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const handleHttpLogged = (e) => {
      setLogs((prev) => [e.detail, ...prev.slice(0, 7)]);
    };

    window.addEventListener('http-request-logged', handleHttpLogged);
    return () => window.removeEventListener('http-request-logged', handleHttpLogged);
  }, []);

  const getMethodBadgeClass = (method) => {
    switch (method) {
      case 'GET': return 'pill-neutral';
      case 'POST': return 'pill-success';
      case 'PUT':
      case 'PATCH': return 'pill-warning';
      case 'DELETE': return 'pill-danger';
      default: return 'pill-neutral';
    }
  };

  return (
    <div className="http-activity-logger" style={{
      background: '#0f172a',
      color: '#f8fafc',
      borderRadius: '8px',
      padding: '0.75rem 1rem',
      marginBottom: '1.25rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
      fontSize: '0.85rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.1rem' }}>🌐</span>
          <strong>REST API CRUD Monitor (Experiment 7: GET, POST, PUT, DELETE)</strong>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: 'transparent',
            color: '#94a3b8',
            border: 'none',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          {isOpen ? '▲ Collapse' : '▼ Expand'}
        </button>
      </div>

      {isOpen && (
        <div style={{ marginTop: '0.65rem', borderTop: '1px solid #334155', paddingTop: '0.5rem' }}>
          {logs.length === 0 ? (
            <div style={{ color: '#94a3b8', fontStyle: 'italic', padding: '0.25rem 0' }}>
              Perform a GET, POST, PUT, or DELETE operation below to view live HTTP requests.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', maxHeight: '140px', overflowY: 'auto' }}>
              {logs.map((log) => (
                <div key={log.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#1e293b',
                  padding: '0.35rem 0.6rem',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`status-pill ${getMethodBadgeClass(log.method)}`} style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>
                      {log.method}
                    </span>
                    <span style={{ color: log.status >= 400 ? '#ef4444' : '#10b981', fontWeight: 600 }}>
                      {log.status}
                    </span>
                    <span style={{ color: '#cbd5e1' }}>{log.url}</span>
                  </div>
                  <span style={{ color: '#64748b' }}>{log.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
