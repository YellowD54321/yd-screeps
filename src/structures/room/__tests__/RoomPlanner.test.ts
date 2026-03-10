import { TERRAIN_MASK_WALL } from '@/constants';
import { planExtensions } from '@/structures/room/RoomPlanner';

function chebyshevDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

describe('planExtensions', () => {
  const spawnX = 25;
  const spawnY = 30;
  const mockGetTerrain = jest.fn();
  const mockRoom = {
    getTerrain: jest.fn().mockReturnValue({ get: mockGetTerrain }),
  } as unknown as Room;
  const mockSpawn = {
    pos: { x: spawnX, y: spawnY, roomName: 'W1N1' },
  } as unknown as StructureSpawn;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTerrain.mockImplementation(() => 0);
  });

  describe('returns 5 coordinates', () => {
    it('should return 5 coordinates', () => {
      const result = planExtensions(mockRoom, mockSpawn);
      expect(result).toHaveLength(5);
    });
  });

  describe('coordinates at distance 2 from spawn', () => {
    it('should return coordinates at Chebyshev distance 2 from spawn', () => {
      const result = planExtensions(mockRoom, mockSpawn);
      for (const pos of result) {
        const dist = chebyshevDistance(pos, { x: spawnX, y: spawnY });
        expect(dist).toBe(2);
      }
    });
  });

  describe('excludes wall terrain', () => {
    it('should not include wall terrain positions', () => {
      mockGetTerrain.mockImplementation((x: number, y: number) => {
        if (x === 23 && y === 30) return TERRAIN_MASK_WALL;
        return 0;
      });

      const result = planExtensions(mockRoom, mockSpawn);
      const hasWallPos = result.some((p) => p.x === 23 && p.y === 30);
      expect(hasWallPos).toBe(false);
    });
  });

  describe('extensions have at least one empty space between', () => {
    it('should have Chebyshev distance >= 2 between any two extensions', () => {
      const result = planExtensions(mockRoom, mockSpawn);
      for (let i = 0; i < result.length; i++) {
        for (let j = i + 1; j < result.length; j++) {
          const dist = chebyshevDistance(result[i], result[j]);
          expect(dist).toBeGreaterThanOrEqual(2);
        }
      }
    });
  });

  describe('coordinates within room bounds', () => {
    it('should return coordinates within room bounds (0-49)', () => {
      const result = planExtensions(mockRoom, mockSpawn);
      for (const pos of result) {
        expect(pos.x).toBeGreaterThanOrEqual(0);
        expect(pos.x).toBeLessThanOrEqual(49);
        expect(pos.y).toBeGreaterThanOrEqual(0);
        expect(pos.y).toBeLessThanOrEqual(49);
      }
    });
  });
});
