import React from 'react';

export default function FilterPanel({
  categories,
  authors,
  selectedCategory,
  setSelectedCategory,
  selectedAuthor,
  setSelectedAuthor,
  onlyAvailable,
  setOnlyAvailable,
  onReset
}) {
  return (
    <div className="filter-panel">
      <div className="filter-header">
        <span className="filter-title">⚡ Filter Catalog</span>
        <button type="button" className="btn-reset" onClick={onReset}>
          Reset All
        </button>
      </div>

      <div className="filter-grid">
        <div className="filter-group">
          <label htmlFor="category-select">Category</label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="author-select">Author</label>
          <select
            id="author-select"
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
          >
            <option value="All">All Authors</option>
            {authors.map((auth) => (
              <option key={auth} value={auth}>{auth}</option>
            ))}
          </select>
        </div>

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
