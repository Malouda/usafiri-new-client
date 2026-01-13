import { describe, it, expect, vi, beforeEach } from 'vitest';
import { busApi } from '../bus.api';
import { BusStatus } from '../interfaces/bus.interface';

// Mock the BaseApi
vi.mock('../../../api/base.api', () => ({
  BaseApi: class BaseApi {
    get = vi.fn();
    post = vi.fn();
    put = vi.fn();
    delete = vi.fn();
  },
}));

describe('BusApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all buses without filters', async () => {
      const mockBuses = [
        {
          id: '1',
          tenantId: 'tenant-1',
          plateNumber: 'ABC-123',
          make: 'Toyota',
          model: 'Coaster',
          numberOfSeats: 30,
          status: BusStatus.ACTIVE,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      vi.spyOn(busApi as any, 'get').mockResolvedValue(mockBuses);

      const result = await busApi.getAll();

      expect(result).toEqual(mockBuses);
      expect((busApi as any).get).toHaveBeenCalledWith('');
    });

    it('should fetch all buses with status filter', async () => {
      const mockBuses = [
        {
          id: '1',
          tenantId: 'tenant-1',
          plateNumber: 'ABC-123',
          make: 'Toyota',
          model: 'Coaster',
          numberOfSeats: 30,
          status: BusStatus.ACTIVE,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];

      vi.spyOn(busApi as any, 'get').mockResolvedValue(mockBuses);

      const result = await busApi.getAll({ status: BusStatus.ACTIVE });

      expect(result).toEqual(mockBuses);
      expect((busApi as any).get).toHaveBeenCalledWith('?status=ACTIVE');
    });
  });

  describe('getAllPaginated', () => {
    it('should fetch paginated buses', async () => {
      const mockResponse = {
        data: [
          {
            id: '1',
            tenantId: 'tenant-1',
            plateNumber: 'ABC-123',
            make: 'Toyota',
            model: 'Coaster',
            numberOfSeats: 30,
            status: BusStatus.ACTIVE,
            createdAt: '2024-01-01',
            updatedAt: '2024-01-01',
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      vi.spyOn(busApi as any, 'get').mockResolvedValue(mockResponse);

      const result = await busApi.getAllPaginated(1, 10);

      expect(result).toEqual(mockResponse);
      expect((busApi as any).get).toHaveBeenCalledWith('/paginated?page=1&limit=10');
    });

    it('should fetch paginated buses with filters', async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      vi.spyOn(busApi as any, 'get').mockResolvedValue(mockResponse);

      const result = await busApi.getAllPaginated(1, 10, { status: BusStatus.MAINTENANCE });

      expect(result).toEqual(mockResponse);
      expect((busApi as any).get).toHaveBeenCalledWith('/paginated?page=1&limit=10&status=MAINTENANCE');
    });
  });

  describe('getById', () => {
    it('should fetch a single bus by ID', async () => {
      const mockBus = {
        id: '1',
        tenantId: 'tenant-1',
        plateNumber: 'ABC-123',
        make: 'Toyota',
        model: 'Coaster',
        numberOfSeats: 30,
        status: BusStatus.ACTIVE,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      vi.spyOn(busApi as any, 'get').mockResolvedValue(mockBus);

      const result = await busApi.getById('1');

      expect(result).toEqual(mockBus);
      expect((busApi as any).get).toHaveBeenCalledWith('/1');
    });
  });

  describe('create', () => {
    it('should create a new bus', async () => {
      const createDto = {
        plateNumber: 'XYZ-789',
        make: 'Mercedes',
        model: 'Sprinter',
        numberOfSeats: 20,
      };

      const mockBus = {
        id: '2',
        tenantId: 'tenant-1',
        ...createDto,
        status: BusStatus.ACTIVE,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01',
      };

      vi.spyOn(busApi as any, 'post').mockResolvedValue(mockBus);

      const result = await busApi.create(createDto);

      expect(result).toEqual(mockBus);
      expect((busApi as any).post).toHaveBeenCalledWith('', createDto);
    });
  });

  describe('update', () => {
    it('should update a bus', async () => {
      const updateDto = {
        status: BusStatus.MAINTENANCE,
      };

      const mockBus = {
        id: '1',
        tenantId: 'tenant-1',
        plateNumber: 'ABC-123',
        make: 'Toyota',
        model: 'Coaster',
        numberOfSeats: 30,
        status: BusStatus.MAINTENANCE,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
      };

      vi.spyOn(busApi as any, 'put').mockResolvedValue(mockBus);

      const result = await busApi.update('1', updateDto);

      expect(result).toEqual(mockBus);
      expect((busApi as any).put).toHaveBeenCalledWith('/1', updateDto);
    });
  });

  describe('deleteBus', () => {
    it('should delete a bus', async () => {
      vi.spyOn(busApi as any, 'delete').mockResolvedValue(undefined);

      await busApi.deleteBus('1');

      expect((busApi as any).delete).toHaveBeenCalledWith('/1');
    });
  });
});

