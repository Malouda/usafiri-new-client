import { BaseApi } from "../../api/base.api";
import { Stop, CreateStopDto, UpdateStopDto, StopFilters, PaginatedStopsResponse } from "./interfaces";

/**
 * Stop API
 * Handles all stop-related API calls
 */
class StopApi extends BaseApi {
  constructor() {
    super("/stops");
  }

  /**
   * Get all stops (non-paginated)
   */
  async getAll(includeInactive: boolean = false): Promise<Stop[]> {
    const params = new URLSearchParams();
    if (includeInactive) {
      params.append("includeInactive", "true");
    }
    const query = params.toString();
    return this.get<Stop[]>(query ? `?${query}` : "");
  }

  /**
   * Get paginated stops
   */
  async getAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: StopFilters
  ): Promise<PaginatedStopsResponse> {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (filters?.isActive !== undefined) {
      params.append("includeInactive", String(!filters.isActive));
    }
    return this.get<PaginatedStopsResponse>(`/paginated?${params.toString()}`);
  }

  /**
   * Get stop by ID
   */
  async getById(id: string): Promise<Stop> {
    return this.get<Stop>(`/${id}`);
  }

  /**
   * Create a new stop
   */
  async create(data: CreateStopDto): Promise<Stop> {
    return this.post<Stop, CreateStopDto>("", data);
  }

  /**
   * Update a stop
   */
  async update(id: string, data: UpdateStopDto): Promise<Stop> {
    return this.put<Stop, UpdateStopDto>(`/${id}`, data);
  }

  /**
   * Delete a stop (deactivates it)
   */
  async deleteStop(id: string): Promise<void> {
    return this.delete<void>(`/${id}`);
  }

  /**
   * Generate audio announcement for a stop
   * Triggers audio generation via OpenAI TTS and uploads to S3
   */
  async generateAudio(id: string): Promise<{ message: string; stopId: string; stopName: string }> {
    return this.post<{ message: string; stopId: string; stopName: string }>(`/${id}/generate-audio`);
  }

  /**
   * Get presigned URL for stop audio file
   * Returns a temporary URL that expires after 1 hour for secure audio access
   */
  async getAudioUrl(id: string): Promise<{ presignedUrl: string; expiresIn: number }> {
    return this.get<{ presignedUrl: string; expiresIn: number }>(`/${id}/audio-url`);
  }

  /**
   * Delete audio file for a stop
   * Removes the audioUrl from the stop record
   */
  async deleteAudio(id: string): Promise<{ message: string }> {
    return this.delete<{ message: string }>(`/${id}/audio`);
  }

  /**
   * Get all stops for a specific trip
   * Returns stops in sequence order as defined in the trip's route
   */
  async getStopsForTrip(tripId: string): Promise<Stop[]> {
    return this.get<Stop[]>(`/trip/${tripId}`);
  }
}

export const stopApi = new StopApi();

