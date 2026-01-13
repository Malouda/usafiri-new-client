export interface Make {
  id: string;
  name: string;
  country?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  models?: Array<{
    id: string;
    makeId: string;
    name: string;
    typicalSeats?: number;
    description?: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface CreateMakeDto {
  name: string;
  country?: string;
  description?: string;
}

export interface UpdateMakeDto {
  name?: string;
  country?: string;
  description?: string;
}

export interface PaginatedMakesResponse {
  data: Make[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

