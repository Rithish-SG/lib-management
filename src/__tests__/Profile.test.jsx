import React from 'react';
import { render, screen } from '@testing-library/react';
import Profile from '../components/Profile';
import { AuthContext } from '../context/AuthContext';
import { LibraryContext } from '../context/LibraryContext';
import * as bookApi from '../api/bookApi';

/**
 * Experiment 9: Member Profile Component Testing
 * Topics: Test member profiles, quota rendering (Requirement 9.a)
 */
describe('Member Profile Component Tests (Requirement 9.a)', () => {
  const mockUser = {
    name: 'Rachel Adams',
    email: 'rachel.adams@college.edu',
    memberId: 'MEM-2024-500',
    phone: '9876543210',
    department: 'Computer Science & Engineering',
    memberType: 'Student',
    maxAllowed: 4
  };

  const mockLibraryContext = {
    borrowedBooks: [{ borrowId: 'BRW-1' }, { borrowId: 'BRW-2' }],
    readingStats: {
      totalBorrowed: 5,
      returned: 3,
      activeLoans: 2,
      onTimeRate: 100
    },
    showToast: vi.fn(),
    setMemberInfo: vi.fn()
  };

  const mockAuthContext = {
    currentUser: mockUser,
    updateProfile: vi.fn()
  };

  beforeEach(() => {
    vi.spyOn(bookApi, 'fetchMemberProfileApi').mockResolvedValue({
      status: 200,
      data: mockUser
    });
  });

  const renderProfile = () => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        <LibraryContext.Provider value={mockLibraryContext}>
          <Profile />
        </LibraryContext.Provider>
      </AuthContext.Provider>
    );
  };

  it('renders member profile details (name, email, department, ID)', async () => {
    renderProfile();

    expect(await screen.findByText('Rachel Adams')).toBeInTheDocument();
    expect(screen.getByText('rachel.adams@college.edu')).toBeInTheDocument();
    expect(screen.getByText('Computer Science & Engineering')).toBeInTheDocument();
    expect(screen.getByText('ID: MEM-2024-500')).toBeInTheDocument();
  });

  it('renders borrowing quota statistics correctly', async () => {
    renderProfile();

    // 2 currently borrowed out of 4 max = 2 remaining
    expect(await screen.findByText('Currently Borrowed')).toBeInTheDocument();
    expect(screen.getByText('Max Allowed')).toBeInTheDocument();
    expect(screen.getByText('Remaining Quota')).toBeInTheDocument();
  });
});
