import { SpawnController } from '@/structures/spawn/SpawnController';

const mockSpawnMiner = jest.fn();
const mockSpawnUpgrader = jest.fn();
const mockSpawnBuilder = jest.fn();
const mockHasEnoughEnergy = jest.fn().mockReturnValue(true);

jest.mock('@/structures/spawn/Spawn', () => {
  return {
    Spawn: jest.fn().mockImplementation(() => ({
      hasEnoughEnergy: mockHasEnoughEnergy,
      spawnMiner: mockSpawnMiner,
      spawnUpgrader: mockSpawnUpgrader,
      spawnBuilder: mockSpawnBuilder,
    })),
  };
});

interface CreepCounts {
  totalCount: number;
  minerCount?: number;
  upgraderCount?: number;
  builderCount?: number;
}

interface MockRoomOptions {
  controllerLevel?: number;
  extensionCount?: number;
  extensionConstructionSiteCount?: number;
}

class MockRoomBuilder {
  private creepsCount: number = 0;
  private minersCount: number = 0;
  private upgradersCount: number = 0;
  private buildersCount: number = 0;
  private controllerLevel: number = 1;
  private extensionCount: number = 0;
  private extensionConstructionSiteCount: number = 0;
  private readonly mockRoom: Room;
  private readonly mockSpawn: StructureSpawn;

  constructor() {
    this.mockSpawn = {} as StructureSpawn;
    this.mockRoom = {
      find: jest.fn().mockReturnValue([]),
      controller: { level: 1 } as StructureController,
    } as unknown as Room;
  }

  withCreeps({
    totalCount,
    minerCount = 0,
    upgraderCount = 0,
    builderCount = 0,
  }: CreepCounts): this {
    this.creepsCount = totalCount;
    this.minersCount = minerCount;
    this.upgradersCount = upgraderCount;
    this.buildersCount = builderCount;
    return this;
  }

  withRoomOptions({ controllerLevel, extensionCount, extensionConstructionSiteCount }: MockRoomOptions): this {
    if (controllerLevel !== undefined) this.controllerLevel = controllerLevel;
    if (extensionCount !== undefined) this.extensionCount = extensionCount;
    if (extensionConstructionSiteCount !== undefined)
      this.extensionConstructionSiteCount = extensionConstructionSiteCount;
    return this;
  }

  build(): { room: Room; spawn: StructureSpawn } {
    (this.mockRoom as { controller?: StructureController }).controller = {
      level: this.controllerLevel,
    } as StructureController;

    (this.mockRoom.find as jest.Mock).mockImplementation((type: FindConstant, opts?: { filter?: { structureType?: StructureConstant } }) => {
      switch (type) {
        case FIND_MY_CREEPS:
          return [
            ...Array(this.minersCount).fill({ memory: { role: CreepRole.MINER } }),
            ...Array(this.upgradersCount).fill({ memory: { role: CreepRole.UPGRADER } }),
            ...Array(this.buildersCount).fill({ memory: { role: CreepRole.BUILDER } }),
            ...Array(
              Math.max(0, this.creepsCount - this.minersCount - this.upgradersCount - this.buildersCount)
            ).fill({ memory: { role: 'other' } }),
          ];
        case FIND_MY_SPAWNS:
          return [this.mockSpawn];
        case FIND_MY_STRUCTURES:
          if (opts?.filter?.structureType === STRUCTURE_EXTENSION) {
            return Array(this.extensionCount).fill({ structureType: STRUCTURE_EXTENSION });
          }
          return [];
        case FIND_CONSTRUCTION_SITES:
          if (opts?.filter?.structureType === STRUCTURE_EXTENSION) {
            return Array(this.extensionConstructionSiteCount).fill({
              structureType: STRUCTURE_EXTENSION,
            });
          }
          return [];
        default:
          return [];
      }
    });
    return { room: this.mockRoom, spawn: this.mockSpawn };
  }
}

