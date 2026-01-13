# Usafiri Frontend Implementation Plan

## Overview
Based on the comprehensive backend analysis, this document outlines the frontend implementation plan for the Usafiri Platform. The backend has 11 major modules with full REST and WebSocket support.

**Already Implemented:** ✅
- Authentication (Login, Registration for Riders & Tenants)
- Basic Dashboard page
- Layout components (Header, Sidebar, AdminLayout)

---

## Phase 1: Core Rider Experience (Priority 1) 🎯

### 1.1 Trip Discovery & Browsing
**Module:** `modules/trip/`

**Features:**
- **Trip List Page** - Browse available trips
  - Filter by: date, route, trip type (Non-Repeating/Repeating)
  - Search functionality
  - View trip details (route, stops, price, availability)
  
- **Trip Details Page** - View comprehensive trip information
  - Route map visualization (Google Maps integration)
  - Stop sequence with pickup/dropoff times
  - Seat availability matrix
  - Price breakdown with platform fees
  - Trip policies (cancellation, passenger info requirements)

**API Endpoints to integrate:**
```
GET /trips - List all trips with filters
GET /trips/:id - Get trip details
GET /trips/:id/invite-link - Get invite link for LINK_ONLY trips
```

**State Management:**
- Redux slice: `tripSlice` with actions for fetching, filtering trips
- Cache trip data for performance

**Components:**
- `TripCard.tsx` - Trip preview card
- `TripList.tsx` - Grid/List of trips
- `TripDetails.tsx` - Detailed trip view
- `TripFilters.tsx` - Filter sidebar
- `RouteMap.tsx` - Google Maps route visualization

**Estimated Time:** 5-7 days

---

### 1.2 Seat Reservation & Booking Flow
**Module:** `modules/reservation/`

**Features:**
- **Seat Selection** - Interactive seat picker
  - Visual seat map (available/occupied/selected)
  - Multi-seat selection support (for Repeating trips)
  - Real-time availability updates
  - Hold timer (3 minutes default) with countdown

- **Booking Checkout** - Confirm reservation
  - Review selected seats and dates
  - Price calculation with platform fees
  - Passenger info collection (based on P3 policy)
  - Idempotency key handling
  - Wallet balance check

- **My Reservations** - View booking history
  - Filter by status (PENDING, CONFIRMED, CANCELLED)
  - View booking details
  - Cancel reservations (with refund calculation)
  - Download/View passenger manifest

**API Endpoints:**
```
POST /reservations/confirm - Confirm seat hold (requires Idempotency-Key header)
GET /reservations - List rider's reservations
GET /reservations/:id - Get reservation details
GET /reservations/manifest - Get passenger manifest
POST /seat-holds - Create seat hold
GET /seat-holds/:holdToken - Get hold details
DELETE /seat-holds/:holdToken - Release hold
POST /cancellations - Cancel reservation
```

**State Management:**
- Redux slice: `reservationSlice`, `seatHoldSlice`
- WebSocket for real-time seat updates

**Components:**
- `SeatMap.tsx` - Interactive seat picker
- `BookingCheckout.tsx` - Checkout flow
- `ReservationList.tsx` - List of user's bookings
- `ReservationCard.tsx` - Booking card preview
- `CancellationModal.tsx` - Cancel booking dialog
- `HoldTimer.tsx` - Countdown timer for hold expiry

**Estimated Time:** 7-10 days

---

### 1.3 Wallet Management
**Module:** `modules/wallet/`

**Features:**
- **Wallet Dashboard** - View balance and transactions
  - Current balance display
  - Recent transactions list
  - Transaction filtering (CREDIT, DEBIT, by category)
  - Transaction history pagination

- **Top-up Wallet** - Add funds (Phase 2: Payment gateway integration)
  - Top-up amount input
  - Payment method selection (stubbed for Phase 1)
  - Transaction confirmation

**API Endpoints:**
```
GET /wallets/balance - Get current wallet balance
GET /wallets/history - Get transaction history (with pagination)
```

**State Management:**
- Redux slice: `walletSlice`

**Components:**
- `WalletDashboard.tsx` - Main wallet page
- `WalletBalance.tsx` - Balance card
- `TransactionHistory.tsx` - Transaction list with filters
- `TransactionItem.tsx` - Single transaction display
- `TopUpModal.tsx` - Top-up dialog (Phase 2)

**Estimated Time:** 3-4 days

---

