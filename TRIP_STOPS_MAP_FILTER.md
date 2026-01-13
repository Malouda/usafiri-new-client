# Trip Stops Map Filter Feature

## Overview

Added functionality to filter and display stops on a map based on the selected trip. Users can now view all stops for a specific trip or view all stops in the system.

## Implementation

### Backend Changes

#### 1. New Endpoint: GET /stops/trip/:tripId

**Location:** `src/modules/route/controllers/stops.controller.ts`

**Purpose:** Retrieve all stops for a specific trip by following the relationship chain: Trip → Route → RouteStops → Stops

**Request:**
```
GET /api/v1/stops/trip/:tripId
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Central Station",
    "latitude": -6.7924,
    "longitude": 39.2083,
    "description": "Main bus terminal",
    "isActive": true,
    "audioUrl": "s3://...",
    "createdAt": "2025-01-15T10:00:00Z",
    "updatedAt": "2025-01-15T10:00:00Z"
  },
  // ... more stops in sequence order
]
```

**Features:**
- Returns stops in sequence order (as defined in route)
- Enforces tenant isolation
- Requires authentication
- Returns 404 if trip not found or has no stops

#### 2. New Service Method: findStopsForTrip()

**Location:** `src/modules/route/services/stop.service.ts`

**Implementation:**
```typescript
async findStopsForTrip(tenantId: string, tripId: string): Promise<Stop[]> {
  // First, get the trip and verify tenant ownership
  const trip = await this.dataSource
    .getRepository('trips')
    .createQueryBuilder('trip')
    .where('trip.id = :tripId', { tripId })
    .andWhere('trip.tenantId = :tenantId', { tenantId })
    .getOne();

  if (!trip) {
    throw new NotFoundException(`Trip ${tripId} not found`);
  }

  // Now query stops using the trip's routeId
  const query = this.stopRepository
    .createQueryBuilder('stop')
    .innerJoin('stop.routeStops', 'routeStop')
    .innerJoin('routeStop.route', 'route')
    .where('route.id = :routeId', { routeId: trip.routeId })
    .andWhere('route.tenantId = :tenantId', { tenantId })
    .orderBy('routeStop.sequence', 'ASC');

  return await query.getMany();
}
```

**Key Features:**
- Two-step query: First validates trip ownership, then queries stops
- Uses trip.routeId to find stops (avoids need for Route.trips relationship)
- Orders by routeStop.sequence
- Validates tenant ownership at both Trip and Route level

### Frontend Changes

#### 1. Updated API Client

**Location:** `src/modules/route/stop.api.ts`

**New Method:**
```typescript
async getStopsForTrip(tripId: string): Promise<Stop[]> {
  return this.get<Stop[]>(`/trip/${tripId}`);
}
```

#### 2. Updated StopsPage Component

**Location:** `src/modules/route/pages/StopsPage.tsx`

**New State:**
```typescript
const [trips, setTrips] = useState<Trip[]>([]);
const [selectedTripId, setSelectedTripId] = useState<string>("");
```

**New Functions:**
```typescript
// Fetch all active trips for the dropdown
async function fetchTrips() {
  const response = await tripApi.getAll({ status: 'ACTIVE' });
  setTrips(response);
  if (response.length > 0) {
    setSelectedTripId(response[0].id); // Auto-select first trip
  }
}

// Fetch stops for a specific trip
async function fetchStopsForTrip(tripId: string) {
  const response = await stopApi.getStopsForTrip(tripId);
  setAllStops(response);
}
```

**New UI - Trip Selector:**
```tsx
<Select value={selectedTripId} onValueChange={setSelectedTripId}>
  <SelectTrigger className="w-[280px] h-8 text-xs">
    <SelectValue placeholder="Select a trip" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All Stops</SelectItem>
    {trips.map((trip) => (
      <SelectItem key={trip.id} value={trip.id}>
        {trip.route?.name || trip.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```

## User Flow

### Viewing Trip Stops on Map

1. **Navigate to Stops Page:**
   - Click "Routes" → "Stops" in sidebar

2. **Switch to Map View:**
   - Click "Map View" button at the top

3. **Select a Trip:**
   - Use the dropdown next to "Stops Map" header
   - Options include:
     - "All Stops" - Shows all stops in the system
     - Individual trips (by route name) - Shows only stops for that trip

4. **View Map:**
   - Map displays markers for selected trip's stops
   - Markers show sequence numbers
   - Green = first stop, Blue = intermediate, Red = last stop
   - Click markers for stop details

5. **Switch Trips:**
   - Select different trip from dropdown
   - Map updates automatically with new stops
   - Zoom/center adjusts to fit all stops

## Features

### Trip Dropdown
- Shows all active trips
- Displays route name for easy identification
- Falls back to trip name or truncated ID if no route name
- Compact design (280px width)
- Small text size for space efficiency