describe('SpawnController', () => {
  let spawnController: SpawnController;
  let mockRoom: Room;

  beforeEach(() => {
    jest.clearAllMocks();
    mockHasEnoughEnergy.mockReturnValue(true);
    const { room } = new MockRoomBuilder().build();
    mockRoom = room;
    spawnController = new SpawnController(mockRoom);
  });

  describe('getSpawnConfig', () => {
    it('should return harvester 6, upgrader 2, builder 0 for RCL 1', () => {
      const { room } = new MockRoomBuilder().withRoomOptions({ controllerLevel: 1 }).build();
      spawnController = new SpawnController(room);
      expect(spawnController.getSpawnConfig()).toEqual({
        harvester: 6,
        upgrader: 2,
        builder: 0,
      });
    });

    it('should return harvester 6, upgrader 2, builder 1 for RCL 2', () => {
      const { room } = new MockRoomBuilder().withRoomOptions({ controllerLevel: 2 }).build();
      spawnController = new SpawnController(room);
      expect(spawnController.getSpawnConfig()).toEqual({
        harvester: 6,
        upgrader: 2,
        builder: 1,
      });
    });
  });

  describe('shouldSpawnBuilder', () => {
    it('should return false when no Extension and no Extension ConstructionSite exist', () => {
      const { room } = new MockRoomBuilder()
        .withRoomOptions({ controllerLevel: 2, extensionCount: 0, extensionConstructionSiteCount: 0 })
        .build();
      spawnController = new SpawnController(room);
      expect(spawnController.shouldSpawnBuilder()).toBe(false);
    });

    it('should return true when Extension exists and builder count is below config', () => {
      const { room } = new MockRoomBuilder()
        .withRoomOptions({ controllerLevel: 2, extensionCount: 1, extensionConstructionSiteCount: 0 })
        .withCreeps({ totalCount: 0, minerCount: 0, upgraderCount: 0, builderCount: 0 })
        .build();
      spawnController = new SpawnController(room);
      expect(spawnController.shouldSpawnBuilder()).toBe(true);
    });

    it('should return true when Extension ConstructionSite exists and builder count is below config', () => {
      const { room } = new MockRoomBuilder()
        .withRoomOptions({ controllerLevel: 2, extensionCount: 0, extensionConstructionSiteCount: 1 })
        .withCreeps({ totalCount: 0, minerCount: 0, upgraderCount: 0, builderCount: 0 })
        .build();
      spawnController = new SpawnController(room);
      expect(spawnController.shouldSpawnBuilder()).toBe(true);
    });
  });

  describe('Creep Count Check', () => {
    it('should return true when creep count is less than max (RCL 1: 8)', () => {
      const { room } = new MockRoomBuilder()
        .withRoomOptions({ controllerLevel: 1 })
        .withCreeps({ totalCount: 3 })
        .build();
      spawnController = new SpawnController(room);
      expect(spawnController.shouldSpawnCreep()).toBe(true);
    });

    it('should return false when creep count reaches max for RCL 1 (8)', () => {
      const { room } = new MockRoomBuilder()
        .withRoomOptions({ controllerLevel: 1 })
        .withCreeps({ totalCount: 8 })
        .build();
      spawnController = new SpawnController(room);
      expect(spawnController.shouldSpawnCreep()).toBe(false);
    });

    it('should return false when creep count reaches max for RCL 2 (9)', () => {
      const { room } = new MockRoomBuilder()
        .withRoomOptions({ controllerLevel: 2 })
        .withCreeps({ totalCount: 9 })
        .build();
      spawnController = new SpawnController(room);
      expect(spawnController.shouldSpawnCreep()).toBe(false);
    });
  });

  describe('Spawn Decision', () => {
    it('should spawn miner first when no creeps exist', () => {
      const { room } = new MockRoomBuilder()
        .withRoomOptions({ controllerLevel: 2 })
        .withCreeps({ totalCount: 0 })
        .build();
      spawnController = new SpawnController(room);
      spawnController.run();
      expect(mockSpawnMiner).toHaveBeenCalled();
      expect(mockSpawnUpgrader).not.toHaveBeenCalled();
      expect(mockSpawnBuilder).not.toHaveBeenCalled();
    });

    it('should spawn miner when less than 6 harvesters exist', () => {
      const { room } = new MockRoomBuilder()
        .withRoomOptions({ controllerLevel: 2 })
        .withCreeps({ totalCount: 2, minerCount: 1, upgraderCount: 1 })
        .build();
      spawnController = new SpawnController(room);
      spawnController.run();
      expect(mockSpawnMiner).toHaveBeenCalled();
      expect(mockSpawnUpgrader).not.toHaveBeenCalled();
      expect(mockSpawnBuilder).not.toHaveBeenCalled();
    });

    it('should spawn upgrader when 6 harvesters exist and less than 2 upgraders', () => {
      const { room } = new MockRoomBuilder()
        .withRoomOptions({ controllerLevel: 2 })
        .withCreeps({ totalCount: 7, minerCount: 6, upgraderCount: 1 })
        .build();
      spawnController = new SpawnController(room);
      spawnController.run();
      expect(mockSpawnMiner).not.toHaveBeenCalled();
      expect(mockSpawnUpgrader).toHaveBeenCalled();
      expect(mockSpawnBuilder).not.toHaveBeenCalled();
    });

    it('should spawn builder when harvesters and upgraders are full, Extension exists, and builder count is 0', () => {
      const { room } = new MockRoomBuilder()
        .withRoomOptions({ controllerLevel: 2, extensionCount: 1 })
        .withCreeps({ totalCount: 8, minerCount: 6, upgraderCount: 2, builderCount: 0 })
        .build();
      spawnController = new SpawnController(room);
      spawnController.run();
      expect(mockSpawnMiner).not.toHaveBeenCalled();
      expect(mockSpawnUpgrader).not.toHaveBeenCalled();
      expect(mockSpawnBuilder).toHaveBeenCalled();
    });

    it('should not spawn builder when no Extension or ConstructionSite exist even if harvesters and upgraders are full', () => {
      const { room } = new MockRoomBuilder()
        .withRoomOptions({ controllerLevel: 2, extensionCount: 0, extensionConstructionSiteCount: 0 })
        .withCreeps({ totalCount: 8, minerCount: 6, upgraderCount: 2, builderCount: 0 })
        .build();
      spawnController = new SpawnController(room);
      spawnController.run();
      expect(mockSpawnMiner).not.toHaveBeenCalled();
      expect(mockSpawnUpgrader).not.toHaveBeenCalled();
      expect(mockSpawnBuilder).not.toHaveBeenCalled();
    });

    it('should not spawn when total creep count reaches maximum', () => {
      const { room } = new MockRoomBuilder()
        .withRoomOptions({ controllerLevel: 2 })
        .withCreeps({ totalCount: 9, minerCount: 6, upgraderCount: 2, builderCount: 1 })
        .build();
      spawnController = new SpawnController(room);
      spawnController.run();
      expect(mockSpawnMiner).not.toHaveBeenCalled();
      expect(mockSpawnUpgrader).not.toHaveBeenCalled();
      expect(mockSpawnBuilder).not.toHaveBeenCalled();
    });

    it('should not spawn when energy is insufficient', () => {
      mockHasEnoughEnergy.mockReturnValue(false);
      const { room } = new MockRoomBuilder()
        .withRoomOptions({ controllerLevel: 2 })
        .withCreeps({ totalCount: 2, minerCount: 1, upgraderCount: 1 })
        .build();
      spawnController = new SpawnController(room);
      spawnController.run();
      expect(mockSpawnMiner).not.toHaveBeenCalled();
      expect(mockSpawnUpgrader).not.toHaveBeenCalled();
      expect(mockSpawnBuilder).not.toHaveBeenCalled();
    });
  });
});
