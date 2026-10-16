import React from 'react';

// Reusable Footer Component
export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>
          <strong>Library Management System</strong> &bull; College Web Technology Lab
        </p>
        <p className="footer-note">
          Experiment 1: React Hooks (<code>useState</code>, <code>useEffect</code>, <code>useRef</code>, <code>useMemo</code>, <code>useCallback</code>, Props)
        </p>
        <p className="copyright">&copy; {new Date().getFullYear()} Campus Central Library. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
