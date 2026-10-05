import React from 'react';
import { useLibrary } from '../context/LibraryContext';

// SearchBar Component consuming search state directly from LibraryContext
export default function SearchBar({ searchRef }) {
  const { searchKeyword, setSearchKeyword } = useLibrary();

  return (
    <div className="search-bar-wrapper">
      <div className="search-input-group">
        <span className="search-icon">🔍</span>
        <input
          ref={searchRef}
          type="text"
          className="search-input"
          placeholder="Search by title, author, or category..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        {searchKeyword && (
          <button
            type="button"
            className="clear-btn"
            onClick={() => setSearchKeyword('')}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <button
        type="button"
        className="focus-btn"
        onClick={() => {
          if (searchRef?.current) {
            searchRef.current.focus();
            searchRef.current.select();
          }
        }}
      >
        🎯 Focus Input
      </button>
    </div>
  );
}
