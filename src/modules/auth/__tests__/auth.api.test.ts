import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { authApi } from '../auth.api';
import { server } from '../../../test/mocks/server';
import { setToken, getToken, removeToken } from '../../../api';

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());

describe('AuthApi', () => {
  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const credentials = {
        phone: '+255712345678',
        password: 'Test123!',
      };

      const response = await authApi.login(credentials);

      expect(response).toEqual({
        access_token: 'mock-access-token',
        user: {
          id: '1',
          phone: '+255712345678',
          email: 'test@example.com',
          fullName: 'Test User',
          role: 'RIDER',
        },
      });

      // Token should be set in localStorage
      expect(getToken()).toBe('mock-access-token');
    });

    it('should throw error with invalid credentials', async () => {
      const credentials = {
        phone: '+255712345678',
        password: 'WrongPassword',
      };

      await expect(authApi.login(credentials)).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // Set a token first
      setToken('test-token');

      await authApi.logout();

      // Token should be removed
      expect(getToken()).toBeNull();
    });
  });

  describe('getProfile', () => {
    it('should get user profile', async () => {
      const profile = await authApi.getProfile();

      expect(profile).toEqual({
        id: '1',
        phone: '+255712345678',
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'RIDER',
      });
    });
  });

  describe('refresh', () => {
    it('should refresh access token', async () => {
      const response = await authApi.refresh();

      expect(response).toEqual({
        access_token: 'new-mock-access-token',
      });

      // New token should be set
      expect(getToken()).toBe('new-mock-access-token');
    });
  });

  describe('registerRider', () => {
    it('should register rider successfully', async () => {
      const riderData = {
        phone: '+255712345679',
        firstName: 'John',
        lastName: 'Doe',
        password: 'Test123!',
        confirmPassword: 'Test123!',
      };

      const response = await authApi.registerRider(riderData);

      expect(response).toEqual({
        user: {
          id: '2',
          phone: '+255712345679',
          firstName: 'John',
          lastName: 'Doe',
          role: 'RIDER',
        },
        otpSent: true,
        message: 'OTP sent to your phone',
      });
    });
  });

  describe('registerTenant', () => {
    it('should register tenant successfully', async () => {
      const tenantData = {
        organizationName: 'Test Company',
        adminFirstName: 'Admin',
        adminLastName: 'User',
        adminPhone: '+255712345680',
        adminEmail: 'admin@test.com',
        password: 'Test123!',
        confirmPassword: 'Test123!',
      };

      const response = await authApi.registerTenant(tenantData);

      expect(response).toEqual({
        tenant: {
          id: '1',
          name: 'Test Company',
          slug: 'test-company',
          status: 'ACTIVE',
          tier: 'FREE',
        },
        admin: {
          id: '3',
          phone: '+255712345680',
          email: 'admin@test.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'ADMIN',
        },
        accessToken: 'mock-tenant-access-token',
        refreshToken: 'mock-tenant-refresh-token',
      });

      // Access token should be set
      expect(getToken()).toBe('mock-tenant-access-token');
    });
  });
});
