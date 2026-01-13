import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tripApi } from '../trip.api';
import { Trip, TripFilters, TripState } from '../interfaces/trip.interface';

const initialState: TripState = {
  trips: [],
  selectedTrip: null,
  filters: {},
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
};

// Async thunks
export const fetchTrips = createAsyncThunk(
  'trip/fetchTrips',
  async (filters?: TripFilters) => {
    return await tripApi.getAll(filters);
  }
);

export const fetchTripsPaginated = createAsyncThunk(
  'trip/fetchTripsPaginated',
  async ({ page = 1, limit = 10, filters }: { page?: number; limit?: number; filters?: TripFilters }) => {
    return await tripApi.getAllPaginated(page, limit, filters);
  }
);

export const fetchTripById = createAsyncThunk(
  'trip/fetchTripById',
  async (tripId: string) => {
    return await tripApi.getById(tripId);
  }
);

const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<TripFilters>) => {
      state.filters = action.payload;
    },
    setSelectedTrip: (state, action: PayloadAction<Trip | null>) => {
      state.selectedTrip = action.payload;
    },
    clearSelectedTrip: (state) => {
      state.selectedTrip = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch trips
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trips';
      })
      // Fetch trips paginated
      .addCase(fetchTripsPaginated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripsPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload.data;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          limit: action.payload.limit,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchTripsPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trips';
      })
      // Fetch trip by ID
      .addCase(fetchTripById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTripById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTrip = action.payload;
      })
      .addCase(fetchTripById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trip';
      });
  },
});

export const { setFilters, setSelectedTrip, clearSelectedTrip, clearError } = tripSlice.actions;
export default tripSlice.reducer;

