import { CreepController } from '@/creeps/CreepController';
import '@/test/mockGame';

jest.mock('@/creeps/miner/MinerCreep', () => {
  return {
    MinerCreep: jest.fn().mockImplementation(() => ({
      run: jest.fn(),
    })),
  };
});

jest.mock('@/creeps/upgrader/UpgraderCreep', () => {
  return {
    UpgraderCreep: jest.fn().mockImplementation(() => ({
      run: jest.fn(),
    })),
  };
});

describe('CreepController', () => {
  let controller: CreepController;

  beforeEach(() => {
    jest.clearAllMocks();
    Game.creeps = {};
  });

  describe('Creep Processing', () => {
    it('should process miner creeps', () => {
      const mockMinerCreep = {
        memory: { role: CreepRole.MINER },
      } as unknown as Creep;

      Game.creeps = {
        miner1: mockMinerCreep,
      };

      controller = new CreepController();
      controller.run();

      const { MinerCreep } = require('@/creeps/miner/MinerCreep');
      expect(MinerCreep).toHaveBeenCalledWith(mockMinerCreep);
      expect(MinerCreep.mock.results[0].value.run).toHaveBeenCalled();
    });

    it('should process upgrader creeps', () => {
      const mockUpgraderCreep = {
        memory: { role: CreepRole.UPGRADER },
      } as unknown as Creep;

      Game.creeps = {
        upgrader1: mockUpgraderCreep,
      };

      controller = new CreepController();
      controller.run();

      const { UpgraderCreep } = require('@/creeps/upgrader/UpgraderCreep');
      expect(UpgraderCreep).toHaveBeenCalledWith(mockUpgraderCreep);
      expect(UpgraderCreep.mock.results[0].value.run).toHaveBeenCalled();
    });

    it('should handle invalid role gracefully', () => {
      const mockInvalidCreep = {
        memory: { role: 'invalid_role' },
      } as unknown as Creep;

      Game.creeps = {
        invalid1: mockInvalidCreep,
      };

      controller = new CreepController();
      controller.run();

      const { MinerCreep } = require('@/creeps/miner/MinerCreep');
      const { UpgraderCreep } = require('@/creeps/upgrader/UpgraderCreep');
      expect(MinerCreep).not.toHaveBeenCalled();
      expect(UpgraderCreep).not.toHaveBeenCalled();
    });

    it('should handle multiple creeps', () => {
      const mockMinerCreep = {
        memory: { role: CreepRole.MINER },
      } as unknown as Creep;
      const mockUpgraderCreep = {
        memory: { role: CreepRole.UPGRADER },
      } as unknown as Creep;
      const mockInvalidCreep = {
        memory: { role: 'invalid_role' },
      } as unknown as Creep;

      Game.creeps = {
        miner1: mockMinerCreep,
        upgrader1: mockUpgraderCreep,
        invalid: mockInvalidCreep,
      };

      controller = new CreepController();
      controller.run();

      const { MinerCreep } = require('@/creeps/miner/MinerCreep');
      const { UpgraderCreep } = require('@/creeps/upgrader/UpgraderCreep');
      expect(MinerCreep).toHaveBeenCalledTimes(1);
      expect(UpgraderCreep).toHaveBeenCalledTimes(1);
      expect(MinerCreep.mock.results[0].value.run).toHaveBeenCalled();
      expect(UpgraderCreep.mock.results[0].value.run).toHaveBeenCalled();
    });

    it('should handle errors gracefully', () => {
      const mockErrorCreep = {
        memory: { role: CreepRole.UPGRADER },
      } as unknown as Creep;

      Game.creeps = {
        error1: mockErrorCreep,
      };

      const { UpgraderCreep } = require('@/creeps/upgrader/UpgraderCreep');
      UpgraderCreep.mockImplementation(() => {
        throw new Error('Test error');
      });

      controller = new CreepController();

      expect(() => controller.run()).not.toThrow();
    });
  });
});
