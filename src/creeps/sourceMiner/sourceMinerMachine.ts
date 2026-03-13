import { createMachine } from 'xstate';
import { creepActions } from '@/creeps/creepActions';

interface SourceMinerContext {
  creep: Creep;
}

type SourceMinerEvent = {
  type: 'TICK';
};

export const createSourceMinerMachine = (creep: Creep) =>
  createMachine(
    {
      id: 'sourceMiner',
      initial: 'harvesting',
      context: { creep },
      schemas: {
        context: {} as SourceMinerContext,
        events: {} as SourceMinerEvent,
      },
      states: {
        harvesting: {
          on: {
            TICK: {
              actions: ['harvest'],
            },
          },
        },
      },
    },
    {
      actions: {
        harvest: ({ context }: { context: SourceMinerContext }) => {
          creepActions.harvestEnergy(context.creep);
        },
      },
    }
  );
