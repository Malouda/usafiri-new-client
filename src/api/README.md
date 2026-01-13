# API Architecture

This directory contains the base API infrastructure that all module-specific APIs should extend.

## Structure

```
src/
├── api/
│   ├── base.api.ts       # BaseApi class with common HTTP methods
│   └── index.ts          # Exports for easy imports
├── api.ts                # Global axios instance with interceptors
└── modules/
    ├── auth/
    │   └── auth.api.ts   # Authentication API (extends BaseApi)
    ├── trip/
    │   └── trip.api.ts   # Trip API (extends BaseApi)
    └── reservation/
        └── reservation.api.ts  # Reservation API (extends BaseApi)
```

## BaseApi Class

The `BaseApi` class provides:
- Automatic URL building from base endpoint
- Common HTTP methods: `get`, `post`, `put`, `patch`, `delete`
- Access to global axios instance (with interceptors for auth, error handling, etc.)
- Type-safe request/response handling

## Creating a New Module API

### Step 1: Create the API file

Create a file `<module-name>.api.ts` in your module directory:

```typescript
// src/modules/your-module/your-module.api.ts
import { BaseApi } from "../../api/base.api";

// Define your interfaces
interface YourEntity {
  id: string;
  name: string;
  // ... other properties
}

interface CreateEntityRequest {
  name: string;
  // ... other properties
}

/**
 * Your Module API
 * Handles all your-module-related API calls
 */
class YourModuleApi extends BaseApi {
  constructor() {
    super("/your-endpoint"); // Base endpoint
  }

  /**
   * Get all entities
   */
  async getAll(): Promise<YourEntity[]> {
    return this.get<YourEntity[]>("");
  }

  /**
   * Get entity by ID
   */
  async getById(id: string): Promise<YourEntity> {
    return this.get<YourEntity>(\`\${id}\`);
  }

  /**
   * Create new entity
   */
  async create(payload: CreateEntityRequest): Promise<YourEntity> {
    return this.post<YourEntity, CreateEntityRequest>("", payload);
  }

  /**
   * Update entity
   */
  async update(id: string, payload: Partial<CreateEntityRequest>): Promise<YourEntity> {
    return this.put<YourEntity, Partial<CreateEntityRequest>>(\`\${id}\`, payload);
  }

  /**
   * Delete entity
   */
  async delete(id: string): Promise<void> {
    return this.delete<void>(\`\${id}\`);
  }

  /**
   * Custom endpoint example
   */
  async customAction(id: string, data: any): Promise<any> {
    return this.post(\`\${id}/custom-action\`, data);
  }
}

// Export singleton instance
export const yourModuleApi = new YourModuleApi();
```

### Step 2: Use in your components

```typescript
import { yourModuleApi } from './your-module.api';

// In your component or service
const entities = await yourModuleApi.getAll();
const entity = await yourModuleApi.getById('123');
const newEntity = await yourModuleApi.create({ name: 'Test' });
```

## Available HTTP Methods

### GET Request
```typescript
protected async get<T>(path: string = "", config?: AxiosRequestConfig): Promise<T>
```

### POST Request
```typescript
protected async post<T, D = any>(
  path: string = "",
  payload?: D,
  config?: AxiosRequestConfig
): Promise<T>
```

### PUT Request
```typescript
protected async put<T, D = any>(
  path: string = "",
  payload?: D,
  config?: AxiosRequestConfig
): Promise<T>
```

### PATCH Request
```typescript
protected async patch<T, D = any>(
  path: string = "",
  payload?: D,
  config?: AxiosRequestConfig
): Promise<T>
```

### DELETE Request
```typescript
protected async delete<T>(path: string = "", config?: AxiosRequestConfig): Promise<T>
```

## URL Building

The base endpoint is set in the constructor and automatically combined with paths:

```typescript
class MyApi extends BaseApi {
  constructor() {
    super("/my-module"); // Base: /my-module
  }

  async getUser(id: string) {
    return this.get<User>(\`users/\${id}\`); // Calls: /my-module/users/:id
  }

  async getAll() {
    return this.get<User[]>(""); // Calls: /my-module
  }
}
```

## Global Features (Inherited)

All module APIs automatically inherit:

1. **Authentication**: JWT token automatically added to requests
2. **Error Handling**: Global error interceptor with toast notifications
3. **Token Refresh**: Automatic token refresh handling
4. **Type Safety**: Full TypeScript support
5. **Request/Response Interceptors**: Centralized in `api.ts`

## Examples

### Auth API (Real Example)
```typescript
import { authApi } from '@/modules/auth/auth.api';

// Login
const response = await authApi.login({ phone: '+255712345678', password: 'pass' });

// Get profile
const user = await authApi.getProfile();

// Logout
await authApi.logout();
```

### Trip API (Example)
```typescript
import { tripApi } from '@/modules/trip/trip.api';

// Get all trips
const trips = await tripApi.getAll();

// Get specific trip
const trip = await tripApi.getById('123');

// Create trip
const newTrip = await tripApi.create({ name: 'New Trip' });

// Get trips by route
const routeTrips = await tripApi.getByRoute('route-123');
```

### Reservation API (Example)
```typescript
import { reservationApi } from '@/modules/reservation/reservation.api';

// Get my reservations
const myReservations = await reservationApi.getMyReservations();

// Create reservation
const reservation = await reservationApi.create({
  tripId: 'trip-123',
  seatIds: ['seat-1', 'seat-2']
});

// Cancel reservation
await reservationApi.cancel('reservation-123', { reason: 'Changed plans' });
```

## Benefits

1. **Consistency**: All APIs follow the same pattern
2. **Type Safety**: Full TypeScript support with generics
3. **Maintainability**: Changes to global behavior only need to be made once
4. **Testability**: Easy to mock for testing
5. **Reusability**: Common methods are inherited, no duplication
6. **Scalability**: Easy to add new modules

## Token Management

Token management is handled by the global API instance:

```typescript
import { setToken, removeToken, getToken } from '@/api';

// These are already used in auth.api.ts
setToken('your-token');
const token = getToken();
removeToken();
```

## Error Handling

Errors are automatically handled by the global interceptor in `api.ts`:
- 401: Logs user out and redirects to login
- 4xx/5xx: Shows toast notification with error message
- Network errors: Shows network error toast

You can also handle specific errors in your component:

```typescript
try {
  await yourModuleApi.create(data);
} catch (error) {
  // Custom error handling
  console.error('Failed to create:', error);
}
```
