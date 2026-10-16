import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Loading from '../components/common/Loading';
import ErrorBoundary from '../components/common/ErrorBoundary';

/**
 * Experiment 9: Loading and Error States Testing
 * Topics: Test loading and error states (Requirement 9.e)
 */
describe('Loading and Error States Tests (Requirement 9.e)', () => {
  it('e) renders Loading component with custom progress message', () => {
    render(<Loading message="Retrieving catalog from REST API gateway..." />);

    expect(screen.getByText('Retrieving catalog from REST API gateway...')).toBeInTheDocument();
  });

  it('e) ErrorBoundary catches component crash and displays fallback error UI', () => {
    // Suppress console.error output during intentional test error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Problematic component that intentionally crashes
    function ProblematicComponent() {
      throw new Error('Test Crash: Simulated network failure in library UI');
    }

    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    expect(
      screen.getByText(/Something went wrong in the Library Application/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Test Crash: Simulated network failure in library UI/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /reload library home/i })
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
