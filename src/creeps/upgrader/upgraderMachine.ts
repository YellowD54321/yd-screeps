import { createMachine } from 'xstate';
import { creepActions } from '@/creeps/creepActions';

interface UpgraderContext {
  creep: Creep;
}

type UpgraderEvent = {
  type: 'TRANSITION';
};

export const createUpgraderMachine = (creep: Creep) =>
  createMachine(
    {
      id: 'upgrader',
      initial: 'harvesting',
      context: { creep },
      schemas: {
        context: {} as UpgraderContext,
        events: {} as UpgraderEvent,
      },
      states: {
        harvesting: {
          entry: ['harvest'],
          on: {
            TRANSITION: {
              target: 'upgrading',
              guard: ({ context }: { context: UpgraderContext }) =>
                context.creep.store.getFreeCapacity() === 0,
            },
          },
        },
        upgrading: {
          entry: ['upgrade'],
          on: {
            TRANSITION: {
              target: 'harvesting',
              guard: ({ context }: { context: UpgraderContext }) =>
                context.creep.store.getUsedCapacity() === 0,
            },
          },
        },
      },
    },
    {
      actions: {
        harvest: ({ context }: { context: UpgraderContext }) => {
          creepActions.harvestEnergy(context.creep);
        },
        upgrade: ({ context }: { context: UpgraderContext }) => {
          creepActions.upgradeController(context.creep);
        },
      },
    }
  );
