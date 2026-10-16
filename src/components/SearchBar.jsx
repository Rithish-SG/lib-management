import React from 'react';

export default function SearchBar({ searchKeyword, setSearchKeyword, searchRef, onClear }) {
  return (
    <div className="search-bar-wrapper">
      <div className="search-input-group">
        <span className="search-icon">🔍</span>
        <input
          ref={searchRef}
          type="text"
          className="search-input"
          placeholder="Search by book title, author, or keyword..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        {searchKeyword && (
          <button type="button" className="clear-btn" onClick={onClear} title="Clear search">
            ✕
          </button>
        )}
      </div>

      <button
        type="button"
        className="focus-btn"
        onClick={() => {
          if (searchRef.current) {
            searchRef.current.focus();
            searchRef.current.select();
          }
        }}
      >
        🎯 Focus Input (useRef)
      </button>
    </div>
  );
}
