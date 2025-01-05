import { createMachine, type StateValue } from 'xstate';

interface CreepContext {
  role: string;
  energy: number;
  maxEnergy: number;
}

type CreepEvent =
  | { type: 'HARVEST' }
  | { type: 'BUILD' }
  | { type: 'UPGRADE' }
  | { type: 'DONE' }
  | { type: 'FULL' }
  | { type: 'NO_ENERGY' };

export const creepMachine = createMachine({
  types: {} as {
    context: CreepContext;
    events: CreepEvent;
    value: StateValue;
  },
  id: 'creep',
  initial: 'idle',
  context: {
    role: 'miner',
    energy: 0,
    maxEnergy: 50,
  },
  states: {
    idle: {
      on: {
        HARVEST: 'harvesting',
        BUILD: 'building',
        UPGRADE: 'upgrading',
      },
      always: [
        {
          target: 'harvesting',
          guard: ({ context }) => context.role === 'miner',
        },
      ],
    },
    harvesting: {
      on: {
        DONE: 'idle',
        FULL: 'transferring',
      },
      entry: {
        type: 'harvestEnergy',
      },
    },
    building: {
      on: {
        DONE: 'idle',
        NO_ENERGY: 'harvesting',
      },
    },
    upgrading: {
      on: {
        DONE: 'idle',
        NO_ENERGY: 'harvesting',
      },
    },
    transferring: {
      on: {
        DONE: 'harvesting',
        NO_ENERGY: 'harvesting',
      },
      entry: {
        type: 'transferEnergy',
      },
    },
  },
});
