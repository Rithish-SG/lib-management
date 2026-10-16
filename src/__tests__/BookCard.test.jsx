import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BookCard from '../components/BookCard';

/**
 * Experiment 9: Component Testing with React Testing Library & Jest Syntax
 * Topics: Test Book Card, Book Availability Status, Actions (9.a, 9.d)
 */
describe('BookCard Component Tests (Requirement 9.a & 9.d)', () => {
  const mockAvailableBook = {
    id: '101',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Computer Science',
    publishedYear: 2008,
    shelfLocation: 'CS-Rack-A1',
    totalCopies: 5,
    availableCopies: 3
  };

  const mockOutOfStockBook = {
    id: '102',
    title: 'Design Patterns',
    author: 'Erich Gamma',
    category: 'Computer Science',
    publishedYear: 1994,
    shelfLocation: 'CS-Rack-A4',
    totalCopies: 4,
    availableCopies: 0
  };

  const renderWithRouter = (ui) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  };

  it('renders book title, author, and category correctly', () => {
    renderWithRouter(
      <BookCard book={mockAvailableBook} isBorrowed={false} />
    );

    expect(screen.getByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('Robert C. Martin')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
  });

  it('d) displays in-stock availability badge when copies > 0', () => {
    renderWithRouter(
      <BookCard book={mockAvailableBook} isBorrowed={false} />
    );

    expect(screen.getByText('3 available')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /borrow/i })).toBeInTheDocument();
  });

  it('d) displays "Out of Stock" status when availableCopies is 0', () => {
    renderWithRouter(
      <BookCard book={mockOutOfStockBook} isBorrowed={false} />
    );

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /out of stock/i })).toBeDisabled();
  });

  it('c) calls onBorrowBook handler when Borrow button is clicked', () => {
    const handleBorrow = vi.fn();
    renderWithRouter(
      <BookCard
        book={mockAvailableBook}
        isBorrowed={false}
        onBorrowBook={handleBorrow}
      />
    );

    const borrowBtn = screen.getByRole('button', { name: /borrow/i });
    fireEvent.click(borrowBtn);

    expect(handleBorrow).toHaveBeenCalledTimes(1);
    expect(handleBorrow).toHaveBeenCalledWith(mockAvailableBook);
  });

  it('displays "Borrowed" button when book is currently issued to the user', () => {
    renderWithRouter(
      <BookCard book={mockAvailableBook} isBorrowed={true} />
    );

    const borrowedBtn = screen.getByRole('button', { name: /borrowed/i });
    expect(borrowedBtn).toBeDisabled();
  });
});
