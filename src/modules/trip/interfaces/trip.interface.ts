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
  PRIVATE = 'PRIVATE',
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
  isActive?: boolean;
}

export interface RouteStop {
  id: string;
  routeId: string;
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
}

export interface CreateNonRepeatingTripDto {
  routeId: string;
  busId: string;
  startDate: string;
  endDate: string;
  morningDepartureTime: string;
  morningArrivalTime?: string;
  eveningDepartureTime: string;
  eveningArrivalTime?: string;
  pricePerDayCents: number;
  visibility?: TripVisibility;
  includeWeekends?: boolean;
  metadata?: Record<string, any>;
}

export interface TimeSlot {
  departureTime: string;
  arrivalTime?: string;
}

export interface OperatingDay {
  day: string; // e.g., 'MONDAY', 'TUESDAY', etc.
  timeSlots: TimeSlot[];
}

export interface CreateRepeatingTripDto {
  routeId: string;
  busId: string;
  startDate: string;
  endDate: string;
  operatingDays: OperatingDay[]; // Array of days with their specific time slots
  pricePerDayCents: number;
  visibility?: TripVisibility;
  metadata?: Record<string, any>;
}

export interface TripState {
  trips: Trip[];
  selectedTrip: Trip | null;
  filters: TripFilters;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

