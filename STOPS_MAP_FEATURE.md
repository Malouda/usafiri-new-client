# Stops Map View Feature

## Overview

Added a map view to the Stops page that displays all stops with their geographic locations on an interactive map using Leaflet and React-Leaflet.

## Changes Made

### 1. New Component: StopsMapView.tsx

**Location:** `src/modules/route/components/StopsMapView.tsx`

**Features:**
- Displays all stops as markers on an interactive OpenStreetMap
- Color-coded markers: Green for active stops, Gray for inactive stops
- Custom circular marker design with center dot
- Popup on marker click showing:
  - Stop name
  - Description (if available)
  - Latitude and longitude (6 decimal precision)
  - Status (Active/Inactive)
- Auto-fits map bounds to show all stops
- Click on marker to view stop details
- Graceful handling of missing or invalid coordinates
- Responsive map with configurable height

**Technical Details:**
- Uses Leaflet for mapping functionality
- Custom `L.divIcon` for stop markers with inline styles
- `FitBounds` component automatically adjusts map zoom and center
- Validates coordinates before rendering markers
- Converts string coordinates to numbers (handles DB decimal types)

### 2. Updated Component: StopsPage.tsx

**Location:** `src/modules/route/pages/StopsPage.tsx`

**New Features:**
- Toggle between List View and Map View
- Two view modes:
  - **List View**: Original paginated table view (10 items per page)
  - **Map View**: Shows all stops on an interactive map (no pagination)
- View mode selector with icons (List and Map icons from lucide-react)
- Fetches all stops when switching to map view (including inactive stops)
- Click on map markers to open the edit dialog for that stop
- Create Stop button available in both views

**State Management:**
```typescript
const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
const [allStops, setAllStops] = useState<Stop[]>([]); // For map view
```

**API Calls:**
- List View: Uses paginated API (`getAllPaginated`)
- Map View: Uses non-paginated API (`getAll`) to fetch all stops at once

### 3. UI Components

**View Toggle:**
- Styled toggle buttons with active state
- List icon for table view
- Map icon for map view
- Located below stats, above main content

**Map View Layout:**
- Header with "Stops Map" title and "Create Stop" button
- 600px height map container
- Loading state while fetching all stops
- Empty state for no stops

## Usage

1. **Navigate to Stops Page:**
   - Click on "Routes" → "Stops" in the sidebar

2. **Switch to Map View:**
   - Click the "Map View" button in the toggle at the top of the page
   - Map will load showing all stops with their locations

3. **Interact with Map:**
   - **Zoom:** Use mouse wheel or zoom controls
   - **Pan:** Click and drag the map
   - **View Stop Details:** Click on any marker to see popup with stop info
   - **Edit Stop:** Click on a marker, then click anywhere on the popup to open edit dialog

4. **Create New Stop:**
   - Click "Create Stop" button (available in both list and map views)
   - Enter stop name, latitude, longitude, and optional description
   - New stop will appear on the map after creation

## Map Features

### Marker Appearance
- **Active Stops:** Green circular marker with white center dot
- **Inactive Stops:** Gray circular marker with white center dot
- **Marker Size:** 24x24 pixels with white border and shadow

### Popup Information
```
Stop Name
Description (if available)
Latitude: -6.123456
Longitude: 39.123456
Status: Active/Inactive
```

### Auto-Fit Bounds
- Map automatically zooms and centers to show all stops
- 50px padding on all sides
- Maximum zoom level of 15 to prevent over-zooming

### Default Center
- If no stops exist: Dar es Salaam center (-6.7924, 39.2083)
- If stops exist: First stop's location or centroid of all stops

## Technical Stack

**Mapping Libraries:**
- `leaflet`: ^1.9.4 - Core mapping library
- `react-leaflet`: ^4.2.1 - React wrapper for Leaflet
- `@types/leaflet`: ^1.9.21 - TypeScript definitions

**Map Tile Provider:**
- OpenStreetMap: Free and open-source map tiles
- Attribution required (automatically included)

**Icons:**
- `lucide-react`: List and Map icons for view toggle

## Files Modified

1. **Created:**
   - `src/modules/route/components/StopsMapView.tsx` (180 lines)

2. **Modified:**
   - `src/modules/route/pages/StopsPage.tsx`:
     - Added imports for StopsMapView, Button, List, and MapIcon
     - Added viewMode and allStops state
     - Added fetchAllStops function
     - Added useEffect to fetch stops when switching to map view
     - Updated render to include view toggle and conditional rendering

## Benefits

✅ **Visual Overview:** See all stops geographically at once
✅ **Better Planning:** Understand stop distribution and coverage
✅ **Easy Verification:** Quickly verify stop coordinates are correct
✅ **Interactive:** Click markers to view details or edit stops
✅ **No Pagination:** See all stops without clicking through pages
✅ **Status Indicator:** Color-coded markers show active vs inactive stops
✅ **Responsive:** Map adjusts to show all stops automatically

## Future Enhancements

Possible future improvements:
1. **Clustering:** Group nearby stops when zoomed out
2. **Search:** Search for stops and highlight on map
3. **Filter:** Filter by active/inactive status
4. **Draw Mode:** Create new stops by clicking on the map
5. **Route Overlay:** Show route paths connecting stops in sequence
6. **Distance Calculations:** Show distances between consecutive stops
7. **Heatmap:** Visualize stop density
8. **Satellite View:** Toggle between map and satellite imagery

## Testing

1. **View Toggle:**
   - Switch between list and map views
   - Verify state persists when creating/editing stops

2. **Map Display:**
   - Verify all stops appear on the map
   - Check marker colors (green = active, gray = inactive)
   - Test popup information accuracy

3. **Marker Interaction:**
   - Click markers to view popups
   - Verify edit dialog opens with correct stop data

4. **Empty States:**
   - Test with no stops (should show empty state message)
   - Test with invalid coordinates (should skip those stops)

5. **Performance:**
   - Test with large number of stops (100+)
   - Verify map loads without lag

## Browser Compatibility

- Chrome/Edge: ✅ Fully supported
- Firefox: ✅ Fully supported
- Safari: ✅ Fully supported
- Mobile browsers: ✅ Touch gestures supported

## Dependencies

No new dependencies required - all mapping libraries were already installed in the project.
