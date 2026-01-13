export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export interface RegisterResponse {
  message: string;
}

// Rider Registration
export interface RegisterRiderRequest {
  phone: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  tenantId?: string;
}

export interface RegisterRiderResponse {
  user: {
    id: string;
    phone: string;
    firstName: string;
    lastName: string;
    role: string;
    tenantId?: string;
  };
  otpSent: boolean;
  message: string;
}

// Tenant Registration
export interface RegisterTenantRequest {
  organizationName: string;
  adminFirstName: string;
  adminLastName: string;
  adminPhone: string;
  adminEmail?: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterTenantResponse {
  tenant: {
    id: string;
    name: string;
    slug?: string;
    status: string;
    tier: string;
  };
  admin: {
    id: string;
    phone: string;
    email?: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}
