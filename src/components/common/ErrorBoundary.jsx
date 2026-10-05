import React, { Component } from 'react';

/**
 * Reusable ErrorBoundary Component
 * Topics: Error Boundaries (Requirement 4.g & 4.h)
 * Catches unexpected rendering errors in children and displays a user-friendly fallback UI.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-card">
          <div className="error-icon">💥</div>
          <h2>Something went wrong in the Library Application</h2>
          <p className="text-muted">
            The application encountered an unexpected runtime rendering error.
            This error was caught gracefully by the <code>ErrorBoundary</code> component.
          </p>

          {this.state.error && (
            <div className="error-details-box">
              <strong>Error:</strong> {this.state.error.toString()}
            </div>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.handleReset}
            >
              🔄 Reload Library Home
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
