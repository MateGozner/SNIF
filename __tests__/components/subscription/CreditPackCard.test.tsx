/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock dependencies
jest.mock('@/hooks/subscription/useSubscription', () => ({
  usePurchaseCredits: jest.fn(),
}));

jest.mock('framer-motion', () => ({
  motion: {
    div: React.forwardRef(({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>, ref: React.Ref<HTMLDivElement>) =>
      React.createElement('div', { ...filterMotionProps(props), ref }, children)
    ),
  },
}));

function filterMotionProps(props: Record<string, unknown>) {
  const filtered: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(props)) {
    if (!['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileTap', 'variants', 'layout'].includes(key)) {
      filtered[key] = val;
    }
  }
  return filtered;
}

import { usePurchaseCredits } from '@/hooks/subscription/useSubscription';
import { CreditPackCard } from '@/components/subscription/CreditPackCard';

const mutateMock = jest.fn();

beforeEach(() => {
  (usePurchaseCredits as jest.Mock).mockReturnValue({
    mutate: mutateMock,
    isPending: false,
  });
  mutateMock.mockClear();
});

describe('CreditPackCard', () => {
  const starterPack = { amount: 10, price: 1.99, label: 'Starter' };
  const bestValuePack = { amount: 50, price: 7.99, popular: true, label: 'Best Value' };
  const megaPack = { amount: 100, price: 12.99, label: 'Mega Pack' };

  it('renders credit amount and price', () => {
    render(<CreditPackCard pack={starterPack} index={0} />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('$1.99')).toBeInTheDocument();
    expect(screen.getByText('credits')).toBeInTheDocument();
  });

  it('renders per-credit price calculation', () => {
    render(<CreditPackCard pack={starterPack} index={0} />);
    // 1.99 / 10 = 0.20
    expect(screen.getByText('$0.20 per credit')).toBeInTheDocument();
  });

  it('renders per-credit price for 50 pack', () => {
    render(<CreditPackCard pack={bestValuePack} index={1} />);
    // 7.99 / 50 = 0.16
    expect(screen.getByText('$0.16 per credit')).toBeInTheDocument();
  });

  it('renders per-credit price for 100 pack', () => {
    render(<CreditPackCard pack={megaPack} index={2} />);
    // 12.99 / 100 = 0.13
    expect(screen.getByText('$0.13 per credit')).toBeInTheDocument();
  });

  it('shows popular badge for popular pack', () => {
    render(<CreditPackCard pack={bestValuePack} index={1} />);
    expect(screen.getByText('Best Value')).toBeInTheDocument();
  });

  it('does not show popular badge for non-popular pack', () => {
    render(<CreditPackCard pack={starterPack} index={0} />);
    expect(screen.queryByText('Starter')).not.toBeInTheDocument(); // label only shows as badge for popular
  });

  it('triggers purchase on Buy Now click', () => {
    render(<CreditPackCard pack={starterPack} index={0} />);
    fireEvent.click(screen.getByText('Buy Now'));
    expect(mutateMock).toHaveBeenCalledWith({
      amount: 10,
      successUrl: expect.stringContaining('/payment/success'),
      cancelUrl: expect.stringContaining('/payment/cancel'),
    });
  });

  it('disables button when purchase is pending', () => {
    (usePurchaseCredits as jest.Mock).mockReturnValue({
      mutate: mutateMock,
      isPending: true,
    });
    render(<CreditPackCard pack={starterPack} index={0} />);
    expect(screen.getByText('Buy Now')).toBeDisabled();
  });
});
