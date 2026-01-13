import { BaseApi } from "../../api/base.api";
import { Make, CreateMakeDto, UpdateMakeDto, PaginatedMakesResponse } from "./interfaces/make.interface";

/**
 * Make API
 * Handles all make-related API calls
 */
class MakeApi extends BaseApi {
  constructor() {
    super("/makes");
  }

  /**
   * Get all makes
   */
  async getAll(): Promise<Make[]> {
    return this.get<Make[]>("");
  }

  /**
   * Get paginated makes
   */
  async getAllPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedMakesResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    
    const query = params.toString();
    return this.get<PaginatedMakesResponse>(`/paginated?${query}`);
  }

  /**
   * Get make by ID
   */
  async getById(id: string): Promise<Make> {
    return this.get<Make>(`/${id}`);
  }

  /**
   * Create a new make
   */
  async create(data: CreateMakeDto): Promise<Make> {
    return this.post<Make, CreateMakeDto>("", data);
  }

  /**
   * Update a make
   */
  async update(id: string, data: UpdateMakeDto): Promise<Make> {
    return this.put<Make, UpdateMakeDto>(`/${id}`, data);
  }

  /**
   * Delete a make
   */
  async deleteMake(id: string): Promise<void> {
    return this.delete<void>(`/${id}`);
  }
}

export const makeApi = new MakeApi();

