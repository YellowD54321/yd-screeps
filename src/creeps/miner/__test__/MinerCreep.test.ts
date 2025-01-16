import { MinerCreep } from '@/creeps/miner/MinerCreep';
import { creepActions } from '@/creeps/creepActions';

jest.mock('@/creeps/creepActions', () => ({
  creepActions: {
    harvestEnergy: jest.fn(),
    transferEnergy: jest.fn(),
  },
}));

describe('MinerCreep', () => {
  let minerCreep: MinerCreep;
  let mockScreepsCreep: Creep;
  let mockGetFreeCapacity: jest.Mock;
  let mockGetUsedCapacity: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetFreeCapacity = jest.fn().mockReturnValue(0);
    mockGetUsedCapacity = jest.fn().mockReturnValue(0);

    mockScreepsCreep = {
      name: 'test-miner',
      memory: {
        role: CreepRole.MINER,
      },
      store: {
        getFreeCapacity: mockGetFreeCapacity,
        getUsedCapacity: mockGetUsedCapacity,
      },
      room: {
        find: jest.fn(),
      },
    } as unknown as Creep;
  });

  describe('constructor', () => {
    it('should throw error if creep role is not miner', () => {
      mockScreepsCreep.memory.role = 'invalid_role' as CreepRole;

      expect(() => new MinerCreep(mockScreepsCreep)).toThrow(
        'MinerCreep can only handle miner role, but got invalid_role'
      );
    });
  });

  describe('run', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should harvest energy when creep has free capacity', () => {
      mockGetFreeCapacity.mockReturnValue(50);
      mockGetUsedCapacity.mockReturnValue(0);

      minerCreep = new MinerCreep(mockScreepsCreep);
      minerCreep.run();

      expect(creepActions.harvestEnergy).toHaveBeenCalledWith(mockScreepsCreep);
    });

    it('should transfer energy when creep is full', () => {
      mockGetFreeCapacity.mockReturnValue(0);
      mockGetUsedCapacity.mockReturnValue(50);

      minerCreep = new MinerCreep(mockScreepsCreep);
      minerCreep.run();

      expect(creepActions.transferEnergy).toHaveBeenCalledWith(mockScreepsCreep);
    });

    it('should harvest energy after transferring when empty', () => {
      mockGetFreeCapacity.mockReturnValue(0);
      mockGetUsedCapacity.mockReturnValue(50);

      minerCreep = new MinerCreep(mockScreepsCreep);
      minerCreep.run();
      expect(creepActions.transferEnergy).toHaveBeenCalledWith(mockScreepsCreep);

      jest.clearAllMocks();
      mockGetFreeCapacity.mockReturnValue(50);
      mockGetUsedCapacity.mockReturnValue(0);
      minerCreep.run();
      expect(creepActions.harvestEnergy).toHaveBeenCalledWith(mockScreepsCreep);
    });
  });
});
