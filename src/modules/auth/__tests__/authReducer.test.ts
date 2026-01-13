import { describe, it, expect, beforeEach } from 'vitest';
import authReducer, {
  loginUser,
  logoutUser,
  fetchCurrentUser,
  registerUser,
  clearError,
  setLoading,
  updateUser,
  type AuthState,
} from '../reducers/authReducer';
import { configureStore } from '@reduxjs/toolkit';

describe('authReducer', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().auth;

      expect(state).toEqual({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        initialized: false,
      });
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      const initialState: AuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Some error',
        initialized: false,
      };

      const newState = authReducer(initialState, clearError());

      expect(newState.error).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const initialState: AuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        initialized: false,
      };

      const newState = authReducer(initialState, setLoading(true));

      expect(newState.isLoading).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('should update user data', () => {
      const initialState: AuthState = {
        user: {
          id: '1',
          phone: '+255712345678',
          email: 'old@example.com',
          fullName: 'Old Name',
          role: 'RIDER',
        },
        token: 'token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
        initialized: true,
      };

      const newState = authReducer(
        initialState,
        updateUser({ email: 'new@example.com' })
      );

      expect(newState.user?.email).toBe('new@example.com');
      expect(newState.user?.fullName).toBe('Old Name'); // Other fields unchanged
    });
  });

  describe('loginUser thunk', () => {
    it('should handle pending state', () => {
      const initialState: AuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: 'Previous error',
        initialized: false,
      };

      const newState = authReducer(initialState, loginUser.pending('', {
        phone: '+255712345678',
        password: 'password',
      }));

      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const initialState: AuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        initialized: false,
      };

      const mockResponse = {
        access_token: 'test-token',
        user: {
          id: '1',
          phone: '+255712345678',
          email: 'test@example.com',
          fullName: 'Test User',
          role: 'RIDER' as const,
        },
      };

      const newState = authReducer(
        initialState,
        loginUser.fulfilled(mockResponse, '', {
          phone: '+255712345678',
          password: 'password',
        })
      );

      expect(newState.user).toEqual(mockResponse.user);
      expect(newState.token).toBe('test-token');
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.isLoading).toBe(false);
      expect(newState.initialized).toBe(true);
    });

    it('should handle rejected state', () => {
      const initialState: AuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        initialized: false,
      };

      const newState = authReducer(
        initialState,
        loginUser.rejected(new Error('Invalid credentials'), '', {
          phone: '+255712345678',
          password: 'wrong',
        }, 'Invalid credentials')
      );

      expect(newState.user).toBeNull();
      expect(newState.token).toBeNull();
      expect(newState.isAuthenticated).toBe(false);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe('Invalid credentials');
      expect(newState.initialized).toBe(true);
    });
  });

  describe('logoutUser thunk', () => {
    it('should handle fulfilled state', () => {
      const initialState: AuthState = {
        user: {
          id: '1',
          phone: '+255712345678',
          email: 'test@example.com',
          fullName: 'Test User',
          role: 'RIDER',
        },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
        initialized: true,
      };

      const newState = authReducer(initialState, logoutUser.fulfilled(undefined, '', undefined));

      expect(newState.user).toBeNull();
      expect(newState.token).toBeNull();
      expect(newState.isAuthenticated).toBe(false);
      expect(newState.error).toBeNull();
    });
  });

  describe('fetchCurrentUser thunk', () => {
    it('should handle pending state', () => {
      const initialState: AuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        initialized: false,
      };

      const newState = authReducer(initialState, fetchCurrentUser.pending('', undefined));

      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const mockUser = {
        id: '1',
        phone: '+255712345678',
        email: 'test@example.com',
        fullName: 'Test User',
        role: 'RIDER' as const,
      };

      const initialState: AuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        initialized: false,
      };

      const newState = authReducer(
        initialState,
        fetchCurrentUser.fulfilled(mockUser, '', undefined)
      );

      expect(newState.user).toEqual(mockUser);
      expect(newState.isAuthenticated).toBe(true);
      expect(newState.isLoading).toBe(false);
      expect(newState.initialized).toBe(true);
    });

    it('should handle rejected state', () => {
      const initialState: AuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        initialized: false,
      };

      const newState = authReducer(
        initialState,
        fetchCurrentUser.rejected(new Error('Unauthorized'), '', undefined, 'Unauthorized')
      );

      expect(newState.user).toBeNull();
      expect(newState.isAuthenticated).toBe(false);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe('Unauthorized');
      expect(newState.initialized).toBe(true);
    });
  });

  describe('registerUser thunk', () => {
    it('should handle pending state', () => {
      const initialState: AuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        initialized: false,
      };

      const newState = authReducer(
        initialState,
        registerUser.pending('', {
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'Test123!',
          confirmPassword: 'Test123!',
        })
      );

      expect(newState.isLoading).toBe(true);
      expect(newState.error).toBeNull();
    });

    it('should handle fulfilled state', () => {
      const initialState: AuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        initialized: false,
      };

      const newState = authReducer(
        initialState,
        registerUser.fulfilled(
          { message: 'Registration successful' },
          '',
          {
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'Test123!',
            confirmPassword: 'Test123!',
          }
        )
      );

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBeNull();
    });

    it('should handle rejected state', () => {
      const initialState: AuthState = {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        initialized: false,
      };

      const newState = authReducer(
        initialState,
        registerUser.rejected(
          new Error('Email already exists'),
          '',
          {
            fullName: 'Test User',
            email: 'test@example.com',
            password: 'Test123!',
            confirmPassword: 'Test123!',
          },
          'Email already exists'
        )
      );

      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe('Email already exists');
    });
  });
});
