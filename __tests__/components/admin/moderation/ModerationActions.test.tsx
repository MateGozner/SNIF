/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock all hook dependencies
jest.mock('@/hooks/admin/useAdminModeration', () => ({
  useDismissReport: jest.fn(),
  useResolveReport: jest.fn(),
  useWarnUser: jest.fn(),
}));

jest.mock('@/hooks/admin/useAdminUsers', () => ({
  useSuspendUser: jest.fn(),
  useBanUser: jest.fn(),
}));

import { useDismissReport, useResolveReport, useWarnUser } from '@/hooks/admin/useAdminModeration';
import { useSuspendUser, useBanUser } from '@/hooks/admin/useAdminUsers';
import { ModerationActions } from '@/components/admin/moderation/ModerationActions';

const dismissMutate = jest.fn();
const resolveMutate = jest.fn();
const warnMutate = jest.fn();
const suspendMutate = jest.fn();
const banMutate = jest.fn();

beforeEach(() => {
  (useDismissReport as jest.Mock).mockReturnValue({ mutate: dismissMutate, isPending: false });
  (useResolveReport as jest.Mock).mockReturnValue({ mutate: resolveMutate, isPending: false });
  (useWarnUser as jest.Mock).mockReturnValue({ mutate: warnMutate, isPending: false });
  (useSuspendUser as jest.Mock).mockReturnValue({ mutate: suspendMutate, isPending: false });
  (useBanUser as jest.Mock).mockReturnValue({ mutate: banMutate, isPending: false });
  jest.clearAllMocks();
});

const defaultProps = {
  reportId: 'report-1',
  targetUserId: 'user-2',
  targetUserName: 'Bob',
};

describe('ModerationActions', () => {
  it('renders Dismiss button', () => {
    render(<ModerationActions {...defaultProps} />);
    expect(screen.getByText('Dismiss')).toBeInTheDocument();
  });

  it('renders Warn User button', () => {
    render(<ModerationActions {...defaultProps} />);
    expect(screen.getByText('Warn User')).toBeInTheDocument();
  });

  it('renders Suspend button', () => {
    render(<ModerationActions {...defaultProps} />);
    expect(screen.getByText('Suspend')).toBeInTheDocument();
  });

  it('renders Ban button', () => {
    render(<ModerationActions {...defaultProps} />);
    expect(screen.getByText('Ban')).toBeInTheDocument();
  });

  it('calls dismiss mutation when Dismiss is clicked', () => {
    render(<ModerationActions {...defaultProps} />);
    fireEvent.click(screen.getByText('Dismiss'));
    expect(dismissMutate).toHaveBeenCalledWith(
      expect.objectContaining({ reportId: 'report-1' }),
      expect.any(Object)
    );
  });

  it('disables all buttons when any action is pending', () => {
    (useDismissReport as jest.Mock).mockReturnValue({ mutate: dismissMutate, isPending: true });

    render(<ModerationActions {...defaultProps} />);

    expect(screen.getByText('Dismiss')).toBeDisabled();
    expect(screen.getByText('Warn User')).toBeDisabled();
    expect(screen.getByText('Suspend')).toBeDisabled();
    expect(screen.getByText('Ban')).toBeDisabled();
  });

  it('opens Ban confirmation dialog when Ban button is clicked', () => {
    render(<ModerationActions {...defaultProps} />);
    fireEvent.click(screen.getByText('Ban'));
    expect(screen.getByText('Ban Bob')).toBeInTheDocument();
    expect(screen.getByText('Permanently ban this user. This action is severe.')).toBeInTheDocument();
  });

  it('opens Suspend dialog when Suspend button is clicked', () => {
    render(<ModerationActions {...defaultProps} />);
    fireEvent.click(screen.getByText('Suspend'));
    expect(screen.getByText('Suspend Bob')).toBeInTheDocument();
  });
});
