export interface Model {
  id: string;
  makeId: string;
  name: string;
  typicalSeats?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  make?: {
    id: string;
    name: string;
    country?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CreateModelDto {
  makeId: string;
  name: string;
  typicalSeats?: number;
  description?: string;
}

export interface UpdateModelDto {
  makeId?: string;
  name?: string;
  typicalSeats?: number;
  description?: string;
}

export interface ModelFilters {
  makeId?: string;
}

export interface PaginatedModelsResponse {
  data: Model[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

