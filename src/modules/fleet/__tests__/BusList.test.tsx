import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BusList } from '../components/BusList';
import { BusStatus } from '../interfaces/bus.interface';

describe('BusList Component', () => {
  const mockBuses = [
    {
      id: '1',
      tenantId: 'tenant-1',
      plateNumber: 'ABC-123',
      make: 'Toyota',
      model: 'Coaster',
      numberOfSeats: 30,
      status: BusStatus.ACTIVE,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      tenantId: 'tenant-1',
      plateNumber: 'XYZ-789',
      make: 'Mercedes',
      model: 'Sprinter',
      numberOfSeats: 20,
      status: BusStatus.MAINTENANCE,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  ];

  const defaultProps = {
    buses: mockBuses,
    totalBuses: 2,
    loading: false,
    error: null,
    skip: 0,
    take: 10,
    onPageChange: vi.fn(),
    onCreateBus: vi.fn(),
    onUpdateBus: vi.fn(),
    onDeleteBus: vi.fn(),
    onRetry: vi.fn(),
  };

  it('should render list of buses', () => {
    render(<BusList {...defaultProps} />);

    expect(screen.getByText('ABC-123')).toBeInTheDocument();
    expect(screen.getByText('XYZ-789')).toBeInTheDocument();
    expect(screen.getByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('Mercedes')).toBeInTheDocument();
  });

  it('should display loading skeletons when loading', () => {
    render(<BusList {...defaultProps} loading={true} buses={[]} />);

    // Should show skeleton loaders
    const skeletons = document.querySelectorAll('[class*="animate-pulse"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should display error message when error occurs', () => {
    render(<BusList {...defaultProps} error="Failed to load buses" buses={[]} />);

    expect(screen.getByText('Failed to load buses')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('should call onRetry when retry button is clicked', async () => {
    const user = userEvent.setup();
    render(<BusList {...defaultProps} error="Failed to load buses" buses={[]} />);

    const retryButton = screen.getByRole('button', { name: /retry/i });
    await user.click(retryButton);

    expect(defaultProps.onRetry).toHaveBeenCalledTimes(1);
  });

  it('should display empty state when no buses', () => {
    render(<BusList {...defaultProps} buses={[]} totalBuses={0} />);

    expect(screen.getByText('No buses found')).toBeInTheDocument();
    expect(screen.getByText('Get started by registering your first bus.')).toBeInTheDocument();
  });

  it('should call onCreateBus when Register Bus button is clicked', async () => {
    const user = userEvent.setup();
    render(<BusList {...defaultProps} />);

    const createButton = screen.getByRole('button', { name: /register bus/i });
    await user.click(createButton);

    expect(defaultProps.onCreateBus).toHaveBeenCalledTimes(1);
  });

  it('should display correct bus status badges', () => {
    render(<BusList {...defaultProps} />);

    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('MAINTENANCE')).toBeInTheDocument();
  });

  it('should display pagination info', () => {
    render(<BusList {...defaultProps} />);

    expect(screen.getByText(/showing 1 to 2 of 2 buses/i)).toBeInTheDocument();
  });

  it('should call onUpdateBus when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<BusList {...defaultProps} />);

    const editButtons = screen.getAllByRole('button', { name: '' }); // Edit buttons have no text
    await user.click(editButtons[0]); // Click first edit button

    expect(defaultProps.onUpdateBus).toHaveBeenCalledWith(mockBuses[0]);
  });

  it('should call onDeleteBus when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<BusList {...defaultProps} />);

    const deleteButtons = screen.getAllByRole('button', { name: '' });
    await user.click(deleteButtons[1]); // Click first delete button (second button overall)

    expect(defaultProps.onDeleteBus).toHaveBeenCalledWith(mockBuses[0].id);
  });
});