### Map Behavior Based on Selection

**When "All Stops" Selected:**
- Calls `GET /stops` (existing endpoint)
- Shows all stops in the system
- Useful for overview of all stop locations

**When Specific Trip Selected:**
- Calls `GET /stops/trip/:tripId` (new endpoint)
- Shows only stops for that trip's route
- Stops appear in sequence order
- Useful for verifying trip route

### Auto-Selection
- First available trip is auto-selected when page loads
- If no trips exist, shows "All Stops" by default
- Prevents empty map state

## Data Flow

```
User Action: Select Trip from Dropdown
    ↓
selectedTripId State Updates
    ↓
useEffect Triggered
    ↓
If tripId !== 'all':
  → fetchStopsForTrip(tripId)
    → GET /api/v1/stops/trip/:tripId
      → Backend: Trip → Route → RouteStops → Stops
        → Returns stops in sequence order
          → setAllStops(response)
            → Map re-renders with trip stops

If tripId === 'all':
  → fetchAllStops()
    → GET /api/v1/stops
      → Returns all stops
        → setAllStops(response)
          → Map re-renders with all stops
```

## Database Relationships

```
Trip (id, routeId, tenantId)
  ↓ one-to-many
Route (id, tenantId)
  ↓ one-to-many
RouteStop (id, routeId, stopId, sequence)
  ↓ many-to-one
Stop (id, name, latitude, longitude, tenantId)
```

**Query Path:**
```sql
SELECT stop.*
FROM stop
INNER JOIN route_stop ON stop.id = route_stop.stopId
INNER JOIN route ON route_stop.routeId = route.id
INNER JOIN trip ON route.id = trip.routeId
WHERE trip.id = :tripId
  AND trip.tenantId = :tenantId
ORDER BY route_stop.sequence ASC
```

## Benefits

✅ **Focused View** - See only relevant stops for a specific trip
✅ **Trip Planning** - Visualize trip route before deployment
✅ **Route Verification** - Confirm stops are correct for each trip
✅ **Flexible** - Switch between trip-specific and all-stops view
✅ **Automatic** - First trip auto-selected for immediate visualization
✅ **Performance** - Efficient database query with joins
✅ **Sequence Order** - Stops appear in correct order from route

## Use Cases

### 1. Route Verification
**Scenario:** Admin creates new trip and wants to verify route
**Action:** Select trip from dropdown, view stops on map
**Result:** Confirms all stops are included and in correct sequence

### 2. Trip Planning
**Scenario:** Planning coverage for a new area
**Action:** View "All Stops" to see coverage gaps
**Result:** Identifies areas needing new stops

### 3. Driver Briefing
**Scenario:** New driver needs to learn route
**Action:** Show trip stops on map with sequence numbers
**Result:** Visual guide for driver orientation

### 4. Stop Optimization
**Scenario:** Too many stops on one trip
**Action:** View trip stops, identify closely-spaced stops
**Result:** Can consolidate or remove redundant stops

## Files Modified

### Backend
1. **`src/modules/route/controllers/stops.controller.ts`**
   - Added `getStopsForTrip()` endpoint method

2. **`src/modules/route/services/stop.service.ts`**
   - Added `findStopsForTrip()` service method

### Frontend
3. **`src/modules/route/stop.api.ts`**
   - Added `getStopsForTrip()` API method

4. **`src/modules/route/pages/StopsPage.tsx`**
   - Added trips state and trip selector
   - Added fetchTrips() and fetchStopsForTrip() functions
   - Updated useEffect to handle trip filtering
   - Added Select component for trip chooser

## Error Handling

**Backend:**
- Returns 404 if trip not found
- Returns 404 if trip has no stops
- Enforces tenant isolation (can't access other tenant's trips)

**Frontend:**
- Displays error toast if trip fetch fails
- Clears stops array on error
- Falls back to "All Stops" if trip selection fails
- Console logs for debugging

## Testing

### Backend
```bash
# Test endpoint
curl -X GET http://localhost:3000/api/v1/stops/trip/:tripId \
  -H "Authorization: Bearer <token>"

# Should return stops in sequence order
# Should return 404 if trip not found
```

### Frontend
1. Go to Stops page
2. Click "Map View"
3. Verify dropdown shows active trips
4. Select a trip
5. Verify map shows only that trip's stops
6. Select "All Stops"
7. Verify map shows all stops
8. Check console for any errors

## Future Enhancements

1. **Trip Search** - Search/filter trips by name
2. **Route Details** - Show route path line connecting stops
3. **Stop Reordering** - Drag markers to change sequence
4. **Distance Display** - Show distance between consecutive stops
5. **Time Estimates** - Display estimated travel time between stops
6. **Multiple Trips** - Compare stops for multiple trips simultaneously
7. **Trip Status Filter** - Filter by active/inactive trips
