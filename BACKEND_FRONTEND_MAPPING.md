# Backend → Frontend Feature Mapping

Quick reference guide showing which backend modules need frontend implementation.

---

## 📊 Implementation Status Overview

| Backend Module | Backend Status | Frontend Status | Priority | Estimated Days |
|----------------|---------------|-----------------|----------|----------------|
| **Auth** | ✅ Complete | ✅ Complete | - | Done |
| **Trips** | ✅ Complete | 🔴 Not Started | P1 | 5-7 |
| **Reservations** | ✅ Complete | 🔴 Not Started | P1 | 7-10 |
| **Wallet** | ✅ Complete | 🔴 Not Started | P1 | 3-4 |
| **Tracking** | ✅ Complete | 🔴 Not Started | P1 | 5-7 |
| **Fleet** | ✅ Complete | 🔴 Not Started | P2 | 6-8 |
| **Routes** | ✅ Complete | 🔴 Not Started | P2 | 5-7 |
| **Admin Dashboard** | ✅ Complete | 🔴 Not Started | P2 | 5-7 |
| **Notifications** | ✅ Complete | 🔴 Not Started | P3 | 4-5 |
| **Reporting** | ✅ Complete | 🔴 Not Started | P3 | 5-6 |

**Legend:**
- ✅ Complete | 🟡 In Progress | 🔴 Not Started
- P1 = Priority 1 (Critical) | P2 = Priority 2 (Important) | P3 = Priority 3 (Nice-to-have)

---

## 🎯 Module Details

### 1. Authentication Module ✅

**Backend Endpoints:**
```
✅ POST /auth/login
✅ POST /auth/register/rider
✅ POST /auth/register/tenant
✅ POST /auth/verify-otp
✅ POST /auth/refresh
✅ POST /auth/logout
✅ POST /auth/forgot-password
✅ POST /auth/reset-password
```

**Frontend Status:** ✅ **COMPLETE**
- Login page with form validation
- Rider registration
- Tenant registration
- OTP verification
- Redux state management
- JWT token handling
- Protected routes

---

### 2. Trip Module 🔴

**Backend Endpoints:**
```
🔴 GET /trips - List trips with filters
🔴 GET /trips/:id - Get trip details
🔴 POST /trips/non-repeating - Create NR trip (Admin)
🔴 POST /trips/repeating - Create RT trip (Admin)
🔴 PUT /trips/:id - Update trip (Admin)
🔴 POST /trips/:id/publish - Publish trip (Admin)
🔴 GET /trips/:id/invite-link - Get invite link
```

**Frontend Needed:**

**Rider Side:**
- [ ] Trip browsing page with filters
- [ ] Trip detail view
- [ ] Route map visualization
- [ ] Trip search functionality

**Admin Side:**
- [ ] Create trip wizard (NR/RT)
- [ ] Trip management table
- [ ] Edit/Update trip forms
- [ ] Publish workflow
- [ ] Trip analytics

**Key Components:**
- `TripCard`, `TripList`, `TripDetails`
- `TripFilters`, `RouteMap`
- `CreateTripWizard`, `TripManagementTable`

**Redux:** `tripSlice` with async thunks

---

### 3. Reservation Module 🔴

**Backend Endpoints:**
```
🔴 POST /seat-holds - Create seat hold
🔴 GET /seat-holds/:token - Get hold details
🔴 DELETE /seat-holds/:token - Release hold
🔴 POST /reservations/confirm - Confirm booking (Idempotency-Key required)
🔴 GET /reservations - List reservations
🔴 GET /reservations/:id - Get reservation details
🔴 POST /cancellations - Cancel reservation
🔴 GET /reservations/manifest - Get manifest (Driver/Admin)
```

**Frontend Needed:**

**Rider Side:**
- [ ] Interactive seat selection map
- [ ] Hold timer with countdown (3 minutes)
- [ ] Booking checkout flow
- [ ] My Reservations page
- [ ] Reservation detail view
- [ ] Cancellation flow with refund info

