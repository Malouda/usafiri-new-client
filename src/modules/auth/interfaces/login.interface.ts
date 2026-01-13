import type { User } from "../../shared/interfaces";

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
