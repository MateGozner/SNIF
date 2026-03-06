/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock @react-oauth/google
const mockLogin = jest.fn();
jest.mock('@react-oauth/google', () => ({
  useGoogleLogin: (opts: { onSuccess: (r: { access_token: string }) => void; onError: () => void }) => {
    mockLogin.mockImplementation(() => {
      opts.onSuccess({ access_token: 'mock-google-token' });
    });
    return mockLogin;
  },
  GoogleOAuthProvider: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', null, children),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

// Mock sonner
const mockToastSuccess = jest.fn();
const mockToastError = jest.fn();
jest.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}));

// Mock geolocation hook
jest.mock('@/hooks/location/useGeoLocation', () => ({
  useGeolocation: () => ({
    getLocation: jest.fn().mockResolvedValue({ latitude: 47.5, longitude: 19.04 }),
  }),
}));

// Mock zustand store
jest.mock('@/lib/store/authStore', () => ({
  useAuthStore: (selector: (state: { setAuth: jest.Mock }) => unknown) =>
    selector({ setAuth: jest.fn() }),
}));

// Mock google auth API
const mockGoogleAuth = jest.fn();
jest.mock('@/lib/auth/google', () => ({
  googleAuth: (...args: unknown[]) => mockGoogleAuth(...args),
}));

import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

describe('GoogleSignInButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Google sign-in button with login text', () => {
    render(<GoogleSignInButton mode="login" />);
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
  });

  it('renders with register text when mode is register', () => {
    render(<GoogleSignInButton mode="register" />);
    expect(screen.getByRole('button', { name: /sign up with google/i })).toBeInTheDocument();
  });

  it('calls googleAuth API on successful Google sign-in', async () => {
    mockGoogleAuth.mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      token: 'jwt-token',
    });

    render(<GoogleSignInButton mode="login" />);
    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }));

    await waitFor(() => {
      expect(mockGoogleAuth).toHaveBeenCalledWith('mock-google-token', expect.anything());
    });
  });

  it('shows error toast on 409 conflict (email exists)', async () => {
    mockGoogleAuth.mockRejectedValue(new Error('An account with this email already exists.'));

    render(<GoogleSignInButton mode="login" />);
    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith(
        expect.stringContaining('already exists')
      );
    });
  });

  it('shows error toast on network error', async () => {
    mockGoogleAuth.mockRejectedValue(new Error('Network error'));

    render(<GoogleSignInButton mode="login" />);
    fireEvent.click(screen.getByRole('button', { name: /continue with google/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Network error');
    });
  });
});
