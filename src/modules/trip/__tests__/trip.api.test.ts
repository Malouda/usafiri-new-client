import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tripApi } from '../trip.api';
import { Trip, TripStatus, TripType } from '../interfaces/trip.interface';

// Mock the BaseApi
vi.mock('../../../api/base.api', () => {
  return {
    BaseApi: class {
      baseURL: string;
      constructor(baseURL: string) {
        this.baseURL = baseURL;
      }
      async get(endpoint: string) {
        return Promise.resolve([]);
      }
      async post(endpoint: string, data: any) {
        return Promise.resolve(data);
      }
      async put(endpoint: string, data: any) {
        return Promise.resolve(data);
      }
      async delete(endpoint: string) {
        return Promise.resolve();
      }
    },
  };
});

describe('Trip API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all trips without filters', async () => {
      const mockTrips: Trip[] = [
        {
          id: '1',
          tenantId: 'tenant-1',
          routeId: 'route-1',
          busId: 'bus-1',
          tripType: TripType.NON_REPEATING,
          status: TripStatus.PUBLISHED,
          visibility: 'PUBLIC',
          basePrice: 5000,
          basePriceCents: 500000,
          currency: 'TZS',
          cancellationPolicy: 'FLEXIBLE',
          passengerInfoPolicy: 'NOT_REQUIRED',
          holdDuration: 180,
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          createdAt: '2025-01-01T00:00:00Z',
          updatedAt: '2025-01-01T00:00:00Z',
        },
      ];

      vi.spyOn(tripApi, 'get').mockResolvedValue(mockTrips);

      const result = await tripApi.getAll();

      expect(result).toEqual(mockTrips);
      expect(tripApi.get).toHaveBeenCalledWith('');
    });

    it('should fetch trips with filters', async () => {
      const filters = {
        status: TripStatus.PUBLISHED,
        tripType: TripType.NON_REPEATING,
      };

      vi.spyOn(tripApi, 'get').mockResolvedValue([]);

      await tripApi.getAll(filters);

      expect(tripApi.get).toHaveBeenCalledWith('?status=PUBLISHED&tripType=NON_REPEATING');
    });
  });

  describe('getById', () => {
    it('should fetch a trip by ID', async () => {
      const mockTrip: Trip = {
        id: '1',
        tenantId: 'tenant-1',
        routeId: 'route-1',
        busId: 'bus-1',
        tripType: TripType.NON_REPEATING,
        status: TripStatus.PUBLISHED,
        visibility: 'PUBLIC',
        basePrice: 5000,
        basePriceCents: 500000,
        currency: 'TZS',
        cancellationPolicy: 'FLEXIBLE',
        passengerInfoPolicy: 'NOT_REQUIRED',
        holdDuration: 180,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        createdAt: '2025-01-01T00:00:00Z',
        updatedAt: '2025-01-01T00:00:00Z',
      };

      vi.spyOn(tripApi, 'get').mockResolvedValue(mockTrip);

      const result = await tripApi.getById('1');

      expect(result).toEqual(mockTrip);
      expect(tripApi.get).toHaveBeenCalledWith('/1');
    });
  });

  describe('getInviteLink', () => {
    it('should fetch invite link for a trip', async () => {
      const mockResponse = { inviteLink: 'https://example.com/invite/abc123' };

      vi.spyOn(tripApi, 'get').mockResolvedValue(mockResponse);

      const result = await tripApi.getInviteLink('1');

      expect(result).toEqual(mockResponse);
      expect(tripApi.get).toHaveBeenCalledWith('/1/invite-link');
    });
  });
});

