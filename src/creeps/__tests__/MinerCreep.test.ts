import { MinerCreep } from '@/creeps/MinerCreep';
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
      memory: {
        role: CreepRole.MINER,
      },
      store: {
        getFreeCapacity: mockGetFreeCapacity,
        getUsedCapacity: mockGetUsedCapacity,
      },
    } as unknown as Creep;

    minerCreep = new MinerCreep(mockScreepsCreep);
  });

  describe('run', () => {
    it('should throw error if creep role is not miner', () => {
      mockScreepsCreep.memory.role = 'invalid_role' as CreepRole;

      expect(() => new MinerCreep(mockScreepsCreep)).toThrow(
        'MinerCreep can only handle miner role, but got invalid_role'
      );
    });

    it('should harvest energy when creep has free capacity', () => {
      mockGetFreeCapacity.mockReturnValue(50);
      mockGetUsedCapacity.mockReturnValue(0);

      minerCreep.run();

      expect(creepActions.harvestEnergy).toHaveBeenCalledWith(mockScreepsCreep);
      expect(creepActions.transferEnergy).not.toHaveBeenCalled();
    });

    it('should transfer energy when creep is full', () => {
      mockGetFreeCapacity.mockReturnValue(0);
      mockGetUsedCapacity.mockReturnValue(50);

      minerCreep.run();

      expect(creepActions.transferEnergy).toHaveBeenCalledWith(mockScreepsCreep);
      expect(creepActions.harvestEnergy).not.toHaveBeenCalled();
    });

    it('should harvest energy after transferring when empty', () => {
      mockGetFreeCapacity.mockReturnValue(0);
      mockGetUsedCapacity.mockReturnValue(50);
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