### 1.4 Real-Time Trip Tracking
**Module:** `modules/tracking/`

**Features:**
- **Live Trip Tracking** - Real-time GPS tracking via WebSocket
  - Bus location on map (Google Maps)
  - Route overlay with stops
  - ETA to each stop
  - Bus speed and heading
  - Connection status indicator
  - Manual ETA refresh

**WebSocket Events (Client → Server):**
```
rider:subscribe - Join tracking room for trip
rider:unsubscribe - Leave tracking room
rider:get-location - Get current location
rider:subscribe-stop-eta - Subscribe to specific stop ETA
rider:refresh-eta - Manually refresh ETA
```

**WebSocket Events (Server → Client):**
```
trip:gps-update - Real-time GPS updates
stop-eta-update - ETA updates for stops
room:joined - Subscription confirmation
room:left - Unsubscription confirmation
room:closed - Trip ended notification
```

**State Management:**
- Redux slice: `trackingSlice`
- WebSocket middleware for Socket.IO

**Components:**
- `LiveTrackingMap.tsx` - Real-time map view
- `ETADisplay.tsx` - ETA to stops
- `BusMarker.tsx` - Animated bus marker
- `StopMarker.tsx` - Stop markers on map
- `TrackingControls.tsx` - Zoom, center, refresh controls

**Estimated Time:** 5-7 days

---

## Phase 2: Admin Features (Priority 2) 🔧

### 2.1 Fleet Management
**Module:** `modules/fleet/`

**Features:**
- **Bus Management**
  - List all buses with filters (status)
  - Add new bus (plate number, capacity, details)
  - Edit bus details
  - Update bus status (ACTIVE, MAINTENANCE, INACTIVE)
  - Delete bus
  - View bus assignment history

- **Driver Management**
  - List all drivers
  - Add new driver (phone, license, details)
  - Edit driver details
  - Assign driver to bus
  - View current assignments
  - Driver assignment history

**API Endpoints:**
```
GET /buses - List all buses
POST /buses - Create bus
GET /buses/:id - Get bus details
PUT /buses/:id - Update bus
DELETE /buses/:id - Delete bus
POST /buses/assign-driver - Assign driver to bus
GET /buses/assignments/current - Get current assignments
GET /buses/:id/assignments - Get assignment history

GET /drivers - List all drivers
POST /drivers - Create driver
GET /drivers/:id - Get driver details
PUT /drivers/:id - Update driver
DELETE /drivers/:id - Delete driver
```

**State Management:**
- Redux slices: `busSlice`, `driverSlice`

**Components:**
- `BusList.tsx`, `BusForm.tsx`, `BusCard.tsx`
- `DriverList.tsx`, `DriverForm.tsx`, `DriverCard.tsx`
- `AssignDriverModal.tsx`
- `AssignmentHistory.tsx`

**Estimated Time:** 6-8 days

---

### 2.2 Route & Stop Management
**Module:** `modules/route/`

**Features:**
- **Route Management**
  - List all routes
  - Create route with stops (min 2 stops)
  - Auto-generated route names ("FirstStop → LastStop")
  - Edit route and reorder stops
  - Soft delete routes
  - View route on map

**API Endpoints:**
```
GET /routes - List all routes
POST /routes - Create route
GET /routes/:id - Get route details
PUT /routes/:id - Update route
DELETE /routes/:id - Delete route (soft)

GET /stops - List all stops
POST /stops - Create stop
PUT /stops/:id - Update stop
DELETE /stops/:id - Delete stop
```

**State Management:**
- Redux slices: `routeSlice`, `stopSlice`

**Components:**
- `RouteList.tsx`, `RouteForm.tsx`
- `StopManager.tsx` - Drag-and-drop stop reordering
- `RouteVisualization.tsx` - Route on map

**Estimated Time:** 5-7 days

---

### 2.3 Trip Scheduling & Management
**Module:** `modules/trip/` (Admin side)

**Features:**
- **Create Trips**
  - Non-Repeating Trip form (Morning/Evening sessions)
  - Repeating Trip form (flexible time slots)
  - Route selection
  - Bus assignment
  - Pricing configuration
  - Policy selection (cancellation, passenger info)
  - Draft/Publish workflow

- **Trip Management**
  - Edit DRAFT trips
  - Publish trips
  - View trip sessions and slots
  - Manage availability
  - Cancel/Complete trips

