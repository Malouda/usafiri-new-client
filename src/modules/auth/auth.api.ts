import { BaseApi } from "../../api/base.api";
import { removeToken, setToken } from "../../api";
import type { User } from "../shared/interfaces";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RegisterRiderRequest,
  RegisterRiderResponse,
  RegisterTenantRequest,
  RegisterTenantResponse
} from "./interfaces";

/**
 * Authentication API
 * Handles all authentication-related API calls
 */
class AuthApi extends BaseApi {
  constructor() {
    super("/auth");
  }

  /**
   * Login with phone and password
   */
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const data = await this.post<LoginResponse, LoginRequest>("login", payload);

    // Handle both camelCase (accessToken) and snake_case (access_token)
    const token = (data as any).accessToken
    if (token) {
      setToken(token);
    }

    return data;
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await this.post("logout");
    } finally {
      removeToken();
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return this.get<User>("profile");
  }

  /**
   * Refresh access token
   */
  async refresh(): Promise<{ access_token: string }> {
    const data = await this.post<{ access_token: string }>("refresh");

    // Handle both camelCase (accessToken) and snake_case (access_token)
    const token = (data as any).accessToken || data.access_token;
    if (token) {
      setToken(token);
    }

    return data;
  }

  /**
   * Register new user (generic registration)
   */
  async register(payload: RegisterRequest): Promise<RegisterResponse> {
    return this.post<RegisterResponse, RegisterRequest>("register", payload);
  }

  /**
   * Register new rider
   */
  async registerRider(payload: RegisterRiderRequest): Promise<RegisterRiderResponse> {
    // Remove confirmPassword as it's only for client-side validation
    const { confirmPassword, ...requestData } = payload;
    return this.post<RegisterRiderResponse, Omit<RegisterRiderRequest, 'confirmPassword'>>(
      "register-rider",
      requestData
    );
  }

  /**
   * Register new tenant organization
   */
  async registerTenant(payload: RegisterTenantRequest): Promise<RegisterTenantResponse> {
    // Remove confirmPassword as it's only for client-side validation
    const { confirmPassword, ...requestData } = payload;
    const data = await this.post<RegisterTenantResponse, Omit<RegisterTenantRequest, 'confirmPassword'>>(
      "tenants/register",
      requestData
    );

    // Handle both camelCase (accessToken) and snake_case (access_token)
    const token = data.accessToken || (data as any).access_token;
    if (token) {
      setToken(token);
    }

    return data;
  }
}

// Export singleton instance
export const authApi = new AuthApi();
