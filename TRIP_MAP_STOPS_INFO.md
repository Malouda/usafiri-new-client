# Trip Map with Stops - Already Implemented!

## Current Implementation

The Trip List page (`TripList.tsx`) **already has** a map feature that shows stops for each trip. Here's how it works:

### How to Access

1. **Go to Trips page** in the admin dashboard
2. **Find a trip** in the table
3. **Click the "Map" button** in the Actions column
4. **Map modal opens** showing:
   - Real-time bus location (if driver is online)
   - All stops for that trip's route
   - Bus icon (green with emoji 🚌)
   - Stop markers (red circles)

### Code Location

**TripMapModal Component:**
`src/modules/trip/components/TripMapModal.tsx`

**Key Features Already Implemented:**

#### 1. Stops Display (Lines 129-215)
```typescript
// Get route stops from trip
const stops = trip.route?.stops || [];

// Render stop markers
{stops.map((stop, index) => {
  if (!stop.latitude || !stop.longitude) return null;

  return (
    <Marker
      key={stop.id || index}
      position={[stopLat, stopLng]}
      icon={createStopIcon()}
    >
      <Popup>
        <p className="font-medium">{stop.name || `Stop ${index + 1}`}</p>
        <p>Sequence: {stop.sequence || index + 1}</p>
        <p>Lat: {stopLat.toFixed(6)}</p>
        <p>Lng: {stopLng.toFixed(6)}</p>
      </Popup>
    </Marker>
  );
})}
```

#### 2. Real-time Bus Location (Lines 82-127)
- Subscribes to WebSocket for GPS updates
- Shows moving bus icon on map
- Updates in real-time as driver sends GPS data

#### 3. Smart Map Centering (Lines 132-146)
- Centers on bus location if online
- Falls back to first stop if bus offline
- Defaults to Dar es Salaam if no data

### Features

✅ **Stop Markers** - Red circular markers for each stop
✅ **Stop Details** - Click marker to see name, sequence, coordinates
✅ **Bus Tracking** - Green bus icon shows real-time location
✅ **Auto-Center** - Map centers on bus or first stop
✅ **Sequence Order** - Stops show their order in route

### Why Stops Might Not Appear

If you're not seeing stops on the map, it could be because:

**1. Backend not returning route data:**
   - Check if trips API includes route with stops
   - Verify: `GET /api/v1/trips` returns `trip.route.stops`

**2. Stops don't have coordinates:**
   - Check stop records in database
   - Verify latitude/longitude fields are populated

**3. Route not assigned to trip:**
   - Check if trip has a valid `routeId`
   - Verify route exists and has stops

### Data Structure Expected

```typescript
{
  id: "trip-uuid",
  name: "Morning Route",
  route: {
    id: "route-uuid",
    name: "Downtown Express",
    stops: [  // ← This array must be populated!
      {
        id: "stop-uuid-1",
        name: "Central Station",
        latitude: -6.7924,
        longitude: 39.2083,
        sequence: 1
      },
      {
        id: "stop-uuid-2",
        name: "Market Square",
        latitude: -6.8000,
        longitude: 39.2500,
        sequence: 2
      }
      // ... more stops
    ]
  }
}
```

### Backend Check

To verify the backend is returning stops:

```bash
# Check if trips include route with stops
curl -X GET http://localhost:3000/api/v1/trips \
  -H "Authorization: Bearer <token>" | jq '.[0].route.stops'

# Should return array of stops with coordinates
```

### Frontend Debugging

Add console logs to see what data is being received:

```typescript
// In TripMapModal.tsx, line 130
const stops = trip.route?.stops || [];
console.log("Trip data:", trip);
console.log("Route data:", trip.route);
console.log("Stops data:", stops);
```

Then check browser console when opening map modal.

## Solution

The feature is **already implemented**! If stops aren't showing:

### Option 1: Fix Backend Response

Ensure the trips endpoint returns route with stops:

```typescript
// Backend: Include route.stops in query
const trips = await tripRepository
  .createQueryBuilder('trip')
  .leftJoinAndSelect('trip.route', 'route')
  .leftJoinAndSelect('route.routeStops', 'routeStops')  // ← Add this
  .leftJoinAndSelect('routeStops.stop', 'stop')          // ← And this
  .getMany();
```

### Option 2: Use New Endpoint

We just created `GET /stops/trip/:tripId` endpoint!

You could update TripMapModal to fetch stops separately:

```typescript
const [stops, setStops] = useState<Stop[]>([]);

useEffect(() => {
  if (open && trip.id) {
    // Fetch stops for this trip
    stopApi.getStopsForTrip(trip.id)
      .then(setStops)
      .catch(console.error);
  }
}, [open, trip.id]);
```

## Recommendation

**Check the backend first!** The frontend code is already perfect. The issue is likely that:

1. The trips API isn't returning `route.stops` data
2. Or the route doesn't have stops assigned

To fix:
1. Verify route has stops in database
2. Ensure trips API includes route.stops in response
3. Check that stops have valid latitude/longitude

The map feature is **fully implemented** and ready to use once the data is available!

## Files Reference

- **Map Modal:** `src/modules/trip/components/TripMapModal.tsx` (lines 75-229)
- **Trip List:** `src/modules/trip/pages/TripList.tsx` (lines 137-145, 404-410)
- **Stop Icon:** `src/modules/trip/components/TripMapModal.tsx` (lines 42-59)
- **Bus Icon:** `src/modules/trip/components/TripMapModal.tsx` (lines 17-40)

Everything is ready - just need the data! 🗺️
