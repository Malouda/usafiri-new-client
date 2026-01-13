# Quick Start Guide - Frontend Implementation

## 🎯 Start Here: Trip Discovery (Phase 1.1)

### Step 1: Set up Trip Module Structure

Create the following directory structure:

```
src/modules/trip/
├── api/
│   └── trip.api.ts (already exists - needs updating)
├── components/
│   ├── TripCard.tsx
│   ├── TripList.tsx
│   ├── TripDetails.tsx
│   ├── TripFilters.tsx
│   └── RouteMap.tsx
├── pages/
│   ├── TripBrowser.tsx
│   └── TripDetailPage.tsx
├── hooks/
│   ├── useTrips.ts
│   └── useTripDetails.ts
├── interfaces/
│   └── trip.interface.ts
└── reducers/
    └── tripSlice.ts
```

### Step 2: Define TypeScript Interfaces

Create `src/modules/trip/interfaces/trip.interface.ts`:

```typescript
export enum TripType {
  NON_REPEATING = 'NON_REPEATING',
  REPEATING = 'REPEATING'
}

export enum TripStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum TripVisibility {
  PUBLIC = 'PUBLIC',
  LINK_ONLY = 'LINK_ONLY'
}

export enum CancellationPolicy {
  FLEXIBLE = 'FLEXIBLE',
  MODERATE = 'MODERATE',
  STRICT = 'STRICT',
  NO_REFUND = 'NO_REFUND'
}

export enum PassengerInfoPolicy {
  NOT_REQUIRED = 'NOT_REQUIRED',
  EXTRA_ONLY = 'EXTRA_ONLY',
  ALL = 'ALL'
}

export interface Trip {
  id: string;
  tenantId: string;
  routeId: string;
  busId: string;
  tripType: TripType;
  status: TripStatus;
  visibility: TripVisibility;
  
  // Pricing
  basePrice: number;
  basePriceCents: number;
  currency: string;
  
  // Policies
  cancellationPolicy: CancellationPolicy;
  passengerInfoPolicy: PassengerInfoPolicy;
  holdDuration: number; // seconds
  
  // Dates
  startDate: string;
  endDate: string;
  
  // Relations
  route?: Route;
  bus?: Bus;
  sessions?: TripSession[];
  slots?: TimeSlot[];
  
  // Metadata
  inviteToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripSession {
  id: string;
  tripId: string;
  sessionType: 'MORNING' | 'EVENING';
  date: string;
  availableSeats: number;
  bookedSeats: number;
}

export interface TimeSlot {
  id: string;
  tripId: string;
  departureTime: string;
  availableSeats: number;
  activeDays: number[]; // [1,2,3,4,5] for weekdays
}

export interface Route {
  id: string;
  name: string;
  stops: RouteStop[];
}

export interface RouteStop {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  sequence: number;
}

export interface Bus {
  id: string;
  plateNumber: string;
  numberOfSeats: number;
  model?: string;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
}

export interface TripFilters {
  status?: TripStatus;
  tripType?: TripType;
  visibility?: TripVisibility;
  startDate?: string;
  endDate?: string;
}
```

### Step 3: Update Trip API

Update `src/modules/trip/api/trip.api.ts`:

```typescript
import { BaseApi } from "../../../api/base.api";
import { Trip, TripFilters } from "../interfaces/trip.interface";

class TripApi extends BaseApi {
  constructor() {
    super("/trips");
  }

  /**
   * Get all trips with optional filters
   */
  async getAll(filters?: TripFilters): Promise<Trip[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.tripType) params.append('tripType', filters.tripType);
    if (filters?.visibility) params.append('visibility', filters.visibility);
    
    const query = params.toString();
    return this.get<Trip[]>(query ? `?${query}` : "");
  }

  /**
   * Get trip by ID with full details
   */
  async getById(id: string): Promise<Trip> {
    return this.get<Trip>(`/${id}`);
  }

  /**
   * Get invite link for LINK_ONLY trips
   */
  async getInviteLink(id: string): Promise<{ inviteLink: string }> {
    return this.get<{ inviteLink: string }>(`/${id}/invite-link`);
  }
}

export const tripApi = new TripApi();
```

### Step 4: Create Redux Slice

Create `src/modules/trip/reducers/tripSlice.ts`:

```typescript
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { tripApi } from '../api/trip.api';
import { Trip, TripFilters } from '../interfaces/trip.interface';

interface TripState {
  trips: Trip[];
  selectedTrip: Trip | null;
  filters: TripFilters;
  loading: boolean;
  error: string | null;
}

const initialState: TripState = {
  trips: [],
  selectedTrip: null,
  filters: {},
  loading: false,
  error: null,
};

// Async thunks
export const fetchTrips = createAsyncThunk(
  'trip/fetchTrips',
  async (filters?: TripFilters) => {
    return await tripApi.getAll(filters);
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
    clearSelectedTrip: (state) => {
      state.selectedTrip = null;
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

export const { setFilters, clearSelectedTrip } = tripSlice.actions;
export default tripSlice.reducer;
```