**Admin/Driver Side:**
- [ ] Passenger manifest view
- [ ] Booking management

**Key Components:**
- `SeatMap`, `SeatPicker`
- `HoldTimer`, `BookingCheckout`
- `ReservationList`, `ReservationCard`
- `CancellationModal`, `ManifestView`

**Redux:** `reservationSlice`, `seatHoldSlice`

**Special Handling:**
- Idempotency key generation (UUID)
- Hold timer management
- Real-time seat availability updates

---

### 4. Wallet Module 🔴

**Backend Endpoints:**
```
🔴 GET /wallets/balance - Get wallet balance
🔴 GET /wallets/history - Get transaction history (paginated)
```

**Frontend Needed:**
- [ ] Wallet dashboard
- [ ] Balance display
- [ ] Transaction history with filters
- [ ] Pagination for history
- [ ] Top-up flow (stubbed for Phase 1)

**Key Components:**
- `WalletDashboard`, `WalletBalance`
- `TransactionHistory`, `TransactionItem`
- `TopUpModal`

**Redux:** `walletSlice`

---

### 5. Tracking Module 🔴

**Backend WebSocket (Namespace: `/tracking`):**

**Events Client → Server:**
```
🔴 rider:subscribe - Join tracking room
🔴 rider:unsubscribe - Leave tracking room
🔴 rider:get-location - Get current location
🔴 rider:subscribe-stop-eta - Subscribe to stop ETA
🔴 rider:refresh-eta - Manually refresh ETA
```

**Events Server → Client:**
```
🔴 trip:gps-update - Real-time GPS updates
🔴 stop-eta-update - ETA updates
🔴 room:joined - Subscription confirmation
🔴 room:left - Unsubscription confirmation
🔴 room:closed - Trip ended
```

**Frontend Needed:**
- [ ] Socket.IO client setup
- [ ] WebSocket connection management
- [ ] Live tracking map with real-time updates
- [ ] Bus marker animation
- [ ] ETA display for stops
- [ ] Manual refresh button
- [ ] Connection status indicator

**Key Components:**
- `LiveTrackingMap`, `BusMarker`, `StopMarker`
- `ETADisplay`, `TrackingControls`
- WebSocket middleware for Redux

**Redux:** `trackingSlice` with WebSocket middleware

**Google Maps Integration:** Required for map display

---

### 6. Fleet Module 🔴

**Backend Endpoints:**

**Buses:**
```
🔴 GET /buses - List buses
🔴 POST /buses - Create bus
🔴 GET /buses/:id - Get bus details
🔴 PUT /buses/:id - Update bus
🔴 DELETE /buses/:id - Delete bus
🔴 POST /buses/assign-driver - Assign driver
🔴 GET /buses/assignments/current - Current assignments
🔴 GET /buses/:id/assignments - Assignment history
```

**Drivers:**
```
🔴 GET /drivers - List drivers
🔴 POST /drivers - Create driver
🔴 GET /drivers/:id - Get driver details
🔴 PUT /drivers/:id - Update driver
🔴 DELETE /drivers/:id - Delete driver
```

**Frontend Needed:**

**Admin Only:**
- [ ] Bus management (CRUD)
- [ ] Driver management (CRUD)
- [ ] Driver-bus assignment
- [ ] Assignment history view
- [ ] Fleet status dashboard

**Key Components:**
- `BusList`, `BusForm`, `BusCard`
- `DriverList`, `DriverForm`, `DriverCard`
- `AssignDriverModal`, `AssignmentHistory`

**Redux:** `busSlice`, `driverSlice`

---

### 7. Routes Module 🔴

**Backend Endpoints:**
```
🔴 GET /routes - List routes
🔴 POST /routes - Create route
🔴 GET /routes/:id - Get route details
🔴 PUT /routes/:id - Update route
🔴 DELETE /routes/:id - Delete route (soft)

🔴 GET /stops - List stops
🔴 POST /stops - Create stop
🔴 PUT /stops/:id - Update stop
🔴 DELETE /stops/:id - Delete stop
```