**API Endpoints:**
```
POST /trips/non-repeating - Create NR trip
POST /trips/repeating - Create RT trip
PUT /trips/:id - Update trip
POST /trips/:id/publish - Publish trip
GET /trips/:id/invite-link - Get invite link
```

**State Management:**
- Extend `tripSlice` with admin actions

**Components:**
- `CreateTripWizard.tsx` - Multi-step form
- `TripTypeSelector.tsx`
- `NonRepeatingTripForm.tsx`
- `RepeatingTripForm.tsx`
- `TripPolicySelector.tsx`
- `TripManagementTable.tsx`

**Estimated Time:** 8-10 days

---

### 2.4 Admin Dashboard & Analytics
**Module:** `modules/admin/`

**Features:**
- **Dashboard Overview**
  - User KPIs (total, active, by role, new this week/month)
  - Trip KPIs (total, active, completed, upcoming, avg occupancy)
  - Booking KPIs (total, today, week, month, cancellation rate)
  - Revenue KPIs (total, today, week, month, platform fees, tenant earnings)
  - Wallet KPIs (total balance, top-ups, deductions, refunds)

- **Activity Feed**
  - Recent bookings, registrations, trip completions
  - Real-time activity updates

- **Fleet Utilization**
  - Bus usage metrics
  - Driver performance

- **Route Performance**
  - Top routes by bookings
  - Route occupancy rates

**API Endpoints:**
```
GET /admin/dashboard - Get dashboard KPIs
GET /admin/dashboard/activity - Get recent activity
GET /admin/dashboard/fleet - Get fleet utilization
GET /admin/dashboard/routes - Get route performance
```

**State Management:**
- Redux slice: `adminDashboardSlice`

**Components:**
- `AdminDashboard.tsx` - Main dashboard page
- `KPICard.tsx` - Metric card component
- `ActivityFeed.tsx` - Recent activity list
- `FleetUtilizationChart.tsx`
- `RoutePerformanceChart.tsx`
- `RevenueChart.tsx`

**Estimated Time:** 5-7 days

---

## Phase 3: Enhanced Features (Priority 3) 🚀

### 3.1 Notification Center
**Module:** `modules/notification/`

**Features:**
- **Notification History**
  - List all notifications
  - Mark as read/unread
  - Filter by type/channel

- **Notification Preferences**
  - Enable/disable channels (push, SMS, email)
  - Configure quiet hours
  - Update device tokens (FCM/APNS)

- **Real-time Notifications**
  - Push notifications for bookings, cancellations, trip updates

**API Endpoints:**
```
GET /notifications/history - Get notification history
GET /notifications/preferences - Get preferences
POST /notifications/preferences/channels - Update channels
POST /notifications/preferences/device-tokens - Update tokens
POST /notifications/preferences/quiet-hours - Configure quiet hours
```

**State Management:**
- Redux slice: `notificationSlice`

**Components:**
- `NotificationCenter.tsx`
- `NotificationList.tsx`
- `NotificationPreferences.tsx`
- `NotificationBadge.tsx`

**Estimated Time:** 4-5 days

---

### 3.2 Reporting & Exports
**Module:** `modules/reporting/`

**Features:**
- **Generate Reports**
  - Revenue reports
  - Trip reports
  - User activity reports
  - Export to CSV/Excel

- **Analytics Dashboards**
  - Charts and visualizations
  - Date range selection
  - Export data

**API Endpoints:**
```
POST /reports/generate - Generate report
GET /reports/:id - Get report
GET /reports/:id/export - Export report
GET /analytics/revenue - Revenue analytics
GET /analytics/trips - Trip analytics
```

**State Management:**
- Redux slice: `reportingSlice`

**Components:**
- `ReportGenerator.tsx`
- `ReportList.tsx`
- `AnalyticsDashboard.tsx`
- `RevenueChart.tsx`
- `TripChart.tsx`

**Estimated Time:** 5-6 days

---

## Phase 4: Polish & Optimization (Priority 4) ✨

### 4.1 UX Enhancements
- Loading skeletons for all data fetching
- Error boundaries and fallback UI
- Toast notifications for actions
- Confirmation dialogs for destructive actions
- Form validation with helpful error messages
- Responsive design for all screens
- Dark mode support
- Accessibility improvements (ARIA labels, keyboard navigation)

**Estimated Time:** 3-4 days

---

