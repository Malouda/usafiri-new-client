import { BaseApi } from "../../api/base.api";
import {
  Route,
  CreateRouteDto,
  UpdateRouteDto,
  RouteFilters,
  PaginatedRoutesResponse,
} from "./interfaces/route.interface";

/**
 * Route API
 * Handles all route-related API calls
 */
class RouteApi extends BaseApi {
  constructor() {
    super("/routes");
  }

  /**
   * Get all routes (non-paginated)
   */
  async getAll(filters?: RouteFilters): Promise<Route[]> {
    const params = new URLSearchParams();
    if (filters?.isActive !== undefined) {
      params.append("includeInactive", String(!filters.isActive));
    }
    const query = params.toString();
    return this.get<Route[]>(query ? `?${query}` : "");
  }

  /**
   * Get paginated routes
   */
  async getAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: RouteFilters
  ): Promise<PaginatedRoutesResponse> {
    const params = new URLSearchParams();
    params.append("page", String(page));
    params.append("limit", String(limit));
    if (filters?.isActive !== undefined) {
      params.append("includeInactive", String(!filters.isActive));
    }
    return this.get<PaginatedRoutesResponse>(`/paginated?${params.toString()}`);
  }

  /**
   * Get route by ID
   */
  async getById(id: string): Promise<Route> {
    return this.get<Route>(`/${id}`);
  }

  /**
   * Create a new route
   */
  async create(data: CreateRouteDto): Promise<Route> {
    return this.post<Route, CreateRouteDto>("", data);
  }

  /**
   * Update a route
   */
  async update(id: string, data: UpdateRouteDto): Promise<Route> {
    return this.put<Route, UpdateRouteDto>(`/${id}`, data);
  }

  /**
   * Delete a route
   */
  async deleteRoute(id: string): Promise<void> {
    return this.delete<void>(`/${id}`);
  }
}

export const routeApi = new RouteApi();

