import { SourceMinerCreep } from '@/creeps/sourceMiner/SourceMinerCreep';
import { creepActions } from '@/creeps/creepActions';

jest.mock('@/creeps/creepActions', () => ({
  creepActions: {
    harvestEnergy: jest.fn(),
  },
}));

describe('SourceMinerCreep', () => {
  let sourceMinerCreep: SourceMinerCreep;
  let mockScreepsCreep: Creep;

  beforeEach(() => {
    jest.clearAllMocks();

    mockScreepsCreep = {
      name: 'test-source-miner',
      memory: {
        role: CreepRole.SOURCE_MINER,
      },
      room: {
        find: jest.fn(),
      },
    } as unknown as Creep;
  });

  describe('constructor', () => {
    it('should throw error if creep role is not sourceMiner', () => {
      mockScreepsCreep.memory.role = 'invalid_role' as CreepRole;

      expect(() => new SourceMinerCreep(mockScreepsCreep)).toThrow(
        'SourceMinerCreep can only handle sourceMiner role, but got invalid_role'
      );
    });
  });

  describe('run', () => {
    it('should call harvestEnergy when run', () => {
      sourceMinerCreep = new SourceMinerCreep(mockScreepsCreep);
      sourceMinerCreep.run();

      expect(creepActions.harvestEnergy).toHaveBeenCalledWith(mockScreepsCreep);
    });

    it('should call harvestEnergy on every run', () => {
      sourceMinerCreep = new SourceMinerCreep(mockScreepsCreep);
      sourceMinerCreep.run();
      sourceMinerCreep.run();

      expect(creepActions.harvestEnergy).toHaveBeenCalledTimes(2);
      expect(creepActions.harvestEnergy).toHaveBeenCalledWith(mockScreepsCreep);
    });
  });
});
