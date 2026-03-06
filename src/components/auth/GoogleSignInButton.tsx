'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { googleAuth } from '@/lib/auth/google';
import { useAuthStore } from '@/lib/store/authStore';
import { useGeolocation } from '@/hooks/location/useGeoLocation';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { User } from '@/lib/types/auth';

interface GoogleSignInButtonProps {
  mode?: 'login' | 'register';
}

export function GoogleSignInButton({ mode = 'login' }: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const { getLocation } = useGeolocation();
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const location = await getLocation().catch(() => undefined);
        const response = await googleAuth(tokenResponse.access_token, location);
        const user: User = {
          id: response.id,
          email: response.email,
          name: response.name,
          role: response.role,
          location: response.location,
        };
        setAuth(response.token, user);
        toast.success(mode === 'register' ? 'Account created successfully' : 'Signed in successfully');
        router.push('/');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Google sign-in failed';
        if (message.includes('already exists')) {
          toast.error('An account with this email already exists. Please sign in with your password and link Google in Settings.');
        } else {
          toast.error(message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error('Google sign-in was cancelled or failed');
    },
    flow: 'implicit',
  });

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isLoading}
      onClick={() => login()}
      className="w-full h-12 rounded-xl bg-white hover:bg-gray-50 text-gray-800 border-white/20 font-medium flex items-center justify-center gap-3 transition-all duration-200"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
      )}
      {isLoading
        ? 'Signing in...'
        : mode === 'register'
          ? 'Sign up with Google'
          : 'Continue with Google'}
    </Button>
  );
}
