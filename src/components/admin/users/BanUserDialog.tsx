'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useBanUser } from '@/hooks/admin/useAdminUsers';

interface BanUserDialogProps {
  userId: string;
  userName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BanUserDialog({ userId, userName, open, onOpenChange }: BanUserDialogProps) {
  const [reason, setReason] = useState('');
  const ban = useBanUser();

  const handleSubmit = () => {
    if (!reason.trim()) return;
    ban.mutate(
      { userId, reason },
      {
        onSuccess: () => {
          onOpenChange(false);
          setReason('');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>
            Ban <strong>{userName}</strong> from the platform.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
            This action will permanently ban the user. They will not be able to log in or use the
            platform until manually unbanned.
          </div>
          <div className="space-y-2">
            <Label htmlFor="ban-reason">Reason</Label>
            <textarea
              id="ban-reason"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2997FF]"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for ban..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!reason.trim() || ban.isPending}
          >
            {ban.isPending ? 'Banning...' : 'Ban User'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
