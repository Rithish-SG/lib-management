import React, { useState } from 'react';
import Button from './common/Button';

/**
 * Component to demonstrate ErrorBoundary functionality to the lab examiner
 */
export default function ErrorTrigger() {
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    // Deliberately throwing a runtime rendering error
    throw new Error('Simulated Lab Error: Unhandled component render exception caught by ErrorBoundary.');
  }

  return (
    <div className="error-trigger-card" style={{ marginTop: '1rem', padding: '1rem', background: '#fff', border: '1px dashed #cbd5e1', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>🧪 Lab Viva Demonstration:</span>
          <p className="text-muted small">Test how the <code>ErrorBoundary</code> component catches unexpected crashes.</p>
        </div>
        <Button variant="danger" size="sm" onClick={() => setShouldCrash(true)}>
          💥 Trigger Test Error (ErrorBoundary)
        </Button>
      </div>
    </div>
  );
}
