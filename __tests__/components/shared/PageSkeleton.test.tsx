/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import React from 'react';
import { PageSkeleton } from '@/components/shared/PageSkeleton';

describe('PageSkeleton', () => {
  it('renders the default number of skeleton rows (4)', () => {
    const { container } = render(<PageSkeleton />);
    // 4 row skeletons + 1 header skeleton = 5 skeleton divs
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(5);
  });

  it('renders custom number of rows', () => {
    const { container } = render(<PageSkeleton rows={2} />);
    // 2 rows + 1 header = 3
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(3);
  });

  it('accepts custom header height', () => {
    const { container } = render(<PageSkeleton headerHeight="h-16" />);
    const header = container.querySelector('.animate-pulse');
    expect(header?.className).toContain('h-16');
  });

  it('uses default header height h-10', () => {
    const { container } = render(<PageSkeleton />);
    const header = container.querySelector('.animate-pulse');
    expect(header?.className).toContain('h-10');
  });

  it('renders skeleton elements with animate-pulse class', () => {
    const { container } = render(<PageSkeleton />);
    const animated = container.querySelectorAll('.animate-pulse');
    expect(animated.length).toBeGreaterThan(0);
  });
});
