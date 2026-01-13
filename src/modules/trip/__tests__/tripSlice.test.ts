import { describe, it, expect, beforeEach } from 'vitest';
import tripReducer, {
  setFilters,
  setSelectedTrip,
  clearSelectedTrip,
  clearError,
  fetchTrips,
  fetchTripById,
} from '../reducers/tripSlice';
import { TripState, TripStatus, TripType } from '../interfaces/trip.interface';

describe('Trip Slice', () => {
  const initialState: TripState = {
    trips: [],
    selectedTrip: null,
    filters: {},
    loading: false,
    error: null,
  };

  describe('Initial State', () => {
    it('should return the initial state', () => {
      expect(tripReducer(undefined, { type: '' })).toEqual(initialState);
    });
  });

  describe('Reducers', () => {
    it('should handle setFilters', () => {
      const filters = { status: TripStatus.PUBLISHED, tripType: TripType.NON_REPEATING };
      const state = tripReducer(initialState, setFilters(filters));
      
      expect(state.filters).toEqual(filters);
    });

    it('should handle setSelectedTrip', () => {
      const trip = {
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
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      const state = tripReducer(initialState, setSelectedTrip(trip));
      
      expect(state.selectedTrip).toEqual(trip);
    });

    it('should handle clearSelectedTrip', () => {
      const stateWithTrip = {
        ...initialState,
        selectedTrip: {
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
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      };

      const state = tripReducer(stateWithTrip, clearSelectedTrip());
      
      expect(state.selectedTrip).toBeNull();
    });

    it('should handle clearError', () => {
      const stateWithError = {
        ...initialState,
        error: 'Failed to fetch trips',
      };

      const state = tripReducer(stateWithError, clearError());
      
      expect(state.error).toBeNull();
    });
  });

  describe('Async Thunks', () => {
    describe('fetchTrips', () => {
      it('should handle fetchTrips.pending', () => {
        const action = { type: fetchTrips.pending.type };
        const state = tripReducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('should handle fetchTrips.fulfilled', () => {
        const trips = [
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
            createdAt: '2025-01-01T00:00:00Z',
            updatedAt: '2025-01-01T00:00:00Z',
          },
        ];

        const action = { type: fetchTrips.fulfilled.type, payload: trips };
        const state = tripReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.trips).toEqual(trips);
        expect(state.error).toBeNull();
      });

      it('should handle fetchTrips.rejected', () => {
        const action = {
          type: fetchTrips.rejected.type,
          error: { message: 'Network error' },
        };
        const state = tripReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Network error');
      });
    });

    describe('fetchTripById', () => {
      it('should handle fetchTripById.pending', () => {
        const action = { type: fetchTripById.pending.type };
        const state = tripReducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('should handle fetchTripById.fulfilled', () => {
        const trip = {
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
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        };

        const action = { type: fetchTripById.fulfilled.type, payload: trip };
        const state = tripReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.selectedTrip).toEqual(trip);
        expect(state.error).toBeNull();
      });

      it('should handle fetchTripById.rejected', () => {
        const action = {
          type: fetchTripById.rejected.type,
          error: { message: 'Trip not found' },
        };
        const state = tripReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Trip not found');
      });
    });
  });
});

