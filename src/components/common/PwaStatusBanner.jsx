import React, { useState, useEffect } from 'react';
import Button from './Button';

/**
 * PwaStatusBanner Component
 * Topics: PWA Offline Indicator, Install Prompt (Requirement 10.d)
 */
export default function PwaStatusBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  if (isOnline && !installPrompt) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: isOnline ? '#0f172a' : '#991b1b',
        color: '#ffffff',
        padding: '0.5rem 1rem',
        borderRadius: '6px',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.825rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
      }}
    >
      <div>
        {!isOnline ? (
          <span>
            📡 <strong>Offline Mode:</strong> No active internet connection. The app is serving assets from the local PWA Cache.
          </span>
        ) : (
          <span>
            📱 <strong>Install Library App:</strong> Add to your home screen or desktop for fast offline access.
          </span>
        )}
      </div>

      {installPrompt && (
        <Button variant="secondary" size="sm" onClick={handleInstallClick}>
          ⬇️ Install App
        </Button>
      )}
    </div>
  );
}
