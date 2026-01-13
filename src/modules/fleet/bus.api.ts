import { BaseApi } from "../../api/base.api";
import { Bus, CreateBusDto, UpdateBusDto, BusFilters, PaginatedBusesResponse } from "./interfaces/bus.interface";
import { SeatLayout, SeatLayoutResponse } from "./interfaces/seat-layout.interface";

/**
 * Bus API
 * Handles all bus-related API calls
 */
class BusApi extends BaseApi {
  constructor() {
    super("/buses");
  }

  /**
   * Get all buses with optional filters
   */
  async getAll(filters?: BusFilters): Promise<Bus[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    
    const query = params.toString();
    return this.get<Bus[]>(query ? `?${query}` : "");
  }

  /**
   * Get paginated buses with optional filters
   */
  async getAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: BusFilters
  ): Promise<PaginatedBusesResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.status) params.append('status', filters.status);
    
    const query = params.toString();
    return this.get<PaginatedBusesResponse>(`/paginated?${query}`);
  }

  /**
   * Get bus by ID
   */
  async getById(id: string): Promise<Bus> {
    return this.get<Bus>(`/${id}`);
  }

  /**
   * Create a new bus
   */
  async create(data: CreateBusDto): Promise<Bus> {
    return this.post<Bus, CreateBusDto>("", data);
  }

  /**
   * Update a bus
   */
  async update(id: string, data: UpdateBusDto): Promise<Bus> {
    return this.put<Bus, UpdateBusDto>(`/${id}`, data);
  }

  /**
   * Delete a bus
   */
  async deleteBus(id: string): Promise<void> {
    return this.delete<void>(`/${id}`);
  }

  /**
   * Get seat layout for a bus
   */
  async getSeatLayout(id: string): Promise<SeatLayout | null> {
    try {
      const response = await this.get<SeatLayoutResponse>(`/${id}/seat-layout`);
      return response.seatLayout;
    } catch (error: any) {
      // Return null if layout doesn't exist (404)
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Set seat layout for a bus
   */
  async setSeatLayout(id: string, layout: SeatLayout): Promise<Bus> {
    return this.put<Bus, SeatLayout>(`/${id}/seat-layout`, layout);
  }

  /**
   * Delete seat layout for a bus
   */
  async deleteSeatLayout(id: string): Promise<Bus> {
    return this.delete<Bus>(`/${id}/seat-layout`);
  }
}

export const busApi = new BusApi();

