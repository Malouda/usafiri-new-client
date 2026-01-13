import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchTrips, setFilters, clearError } from '../reducers/tripSlice';
import { TripFilters } from '../interfaces/trip.interface';

export const useTrips = (initialFilters?: TripFilters) => {
  const dispatch = useAppDispatch();
  const { trips, loading, error, filters } = useAppSelector((state) => state.trip);

  useEffect(() => {
    if (initialFilters) {
      dispatch(setFilters(initialFilters));
    }
    dispatch(fetchTrips(initialFilters || filters));
  }, []);

  const refetch = () => {
    dispatch(fetchTrips(filters));
  };

  const updateFilters = (newFilters: TripFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchTrips(newFilters));
  };

  const clearErrorMessage = () => {
    dispatch(clearError());
  };

  return {
    trips,
    loading,
    error,
    filters,
    refetch,
    updateFilters,
    clearErrorMessage,
  };
};

