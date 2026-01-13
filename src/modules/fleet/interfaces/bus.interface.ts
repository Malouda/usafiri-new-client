import { SeatLayout } from './seat-layout.interface';

export enum BusStatus {
  ACTIVE = 'ACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE',
}

export interface Bus {
  id: string;
  tenantId: string;
  plateNumber: string;
  makeId?: string;
  modelId?: string;
  numberOfSeats: number;
  status: BusStatus;
  metadata?: Record<string, any>;
  seatLayout?: SeatLayout;
  createdAt: string;
  updatedAt: string;
  makeEntity?: {
    id: string;
    name: string;
    country?: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  };
  modelEntity?: {
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
  };
}

export interface CreateBusDto {
  plateNumber: string;
  makeId: string;
  modelId: string;
  numberOfSeats: number;
  metadata?: Record<string, any>;
}

export interface UpdateBusDto {
  plateNumber?: string;
  makeId?: string;
  modelId?: string;
  numberOfSeats?: number;
  status?: BusStatus;
  metadata?: Record<string, any>;
}

export interface BusFilters {
  status?: BusStatus;
}

export interface PaginatedBusesResponse {
  data: Bus[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

