import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { api } from "../api";

/**
 * Base API class that all module APIs should extend
 * Provides common HTTP methods (GET, POST, PUT, PATCH, DELETE)
 * and access to the global axios instance with interceptors
 */
export class BaseApi {
  protected api: AxiosInstance;
  protected baseEndpoint: string;

  constructor(baseEndpoint: string) {
    this.api = api;
    this.baseEndpoint = baseEndpoint;
  }

  /**
   * Build full endpoint URL
   */
  protected buildUrl(path: string): string {
    const cleanBase = this.baseEndpoint.replace(/\/$/, "");
    const cleanPath = path.replace(/^\//, "");
    return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
  }

  /**
   * GET request
   */
  protected async get<T>(path: string = "", config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.api.get<T>(this.buildUrl(path), config);
    return data;
  }

  /**
   * POST request
   */
  protected async post<T, D = any>(
    path: string = "",
    payload?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const { data } = await this.api.post<T>(this.buildUrl(path), payload, config);
    return data;
  }

  /**
   * PUT request
   */
  protected async put<T, D = any>(
    path: string = "",
    payload?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const { data } = await this.api.put<T>(this.buildUrl(path), payload, config);
    return data;
  }

  /**
   * PATCH request
   */
  protected async patch<T, D = any>(
    path: string = "",
    payload?: D,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const { data } = await this.api.patch<T>(this.buildUrl(path), payload, config);
    return data;
  }

  /**
   * DELETE request
   */
  protected async delete<T>(path: string = "", config?: AxiosRequestConfig): Promise<T> {
    const { data } = await this.api.delete<T>(this.buildUrl(path), config);
    return data;
  }
}
