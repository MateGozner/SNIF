'use client';

import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { linkGoogle, unlinkGoogle, setPasswordForGoogleUser } from '@/lib/auth/google';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface ConnectedAccountsProps {
  hasGoogleLinked: boolean;
  hasPassword: boolean;
  onUpdate: () => void;
}

export function ConnectedAccounts({
  hasGoogleLinked,
  hasPassword,
  onUpdate,
}: ConnectedAccountsProps) {
  const [isLinking, setIsLinking] = useState(false);
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [showSetPassword, setShowSetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLinking(true);
        await linkGoogle(tokenResponse.access_token);
        toast.success('Google account linked successfully');
        onUpdate();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to link Google account';
        toast.error(message);
      } finally {
        setIsLinking(false);
      }
    },
    onError: () => {
      toast.error('Google sign-in was cancelled');
      setIsLinking(false);
    },
    flow: 'implicit',
  });

  const handleUnlink = async () => {
    if (!hasPassword) {
      toast.error('Please set a password before unlinking Google. Otherwise you won\'t be able to sign in.');
      setShowSetPassword(true);
      return;
    }
    try {
      setIsUnlinking(true);
      await unlinkGoogle();
      toast.success('Google account unlinked');
      onUpdate();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to unlink Google account';
      toast.error(message);
    } finally {
      setIsUnlinking(false);
    }
  };

  const handleSetPassword = async () => {
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    try {
      setIsSavingPassword(true);
      await setPasswordForGoogleUser(newPassword);
      toast.success('Password set successfully');
      setShowSetPassword(false);
      setNewPassword('');
      onUpdate();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to set password';
      toast.error(message);
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-[#38bdf8] font-medium text-sm tracking-wide">
        Connected Accounts
      </h3>

      <div className="bg-white/[0.06] p-6 rounded-2xl backdrop-blur-md border border-white/[0.08] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <div>
              <p className="text-white font-medium text-sm">Google</p>
              <p className="text-white/40 text-xs">
                {hasGoogleLinked ? 'Connected' : 'Not connected'}
              </p>
            </div>
          </div>

          {hasGoogleLinked ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUnlink}
              disabled={isUnlinking}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl text-sm"
            >
              {isUnlinking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Unlink'}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => googleLogin()}
              disabled={isLinking}
              className="text-[#2997FF] hover:text-[#2997FF]/80 hover:bg-[#2997FF]/10 rounded-xl text-sm"
            >
              {isLinking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Link'}
            </Button>
          )}
        </div>

        {/* Set password section for Google-only users */}
        {hasGoogleLinked && !hasPassword && (
          <div className="pt-3 border-t border-white/[0.08]">
            {showSetPassword ? (
              <div className="space-y-3">
                <p className="text-white/60 text-xs">
                  Set a password to also sign in with email/password.
                </p>
                <Input
                  type="password"
                  placeholder="New password (min 8 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10 bg-white/10 border-white/20 text-white rounded-xl text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSetPassword}
                    disabled={isSavingPassword}
                    className="rounded-xl bg-[#2997FF] text-white hover:bg-[#2997FF]/90 text-sm"
                  >
                    {isSavingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowSetPassword(false);
                      setNewPassword('');
                    }}
                    className="rounded-xl text-white/60 text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSetPassword(true)}
                className="text-white/60 hover:text-white/80 text-xs p-0 h-auto"
              >
                Set a password for email sign-in
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
