/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ParkAmenityBadge } from '@/components/parks/ParkAmenityBadge';
import type { ParkAmenity } from '@/lib/types/park';

describe('ParkAmenityBadge', () => {
  const amenityLabels: Record<ParkAmenity, string> = {
    'dog-friendly': 'Dog Friendly',
    fenced: 'Fenced',
    water: 'Water',
    parking: 'Parking',
    lighting: 'Lit',
    benches: 'Benches',
    'waste-bins': 'Waste Bins',
    'off-leash': 'Off-Leash',
    agility: 'Agility',
    shade: 'Shade',
  };

  it.each(Object.entries(amenityLabels))(
    'renders correct label for "%s" amenity',
    (amenity, expectedLabel) => {
      render(<ParkAmenityBadge amenity={amenity as ParkAmenity} />);
      expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    }
  );

  it('renders an icon alongside the label', () => {
    const { container } = render(<ParkAmenityBadge amenity="water" />);
    // lucide icons render as SVG elements
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders with badge-like styling', () => {
    const { container } = render(<ParkAmenityBadge amenity="fenced" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('text-xs');
  });
});
