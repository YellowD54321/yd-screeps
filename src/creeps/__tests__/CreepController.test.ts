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

jest.mock('@/creeps/builder/BuilderCreep', () => {
  return {
    BuilderCreep: jest.fn().mockImplementation(() => ({
      run: jest.fn(),
    })),
  };
});

const createMockCreep = (role: string) =>
  ({
    memory: { role },
    room: {
      memory: {},
      controller: { level: 3 },
    },
    pos: { x: 0, y: 0 },
  }) as unknown as Creep;

describe('CreepController', () => {
  let controller: CreepController;

  beforeEach(() => {
    jest.clearAllMocks();
    Game.creeps = {};
  });

  describe('Creep Processing', () => {
    it('should process miner creeps', () => {
      const mockMinerCreep = createMockCreep(CreepRole.MINER);

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
      const mockUpgraderCreep = createMockCreep(CreepRole.UPGRADER);

      Game.creeps = {
        upgrader1: mockUpgraderCreep,
      };

      controller = new CreepController();
      controller.run();

      const { UpgraderCreep } = require('@/creeps/upgrader/UpgraderCreep');
      expect(UpgraderCreep).toHaveBeenCalledWith(mockUpgraderCreep);
      expect(UpgraderCreep.mock.results[0].value.run).toHaveBeenCalled();
    });

    it('should process builder creeps', () => {
      const mockBuilderCreep = createMockCreep(CreepRole.BUILDER);

      Game.creeps = {
        builder1: mockBuilderCreep,
      };

      controller = new CreepController();
      controller.run();

      const { BuilderCreep } = require('@/creeps/builder/BuilderCreep');
      expect(BuilderCreep).toHaveBeenCalledWith(mockBuilderCreep);
      expect(BuilderCreep.mock.results[0].value.run).toHaveBeenCalled();
    });

    it('should handle invalid role gracefully', () => {
      const mockInvalidCreep = createMockCreep('invalid_role');

      Game.creeps = {
        invalid1: mockInvalidCreep,
      };

      controller = new CreepController();
      controller.run();

      const { MinerCreep } = require('@/creeps/miner/MinerCreep');
      const { UpgraderCreep } = require('@/creeps/upgrader/UpgraderCreep');
      const { BuilderCreep } = require('@/creeps/builder/BuilderCreep');
      expect(MinerCreep).not.toHaveBeenCalled();
      expect(UpgraderCreep).not.toHaveBeenCalled();
      expect(BuilderCreep).not.toHaveBeenCalled();
    });

    it('should handle multiple creeps', () => {
      const mockMinerCreep = createMockCreep(CreepRole.MINER);
      const mockUpgraderCreep = createMockCreep(CreepRole.UPGRADER);
      const mockBuilderCreep = createMockCreep(CreepRole.BUILDER);
      const mockInvalidCreep = createMockCreep('invalid_role');

      Game.creeps = {
        miner1: mockMinerCreep,
        upgrader1: mockUpgraderCreep,
        builder1: mockBuilderCreep,
        invalid: mockInvalidCreep,
      };

      controller = new CreepController();
      controller.run();

      const { MinerCreep } = require('@/creeps/miner/MinerCreep');
      const { UpgraderCreep } = require('@/creeps/upgrader/UpgraderCreep');
      const { BuilderCreep } = require('@/creeps/builder/BuilderCreep');
      expect(MinerCreep).toHaveBeenCalledTimes(1);
      expect(UpgraderCreep).toHaveBeenCalledTimes(1);
      expect(BuilderCreep).toHaveBeenCalledTimes(1);
      expect(MinerCreep.mock.results[0].value.run).toHaveBeenCalled();
      expect(UpgraderCreep.mock.results[0].value.run).toHaveBeenCalled();
      expect(BuilderCreep.mock.results[0].value.run).toHaveBeenCalled();
    });

    it('should handle errors gracefully', () => {
      const mockErrorCreep = createMockCreep(CreepRole.UPGRADER);

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
