import { BaseApi } from "../../api/base.api";
import {
  Reservation,
  SeatHold,
  CreateSeatHoldRequest,
  ConfirmReservationRequest,
  CancelReservationRequest,
  ReservationFilters,
  PassengerManifest,
} from "./interfaces/reservation.interface";

/**
 * Reservation API
 * Handles all reservation-related API calls
 */
class ReservationApi extends BaseApi {
  constructor() {
    super("/reservations");
  }

  /**
   * Create a seat hold
   */
  async createSeatHold(data: CreateSeatHoldRequest): Promise<SeatHold> {
    return this.post<SeatHold, CreateSeatHoldRequest>("/seat-holds", data);
  }

  /**
   * Get seat hold details
   */
  async getSeatHold(holdToken: string): Promise<SeatHold> {
    return this.get<SeatHold>(`/seat-holds/${holdToken}`);
  }

  /**
   * Release a seat hold
   */
  async releaseSeatHold(holdToken: string): Promise<void> {
    return this.delete<void>(`/seat-holds/${holdToken}`);
  }

  /**
   * Confirm reservation (requires Idempotency-Key header)
   */
  async confirmReservation(
    data: ConfirmReservationRequest,
    idempotencyKey: string
  ): Promise<Reservation> {
    return this.post<Reservation, ConfirmReservationRequest>("/confirm", data, {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    });
  }

  /**
   * Get all reservations for current user
   */
  async getMyReservations(filters?: ReservationFilters): Promise<Reservation[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.tripId) params.append('tripId', filters.tripId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    const query = params.toString();
    return this.get<Reservation[]>(query ? `?${query}` : "");
  }

  /**
   * Get reservation by ID
   */
  async getById(id: string): Promise<Reservation> {
    return this.get<Reservation>(`/${id}`);
  }

  /**
   * Cancel reservation
   */
  async cancelReservation(data: CancelReservationRequest): Promise<Reservation> {
    return this.post<Reservation, CancelReservationRequest>("/cancellations", data);
  }

  /**
   * Get passenger manifest (Admin/Driver)
   */
  async getManifest(
    tripId: string,
    sessionId?: string,
    slotId?: string,
    date?: string
  ): Promise<PassengerManifest> {
    const params = new URLSearchParams();
    params.append('tripId', tripId);
    if (sessionId) params.append('sessionId', sessionId);
    if (slotId) params.append('slotId', slotId);
    if (date) params.append('date', date);
    
    return this.get<PassengerManifest>(`/manifest?${params.toString()}`);
  }
}

export const reservationApi = new ReservationApi();
