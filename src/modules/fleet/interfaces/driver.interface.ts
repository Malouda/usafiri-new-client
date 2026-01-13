export enum UserRole {
  ADMIN = 'ADMIN',
  DRIVER = 'DRIVER',
  PASSENGER = 'PASSENGER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface Driver {
  id: string;
  tenantId: string;
  phone: string;
  email?: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  phoneVerified: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDriverDto {
  phone: string;
  email?: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateDriverDto {
  phone?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  status?: UserStatus;
}

export interface PaginatedDriversResponse {
  data: Driver[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

