import { createActor } from 'xstate';
import { createMinerMachine } from '@/creeps/miner/minerMachine';

jest.mock('@/creeps/creepActions', () => ({
  creepActions: {
    harvestEnergy: jest.fn(),
    transferEnergy: jest.fn(),
  },
}));

describe('minerMachine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should transition from harvesting to transferring when full', () => {
    const creep = {
      store: {
        getFreeCapacity: () => 0,
        getUsedCapacity: () => 50,
      },
      room: {
        find: jest.fn(),
      },
    } as unknown as Creep;

    const actor = createActor(createMinerMachine(creep));
    actor.start();
    expect(actor.getSnapshot().value).toBe('harvesting');
    actor.send({ type: 'TRANSITION' });
    expect(actor.getSnapshot().value).toBe('transferring');
  });

  it('should transition from transferring to harvesting when empty', () => {
    const creep = {
      store: {
        getFreeCapacity: () => 50,
        getUsedCapacity: () => 0,
      },
      room: {
        find: jest.fn(),
      },
    } as unknown as Creep;

    const actor = createActor(createMinerMachine(creep));
    actor.start();
    actor.send({ type: 'TRANSITION' });
    expect(actor.getSnapshot().value).toBe('harvesting');
  });

  it('should stay in harvesting state when not full', () => {
    const creep = {
      store: {
        getFreeCapacity: () => 25,
        getUsedCapacity: () => 25,
      },
      room: {
        find: jest.fn(),
      },
    } as unknown as Creep;

    const actor = createActor(createMinerMachine(creep));
    actor.start();
    actor.send({ type: 'TRANSITION' });
    expect(actor.getSnapshot().value).toBe('harvesting');
  });

  it('should stay in transferring state when not empty', () => {
    const mockGetFreeCapacity = jest.fn().mockReturnValue(0);
    const mockGetUsedCapacity = jest.fn().mockReturnValue(50);
    const creep = {
      store: {
        getFreeCapacity: mockGetFreeCapacity,
        getUsedCapacity: mockGetUsedCapacity,
      },
      room: {
        find: jest.fn(),
      },
    } as unknown as Creep;

    const actor = createActor(createMinerMachine(creep));
    actor.start();
    actor.send({ type: 'TRANSITION' });
    expect(actor.getSnapshot().value).toBe('transferring');

    mockGetFreeCapacity.mockReturnValue(25);
    mockGetUsedCapacity.mockReturnValue(25);
    actor.send({ type: 'TRANSITION' });
    expect(actor.getSnapshot().value).toBe('transferring');
  });
});
