import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const handlers = [
  // Login endpoint
  http.post(`${API_BASE_URL}/auth/login`, async ({ request }) => {
    const body = await request.json() as { phone: string; password: string };

    if (body.phone === '+255712345678' && body.password === 'Test123!') {
      return HttpResponse.json({
        access_token: 'mock-access-token',
        user: {
          id: '1',
          phone: '+255712345678',
          email: 'test@example.com',
          fullName: 'Test User',
          role: 'RIDER',
        },
      });
    }

    return HttpResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  }),

  // Logout endpoint
  http.post(`${API_BASE_URL}/auth/logout`, () => {
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),

  // Get profile endpoint
  // http.get(`${API_BASE_URL}/auth/profile`, () => {
  //   return HttpResponse.json({
  //     id: '1',
  //     phone: '+255712345678',
  //     email: 'test@example.com',
  //     fullName: 'Test User',
  //     role: 'RIDER',
  //   });
  // }),

  // Register rider endpoint
  http.post(`${API_BASE_URL}/auth/register-rider`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json({
      user: {
        id: '2',
        phone: body.phone,
        firstName: body.firstName,
        lastName: body.lastName,
        role: 'RIDER',
      },
      otpSent: true,
      message: 'OTP sent to your phone',
    });
  }),

  // Register tenant endpoint
  http.post(`${API_BASE_URL}/auth/tenants/register`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json({
      tenant: {
        id: '1',
        name: body.organizationName,
        slug: body.organizationName.toLowerCase().replace(/\s+/g, '-'),
        status: 'ACTIVE',
        tier: 'FREE',
      },
      admin: {
        id: '3',
        phone: body.adminPhone,
        email: body.adminEmail,
        firstName: body.adminFirstName,
        lastName: body.adminLastName,
        role: 'ADMIN',
      },
      accessToken: 'mock-tenant-access-token',
      refreshToken: 'mock-tenant-refresh-token',
    });
  }),

  // Refresh token endpoint
  http.post(`${API_BASE_URL}/auth/refresh`, () => {
    return HttpResponse.json({
      access_token: 'new-mock-access-token',
    });
  }),
];
