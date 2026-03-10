import { TERRAIN_MASK_WALL } from '@/constants';
import { mockGame } from '@/test/mockGame';
import { ensureExtensionConstructionSites, planExtensions } from '@/structures/room/RoomPlanner';

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

describe('ensureExtensionConstructionSites', () => {
  const roomName = 'W1N1';
  const spawnX = 25;
  const spawnY = 30;
  const mockGetTerrain = jest.fn();
  const mockFind = jest.fn();
  const mockCreateConstructionSite = jest.fn();

  const mockSpawn = {
    pos: { x: spawnX, y: spawnY, roomName },
  } as unknown as StructureSpawn;

  const occupiedPositions = new Map<string, { structures: number; constructionSites: number }>();

  let mockRoom: Room;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetTerrain.mockImplementation(() => 0);
    occupiedPositions.clear();
    mockCreateConstructionSite.mockReturnValue(mockGame.OK);

    (global as { __lookForGetter?: (x: number, y: number, type: string) => unknown[] }).__lookForGetter =
      (x, y, type) => {
        const key = `${x},${y}`;
        const occ = occupiedPositions.get(key) || { structures: 0, constructionSites: 0 };
        if (type === LOOK_STRUCTURES) return Array(occ.structures).fill({});
        if (type === LOOK_CONSTRUCTION_SITES) return Array(occ.constructionSites).fill({});
        return [];
      };

    mockRoom = {
      name: roomName,
      getTerrain: jest.fn().mockReturnValue({ get: mockGetTerrain }),
      find: mockFind,
      createConstructionSite: mockCreateConstructionSite,
      controller: { level: 2 } as StructureController,
    } as unknown as Room;
  });

  it('should not call createConstructionSite when RCL < 2', () => {
    mockRoom.controller = { level: 1 } as StructureController;
    mockFind.mockImplementation((type: FindConstant) => {
      if (type === FIND_MY_SPAWNS) return [mockSpawn];
      if (type === FIND_MY_STRUCTURES) return [];
      if (type === FIND_CONSTRUCTION_SITES) return [];
      return [];
    });

    ensureExtensionConstructionSites(mockRoom);

    expect(mockCreateConstructionSite).not.toHaveBeenCalled();
  });

  it('should not call createConstructionSite when Extension count >= 5', () => {
    const fiveExtensions = Array(5).fill({ structureType: STRUCTURE_EXTENSION });
    mockFind.mockImplementation((type: FindConstant) => {
      if (type === FIND_MY_SPAWNS) return [mockSpawn];
      if (type === FIND_MY_STRUCTURES) return fiveExtensions;
      if (type === FIND_CONSTRUCTION_SITES) return [];
      return [];
    });

    ensureExtensionConstructionSites(mockRoom);

    expect(mockCreateConstructionSite).not.toHaveBeenCalled();
  });

  it('should call createConstructionSite for empty positions when RCL >= 2 and count < 5', () => {
    mockFind.mockImplementation((type: FindConstant) => {
      if (type === FIND_MY_SPAWNS) return [mockSpawn];
      if (type === FIND_MY_STRUCTURES) return [];
      if (type === FIND_CONSTRUCTION_SITES) return [];
      return [];
    });

    ensureExtensionConstructionSites(mockRoom);

    expect(mockCreateConstructionSite).toHaveBeenCalled();
    const calls = mockCreateConstructionSite.mock.calls;
    expect(calls.every(([x, y, type]) => type === STRUCTURE_EXTENSION)).toBe(true);
    expect(calls.length).toBeLessThanOrEqual(5);
  });

  it('should skip positions that already have Structure or ConstructionSite', () => {
    mockFind.mockImplementation((type: FindConstant) => {
      if (type === FIND_MY_SPAWNS) return [mockSpawn];
      if (type === FIND_MY_STRUCTURES) return [];
      if (type === FIND_CONSTRUCTION_SITES) return [];
      return [];
    });

    const planned = planExtensions(mockRoom, mockSpawn);
    if (planned.length > 0) {
      const first = planned[0];
      occupiedPositions.set(`${first.x},${first.y}`, { structures: 1, constructionSites: 0 });
    }

    ensureExtensionConstructionSites(mockRoom);

    const calls = mockCreateConstructionSite.mock.calls;
    const firstPos = planned[0];
    const calledAtFirst = calls.some(([x, y]) => x === firstPos.x && y === firstPos.y);
    expect(calledAtFirst).toBe(false);
  });
});
