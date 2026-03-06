/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import React from 'react';

jest.mock('@/hooks/subscription/useSubscription', () => ({
  useUsage: jest.fn(),
  useCreditBalance: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  motion: {
    span: React.forwardRef(({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>, ref: React.Ref<HTMLSpanElement>) => {
      const filtered: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(props)) {
        if (!['initial', 'animate', 'exit', 'transition', 'variants', 'layout', 'mode'].includes(key)) {
          filtered[key] = val;
        }
      }
      return React.createElement('span', { ...filtered, ref }, children);
    }),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
}));

import { useUsage, useCreditBalance } from '@/hooks/subscription/useSubscription';
import { LikeCounter } from '@/components/subscription/LikeCounter';

beforeEach(() => {
  (useUsage as jest.Mock).mockReturnValue({ data: undefined });
  (useCreditBalance as jest.Mock).mockReturnValue({ data: undefined });
});

describe('LikeCounter', () => {
  it('renders remaining daily likes', () => {
    (useUsage as jest.Mock).mockReturnValue({
      data: {
        usageCounts: { Like: 2 },
        currentLimits: { dailyLikes: 10 },
      },
    });
    (useCreditBalance as jest.Mock).mockReturnValue({ data: { credits: 0 } });

    render(<LikeCounter />);
    // 10 - 2 = 8 daily remaining
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('daily')).toBeInTheDocument();
  });

  it('shows zero when all daily likes are used', () => {
    (useUsage as jest.Mock).mockReturnValue({
      data: {
        usageCounts: { Like: 5 },
        currentLimits: { dailyLikes: 5 },
      },
    });
    (useCreditBalance as jest.Mock).mockReturnValue({ data: { credits: 0 } });

    render(<LikeCounter />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows bonus credits when available', () => {
    (useUsage as jest.Mock).mockReturnValue({
      data: {
        usageCounts: { Like: 0 },
        currentLimits: { dailyLikes: 5 },
      },
    });
    (useCreditBalance as jest.Mock).mockReturnValue({ data: { credits: 15 } });

    render(<LikeCounter />);
    expect(screen.getByText('+15')).toBeInTheDocument();
  });

  it('does not show bonus section when credits are 0', () => {
    (useUsage as jest.Mock).mockReturnValue({
      data: {
        usageCounts: { Like: 0 },
        currentLimits: { dailyLikes: 10 },
      },
    });
    (useCreditBalance as jest.Mock).mockReturnValue({ data: { credits: 0 } });

    render(<LikeCounter />);
    expect(screen.queryByText(/^\+/)).not.toBeInTheDocument();
  });

  it('shows "Buy More" link when total remaining <= 3', () => {
    (useUsage as jest.Mock).mockReturnValue({
      data: {
        usageCounts: { Like: 4 },
        currentLimits: { dailyLikes: 5 },
      },
    });
    (useCreditBalance as jest.Mock).mockReturnValue({ data: { credits: 1 } });

    render(<LikeCounter />);
    // total = 1 daily + 1 credit = 2, which is <= 3
    expect(screen.getByText('Buy More')).toBeInTheDocument();
  });

  it('does not show "Buy More" when total remaining > 3', () => {
    (useUsage as jest.Mock).mockReturnValue({
      data: {
        usageCounts: { Like: 0 },
        currentLimits: { dailyLikes: 10 },
      },
    });
    (useCreditBalance as jest.Mock).mockReturnValue({ data: { credits: 0 } });

    render(<LikeCounter />);
    expect(screen.queryByText('Buy More')).not.toBeInTheDocument();
  });

  it('handles undefined data gracefully', () => {
    (useUsage as jest.Mock).mockReturnValue({ data: undefined });
    (useCreditBalance as jest.Mock).mockReturnValue({ data: undefined });

    render(<LikeCounter />);
    // dailyRemaining = max(0, 5 - 0) = 5, bonusCredits = 0
    expect(screen.getByText('daily')).toBeInTheDocument();
  });
});
