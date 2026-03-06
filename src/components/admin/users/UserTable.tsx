'use client';

import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
} from '@tanstack/react-table';
import { AdminUserDto } from '@/lib/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Ban, Clock } from 'lucide-react';
import Link from 'next/link';

const columnHelper = createColumnHelper<AdminUserDto>();

interface UserTableProps {
  data: AdminUserDto[];
  sorting: SortingState;
  onSortingChange: (sorting: SortingState) => void;
  onSuspend: (user: AdminUserDto) => void;
  onBan: (user: AdminUserDto) => void;
}

function StatusBadge({ user }: { user: AdminUserDto }) {
  if (user.isBanned) {
    return <Badge variant="destructive">Banned</Badge>;
  }
  if (user.suspendedUntil && new Date(user.suspendedUntil) > new Date()) {
    return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Suspended</Badge>;
  }
  return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
}

export function UserTable({ data, sorting, onSortingChange, onSuspend, onBan }: UserTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (info) => (
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                info.row.original.isOnline ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
            <span className="font-medium text-gray-900">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => <span className="text-gray-600">{info.getValue()}</span>,
      }),
      columnHelper.accessor('petCount', {
        header: 'Pets',
        cell: (info) => info.getValue(),
      }),
      columnHelper.display({
        id: 'status',
        header: 'Status',
        cell: (info) => <StatusBadge user={info.row.original} />,
      }),
      columnHelper.accessor('subscriptionPlan', {
        header: 'Plan',
        cell: (info) => (
          <Badge variant="outline" className="capitalize">
            {info.getValue() ?? 'Free'}
          </Badge>
        ),
      }),
      columnHelper.accessor('createdAt', {
        header: 'Joined',
        cell: (info) =>
          new Date(info.getValue()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
      }),
      columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => {
          const user = info.row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/admin/users/${user.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSuspend(user)}>
                  <Clock className="h-4 w-4 mr-2" />
                  Suspend
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onBan(user)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  {user.isBanned ? 'Unban' : 'Ban'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }),
    ],
    [onSuspend, onBan]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      onSortingChange(next);
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {table.getRowModel().rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
