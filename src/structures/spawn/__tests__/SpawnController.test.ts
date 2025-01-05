import { SpawnController } from '@/structures/spawn/SpawnController';

// Mock the Spawn class
const mockSpawnMiner = jest.fn();
const mockHasEnoughEnergy = jest.fn().mockReturnValue(true);

jest.mock('@/structures/spawn/Spawn', () => {
  return {
    Spawn: jest.fn().mockImplementation(() => ({
      hasEnoughEnergy: mockHasEnoughEnergy,
      spawnMiner: mockSpawnMiner,
    })),
  };
});

class MockRoomBuilder {
  private creepsCount: number = 0;
  private readonly mockRoom: Room;
  private readonly mockSpawn: StructureSpawn;

  constructor() {
    this.mockSpawn = {} as StructureSpawn;
    this.mockRoom = {
      find: jest.fn().mockReturnValue([]),
    } as unknown as Room;
  }

  withCreeps(count: number): this {
    this.creepsCount = count;
    (this.mockRoom.find as jest.Mock).mockImplementation((type: FindConstant) => {
      switch (type) {
        case FIND_MY_CREEPS:
          return Array(this.creepsCount).fill({});
        case FIND_MY_SPAWNS:
          return [this.mockSpawn];
        default:
          return [];
      }
    });
    return this;
  }

  build(): { room: Room; spawn: StructureSpawn } {
    return { room: this.mockRoom, spawn: this.mockSpawn };
  }
}

describe('SpawnController', () => {
  let spawnController: SpawnController;
  let mockRoom: Room;

  beforeEach(() => {
    jest.clearAllMocks();
    const { room } = new MockRoomBuilder().build();
    mockRoom = room;
    spawnController = new SpawnController(mockRoom);
  });

  describe('Creep Count Check', () => {
    it('should return true when creep count is less than 5', () => {
      const { room } = new MockRoomBuilder().withCreeps(3).build();
      spawnController = new SpawnController(room);
      expect(spawnController.shouldSpawnCreep()).toBe(true);
    });

    it('should return false when creep count is 5 or more', () => {
      const { room } = new MockRoomBuilder().withCreeps(5).build();
      spawnController = new SpawnController(room);
      expect(spawnController.shouldSpawnCreep()).toBe(false);
    });
  });

  describe('Spawn Decision', () => {
    it('should spawn creep when conditions are met', () => {
      const { room } = new MockRoomBuilder().withCreeps(3).build();
      spawnController = new SpawnController(room);
      spawnController.run();
      expect(mockSpawnMiner).toHaveBeenCalled();
    });

    it('should not spawn creep when energy is insufficient', () => {
      mockHasEnoughEnergy.mockReturnValue(false);
      const { room } = new MockRoomBuilder().withCreeps(3).build();
      spawnController = new SpawnController(room);
      spawnController.run();
      expect(mockSpawnMiner).not.toHaveBeenCalled();
    });

    it('should not spawn creep when creep count is sufficient', () => {
      const { room } = new MockRoomBuilder().withCreeps(5).build();
      spawnController = new SpawnController(room);
      spawnController.run();
      expect(mockSpawnMiner).not.toHaveBeenCalled();
    });
  });
});
