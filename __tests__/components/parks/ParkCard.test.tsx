/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { ParkCard } from '@/components/parks/ParkCard';
import type { Park } from '@/lib/types/park';

// Mock ParkAmenityBadge to simplify
jest.mock('@/components/parks/ParkAmenityBadge', () => ({
  ParkAmenityBadge: ({ amenity }: { amenity: string }) =>
    React.createElement('span', { 'data-testid': `amenity-${amenity}` }, amenity),
}));

describe('ParkCard', () => {
  const basePark: Park = {
    id: 'p1',
    name: 'Central Dog Park',
    lat: 47.5,
    lng: 19.04,
    amenities: ['dog-friendly', 'fenced', 'water'],
    distance: 0.8,
  };

  it('renders park name', () => {
    render(<ParkCard park={basePark} />);
    expect(screen.getByText('Central Dog Park')).toBeInTheDocument();
  });

  it('renders distance in meters when < 1km', () => {
    render(<ParkCard park={{ ...basePark, distance: 0.45 }} />);
    // 0.45 * 1000 = 450m
    expect(screen.getByText('450m away')).toBeInTheDocument();
  });

  it('renders distance in km when >= 1km', () => {
    render(<ParkCard park={{ ...basePark, distance: 2.3 }} />);
    expect(screen.getByText('2.3km away')).toBeInTheDocument();
  });

  it('does not render distance when undefined', () => {
    const parkNoDistance = { ...basePark, distance: undefined };
    render(<ParkCard park={parkNoDistance} />);
    expect(screen.queryByText(/away/)).not.toBeInTheDocument();
  });

  it('renders amenity badges', () => {
    render(<ParkCard park={basePark} />);
    expect(screen.getByTestId('amenity-dog-friendly')).toBeInTheDocument();
    expect(screen.getByTestId('amenity-fenced')).toBeInTheDocument();
    expect(screen.getByTestId('amenity-water')).toBeInTheDocument();
  });

  it('renders no amenity badges when park has none', () => {
    render(<ParkCard park={{ ...basePark, amenities: [] }} />);
    expect(screen.queryByTestId(/^amenity-/)).not.toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const onClick = jest.fn();
    render(<ParkCard park={basePark} onClick={onClick} />);
    fireEvent.click(screen.getByText('Central Dog Park'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies selected styling when selected', () => {
    const { container } = render(<ParkCard park={basePark} selected={true} />);
    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('ring-2');
  });
});
