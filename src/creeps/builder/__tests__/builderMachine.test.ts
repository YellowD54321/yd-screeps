import { createActor } from 'xstate';
import { createBuilderMachine } from '@/creeps/builder/builderMachine';
import { creepActions } from '@/creeps/creepActions';
import { getNextBuildTarget } from '@/creeps/builder/getNextBuildTarget';

jest.mock('@/creeps/creepActions', () => ({
  creepActions: {
    harvestEnergy: jest.fn(),
    build: jest.fn(),
  },
}));

jest.mock('@/creeps/builder/getNextBuildTarget', () => ({
  getNextBuildTarget: jest.fn(),
}));

describe('builderMachine', () => {
  const mockMemory: BuilderMemory = {
    role: CreepRole.BUILDER,
    state: CreepState.HARVESTING,
    buildingTargetId: undefined,
  };

  const mockCreep = {
    store: {
      getFreeCapacity: jest.fn(),
      getUsedCapacity: jest.fn(),
    },
    memory: mockMemory,
    room: {
      find: jest.fn(),
    },
  } as unknown as Creep;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMemory.buildingTargetId = undefined;
    (mockCreep.store.getFreeCapacity as jest.Mock).mockReturnValue(50);
    (mockCreep.store.getUsedCapacity as jest.Mock).mockReturnValue(0);
  });

  it('should start in harvesting state', () => {
    const machine = createBuilderMachine(mockCreep);
    const actor = createActor(machine);
    actor.start();

    expect(actor.getSnapshot().value).toBe('harvesting');
  });

  it('should call harvestEnergy on harvesting entry', () => {
    const machine = createBuilderMachine(mockCreep);
    const actor = createActor(machine);
    actor.start();

    expect(creepActions.harvestEnergy).toHaveBeenCalledWith(mockCreep);
  });

  it('should transition to building when store is full', () => {
    (mockCreep.store.getFreeCapacity as jest.Mock).mockReturnValue(0);

    const machine = createBuilderMachine(mockCreep);
    const actor = createActor(machine);
    actor.start();
    actor.send({ type: 'TRANSITION' });

    expect(actor.getSnapshot().value).toBe('building');
  });

  it('should stay in harvesting when store is not full', () => {
    (mockCreep.store.getFreeCapacity as jest.Mock).mockReturnValue(50);

    const machine = createBuilderMachine(mockCreep);
    const actor = createActor(machine);
    actor.start();
    actor.send({ type: 'TRANSITION' });

    expect(actor.getSnapshot().value).toBe('harvesting');
  });

  it('should transition to harvesting when store is empty in building state', () => {
    (mockCreep.store.getFreeCapacity as jest.Mock).mockReturnValue(0);
    (mockCreep.store.getUsedCapacity as jest.Mock).mockReturnValue(50);

    const machine = createBuilderMachine(mockCreep);
    const actor = createActor(machine);
    actor.start();
    actor.send({ type: 'TRANSITION' });
    expect(actor.getSnapshot().value).toBe('building');

    (mockCreep.store.getFreeCapacity as jest.Mock).mockReturnValue(50);
    (mockCreep.store.getUsedCapacity as jest.Mock).mockReturnValue(0);
    actor.send({ type: 'TRANSITION' });

    expect(actor.getSnapshot().value).toBe('harvesting');
  });

  it('should call harvestEnergy again when re-entering harvesting from building', () => {
    (mockCreep.store.getFreeCapacity as jest.Mock).mockReturnValue(0);
    (mockCreep.store.getUsedCapacity as jest.Mock).mockReturnValue(50);

    const machine = createBuilderMachine(mockCreep);
    const actor = createActor(machine);
    actor.start();
    expect(creepActions.harvestEnergy).toHaveBeenCalledTimes(1);

    actor.send({ type: 'TRANSITION' });
    expect(actor.getSnapshot().value).toBe('building');

    (mockCreep.store.getFreeCapacity as jest.Mock).mockReturnValue(50);
    (mockCreep.store.getUsedCapacity as jest.Mock).mockReturnValue(0);
    actor.send({ type: 'TRANSITION' });

    expect(actor.getSnapshot().value).toBe('harvesting');
    expect(creepActions.harvestEnergy).toHaveBeenCalledTimes(2);
  });

  it('should stay in building when store is not empty', () => {
    (mockCreep.store.getFreeCapacity as jest.Mock).mockReturnValue(0);
    (mockCreep.store.getUsedCapacity as jest.Mock).mockReturnValue(50);

    const machine = createBuilderMachine(mockCreep);
    const actor = createActor(machine);
    actor.start();
    actor.send({ type: 'TRANSITION' });
    expect(actor.getSnapshot().value).toBe('building');

    actor.send({ type: 'TRANSITION' });
    expect(actor.getSnapshot().value).toBe('building');
  });

  describe('building entry action', () => {
    const mockSite = { id: 'site1' } as ConstructionSite;

    function enterBuildingState() {
      (mockCreep.store.getFreeCapacity as jest.Mock).mockReturnValue(0);
      (mockCreep.store.getUsedCapacity as jest.Mock).mockReturnValue(50);

      const machine = createBuilderMachine(mockCreep);
      const actor = createActor(machine);
      actor.start();
      actor.send({ type: 'TRANSITION' });
      expect(actor.getSnapshot().value).toBe('building');
      return actor;
    }

    it('should find target via getNextBuildTarget when no target in memory', () => {
      (getNextBuildTarget as jest.Mock).mockReturnValue(mockSite);

      enterBuildingState();

      expect(getNextBuildTarget).toHaveBeenCalledWith(mockCreep);
      expect(mockMemory.buildingTargetId).toBe('site1');
      expect(creepActions.build).toHaveBeenCalledWith(mockCreep, mockSite);
    });

    it('should use existing target from memory via Game.getObjectById', () => {
      mockMemory.buildingTargetId = 'site1' as Id<ConstructionSite>;
      (Game as any).getObjectById = jest.fn().mockReturnValue(mockSite);

      enterBuildingState();

      expect((Game as any).getObjectById).toHaveBeenCalledWith('site1');
      expect(creepActions.build).toHaveBeenCalledWith(mockCreep, mockSite);
    });

    it('should clear target and find next when target no longer exists', () => {
      const newSite = { id: 'site2' } as ConstructionSite;
      mockMemory.buildingTargetId = 'site1' as Id<ConstructionSite>;
      (Game as any).getObjectById = jest.fn().mockReturnValue(null);
      (getNextBuildTarget as jest.Mock).mockReturnValue(newSite);

      enterBuildingState();

      expect(mockMemory.buildingTargetId).toBe('site2');
      expect(creepActions.build).toHaveBeenCalledWith(mockCreep, newSite);
    });

    it('should clear target and not build when no targets available', () => {
      mockMemory.buildingTargetId = 'site1' as Id<ConstructionSite>;
      (Game as any).getObjectById = jest.fn().mockReturnValue(null);
      (getNextBuildTarget as jest.Mock).mockReturnValue(null);

      enterBuildingState();

      expect(mockMemory.buildingTargetId).toBeUndefined();
      expect(creepActions.build).not.toHaveBeenCalled();
    });

    it('should not build when no target in memory and no targets available', () => {
      (getNextBuildTarget as jest.Mock).mockReturnValue(null);

      enterBuildingState();

      expect(creepActions.build).not.toHaveBeenCalled();
      expect(mockMemory.buildingTargetId).toBeUndefined();
    });
  });
});
