import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../../test/utils';
import TenantRegister from '../pages/TenantRegister';
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

describe('TenantRegister Component', () => {
  it('should render tenant registration form', () => {
    render(<TenantRegister />);

    expect(screen.getByLabelText(/organization name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create organization/i })).toBeInTheDocument();
  });

  it('should have organization, admin, and security sections', () => {
    render(<TenantRegister />);

    expect(screen.getByText(/organization details/i)).toBeInTheDocument();
    expect(screen.getByText(/admin user details/i)).toBeInTheDocument();
    expect(screen.getByText(/security/i)).toBeInTheDocument();
  });

  it('should disable submit button when form is invalid', () => {
    render(<TenantRegister />);

    const submitButton = screen.getByRole('button', { name: /create organization/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when all required fields are valid', async () => {
    const user = userEvent.setup();
    render(<TenantRegister />);

    const orgNameInput = screen.getByLabelText(/organization name/i);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const phoneInput = screen.getByLabelText(/phone number/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create organization/i });

    await user.type(orgNameInput, 'Test Company');
    await user.type(firstNameInput, 'Admin');
    await user.type(lastNameInput, 'User');
    await user.type(phoneInput, '+255712345680');
    await user.type(passwordInput, 'Test123!');
    await user.type(confirmPasswordInput, 'Test123!');

    expect(submitButton).not.toBeDisabled();
  });

  it('should validate organization name minimum length', async () => {
    const user = userEvent.setup();
    render(<TenantRegister />);

    const orgNameInput = screen.getByLabelText(/organization name/i);
    const submitButton = screen.getByRole('button', { name: /create organization/i });

    // Organization name less than 3 characters
    await user.type(orgNameInput, 'AB');

    expect(submitButton).toBeDisabled();
  });

  it('should register tenant successfully and redirect to dashboard', async () => {
    const user = userEvent.setup();
    render(<TenantRegister />);

    const orgNameInput = screen.getByLabelText(/organization name/i);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const phoneInput = screen.getByLabelText(/phone number/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create organization/i });

    await user.type(orgNameInput, 'Test Company');
    await user.type(firstNameInput, 'Admin');
    await user.type(lastNameInput, 'User');
    await user.type(phoneInput, '+255712345680');
    await user.type(emailInput, 'admin@test.com');
    await user.type(passwordInput, 'Test123!');
    await user.type(confirmPasswordInput, 'Test123!');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('should validate password match', async () => {
    const user = userEvent.setup();
    render(<TenantRegister />);

    const orgNameInput = screen.getByLabelText(/organization name/i);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const phoneInput = screen.getByLabelText(/phone number/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create organization/i });

    await user.type(orgNameInput, 'Test Company');
    await user.type(firstNameInput, 'Admin');
    await user.type(lastNameInput, 'User');
    await user.type(phoneInput, '+255712345680');
    await user.type(passwordInput, 'Test123!');
    await user.type(confirmPasswordInput, 'DifferentPassword1!');

    // Submit button should remain disabled due to password mismatch
    expect(submitButton).toBeDisabled();
  });

  it('should validate password strength', async () => {
    const user = userEvent.setup();
    render(<TenantRegister />);

    const orgNameInput = screen.getByLabelText(/organization name/i);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const phoneInput = screen.getByLabelText(/phone number/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create organization/i });

    await user.type(orgNameInput, 'Test Company');
    await user.type(firstNameInput, 'Admin');
    await user.type(lastNameInput, 'User');
    await user.type(phoneInput, '+255712345680');
    // Weak password (no uppercase, no number)
    await user.type(passwordInput, 'weakpassword');
    await user.type(confirmPasswordInput, 'weakpassword');

    // Submit button should be disabled due to weak password
    expect(submitButton).toBeDisabled();
  });

  it('should allow optional email field', async () => {
    const user = userEvent.setup();
    render(<TenantRegister />);

    const emailInput = screen.getByLabelText(/email address/i);

    // Email is optional, form should be valid without it
    expect(emailInput).not.toBeRequired();

    await user.type(emailInput, 'optional@test.com');
    expect(emailInput).toHaveValue('optional@test.com');
  });

  it('should have links to login and rider registration', () => {
    render(<TenantRegister />);

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/register as rider/i)).toBeInTheDocument();
  });

  it('should show loading state during submission', async () => {
    const user = userEvent.setup();
    render(<TenantRegister />);

    const orgNameInput = screen.getByLabelText(/organization name/i);
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const phoneInput = screen.getByLabelText(/phone number/i);
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    const submitButton = screen.getByRole('button', { name: /create organization/i });

    await user.type(orgNameInput, 'Test Company');
    await user.type(firstNameInput, 'Admin');
    await user.type(lastNameInput, 'User');
    await user.type(phoneInput, '+255712345680');
    await user.type(passwordInput, 'Test123!');
    await user.type(confirmPasswordInput, 'Test123!');

    // Check that button is not disabled before clicking
    expect(submitButton).not.toBeDisabled();

    // Click and immediately check for loading state
    const clickPromise = user.click(submitButton);

    // Should show loading text (check synchronously right after click)
    await waitFor(() => {
      expect(screen.getByText(/creating organization/i)).toBeInTheDocument();
    });

    await clickPromise;
  });

  it('should show password requirements help text', () => {
    render(<TenantRegister />);

    expect(
      screen.getByText(/min 8 chars, must include uppercase, lowercase, and number/i)
    ).toBeInTheDocument();
  });

  it('should show organization name minimum length help text', () => {
    render(<TenantRegister />);

    expect(screen.getByText(/min 3 characters/i)).toBeInTheDocument();
  });
});
