/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useNearbyParks, useGeolocation } from '@/hooks/parks/useNearbyParks';

const mockPosition = { lat: 47.497, lng: 19.04 };

const overpassResponse = {
  elements: [
    {
      id: 1001,
      tags: { name: 'City Dog Park', leisure: 'dog_park', fenced: 'yes', drinking_water: 'yes' },
      center: { lat: 47.498, lon: 19.041 },
    },
    {
      id: 1002,
      tags: { name: 'Riverside Park', leisure: 'park' },
      center: { lat: 47.51, lon: 19.06 },
    },
    {
      id: 1003,
      tags: { leisure: 'park' },
      lat: 47.499,
      lon: 19.042,
    },
  ],
};

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return React.createElement(QueryClientProvider, { client }, children);
}

beforeEach(() => {
  Object.defineProperty(navigator, 'geolocation', {
    value: {
      getCurrentPosition: jest.fn((success: PositionCallback) =>
        success({
          coords: { latitude: mockPosition.lat, longitude: mockPosition.lng },
        } as GeolocationPosition)
      ),
    },
    writable: true,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('useNearbyParks', () => {
  it('fetches parks from Overpass API and sorts by distance', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(overpassResponse),
    });

    const { result } = renderHook(() => useNearbyParks(5), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const parks = result.current.data!;
    expect(parks.length).toBe(3);

    // Sorted by distance (closest first)
    for (let i = 1; i < parks.length; i++) {
      expect(parks[i].distance!).toBeGreaterThanOrEqual(parks[i - 1].distance!);
    }
  });

  it('parses park amenities correctly', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(overpassResponse),
    });

    const { result } = renderHook(() => useNearbyParks(5), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const dogPark = result.current.data!.find((p) => p.name === 'City Dog Park')!;
    expect(dogPark.amenities).toContain('dog-friendly');
    expect(dogPark.amenities).toContain('fenced');
    expect(dogPark.amenities).toContain('water');
  });

  it('defaults name to "Unnamed Park" when tags.name is missing', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(overpassResponse),
    });

    const { result } = renderHook(() => useNearbyParks(5), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const unnamed = result.current.data!.find((p) => p.id === '1003')!;
    expect(unnamed.name).toBe('Unnamed Park');
  });

  it('handles Overpass API error', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });

    const { result } = renderHook(() => useNearbyParks(5), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });

  it('handles empty results', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ elements: [] }),
    });

    const { result } = renderHook(() => useNearbyParks(5), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it('reports geolocation error when not supported', async () => {
    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      writable: true,
    });

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => expect(result.current.error).toBe('Geolocation is not supported'));
  });
});