**Frontend Needed:**

**Admin Side:**
- [ ] Route management (CRUD)
- [ ] Stop management (CRUD)
- [ ] Stop sequencing with drag-and-drop
- [ ] Route visualization on map
- [ ] Auto-generated route names

**Rider Side:**
- [ ] View routes (read-only)
- [ ] Route details with stops

**Key Components:**
- `RouteList`, `RouteForm`
- `StopManager` (with drag-and-drop)
- `RouteVisualization` (map)

**Redux:** `routeSlice`, `stopSlice`

---

### 8. Admin Dashboard Module 🔴

**Backend Endpoints:**
```
🔴 GET /admin/dashboard - Dashboard KPIs
🔴 GET /admin/dashboard/activity - Recent activity
🔴 GET /admin/dashboard/fleet - Fleet utilization
🔴 GET /admin/dashboard/routes - Route performance
```

**Frontend Needed:**

**Admin Only:**
- [ ] Dashboard overview with KPIs
  - Users (total, active, by role, new)
  - Trips (total, active, completed, avg occupancy)
  - Bookings (total, cancellation rate)
  - Revenue (total, platform fees, tenant earnings)
  - Wallets (total balance, active wallets)
- [ ] Activity feed
- [ ] Fleet utilization charts
- [ ] Route performance charts

**Key Components:**
- `AdminDashboard`, `KPICard`
- `ActivityFeed`, `FleetUtilizationChart`
- `RoutePerformanceChart`, `RevenueChart`

**Redux:** `adminDashboardSlice`

**Charts:** Use `recharts` library

---

### 9. Notification Module 🔴

**Backend Endpoints:**
```
🔴 POST /notifications/send - Send notification
🔴 GET /notifications/history - Notification history
🔴 GET /notifications/preferences - Get preferences
🔴 POST /notifications/preferences/channels - Update channels
🔴 POST /notifications/preferences/device-tokens - Update tokens
🔴 POST /notifications/preferences/quiet-hours - Configure quiet hours
🔴 POST /notifications/:id/retry - Retry failed notification
```

**Frontend Needed:**
- [ ] Notification center/inbox
- [ ] Notification badge with count
- [ ] Mark as read/unread
- [ ] Notification preferences page
- [ ] Device token management (FCM/APNS)
- [ ] Quiet hours configuration
- [ ] Real-time push notifications

**Key Components:**
- `NotificationCenter`, `NotificationList`
- `NotificationBadge`, `NotificationPreferences`

**Redux:** `notificationSlice`

**Push Notifications:** Firebase Cloud Messaging integration

---

### 10. Reporting Module 🔴

**Backend Endpoints:**
```
🔴 POST /reports/generate - Generate report
🔴 GET /reports/:id - Get report
🔴 GET /reports/:id/export - Export report (CSV/Excel)
🔴 GET /analytics/revenue - Revenue analytics
🔴 GET /analytics/trips - Trip analytics
```

**Frontend Needed:**

**Admin Only:**
- [ ] Report generator with filters
- [ ] Report list/history
- [ ] Export to CSV/Excel
- [ ] Revenue analytics dashboard
- [ ] Trip analytics dashboard
- [ ] Custom date range selection

**Key Components:**
- `ReportGenerator`, `ReportList`
- `AnalyticsDashboard`, `RevenueChart`, `TripChart`

**Redux:** `reportingSlice`

---

## 📈 Implementation Roadmap

### Phase 1: Core Rider Features (Weeks 1-3)
**Goal:** Enable riders to browse trips, book seats, and track shuttles

```
Week 1: Trip Discovery
  ├── Trip browsing
  ├── Trip details
  └── Route visualization

Week 2-3: Booking Flow
  ├── Seat selection
  ├── Hold timer
  ├── Checkout
  ├── My reservations
  └── Wallet integration
```

