import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import { LibraryContext } from '../context/LibraryContext';

/**
 * Experiment 9: Book Search and Category Filtering Tests
 * Topics: Test book search and category filtering (Requirement 9.b)
 */
describe('Search and Filter Component Tests (Requirement 9.b)', () => {
  it('b) updates search keyword on user keystrokes', () => {
    const setSearchKeyword = vi.fn();
    const mockContext = {
      searchKeyword: '',
      setSearchKeyword
    };

    render(
      <LibraryContext.Provider value={mockContext}>
        <SearchBar searchRef={{ current: null }} />
      </LibraryContext.Provider>
    );

    const input = screen.getByPlaceholderText(/search by title, author, or category/i);
    fireEvent.change(input, { target: { value: 'Algorithms' } });

    expect(setSearchKeyword).toHaveBeenCalledWith('Algorithms');
  });

  it('b) clears search keyword when Clear (✕) button is clicked', () => {
    const setSearchKeyword = vi.fn();
    const mockContext = {
      searchKeyword: 'React',
      setSearchKeyword
    };

    render(
      <LibraryContext.Provider value={mockContext}>
        <SearchBar searchRef={{ current: null }} />
      </LibraryContext.Provider>
    );

    const clearBtn = screen.getByTitle('Clear search');
    fireEvent.click(clearBtn);

    expect(setSearchKeyword).toHaveBeenCalledWith('');
  });

  it('b) triggers category selection in FilterPanel dropdown', () => {
    const setSelectedCategory = vi.fn();
    const mockContext = {
      categories: ['Computer Science', 'Mathematics', 'Literature'],
      authors: ['Thomas Cormen', 'George Orwell'],
      selectedCategory: 'All',
      setSelectedCategory,
      selectedAuthor: 'All',
      setSelectedAuthor: vi.fn(),
      onlyAvailable: false,
      setOnlyAvailable: vi.fn(),
      resetFilters: vi.fn()
    };

    render(
      <LibraryContext.Provider value={mockContext}>
        <FilterPanel />
      </LibraryContext.Provider>
    );

    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: 'Mathematics' } });

    expect(setSelectedCategory).toHaveBeenCalledWith('Mathematics');
  });

  it('b) resets all filters when "Reset All Filters" button is clicked', () => {
    const resetFilters = vi.fn();
    const mockContext = {
      categories: ['Computer Science'],
      authors: ['Thomas Cormen'],
      selectedCategory: 'Computer Science',
      setSelectedCategory: vi.fn(),
      selectedAuthor: 'All',
      setSelectedAuthor: vi.fn(),
      onlyAvailable: true,
      setOnlyAvailable: vi.fn(),
      resetFilters
    };

    render(
      <LibraryContext.Provider value={mockContext}>
        <FilterPanel />
      </LibraryContext.Provider>
    );

    const resetBtn = screen.getByRole('button', { name: /reset all filters/i });
    fireEvent.click(resetBtn);

    expect(resetFilters).toHaveBeenCalledTimes(1);
  });
});
