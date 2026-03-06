'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAdminUserDetail, useSuspendUser, useBanUser, useUnbanUser, useUnsuspendUser } from '@/hooks/admin/useAdminUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, PawPrint, Shield, Clock, Ban } from 'lucide-react';
import { SuspendUserDialog } from '@/components/admin/users/SuspendUserDialog';
import { BanUserDialog } from '@/components/admin/users/BanUserDialog';
import { useState } from 'react';

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: user, isLoading } = useAdminUserDetail(id);
  const unsuspend = useUnsuspendUser();
  const unban = useUnbanUser();

  const [showSuspend, setShowSuspend] = useState(false);
  const [showBan, setShowBan] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        User not found.
      </div>
    );
  }

  const isSuspended = user.suspendedUntil && new Date(user.suspendedUntil) > new Date();

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push('/admin/users')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Users
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Info Card */}
        <Card className="lg:col-span-2 bg-white">
          <CardHeader>
            <CardTitle className="text-lg">User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <Badge variant="outline" className="capitalize">
                  {user.role ?? 'User'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-500">Joined</p>
                <p className="font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                {user.isBanned ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : isSuspended ? (
                  <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    Suspended until{' '}
                    {new Date(user.suspendedUntil!).toLocaleDateString()}
                  </Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Subscription</p>
                <Badge variant="outline" className="capitalize">
                  {user.subscriptionPlan ?? 'Free'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isSuspended ? (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => unsuspend.mutate(user.id)}
                disabled={unsuspend.isPending}
              >
                <Clock className="h-4 w-4 mr-2" />
                {unsuspend.isPending ? 'Removing...' : 'Remove Suspension'}
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowSuspend(true)}
              >
                <Clock className="h-4 w-4 mr-2" />
                Suspend User
              </Button>
            )}
            {user.isBanned ? (
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  if (confirm(`Are you sure you want to unban ${user.name}?`)) {
                    unban.mutate(user.id);
                  }
                }}
                disabled={unban.isPending}
              >
                <Ban className="h-4 w-4 mr-2" />
                {unban.isPending ? 'Unbanning...' : 'Unban User'}
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={() => setShowBan(true)}
              >
                <Ban className="h-4 w-4 mr-2" />
                Ban User
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{user.petCount}</p>
            <p className="text-sm text-gray-500">Pets</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{user.matchesCount}</p>
            <p className="text-sm text-gray-500">Matches</p>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{user.reportsCount}</p>
            <p className="text-sm text-gray-500">Reports</p>
          </CardContent>
        </Card>
      </div>

      {/* Pets List */}
      {user.pets.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Pets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.pets.map((pet) => (
                <div
                  key={pet.id}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 p-3"
                >
                  <div className="h-10 w-10 rounded-full bg-[#2997FF]/10 flex items-center justify-center">
                    <PawPrint className="h-5 w-5 text-[#2997FF]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{pet.name}</p>
                    <p className="text-xs text-gray-500">
                      {pet.species} · {pet.breed}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <SuspendUserDialog
        userId={user.id}
        userName={user.name}
        open={showSuspend}
        onOpenChange={setShowSuspend}
      />
      <BanUserDialog
        userId={user.id}
        userName={user.name}
        open={showBan}
        onOpenChange={setShowBan}
      />
    </div>
  );
}
