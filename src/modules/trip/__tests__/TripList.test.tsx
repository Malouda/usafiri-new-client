import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import TripList from '../pages/TripList';
import tripReducer from '../reducers/tripSlice';
import authReducer from '../../auth/reducers/authReducer';
import { TripStatus, TripType } from '../interfaces/trip.interface';

// Mock the trip API
vi.mock('../trip.api', () => ({
  tripApi: {
    getAll: vi.fn(),
    getById: vi.fn(),
  },
}));

// Mock the hooks
vi.mock('../hooks/useTrips', () => ({
  useTrips: vi.fn(),
}));

import { useTrips } from '../hooks/useTrips';

const mockUseTrips = useTrips as ReturnType<typeof vi.fn>;

describe('TripList Component', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        trip: tripReducer,
        auth: authReducer,
      },
    });
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <TripList />
        </BrowserRouter>
      </Provider>
    );
  };

  it('should render loading state', () => {
    mockUseTrips.mockReturnValue({
      trips: [],
      loading: true,
      error: null,
      filters: {},
      updateFilters: vi.fn(),
      refetch: vi.fn(),
      clearErrorMessage: vi.fn(),
    });

    renderComponent();

    expect(screen.queryByText('Available Trips')).not.toBeInTheDocument();
  });

  it('should render error state', () => {
    mockUseTrips.mockReturnValue({
      trips: [],
      loading: false,
      error: 'Failed to fetch trips',
      filters: {},
      updateFilters: vi.fn(),
      refetch: vi.fn(),
      clearErrorMessage: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('Failed to fetch trips')).toBeInTheDocument();
  });

  it('should render trip list', async () => {
    const mockTrips = [
      {
        id: '1',
        tenantId: 'tenant-1',
        routeId: 'route-1',
        busId: 'bus-1',
        tripType: TripType.NON_REPEATING,
        status: TripStatus.PUBLISHED,
        visibility: 'PUBLIC' as const,
        basePrice: 5000,
        basePriceCents: 500000,
        currency: 'TZS',
        cancellationPolicy: 'FLEXIBLE' as const,
        passengerInfoPolicy: 'NOT_REQUIRED' as const,
        holdDuration: 180,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        route: {
          id: 'route-1',
          name: 'Downtown → Airport',
          stops: [
            { id: 'stop-1', routeId: 'route-1', name: 'Downtown', latitude: 0, longitude: 0, sequence: 1 },
            { id: 'stop-2', routeId: 'route-1', name: 'Airport', latitude: 0, longitude: 0, sequence: 2 },
          ],
        },
        bus: {
          id: 'bus-1',
          plateNumber: 'T123ABC',
          numberOfSeats: 50,
          status: 'ACTIVE' as const,
        },
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      },
    ];

    mockUseTrips.mockReturnValue({
      trips: mockTrips,
      loading: false,
      error: null,
      filters: {},
      updateFilters: vi.fn(),
      refetch: vi.fn(),
      clearErrorMessage: vi.fn(),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Available Trips')).toBeInTheDocument();
      expect(screen.getByText('Downtown → Airport')).toBeInTheDocument();
      expect(screen.getByText('2 stops')).toBeInTheDocument();
      expect(screen.getByText('TZS 5,000')).toBeInTheDocument();
    });
  });

  it('should render empty state', () => {
    mockUseTrips.mockReturnValue({
      trips: [],
      loading: false,
      error: null,
      filters: {},
      updateFilters: vi.fn(),
      refetch: vi.fn(),
      clearErrorMessage: vi.fn(),
    });

    renderComponent();

    expect(screen.getByText('Available Trips')).toBeInTheDocument();
    expect(screen.getByText('No trips available')).toBeInTheDocument();
  });
});

