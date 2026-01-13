import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/utils';
import Login from '../pages/Login';
import { server } from '../../../test/mocks/server';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  mockNavigate.mockClear();
});
afterAll(() => server.close());

describe('Login Component', () => {
  it('should render login form', () => {
    render(<Login />);

    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show validation error for empty fields', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Submit button should be disabled when fields are empty
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(phoneInput, '+255712345678');
    await user.type(passwordInput, 'Test123!');

    expect(submitButton).not.toBeDisabled();
  });

  it('should login successfully with valid credentials', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(phoneInput, '+255712345678');
    await user.type(passwordInput, 'Test123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  it('should show error message with invalid credentials', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(phoneInput, '+255712345678');
    await user.type(passwordInput, 'WrongPassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const passwordInput = screen.getByLabelText(/^password$/i);
    const toggleButton = screen.getByLabelText(/show password/i);

    expect(passwordInput).toHaveAttribute('type', 'password');

    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('should have links to registration pages', () => {
    render(<Login />);

    expect(screen.getByText(/rider/i)).toBeInTheDocument();
    expect(screen.getByText(/organization\/tenant/i)).toBeInTheDocument();
  });

  it('should clear error when user starts typing', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Trigger error first
    await user.type(phoneInput, '+255712345678');
    await user.type(passwordInput, 'WrongPassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    // Start typing again
    await user.clear(passwordInput);
    await user.type(passwordInput, 'T');

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
    });
  });
});
