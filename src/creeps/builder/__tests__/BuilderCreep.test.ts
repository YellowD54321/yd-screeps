import { BuilderCreep } from '@/creeps/builder/BuilderCreep';

jest.mock('@/creeps/creepActions', () => ({
  creepActions: {
    harvestEnergy: jest.fn(),
    build: jest.fn(),
  },
}));

describe('BuilderCreep', () => {
  const createMockCreep = (role: string) =>
    ({
      name: 'builder1',
      memory: { role, buildingTargetId: undefined },
      store: {
        getFreeCapacity: jest.fn().mockReturnValue(50),
        getUsedCapacity: jest.fn().mockReturnValue(0),
      },
      room: { find: jest.fn().mockReturnValue([]) },
    }) as unknown as Creep;

  it('should create BuilderCreep with builder role', () => {
    const creep = createMockCreep('builder');
    expect(() => new BuilderCreep(creep)).not.toThrow();
  });

  it('should throw error for non-builder role', () => {
    const creep = createMockCreep('miner');
    expect(() => new BuilderCreep(creep)).toThrow(
      'BuilderCreep can only handle builder role, but got miner'
    );
  });

  it('should call run without error', () => {
    const creep = createMockCreep('builder');
    const builder = new BuilderCreep(creep);
    expect(() => builder.run()).not.toThrow();
  });
});
