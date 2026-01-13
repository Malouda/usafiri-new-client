import { describe, it, expect, vi, beforeEach } from 'vitest';
import { driverApi } from '../driver.api';
import { UserStatus } from '../interfaces/driver.interface';

// Mock the BaseApi
vi.mock('../../../api/base.api', () => ({
  BaseApi: class BaseApi {
    get = vi.fn();
    post = vi.fn();
    put = vi.fn();
    delete = vi.fn();
  },
}));

describe('DriverApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all drivers', async () => {
      const mockDrivers = [
        {
          id: '1',
          tenantId: 'tenant-1',
          phone: '+255712345678',
          email: 'driver@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'DRIVER',
          status: UserStatus.ACTIVE,
          phoneVerified: true,
          emailVerified: false,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      vi.spyOn(driverApi as any, 'get').mockResolvedValue(mockDrivers);

      const result = await driverApi.getAll();

      expect(result).toEqual(mockDrivers);
      expect((driverApi as any).get).toHaveBeenCalledWith('');
    });
  });

  describe('getAllPaginated', () => {
    it('should fetch paginated drivers', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            tenantId: 'tenant-1',
            phone: '+255712345678',
            email: 'driver@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'DRIVER',
            status: UserStatus.ACTIVE,
            phoneVerified: true,
            emailVerified: false,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      vi.spyOn(driverApi as any, 'get').mockResolvedValue(mockResponse);

      const result = await driverApi.getAllPaginated(1, 10);

      expect(result).toEqual(mockResponse);
      expect((driverApi as any).get).toHaveBeenCalledWith('/paginated?page=1&limit=10');
    });
  });

  describe('getById', () => {
    it('should fetch a single driver by ID', async () => {
      const mockDriver = {
        id: '1',
        tenantId: 'tenant-1',
        phone: '+255712345678',
        email: 'driver@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'DRIVER',
        status: UserStatus.ACTIVE,
        phoneVerified: true,
        emailVerified: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      vi.spyOn(driverApi as any, 'get').mockResolvedValue(mockDriver);

      const result = await driverApi.getById('1');

      expect(result).toEqual(mockDriver);
      expect((driverApi as any).get).toHaveBeenCalledWith('/1');
    });
  });

  describe('create', () => {
    it('should create a new driver', async () => {
      const createDto = {
        phone: '+255712345678',
        email: 'newdriver@example.com',
        password: 'SecurePass123!',
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const mockDriver = {
        id: '2',
        tenantId: 'tenant-1',
        phone: '+255712345678',
        email: 'newdriver@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'DRIVER',
        status: UserStatus.ACTIVE,
        phoneVerified: false,
        emailVerified: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      vi.spyOn(driverApi as any, 'post').mockResolvedValue(mockDriver);

      const result = await driverApi.create(createDto);

      expect(result).toEqual(mockDriver);
      expect((driverApi as any).post).toHaveBeenCalledWith('', createDto);
    });
  });

  describe('update', () => {
    it('should update a driver', async () => {
      const updateDto = {
        status: UserStatus.INACTIVE,
      };

      const mockDriver = {
        id: '1',
        tenantId: 'tenant-1',
        phone: '+255712345678',
        email: 'driver@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'DRIVER',
        status: UserStatus.INACTIVE,
        phoneVerified: true,
        emailVerified: false,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      };

      vi.spyOn(driverApi as any, 'put').mockResolvedValue(mockDriver);

      const result = await driverApi.update('1', updateDto);

      expect(result).toEqual(mockDriver);
      expect((driverApi as any).put).toHaveBeenCalledWith('/1', updateDto);
    });
  });

  describe('deleteDriver', () => {
    it('should deactivate a driver', async () => {
      vi.spyOn(driverApi as any, 'delete').mockResolvedValue(undefined);

      await driverApi.deleteDriver('1');

      expect((driverApi as any).delete).toHaveBeenCalledWith('/1');
    });
  });
});

