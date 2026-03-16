import { createSourceMinerMachine } from '../sourceMinerMachine';

jest.mock('@/creeps/creepActions', () => ({
  creepActions: {
    harvestEnergy: jest.fn(),
  },
}));

describe('sourceMinerMachine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have only harvesting state', () => {
    const creep = {
      room: {
        find: jest.fn(),
      },
    } as unknown as Creep;

    const machine = createSourceMinerMachine(creep);

    expect(machine.getSnapshot().value).toBe('harvesting');
  });
});
