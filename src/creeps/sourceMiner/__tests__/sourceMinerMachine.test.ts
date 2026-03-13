import { createActor } from 'xstate';
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

    const actor = createActor(createSourceMinerMachine(creep), {
      systemId: 'test-source-miner',
    });
    actor.start();

    expect(actor.getSnapshot().value).toBe('harvesting');
  });
});
