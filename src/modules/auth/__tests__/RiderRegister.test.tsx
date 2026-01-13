import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/utils';
import RiderRegister from '../pages/RiderRegister';
import { server } from '../../../test/mocks/server';

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

describe('RiderRegister Component', () => {
  it('should render rider registration form', () => {
    render(<RiderRegister />);

    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create rider account/i })).toBeInTheDocument();
  });

  it('should disable submit button when form is invalid', () => {
    render(<RiderRegister />);

    const submitButton = screen.getByRole('button', { name: /create rider account/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when all required fields are valid', async () => {
    const user = userEvent.setup();
    render(<RiderRegister />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create rider account/i });

    await user.type(phoneInput, '+255712345679');
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(passwordInput, 'Test123!');
    await user.type(confirmPasswordInput, 'Test123!');

    expect(submitButton).not.toBeDisabled();
  });

  it('should show password requirements', () => {
    render(<RiderRegister />);

    expect(
      screen.getByText(/min 8 chars, must include uppercase, lowercase, and number/i)
    ).toBeInTheDocument();
  });

  it('should register rider successfully', async () => {
    const user = userEvent.setup();
    render(<RiderRegister />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create rider account/i });

    await user.type(phoneInput, '+255712345679');
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(passwordInput, 'Test123!');
    await user.type(confirmPasswordInput, 'Test123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/auth/login', { replace: true });
    });
  });

  it('should validate password match', async () => {
    const user = userEvent.setup();
    render(<RiderRegister />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create rider account/i });

    await user.type(phoneInput, '+255712345679');
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(passwordInput, 'Test123!');
    await user.type(confirmPasswordInput, 'DifferentPassword1!');

    // Submit button should remain disabled due to password mismatch
    expect(submitButton).toBeDisabled();
  });

  it('should validate password strength', async () => {
    const user = userEvent.setup();
    render(<RiderRegister />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create rider account/i });

    await user.type(phoneInput, '+255712345679');
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    // Weak password (no uppercase, no number)
    await user.type(passwordInput, 'weakpassword');
    await user.type(confirmPasswordInput, 'weakpassword');

    // Submit button should be disabled due to weak password
    expect(submitButton).toBeDisabled();
  });

  it('should have links to login and tenant registration', () => {
    render(<RiderRegister />);

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/register as tenant/i)).toBeInTheDocument();
  });

  it('should allow optional tenant ID', async () => {
    const user = userEvent.setup();
    render(<RiderRegister />);

    const tenantIdInput = screen.getByLabelText(/organization id/i);

    await user.type(tenantIdInput, '550e8400-e29b-41d4-a716-446655440000');

    expect(tenantIdInput).toHaveValue('550e8400-e29b-41d4-a716-446655440000');
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    render(<RiderRegister />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create rider account/i });

    await user.type(phoneInput, '+255712345679');
    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(passwordInput, 'Test123!');
    await user.type(confirmPasswordInput, 'Test123!');

    // Check that button is not disabled before clicking
    expect(submitButton).not.toBeDisabled();

    // Click and immediately check for loading state
    const clickPromise = user.click(submitButton);

    // Should show loading text (check synchronously right after click)
    await waitFor(() => {
      expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    });

    await clickPromise;
  });
});
