import { createMachine } from 'xstate';
import { creepActions } from '@/creeps/creepActions';

interface MinerContext {
  creep: Creep;
}

type MinerEvent = {
  type: 'TRANSITION';
};

export const createMinerMachine = (creep: Creep) =>
  createMachine(
    {
      id: 'miner',
      initial: 'harvesting',
      context: { creep },
      schemas: {
        context: {} as MinerContext,
        events: {} as MinerEvent,
      },
      states: {
        harvesting: {
          entry: ['harvest'],
          on: {
            TRANSITION: {
              target: 'transferring',
              guard: ({ context }: { context: MinerContext }) =>
                context.creep.store.getFreeCapacity() === 0,
            },
          },
        },
        transferring: {
          entry: ['transfer'],
          on: {
            TRANSITION: {
              target: 'harvesting',
              guard: ({ context }: { context: MinerContext }) =>
                context.creep.store.getUsedCapacity() === 0,
            },
          },
        },
      },
    },
    {
      actions: {
        harvest: ({ context }: { context: MinerContext }) => {
          creepActions.harvestEnergy(context.creep);
        },
        transfer: ({ context }: { context: MinerContext }) => {
          creepActions.transferEnergy(context.creep);
        },
      },
    }
  );
