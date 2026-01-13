# Route/Trip Stops Map Feature

## Overview

Added an interactive map view to display all stops for a specific route/trip, showing the route path and stop sequence with visual markers.

## Implementation

### 1. New Component: RouteMapModal.tsx

**Location:** `src/modules/route/components/RouteMapModal.tsx`

**Features:**
- **Modal Dialog** - Opens in a large modal (max-width 5xl, 85% viewport height)
- **Route Path Visualization** - Blue dashed polyline connecting all stops in sequence
- **Color-coded Stop Markers:**
  - 🟢 **Green** - First stop (Start point)
  - 🔴 **Red** - Last stop (End point)
  - 🔵 **Blue** - Intermediate stops
- **Sequence Numbers** - Each marker shows the stop sequence number
- **Interactive Popups** - Click markers to see:
  - Stop name with emoji (🚀 Start, 🏁 End)
  - Description (if available)
  - Coordinates (latitude/longitude with 6 decimal precision)
  - Sequence number
- **Auto-fit Bounds** - Map automatically zooms to show entire route
- **Empty State** - Shows message when route has no stops

**Technical Details:**
```typescript
// Stop marker colors based on position
const color = isFirst ? '#10b981' : isLast ? '#ef4444' : '#3b82f6';

// Route path with dashed line
<Polyline
  positions={routePath}
  color="#3b82f6"
  weight={4}
  opacity={0.7}
  dashArray="10, 10"
/>
```

### 2. Updated Component: RouteList.tsx

**Location:** `src/modules/route/components/RouteList.tsx`

**Changes:**
- Added `onViewMap` prop to component interface
- Added Map icon button (blue color) in actions column
- Map button appears before Edit and Delete buttons
- Tooltip: "View route map"

**Button Implementation:**
```typescript
<Button
  variant="ghost"
  size="sm"
  onClick={() => onViewMap(route)}
  className="h-7 w-7 p-0"
  title="View route map"
>
  <MapIcon className="h-3 w-3 text-blue-600" />
</Button>
```

### 3. Updated Page: RoutesPage.tsx

**Location:** `src/modules/route/pages/RoutesPage.tsx`

**State Management:**
```typescript
const [isMapModalOpen, setIsMapModalOpen] = useState(false);
const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
```

**Event Handler:**
```typescript
function handleViewMap(route: Route) {
  setSelectedRoute(route);
  setIsMapModalOpen(true);
}
```

**Modal Rendering:**
- Conditionally renders RouteMapModal when a route is selected
- Handles modal close by resetting state
- Passes selected route to modal component

## Usage

### For Users:

1. **Navigate to Routes Page:**
   - Go to Routes section in the admin dashboard

2. **View Route Map:**
   - Find the route you want to visualize
   - Click the blue **Map icon** (🗺️) in the Actions column
   - A modal will open showing the route map

3. **Interact with Map:**
   - **View Stop Details:** Click any marker to see popup with stop information
   - **Zoom:** Use mouse wheel or zoom controls
   - **Pan:** Click and drag the map
   - **Close:** Click outside modal or press ESC

### Visual Legend:

- **🟢 Green Marker** - Starting point (first stop)
- **🔵 Blue Markers** - Intermediate stops
- **🔴 Red Marker** - End point (last stop)
- **Blue Dashed Line** - Route path connecting stops in sequence
- **Numbers on Markers** - Stop sequence order

## Data Flow

1. User clicks Map icon on a route
2. `handleViewMap(route)` sets selected route and opens modal
3. `RouteMapModal` receives route with `routeStops` array
4. Component extracts and sorts stops by sequence
5. Map renders with:
   - Markers at each stop location
   - Polyline connecting stops
   - Auto-fit bounds to show entire route

## Route Data Structure

```typescript
interface Route {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  routeStops?: RouteStop[];
}

interface RouteStop {
  id: string;
  routeId: string;
  stopId: string;
  sequence: number;
  estimatedDurationMinutes?: number;
  stop?: Stop; // Populated with stop details
}

interface Stop {
  id: string;
  name: string;
  latitude: number | string;
  longitude: number | string;
  description?: string;
  isActive: boolean;
}
```

## Benefits

✅ **Visual Route Planning** - See the entire route path at a glance
✅ **Stop Sequence Verification** - Confirm stops are in correct order
✅ **Geographic Coverage** - Understand route coverage area
✅ **Distance Assessment** - Visualize spacing between stops
✅ **Easy Navigation** - Quick access from routes table
✅ **Professional UI** - Clean modal with auto-fit bounds

## Technical Features

### Marker Styling
- 32x32px circular markers with white borders
- Bold white sequence numbers
- Drop shadow for depth
- Color-coded by position

### Route Path
- 4px width blue line
- 70% opacity for subtle appearance
- Dashed pattern (10px dash, 10px gap)
- Connects stops in sequential order

### Map Behavior
- Auto-fits bounds with 50px padding
- Maximum zoom level of 15 to prevent over-zooming
- OpenStreetMap tiles for geographic context
- Responsive to window resizing

### Error Handling
- Filters stops with invalid coordinates
- Shows empty state if no stops exist
- Validates stop data before rendering
- Console logging for debugging

## Files Modified/Created

### Created:
1. **`src/modules/route/components/RouteMapModal.tsx`** (240+ lines)
   - Main map modal component
   - Route path visualization
   - Stop markers with popups

### Modified:
2. **`src/modules/route/components/RouteList.tsx`**
   - Added Map icon import
   - Added `onViewMap` prop
   - Added Map button to actions

3. **`src/modules/route/pages/RoutesPage.tsx`**
   - Added RouteMapModal import
   - Added map modal state
   - Added handleViewMap function
   - Added RouteMapModal rendering

## Example Workflow

```
User Flow:
1. Open Routes page
2. See list of routes with stops count
3. Click Map icon on "Downtown Express" route
4. Modal opens showing:
   - Green marker at "Central Station" (Stop 1)
   - Blue markers at intermediate stops
   - Red marker at "Airport Terminal" (Stop 10)
   - Blue dashed line connecting all stops
5. Click marker to see stop details
6. Close modal
```

## Dependencies

- `leaflet` - Mapping library (already installed)
- `react-leaflet` - React wrapper for Leaflet (already installed)
- `@/components/ui/dialog` - Modal dialog component
- OpenStreetMap - Map tile provider (free)

## Future Enhancements

Possible improvements:
1. **Edit Mode** - Drag markers to reorder or adjust stop locations
2. **Distance Calculations** - Show distance between consecutive stops
3. **Time Estimates** - Display estimated travel time between stops
4. **Alternative Routes** - Suggest route optimizations
5. **Print/Export** - Download map as image or PDF
6. **Satellite View** - Toggle between map and satellite imagery
7. **Traffic Layer** - Show real-time traffic conditions
8. **Stop Details** - Click marker to edit stop directly from map

## Browser Compatibility

- ✅ Chrome/Edge - Fully supported
- ✅ Firefox - Fully supported
- ✅ Safari - Fully supported
- ✅ Mobile browsers - Touch gestures supported

## Notes

- Route data must include `routeStops` with populated `stop` data
- Backend API should return route with nested stop information
- Invalid coordinates are automatically filtered out
- Map defaults to Dar es Salaam center if no valid stops
