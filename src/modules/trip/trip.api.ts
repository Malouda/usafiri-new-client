import { BaseApi } from "../../api/base.api";
import { Trip, TripFilters, CreateNonRepeatingTripDto, CreateRepeatingTripDto } from "./interfaces/trip.interface";

/**
 * Trip API
 * Handles all trip-related API calls
 */
class TripApi extends BaseApi {
  constructor() {
    super("/trips");
  }

  /**
   * Get all trips with optional filters
   */
  async getAll(filters?: TripFilters): Promise<Trip[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.tripType) params.append('tripType', filters.tripType);
    if (filters?.visibility) params.append('visibility', filters.visibility);
    
    const query = params.toString();
    return this.get<Trip[]>(query ? `?${query}` : "");
  }

  /**
   * Get paginated trips with optional filters
   */
  async getAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: TripFilters
  ): Promise<{ data: Trip[]; total: number; page: number; limit: number; totalPages: number }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.tripType) params.append('tripType', filters.tripType);
    if (filters?.visibility) params.append('visibility', filters.visibility);
    
    const query = params.toString();
    return this.get<{ data: Trip[]; total: number; page: number; limit: number; totalPages: number }>(
      `/paginated?${query}`
    );
  }

  /**
   * Get trip by ID with full details
   */
  async getById(id: string): Promise<Trip> {
    return this.get<Trip>(`/${id}`);
  }

  /**
   * Get invite link for LINK_ONLY trips
   */
  async getInviteLink(id: string): Promise<{ inviteLink: string }> {
    return this.get<{ inviteLink: string }>(`/${id}/invite-link`);
  }

  /**
   * Create non-repeating trip (daily work shuttle)
   */
  async createNonRepeating(data: CreateNonRepeatingTripDto): Promise<Trip> {
    return this.post<Trip, CreateNonRepeatingTripDto>("/non-repeating", data);
  }

  /**
   * Create repeating trip (flexible one-way shuttle)
   */
  async createRepeating(data: CreateRepeatingTripDto): Promise<Trip> {
    return this.post<Trip, CreateRepeatingTripDto>("/repeating", data);
  }
}

export const tripApi = new TripApi();