### Phase 2: Admin Essentials (Weeks 4-7)
**Goal:** Enable admins to manage fleet, routes, and trips

```
Week 4-5: Fleet & Routes
  ├── Bus management
  ├── Driver management
  ├── Route management
  └── Stop management

Week 6-7: Trip Management & Dashboard
  ├── Create trips (NR/RT)
  ├── Trip management
  ├── Admin dashboard
  └── KPIs and analytics
```

### Phase 3: Real-time & Notifications (Weeks 8-9)
**Goal:** Add real-time tracking and communication

```
Week 8: Tracking
  ├── WebSocket setup
  ├── Live tracking map
  ├── ETA updates
  └── Connection handling

Week 9: Notifications
  ├── Notification center
  ├── Preferences
  ├── Push notifications
  └── Real-time updates
```

### Phase 4: Reports & Polish (Weeks 10-13)
**Goal:** Complete feature set and optimize

```
Week 10-11: Reporting
  ├── Report generation
  ├── Analytics dashboards
  └── Exports

Week 12-13: Polish
  ├── UX improvements
  ├── Performance optimization
  └── Testing
```

---

## 🔗 API Integration Checklist

### For Each Module:

1. **Define Interfaces** (`*.interface.ts`)
   - Match backend DTOs
   - Include enums from backend
   - Add frontend-specific types

2. **Create API Client** (`*.api.ts`)
   - Extend `BaseApi`
   - Implement all endpoints
   - Handle errors properly

3. **Create Redux Slice** (`*Slice.ts`)
   - Define state interface
   - Create async thunks
   - Handle loading/error states

4. **Create Custom Hooks** (`use*.ts`)
   - Encapsulate Redux logic
   - Provide clean API for components

5. **Build Components**
   - Use Shadcn/ui for base components
   - Follow design system
   - Add proper TypeScript types

6. **Add Tests**
   - Unit tests for slices
   - Component tests
   - Integration tests for flows

---

## 🚦 Current Priorities (Next Sprint)

1. **Trip Module** - Highest priority for rider experience
2. **Reservation Module** - Critical for business value
3. **Wallet Module** - Required for bookings
4. **Tracking Module** - Key differentiator

**Target:** Complete Phase 1 in 3 weeks

---

## 📋 Dependencies Map

```
Trip Module
  └─ requires: Route Module (read-only), Bus Module (read-only)

Reservation Module
  └─ requires: Trip Module, Wallet Module, Seat Hold logic

Wallet Module
  └─ standalone (no dependencies)

Tracking Module
  └─ requires: Trip Module, Reservation Module (for access control)

Fleet Module
  └─ standalone (admin only)

Routes Module
  └─ standalone (admin create, rider view)

Admin Dashboard
  └─ requires: all modules (read-only aggregations)

Notifications
  └─ integrates with: all modules (cross-cutting)

Reporting
  └─ requires: all modules (data aggregation)
```

---

## 🎓 Skills Required Per Module

| Module | React | TypeScript | Redux | WebSocket | Maps | Charts |
|--------|-------|-----------|-------|-----------|------|--------|
| Trips | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | - | ⭐⭐ | - |
| Reservations | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | - |
| Wallet | ⭐⭐ | ⭐⭐ | ⭐⭐ | - | - | - |
| Tracking | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | - |
| Fleet | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | - | - | - |
| Routes | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | - | ⭐⭐⭐ | - |
| Dashboard | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | - | - | ⭐⭐⭐⭐ |
| Notifications | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ | - | - |
| Reporting | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | - | - | ⭐⭐⭐⭐ |

**Legend:** ⭐ = Basic, ⭐⭐ = Intermediate, ⭐⭐⭐ = Advanced, ⭐⭐⭐⭐ = Expert

---

**Last Updated:** November 9, 2025