### 4.2 Performance Optimization
- Implement React.lazy() for route-based code splitting
- Optimize bundle size
- Image optimization
- Caching strategies with React Query or RTK Query
- Virtualized lists for large datasets
- Debounced search inputs
- WebSocket connection management

**Estimated Time:** 3-4 days

---

### 4.3 Testing
- Unit tests for Redux slices
- Component tests for all UI components
- Integration tests for critical flows
- E2E tests for booking flow
- WebSocket connection tests

**Estimated Time:** 5-7 days

---

## Implementation Priority Summary

### Immediate (Week 1-3): Core Rider Features
1. ✅ Trip Discovery & Browsing
2. ✅ Seat Reservation & Booking
3. ✅ Wallet Management

### Short-term (Week 4-6): Real-time & Admin Basics
4. ✅ Real-Time Tracking
5. ✅ Fleet Management
6. ✅ Route & Stop Management

### Medium-term (Week 7-10): Admin Advanced
7. ✅ Trip Scheduling (Admin)
8. ✅ Admin Dashboard
9. ✅ Notification Center

### Long-term (Week 11-13): Polish & Reports
10. ✅ Reporting & Exports
11. ✅ UX Enhancements
12. ✅ Performance Optimization
13. ✅ Testing

---

## Technical Stack & Dependencies

### Required npm packages:
```json
{
  "dependencies": {
    "@googlemaps/js-api-loader": "^1.16.2",
    "socket.io-client": "^4.6.0",
    "recharts": "^2.5.0",
    "date-fns": "^3.0.0",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "vitest": "^1.0.0",
    "msw": "^2.0.0"
  }
}
```

### State Management Structure:
```
src/store/
├── slices/
│   ├── authSlice.ts ✅ (existing)
│   ├── tripSlice.ts
│   ├── reservationSlice.ts
│   ├── seatHoldSlice.ts
│   ├── walletSlice.ts
│   ├── trackingSlice.ts
│   ├── busSlice.ts
│   ├── driverSlice.ts
│   ├── routeSlice.ts
│   ├── stopSlice.ts
│   ├── notificationSlice.ts
│   ├── adminDashboardSlice.ts
│   └── reportingSlice.ts
└── index.ts
```

---

## API Integration Notes

### Authentication
- JWT tokens stored in localStorage
- Axios interceptor for token injection
- Refresh token mechanism
- Tenant isolation via `tenantId` in user context

### WebSocket Connection
```typescript
// Socket.IO client setup
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/tracking', {
  auth: {
    token: getAuthToken(),
    userId: getUserId(),
    tenantId: getTenantId()
  }
});
```

### Idempotency Keys
- Generate UUID for booking confirmation requests
- Store in local state to prevent duplicate submissions
- Required header: `Idempotency-Key: <uuid>`

---

## Design System & UI Components

### Shadcn/ui Components to Use:
- ✅ Card, Button, Input (already available)
- ✅ Dialog, Sheet, Popover
- ✅ Table, Badge, Avatar
- ✅ Select, Checkbox, Radio
- ✅ Tabs, Accordion, Alert
- ✅ Toast, Skeleton
- ✅ Progress, Separator

### Custom Components to Build:
- `SeatMap` - Interactive seat picker
- `TripCard` - Trip preview card
- `RouteMap` - Google Maps integration
- `LiveTrackingMap` - Real-time tracking map
- `KPICard` - Dashboard metric card
- `HoldTimer` - Countdown timer

---

## Next Steps

1. **Review this plan** with the team
2. **Set up project structure** for new modules
3. **Create Redux slices** for state management
4. **Build API client wrappers** extending `BaseApi`
5. **Start with Phase 1.1** - Trip Discovery & Browsing

---

## Estimated Total Timeline
- **Phase 1 (Core Rider):** 3 weeks
- **Phase 2 (Admin Features):** 4 weeks
- **Phase 3 (Enhanced Features):** 2 weeks
- **Phase 4 (Polish):** 2 weeks

**Total:** ~11-13 weeks for full implementation

---

## Questions & Decisions Needed

1. **Google Maps API Key** - Need to set up billing and get API key
2. **Payment Gateway** - Which provider? (M-Pesa, Stripe?)
3. **Push Notifications** - Firebase Cloud Messaging setup
4. **Image Assets** - Bus icons, route markers, etc.
5. **Environment Variables** - API URL, WebSocket URL, Maps key
6. **Multi-language Support** - English/Swahili?

---

Generated: November 9, 2025

