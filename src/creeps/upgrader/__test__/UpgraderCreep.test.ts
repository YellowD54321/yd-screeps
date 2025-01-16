import { UpgraderCreep } from '@/creeps/upgrader/UpgraderCreep';
import { creepActions } from '@/creeps/creepActions';

jest.mock('@/creeps/creepActions', () => ({
  creepActions: {
    harvestEnergy: jest.fn(),
    upgradeController: jest.fn(),
  },
}));

describe('UpgraderCreep', () => {
  let upgraderCreep: UpgraderCreep;
  let mockScreepsCreep: Creep;
  let mockGetFreeCapacity: jest.Mock;
  let mockGetUsedCapacity: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetFreeCapacity = jest.fn().mockReturnValue(0);
    mockGetUsedCapacity = jest.fn().mockReturnValue(0);

    mockScreepsCreep = {
      name: 'test-upgrader',
      memory: {
        role: CreepRole.UPGRADER,
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
    it('should throw error if creep role is not upgrader', () => {
      mockScreepsCreep.memory.role = 'invalid_role' as CreepRole;

      expect(() => new UpgraderCreep(mockScreepsCreep)).toThrow(
        'UpgraderCreep can only handle upgrader role, but got invalid_role'
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

      upgraderCreep = new UpgraderCreep(mockScreepsCreep);
      upgraderCreep.run();

      expect(creepActions.harvestEnergy).toHaveBeenCalledWith(mockScreepsCreep);
    });

    it('should upgrade controller when creep is full', () => {
      mockGetFreeCapacity.mockReturnValue(0);
      mockGetUsedCapacity.mockReturnValue(50);

      upgraderCreep = new UpgraderCreep(mockScreepsCreep);
      upgraderCreep.run();

      expect(creepActions.upgradeController).toHaveBeenCalledWith(mockScreepsCreep);
    });

    it('should harvest energy after upgrading when empty', () => {
      mockGetFreeCapacity.mockReturnValue(0);
      mockGetUsedCapacity.mockReturnValue(50);

      upgraderCreep = new UpgraderCreep(mockScreepsCreep);
      upgraderCreep.run();
      expect(creepActions.upgradeController).toHaveBeenCalledWith(mockScreepsCreep);

      jest.clearAllMocks();
      mockGetFreeCapacity.mockReturnValue(50);
      mockGetUsedCapacity.mockReturnValue(0);
      upgraderCreep.run();
      expect(creepActions.harvestEnergy).toHaveBeenCalledWith(mockScreepsCreep);
    });
  });
});
