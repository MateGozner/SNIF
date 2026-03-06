'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useDismissReport, useResolveReport, useWarnUser } from '@/hooks/admin/useAdminModeration';
import { useSuspendUser, useBanUser } from '@/hooks/admin/useAdminUsers';
import { ShieldAlert, ShieldOff, Ban, AlertTriangle, X } from 'lucide-react';

interface ModerationActionsProps {
  reportId: string;
  targetUserId: string;
  targetUserName: string;
}

export function ModerationActions({ reportId, targetUserId, targetUserName }: ModerationActionsProps) {
  const dismiss = useDismissReport();
  const resolve = useResolveReport();
  const warn = useWarnUser();
  const suspend = useSuspendUser();
  const ban = useBanUser();

  const [suspendDays, setSuspendDays] = useState('7');
  const [reason, setReason] = useState('');
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const isPending =
    dismiss.isPending || resolve.isPending || warn.isPending || suspend.isPending || ban.isPending;

  const handleDismiss = () => {
    dismiss.mutate({ reportId, notes: reason || undefined }, {
      onSuccess: () => setActiveDialog(null),
    });
  };

  const handleWarn = () => {
    warn.mutate({ userId: targetUserId, reason: reason || 'Violation of community guidelines' }, {
      onSuccess: () => {
        resolve.mutate({ reportId, resolution: 'warned', notes: reason || undefined });
        setActiveDialog(null);
      },
    });
  };

  const handleSuspend = () => {
    suspend.mutate(
      {
        userId: targetUserId,
        durationDays: parseInt(suspendDays, 10),
        reason: reason || 'Policy violation',
      },
      {
        onSuccess: () => {
          resolve.mutate({ reportId, resolution: 'suspended', notes: reason || undefined });
          setActiveDialog(null);
        },
      }
    );
  };

  const handleBan = () => {
    ban.mutate({ userId: targetUserId, reason: reason || 'Severe policy violation' }, {
      onSuccess: () => {
        resolve.mutate({ reportId, resolution: 'banned', notes: reason || undefined });
        setActiveDialog(null);
      },
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Dismiss */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleDismiss}
        disabled={isPending}
      >
        <X className="h-4 w-4 mr-1" />
        Dismiss
      </Button>

      {/* Warn */}
      <Dialog open={activeDialog === 'warn'} onOpenChange={(o) => setActiveDialog(o ? 'warn' : null)}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={isPending}>
            <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
            Warn User
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Warn {targetUserName}</DialogTitle>
            <DialogDescription>Send a warning to this user about their behavior.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDialog(null)}>Cancel</Button>
            <Button onClick={handleWarn} disabled={isPending}>Send Warning</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend */}
      <Dialog open={activeDialog === 'suspend'} onOpenChange={(o) => setActiveDialog(o ? 'suspend' : null)}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" disabled={isPending}>
            <ShieldAlert className="h-4 w-4 mr-1 text-orange-500" />
            Suspend
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend {targetUserName}</DialogTitle>
            <DialogDescription>Temporarily suspend this user&apos;s account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Select value={suspendDays} onValueChange={setSuspendDays}>
              <SelectTrigger>
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day</SelectItem>
                <SelectItem value="3">3 days</SelectItem>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Reason (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleSuspend} disabled={isPending}>
              Suspend User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban */}
      <Dialog open={activeDialog === 'ban'} onOpenChange={(o) => setActiveDialog(o ? 'ban' : null)}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm" disabled={isPending}>
            <Ban className="h-4 w-4 mr-1" />
            Ban
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ban {targetUserName}</DialogTitle>
            <DialogDescription>Permanently ban this user. This action is severe.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveDialog(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleBan} disabled={isPending}>
              <ShieldOff className="h-4 w-4 mr-1" />
              Permanently Ban
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
