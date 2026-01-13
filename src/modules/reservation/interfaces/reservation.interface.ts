export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED'
}

export interface Reservation {
  id: string;
  riderId: string;
  tenantId: string;
  tripId: string;
  holdToken?: string;
  status: ReservationStatus;
  
  // Seat information
  seatNumbers: number[];
  seatCount: number;
  
  // Pricing
  totalAmount: number;
  totalAmountCents: number;
  platformFee: number;
  platformFeeCents: number;
  currency: string;
  
  // Passenger info
  passengerNames?: string[];
  passengerPhones?: string[];
  
  // Dates (for repeating trips)
  selectedDates?: string[];
  
  // Session info (for non-repeating trips)
  sessionId?: string;
  sessionType?: 'MORNING' | 'EVENING';
  sessionDate?: string;
  
  // Slot info (for repeating trips)
  slotId?: string;
  
  // Cancellation
  cancelledAt?: string;
  cancellationReason?: string;
  refundAmount?: number;
  refundAmountCents?: number;
  
  // Relations
  trip?: any; // Trip interface from trip module
  rider?: any; // User interface
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface SeatHold {
  holdToken: string;
  tripId: string;
  riderId: string;
  seatNumbers: number[];
  selectedDates?: string[];
  sessionId?: string;
  slotId?: string;
  expiresAt: string;
  createdAt: string;
}

export interface CreateSeatHoldRequest {
  tripId: string;
  seatNumbers: number[];
  selectedDates?: string[]; // For repeating trips
  sessionId?: string; // For non-repeating trips
  slotId?: string; // For repeating trips
}

export interface ConfirmReservationRequest {
  holdToken: string;
  passengerNames?: string[];
  passengerPhones?: string[];
}

export interface CancelReservationRequest {
  reservationId: string;
  reason?: string;
}

export interface ReservationFilters {
  status?: ReservationStatus;
  tripId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ReservationState {
  reservations: Reservation[];
  selectedReservation: Reservation | null;
  currentHold: SeatHold | null;
  filters: ReservationFilters;
  loading: boolean;
  error: string | null;
  holdTimeRemaining: number; // seconds
}

export interface PassengerManifest {
  tripId: string;
  sessionId?: string;
  slotId?: string;
  date: string;
  passengers: {
    reservationId: string;
    riderName: string;
    riderPhone: string;
    seatNumbers: number[];
    passengerNames?: string[];
    status: ReservationStatus;
  }[];
  totalPassengers: number;
  totalSeats: number;
}

