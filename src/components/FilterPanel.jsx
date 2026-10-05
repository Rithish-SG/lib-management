import React from 'react';
import { useLibrary } from '../context/LibraryContext';

// FilterPanel Component consuming filter state directly from LibraryContext
export default function FilterPanel() {
  const {
    categories,
    authors,
    selectedCategory,
    setSelectedCategory,
    selectedAuthor,
    setSelectedAuthor,
    onlyAvailable,
    setOnlyAvailable,
    resetFilters
  } = useLibrary();

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <span className="filter-title">⚡ Filter Catalog</span>
        <button type="button" className="btn-reset" onClick={resetFilters}>
          Reset All Filters
        </button>
      </div>

      <div className="filter-grid">
        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="category-select">Category</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Author Filter */}
        <div className="filter-group">
          <label htmlFor="author-select">Author</label>
          <select
            id="author-select"
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
          >
            <option value="All">All Authors</option>
            {authors.map((auth) => (
              <option key={auth} value={auth}>
                {auth}
              </option>
            ))}
          </select>
        </div>

        {/* Availability Toggle */}
        <div className="filter-group filter-checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
            />
            <span>Show Only Available Books</span>
          </label>
        </div>
      </div>
    </div>
  );
}