### Step 5: Register Redux Slice

Update `src/store/index.ts`:

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../modules/auth/reducers/authReducer';
import tripReducer from '../modules/trip/reducers/tripSlice'; // Add this

export const store = configureStore({
  reducer: {
    auth: authReducer,
    trip: tripReducer, // Add this
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Step 6: Create Custom Hook

Create `src/modules/trip/hooks/useTrips.ts`:

```typescript
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchTrips, setFilters } from '../reducers/tripSlice';
import { TripFilters } from '../interfaces/trip.interface';

export const useTrips = (initialFilters?: TripFilters) => {
  const dispatch = useAppDispatch();
  const { trips, loading, error, filters } = useAppSelector((state) => state.trip);

  useEffect(() => {
    if (initialFilters) {
      dispatch(setFilters(initialFilters));
    }
    dispatch(fetchTrips(initialFilters));
  }, [dispatch, initialFilters]);

  const refetch = () => {
    dispatch(fetchTrips(filters));
  };

  const updateFilters = (newFilters: TripFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchTrips(newFilters));
  };

  return {
    trips,
    loading,
    error,
    filters,
    refetch,
    updateFilters,
  };
};
```

### Step 7: Create TripCard Component

Create `src/modules/trip/components/TripCard.tsx`:

```tsx
import { Trip } from "../interfaces/trip.interface";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TripCardProps {
  trip: Trip;
}

export const TripCard = ({ trip }: TripCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/trips/${trip.id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleViewDetails}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{trip.route?.name || 'Unknown Route'}</CardTitle>
          <Badge variant={trip.status === 'PUBLISHED' ? 'default' : 'secondary'}>
            {trip.status}
          </Badge>
        </div>
        <CardDescription>
          {trip.tripType === 'NON_REPEATING' ? 'Daily Shuttle' : 'Flexible Schedule'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            {trip.route?.stops?.length || 0} stops
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="mr-2 h-4 w-4" />
            {trip.bus?.numberOfSeats || 0} seats
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-2xl font-bold">
              {trip.currency} {trip.basePrice.toLocaleString()}
            </span>
            <Button onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}>
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

### Step 8: Create TripList Page

Create `src/modules/trip/pages/TripBrowser.tsx`:

```tsx
import { useTrips } from "../hooks/useTrips";
import { TripCard } from "../components/TripCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const TripBrowser = () => {
  const { trips, loading, error } = useTrips();

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>No trips available at the moment.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Trips</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
};
```

### Step 9: Add Route

Update `src/routes/AppRouter.tsx`:

```tsx
import { TripBrowser } from "@/modules/trip/pages/TripBrowser";

// In your routes:
<Route path="/trips" element={<TripBrowser />} />
```

### Step 10: Add Navigation Link

Update your sidebar/navigation to include:

```tsx
<NavLink to="/trips">Browse Trips</NavLink>
```

---

## 🚀 Running Your Implementation

1. **Start the backend:**
   ```bash
   cd ../usafiri-nest
   npm run start:dev
   ```

2. **Start the frontend:**
   ```bash
   cd usafiri-client-new
   npm run dev
   ```

3. **Test the trip browser:**
   - Navigate to `http://localhost:5173/trips`
   - You should see available trips from the backend

---

## 📋 Next Steps After Trip Browser

1. **Add Filters** - Create `TripFilters.tsx` component
2. **Trip Details Page** - Show full trip information
3. **Route Map** - Integrate Google Maps to show route
4. **Move to Seat Selection** - Implement seat reservation flow

---

## 🛠 Useful Commands

```bash
# Install dependencies
npm install

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Run linter
npm run lint
```

---

## 📚 Additional Resources

- **Backend API Documentation:** `http://localhost:3000/docs` (Swagger)
- **Shadcn/ui Components:** `https://ui.shadcn.com`
- **Redux Toolkit:** `https://redux-toolkit.js.org`
- **React Router:** `https://reactrouter.com`

---

## 🐛 Common Issues & Solutions

### Issue: API calls failing with 401
**Solution:** Check that JWT token is being included in headers. Verify token expiry.

### Issue: CORS errors
**Solution:** Ensure backend CORS configuration allows your frontend origin.

### Issue: Redux state not updating
**Solution:** Check that you're using `useAppDispatch` and `useAppSelector` hooks, not the raw Redux hooks.

### Issue: TypeScript errors
**Solution:** Ensure interfaces match backend DTOs. Check `trip.interface.ts`.

---

Generated: November 9, 2025

