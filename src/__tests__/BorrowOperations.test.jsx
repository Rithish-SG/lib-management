import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BorrowedBooks from '../components/BorrowedBooks';
import { LibraryContext } from '../context/LibraryContext';
import * as crudApi from '../api/crudApi';

/**
 * Experiment 9: Borrow, Return, and Renew Operations Testing
 * Topics: Test borrow, return, and renew operations, empty states (9.a, 9.c, 9.e)
 */
describe('Borrow Operations Tests (Requirement 9.a, 9.c & 9.e)', () => {
  const mockLoans = [
    {
      borrowId: 'BRW-1001',
      bookId: '101',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Computer Science',
      borrowDate: '2026-09-20',
      dueDate: '2026-10-15',
      renewalCount: 0,
      status: 'Active'
    }
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const renderWithContext = (borrowedList = mockLoans) => {
    vi.spyOn(crudApi, 'getBorrowRecordsApi').mockResolvedValue({
      status: 200,
      data: borrowedList
    });

    const mockContextValue = {
      showToast: vi.fn()
    };

    return render(
      <LibraryContext.Provider value={mockContextValue}>
        <BorrowedBooks />
      </LibraryContext.Provider>
    );
  };

  it('renders borrowed books table with active loans', async () => {
    renderWithContext(mockLoans);

    expect(await screen.findByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('BRW-1001')).toBeInTheDocument();
    expect(screen.getByText('2026-10-15')).toBeInTheDocument();
  });

  it('c) executes Renew operation when "Renew (PATCH)" button is clicked', async () => {
    const renewSpy = vi.spyOn(crudApi, 'updateBorrowRecordApi').mockResolvedValue({
      status: 200,
      data: { ...mockLoans[0], renewalCount: 1, dueDate: '2026-10-22' }
    });

    renderWithContext(mockLoans);

    const renewBtn = await screen.findByRole('button', { name: /renew/i });
    fireEvent.click(renewBtn);

    await waitFor(() => {
      expect(renewSpy).toHaveBeenCalledWith('BRW-1001', 'RENEW');
    });
  });

  it('c) executes Return operation when "Return" button is clicked', async () => {
    const returnSpy = vi.spyOn(crudApi, 'updateBorrowRecordApi').mockResolvedValue({
      status: 200,
      success: true
    });

    renderWithContext(mockLoans);

    const returnBtn = await screen.findByRole('button', { name: /return/i });
    fireEvent.click(returnBtn);

    await waitFor(() => {
      expect(returnSpy).toHaveBeenCalledWith('BRW-1001', 'RETURN');
    });
  });

  it('e) renders "No borrowed books" empty state when loans list is empty', async () => {
    renderWithContext([]);

    expect(await screen.findByText('No borrowed books')).toBeInTheDocument();
    expect(screen.getByText(/No active loan records found in the database/i)).toBeInTheDocument();
  });
});
