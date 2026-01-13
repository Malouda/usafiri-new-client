import { Stop } from "./stop.interface";

export type { Stop };

export interface RouteStop {
  id: string;
  routeId: string;
  stopId: string;
  sequence: number;
  estimatedDurationMinutes?: number;
  createdAt: string;
  updatedAt: string;
  stop?: Stop;
}

export interface Route {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  routeStops?: RouteStop[];
}

export interface RouteStopDto {
  stopId: string;
  sequence: number;
  estimatedDurationMinutes?: number;
}

export interface CreateRouteDto {
  description?: string;
  stops: RouteStopDto[];
}

export interface UpdateRouteDto {
  description?: string;
  isActive?: boolean;
  stops?: RouteStopDto[];
}

export interface RouteFilters {
  isActive?: boolean;
}

export interface PaginatedRoutesResponse {
  data: Route[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

