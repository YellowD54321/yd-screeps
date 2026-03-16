import { createUpgraderMachine } from '@/creeps/upgrader/upgraderMachine';

jest.mock('@/creeps/creepActions', () => ({
  creepActions: {
    harvestEnergy: jest.fn(),
    upgradeController: jest.fn(),
  },
}));

describe('upgraderMachine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should transition from harvesting to upgrading when full', () => {
    const creep = {
      store: {
        getFreeCapacity: () => 0,
        getUsedCapacity: () => 50,
      },
      room: {
        find: jest.fn(),
      },
    } as unknown as Creep;

    const machine = createUpgraderMachine(creep);
    expect(machine.getSnapshot().value).toBe('harvesting');
    machine.send({ type: 'TRANSITION' });
    expect(machine.getSnapshot().value).toBe('upgrading');
  });

  it('should transition from upgrading to harvesting when empty', () => {
    const creep = {
      store: {
        getFreeCapacity: () => 50,
        getUsedCapacity: () => 0,
      },
      room: {
        find: jest.fn(),
      },
    } as unknown as Creep;

    const machine = createUpgraderMachine(creep);
    machine.send({ type: 'TRANSITION' });
    expect(machine.getSnapshot().value).toBe('harvesting');
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

    const machine = createUpgraderMachine(creep);
    machine.send({ type: 'TRANSITION' });
    expect(machine.getSnapshot().value).toBe('harvesting');
  });

  it('should stay in upgrading state when not empty', () => {
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

    const machine = createUpgraderMachine(creep);
    machine.send({ type: 'TRANSITION' });
    expect(machine.getSnapshot().value).toBe('upgrading');

    mockGetFreeCapacity.mockReturnValue(25);
    mockGetUsedCapacity.mockReturnValue(25);
    machine.send({ type: 'TRANSITION' });
    expect(machine.getSnapshot().value).toBe('upgrading');
  });
});
