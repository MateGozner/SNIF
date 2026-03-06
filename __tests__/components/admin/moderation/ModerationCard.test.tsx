/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ModerationCard } from '@/components/admin/moderation/ModerationCard';
import type { AdminReportDto } from '@/lib/types/admin';

const baseReport: AdminReportDto = {
  id: 'report-1',
  reporterName: 'Alice',
  targetUserId: 'user-2',
  targetUserName: 'Bob',
  targetPetName: 'Rex',
  reason: 'Inappropriate content',
  description: 'Posted spam photos',
  status: 'pending',
  createdAt: new Date(Date.now() - 3600_000).toISOString(), // 1 hour ago
};

describe('ModerationCard', () => {
  it('renders target user name', () => {
    render(<ModerationCard report={baseReport} isSelected={false} onClick={jest.fn()} />);
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders pet name when present', () => {
    render(<ModerationCard report={baseReport} isSelected={false} onClick={jest.fn()} />);
    expect(screen.getByText('(pet: Rex)')).toBeInTheDocument();
  });

  it('does not render pet name when null', () => {
    const reportNoPet = { ...baseReport, targetPetName: null };
    render(<ModerationCard report={reportNoPet} isSelected={false} onClick={jest.fn()} />);
    expect(screen.queryByText(/pet:/)).not.toBeInTheDocument();
  });

  it('renders the report reason', () => {
    render(<ModerationCard report={baseReport} isSelected={false} onClick={jest.fn()} />);
    expect(screen.getByText('Inappropriate content')).toBeInTheDocument();
  });

  it('renders reporter name', () => {
    render(<ModerationCard report={baseReport} isSelected={false} onClick={jest.fn()} />);
    expect(screen.getByText('by Alice')).toBeInTheDocument();
  });

  it('shows Pending badge for pending status', () => {
    render(<ModerationCard report={baseReport} isSelected={false} onClick={jest.fn()} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('shows Resolved badge for resolved status', () => {
    const resolved = { ...baseReport, status: 'resolved' };
    render(<ModerationCard report={resolved} isSelected={false} onClick={jest.fn()} />);
    expect(screen.getByText('Resolved')).toBeInTheDocument();
  });

  it('shows Dismissed badge for dismissed status', () => {
    const dismissed = { ...baseReport, status: 'dismissed' };
    render(<ModerationCard report={dismissed} isSelected={false} onClick={jest.fn()} />);
    expect(screen.getByText('Dismissed')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const onClick = jest.fn();
    render(<ModerationCard report={baseReport} isSelected={false} onClick={onClick} />);
    fireEvent.click(screen.getByText('Bob'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies selected styling when isSelected is true', () => {
    const { container } = render(
      <ModerationCard report={baseReport} isSelected={true} onClick={jest.fn()} />
    );
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('ring-2');
  });
});
