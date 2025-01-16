import { Spawn } from '@/structures/spawn/Spawn';

type SpawnOptionsWithMemory = SpawnOptions & {
  memory: {
    role: CreepRole.MINER;
    state: CreepState;
  };
};

describe('Spawn', () => {
  const spawnCreep = jest.fn<
    ScreepsReturnCode,
    [BodyPartConstant[], string, SpawnOptionsWithMemory]
  >();
  const mockSpawn = {
    id: 'spawn_1' as Id<StructureSpawn>,
    pos: {
      x: 0,
      y: 0,
      roomName: 'test_room',
    } as RoomPosition,
    room: {} as Room,
    store: {
      getUsedCapacity: () => 300, // Simulate sufficient energy
      getCapacity: () => 300,
    },
    spawnCreep,
  } as unknown as StructureSpawn;

  let spawn: Spawn;

  beforeEach(() => {
    spawn = new Spawn(mockSpawn);
    jest.clearAllMocks();
  });

  describe('Energy Check', () => {
    it('should return true when energy is sufficient', () => {
      expect(spawn.hasEnoughEnergy()).toBe(true);
    });

    it('should return false when energy is insufficient', () => {
      const mockSpawnLowEnergy = {
        ...mockSpawn,
        store: {
          getUsedCapacity: () => 100, // Simulate insufficient energy
          getCapacity: () => 300,
        },
      } as unknown as StructureSpawn;

      const spawnLowEnergy = new Spawn(mockSpawnLowEnergy);
      expect(spawnLowEnergy.hasEnoughEnergy()).toBe(false);
    });
  });

  describe('Creep Production', () => {
    it('should spawn a miner creep with correct configuration', () => {
      spawn.spawnMiner();
      expect(spawnCreep).toHaveBeenCalled();

      const [bodyParts, name, options] = spawnCreep.mock.calls[0] || [];
      expect(bodyParts).toBeDefined();
      expect(bodyParts).toContain(WORK);
      expect(bodyParts).toContain(CARRY);
      expect(bodyParts).toContain(MOVE);

      expect(name).toMatch(/^Miner_\d+$/);
      expect(options.memory.role).toBe(CreepRole.MINER);
    });

    it('should spawn an upgrader creep with correct configuration', () => {
      spawn.spawnUpgrader();
      expect(spawnCreep).toHaveBeenCalled();

      const [bodyParts, name, options] = spawnCreep.mock.calls[0] || [];
      expect(bodyParts).toBeDefined();
      expect(bodyParts).toContain(WORK);
      expect(bodyParts).toContain(CARRY);
      expect(bodyParts).toContain(MOVE);

      expect(name).toMatch(/^Upgrader_\d+$/);
      expect(options.memory.role).toBe(CreepRole.UPGRADER);
      expect(options.memory.state).toBe(CreepState.HARVESTING);
    });
  });
});
