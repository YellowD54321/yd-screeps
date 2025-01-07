import { CreepController } from '@/creeps/CreepController';
import '@/test/mockGame';

jest.mock('@/creeps/miner/MinerCreep', () => {
  return {
    MinerCreep: jest.fn().mockImplementation(() => ({
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
      expect(MinerCreep).not.toHaveBeenCalled();
    });

    it('should handle multiple creeps', () => {
      const mockMinerCreep1 = {
        memory: { role: CreepRole.MINER },
      } as unknown as Creep;
      const mockMinerCreep2 = {
        memory: { role: CreepRole.MINER },
      } as unknown as Creep;
      const mockInvalidCreep = {
        memory: { role: 'invalid_role' },
      } as unknown as Creep;

      Game.creeps = {
        miner1: mockMinerCreep1,
        miner2: mockMinerCreep2,
        invalid: mockInvalidCreep,
      };

      controller = new CreepController();
      controller.run();

      const { MinerCreep } = require('@/creeps/miner/MinerCreep');
      expect(MinerCreep).toHaveBeenCalledTimes(2);
      expect(MinerCreep.mock.results[0].value.run).toHaveBeenCalled();
      expect(MinerCreep.mock.results[1].value.run).toHaveBeenCalled();
    });

    it('should handle errors gracefully', () => {
      const mockErrorCreep = {
        memory: { role: CreepRole.MINER },
      } as unknown as Creep;

      Game.creeps = {
        error1: mockErrorCreep,
      };

      const { MinerCreep } = require('@/creeps/miner/MinerCreep');
      MinerCreep.mockImplementation(() => {
        throw new Error('Test error');
      });

      controller = new CreepController();

      expect(() => controller.run()).not.toThrow();
    });
  });
});
