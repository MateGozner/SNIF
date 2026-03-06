import { AuthResponse } from '@/lib/types/auth';
import { LocationDto } from '@/lib/types/location';
import { cookies } from './cookies';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function googleAuth(
  idToken: string,
  location?: LocationDto
): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}api/users/google-auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken, location }),
  });

  if (response.status === 409) {
    throw new Error(
      'An account with this email already exists. Please sign in with your password and link your Google account in Settings.'
    );
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Google authentication failed');
  }

  const data: AuthResponse = await response.json();
  cookies.setToken(data.token);
  return data;
}

export async function linkGoogle(idToken: string): Promise<void> {
  const token = cookies.getToken();
  const response = await fetch(`${BASE_URL}api/users/google/link`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to link Google account');
  }
}

export async function unlinkGoogle(): Promise<void> {
  const token = cookies.getToken();
  const response = await fetch(`${BASE_URL}api/users/google/unlink`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to unlink Google account');
  }
}

export async function setPasswordForGoogleUser(
  newPassword: string
): Promise<void> {
  const token = cookies.getToken();
  const response = await fetch(`${BASE_URL}api/users/set-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({ newPassword }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to set password');
  }
}
