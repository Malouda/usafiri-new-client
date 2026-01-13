export enum UserRole {
  SUPER_ADMIN = "super_admin",
  STORE_OWNER = "store_owner",
  MANAGER = "manager",
  CASHIER = "cashier",
  SELLER = "seller",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  LOCKED = "locked",
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  preferredLanguage: "en" | "sw";
  status: UserStatus;
  profilePhotoUrl?: string;
  businessId?: string;
  lastLoginAt?: string;
  failedLoginAttempts: number;
  createdAt: string;
  updatedAt: string;
}
