export interface Stop {
  id: string;
  tenantId: string;
  name: string;
  latitude: number | string; // Can be string from DB decimal type
  longitude: number | string; // Can be string from DB decimal type
  description?: string;
  audioUrl?: string; // URL to pre-generated audio announcement (S3 URL)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStopDto {
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
}

export interface UpdateStopDto {
  name?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  isActive?: boolean;
}

export interface StopFilters {
  isActive?: boolean;
}

export interface PaginatedStopsResponse {
  data: Stop[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

