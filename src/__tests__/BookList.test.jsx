import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BookList from '../components/BookList';
import { LibraryContext } from '../context/LibraryContext';

/**
 * Experiment 9: BookList Component Tests
 * Topics: Test book lists, Empty state messages (9.a, 9.e)
 */
describe('BookList Component Tests (Requirement 9.a & 9.e)', () => {
  const mockBooks = [
    {
      id: '101',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Computer Science',
      publishedYear: 2008,
      shelfLocation: 'Rack-A1',
      totalCopies: 5,
      availableCopies: 3
    },
    {
      id: '102',
      title: 'Dune',
      author: 'Frank Herbert',
      category: 'Science Fiction',
      publishedYear: 1965,
      shelfLocation: 'Rack-B1',
      totalCopies: 4,
      availableCopies: 2
    }
  ];

  const renderWithContext = (filteredBooks = []) => {
    const mockContextValue = {
      filteredBooks,
      borrowedBookIds: new Set(),
      setSelectedBook: vi.fn(),
      borrowBook: vi.fn(),
      placeHold: vi.fn()
    };

    return render(
      <BrowserRouter>
        <LibraryContext.Provider value={mockContextValue}>
          <BookList />
        </LibraryContext.Provider>
      </BrowserRouter>
    );
  };

  it('renders a list of books matching the count', () => {
    renderWithContext(mockBooks);

    expect(screen.getByText('Showing 2 books')).toBeInTheDocument();
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('Dune')).toBeInTheDocument();
  });

  it('e) renders "No books found" empty state message when list is empty', () => {
    renderWithContext([]);

    expect(screen.getByText('No books found')).toBeInTheDocument();
    expect(
      screen.getByText(/We couldn't find any books matching your search or filter criteria/i)
    ).toBeInTheDocument();
  });
});
