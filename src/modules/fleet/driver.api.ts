import { BaseApi } from "../../api/base.api";
import { Driver, CreateDriverDto, UpdateDriverDto, PaginatedDriversResponse } from "./interfaces/driver.interface";

/**
 * Driver API
 * Handles all driver-related API calls
 */
class DriverApi extends BaseApi {
  constructor() {
    super("/drivers");
  }

  /**
   * Get all drivers
   */
  async getAll(): Promise<Driver[]> {
    return this.get<Driver[]>("");
  }

  /**
   * Get paginated drivers
   */
  async getAllPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedDriversResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const query = params.toString();
    return this.get<PaginatedDriversResponse>(`/paginated?${query}`);
  }

  /**
   * Get driver by ID
   */
  async getById(id: string): Promise<Driver> {
    return this.get<Driver>(`/${id}`);
  }

  /**
   * Create a new driver
   */
  async create(data: CreateDriverDto): Promise<Driver> {
    return this.post<Driver, CreateDriverDto>("", data);
  }

  /**
   * Update a driver
   */
  async update(id: string, data: UpdateDriverDto): Promise<Driver> {
    return this.put<Driver, UpdateDriverDto>(`/${id}`, data);
  }

  /**
   * Delete/deactivate a driver
   */
  async deleteDriver(id: string): Promise<void> {
    return this.delete<void>(`/${id}`);
  }
}

export const driverApi = new DriverApi();

