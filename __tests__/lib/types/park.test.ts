import type { Park, ParkAmenity, MeetupLocation } from '@/lib/types/park';

describe('Park types', () => {
  it('Park object satisfies the interface', () => {
    const park: Park = {
      id: 'p1',
      name: 'Central Park',
      lat: 40.785091,
      lng: -73.968285,
      amenities: ['dog-friendly', 'water', 'fenced'],
      distance: 1.5,
    };
    expect(park.id).toBe('p1');
    expect(park.name).toBe('Central Park');
    expect(park.amenities).toHaveLength(3);
    expect(park.distance).toBe(1.5);
  });

  it('Park distance is optional', () => {
    const park: Park = {
      id: 'p2',
      name: 'Local Park',
      lat: 0,
      lng: 0,
      amenities: [],
    };
    expect(park.distance).toBeUndefined();
  });

  it('all ParkAmenity values are valid', () => {
    const allAmenities: ParkAmenity[] = [
      'dog-friendly',
      'fenced',
      'water',
      'parking',
      'lighting',
      'benches',
      'waste-bins',
      'off-leash',
      'agility',
      'shade',
    ];
    expect(allAmenities).toHaveLength(10);

    // Ensure each is a valid string type
    for (const a of allAmenities) {
      expect(typeof a).toBe('string');
      expect(a.length).toBeGreaterThan(0);
    }
  });

  it('MeetupLocation satisfies the interface', () => {
    const meetup: MeetupLocation = {
      parkId: 'p1',
      parkName: 'Central Park',
      lat: 40.785091,
      lng: -73.968285,
    };
    expect(meetup.parkId).toBe('p1');
    expect(meetup.parkName).toBe('Central Park');
  });

  it('amenities array can be empty', () => {
    const park: Park = {
      id: 'p3',
      name: 'Empty Park',
      lat: 0,
      lng: 0,
      amenities: [],
    };
    expect(park.amenities).toEqual([]);
  });
});
