import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DriverList } from '../components/DriverList';
import { UserStatus, UserRole } from '../interfaces/driver.interface';

describe('DriverList Component', () => {
  const mockDrivers = [
    {
      id: '1',
      tenantId: 'tenant-1',
      phone: '+255712345678',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.DRIVER,
      status: UserStatus.ACTIVE,
      phoneVerified: true,
      emailVerified: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      tenantId: 'tenant-1',
      phone: '+255787654321',
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: UserRole.DRIVER,
      status: UserStatus.INACTIVE,
      phoneVerified: true,
      emailVerified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];

  const defaultProps = {
    drivers: mockDrivers,
    totalDrivers: 2,
    loading: false,
    error: null,
    skip: 0,
    take: 10,
    onPageChange: vi.fn(),
    onCreateDriver: vi.fn(),
    onUpdateDriver: vi.fn(),
    onDeleteDriver: vi.fn(),
    onRetry: vi.fn(),
  };

  it('should render list of drivers', () => {
    render(<DriverList {...defaultProps} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('+255712345678')).toBeInTheDocument();
    expect(screen.getByText('+255787654321')).toBeInTheDocument();
  });

  it('should display loading skeletons when loading', () => {
    render(<DriverList {...defaultProps} loading={true} drivers={[]} />);

    // Should show skeleton loaders
    const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should display error message when error occurs', () => {
    render(<DriverList {...defaultProps} error="Failed to load drivers" drivers={[]} />);

    expect(screen.getByText('Failed to load drivers')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    render(<DriverList {...defaultProps} error="Failed to load drivers" drivers={[]} />);

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);

    expect(defaultProps.onRetry).toHaveBeenCalledTimes(1);
  });

  it('should display empty state when no drivers', () => {
    render(<DriverList {...defaultProps} drivers={[]} totalDrivers={0} />);

    expect(screen.getByText('No drivers found')).toBeInTheDocument();
    expect(screen.getByText('Get started by adding your first driver.')).toBeInTheDocument();
  });

  it('should call onCreateDriver when Add Driver button is clicked', async () => {
    const user = userEvent.setup();
    render(<DriverList {...defaultProps} />);

    const createButton = screen.getByRole('button', { name: /add driver/i });
    await user.click(createButton);

    expect(defaultProps.onCreateDriver).toHaveBeenCalledTimes(1);
  });

  it('should display correct driver status badges', () => {
    render(<DriverList {...defaultProps} />);

    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('INACTIVE')).toBeInTheDocument();
  });

  it('should display email or dash when email is missing', () => {
    const driversWithoutEmail = [
      {
        ...mockDrivers[0],
        email: undefined,
      },
    ];
    
    render(<DriverList {...defaultProps} drivers={driversWithoutEmail} totalDrivers={1} />);

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should display pagination info', () => {
    render(<DriverList {...defaultProps} />);

    expect(screen.getByText(/showing 1 to 2 of 2 drivers/i)).toBeInTheDocument();
  });

  it('should call onUpdateDriver when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<DriverList {...defaultProps} />);

    const editButtons = screen.getAllByRole('button', { name: '' }); // Edit buttons have no text
    await user.click(editButtons[0]); // Click first edit button

    expect(defaultProps.onUpdateDriver).toHaveBeenCalledWith(mockDrivers[0]);
  });

  it('should call onDeleteDriver when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<DriverList {...defaultProps} />);

    const deleteButtons = screen.getAllByRole('button', { name: '' });
    await user.click(deleteButtons[1]); // Click first delete button (second button overall)

    expect(defaultProps.onDeleteDriver).toHaveBeenCalledWith(mockDrivers[0].id);
  });
});

