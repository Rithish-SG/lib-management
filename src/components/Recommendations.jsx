import React, { useState, useEffect } from 'react';
import { fetchRecommendationsApi } from '../api/bookApi';
import BookCard from './BookCard';
import Loading from './common/Loading';
import Button from './common/Button';
import { useLibrary } from '../context/LibraryContext';

/**
 * Experiment 5: API-Based Recommendations Component
 * Topics: Implement API-based recommendations, Async Data, Loading & Error States (5.e, 5.f)
 */
export default function Recommendations() {
  const { memberInfo } = useLibrary();

  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRecommendationsFromApi = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('[REST API GET /api/recommendations] Requesting recommendations...');
      const response = await fetchRecommendationsApi(memberInfo?.department ? 'Computer Science' : 'Literature');
      setRecommendations(response.data);
    } catch (err) {
      console.error('[REST API Recommendations Error]:', err);
      setError(err.message || 'Failed to fetch recommendations from REST API.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendationsFromApi();
  }, [memberInfo]);

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="recommendation-badge">✨ REST API: Recommendations Engine</span>
            <h3>Books Tailored to Your Interests</h3>
            <p className="text-muted small">
              Dynamically delivered by the Library Recommendation REST Service (<code>GET /api/recommendations</code>).
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={loadRecommendationsFromApi}>
            🔄 Refresh API
          </Button>
        </div>
      </div>

      {/* e) Loading State */}
      {isLoading && (
        <Loading message="Generating personalized reading recommendations via REST API..." />
      )}

      {/* e) Error State */}
      {!isLoading && error && (
        <div className="empty-state-mini" style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px' }}>
          <p className="text-danger">⚠️ {error}</p>
          <Button variant="primary" size="sm" onClick={loadRecommendationsFromApi} style={{ marginTop: '0.5rem' }}>
            Retry Recommendation Request
          </Button>
        </div>
      )}

      {/* Success State */}
      {!isLoading && !error && (
        recommendations.length === 0 ? (
          <div className="empty-state-mini">
            <p>No recommendations returned by the REST API at this moment.</p>
          </div>
        ) : (
          <div className="books-grid">
            {recommendations.map((book) => (
              <BookCard key={`rec-${book.id}`} book={book} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
