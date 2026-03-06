/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import React from 'react';
import { CardGridSkeleton } from '@/components/shared/CardGridSkeleton';

describe('CardGridSkeleton', () => {
  it('renders default 6 skeleton cards', () => {
    const { container } = render(<CardGridSkeleton />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(6);
  });

  it('renders custom number of cards', () => {
    const { container } = render(<CardGridSkeleton count={4} />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(4);
  });

  it('renders with 3-column grid by default', () => {
    const { container } = render(<CardGridSkeleton />);
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('lg:grid-cols-3');
  });

  it('renders with 2-column grid when columns=2', () => {
    const { container } = render(<CardGridSkeleton columns={2} />);
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('sm:grid-cols-2');
    expect(grid.className).not.toContain('lg:grid-cols-3');
  });

  it('renders with 4-column grid when columns=4', () => {
    const { container } = render(<CardGridSkeleton columns={4} />);
    const grid = container.firstChild as HTMLElement;
    expect(grid.className).toContain('lg:grid-cols-4');
  });

  it('skeleton cards have rounded-xl class', () => {
    const { container } = render(<CardGridSkeleton count={1} />);
    const skeleton = container.querySelector('.animate-pulse');
    expect(skeleton?.className).toContain('rounded-xl');
  });
});
