import { BaseApi } from "../../api/base.api";
import { Model, CreateModelDto, UpdateModelDto, ModelFilters, PaginatedModelsResponse } from "./interfaces/model.interface";

/**
 * Model API
 * Handles all model-related API calls
 */
class ModelApi extends BaseApi {
  constructor() {
    super("/models");
  }

  /**
   * Get all models with optional filters
   */
  async getAll(filters?: ModelFilters): Promise<Model[]> {
    const params = new URLSearchParams();
    if (filters?.makeId) params.append('makeId', filters.makeId);
    
    const query = params.toString();
    return this.get<Model[]>(query ? `?${query}` : "");
  }

  /**
   * Get paginated models with optional filters
   */
  async getAllPaginated(
    page: number = 1,
    limit: number = 10,
    filters?: ModelFilters
  ): Promise<PaginatedModelsResponse> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (filters?.makeId) params.append('makeId', filters.makeId);
    
    const query = params.toString();
    return this.get<PaginatedModelsResponse>(`/paginated?${query}`);
  }

  /**
   * Get model by ID
   */
  async getById(id: string): Promise<Model> {
    return this.get<Model>(`/${id}`);
  }

  /**
   * Create a new model
   */
  async create(data: CreateModelDto): Promise<Model> {
    return this.post<Model, CreateModelDto>("", data);
  }

  /**
   * Update a model
   */
  async update(id: string, data: UpdateModelDto): Promise<Model> {
    return this.put<Model, UpdateModelDto>(`/${id}`, data);
  }

  /**
   * Delete a model
   */
  async deleteModel(id: string): Promise<void> {
    return this.delete<void>(`/${id}`);
  }
}

export const modelApi = new ModelApi();

