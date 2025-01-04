import { createMachine } from 'xstate';

export const creepMachine = createMachine({
  id: 'creep',
  initial: 'idle',
  states: {
    idle: {
      on: {
        HARVEST: 'harvesting',
        BUILD: 'building',
        UPGRADE: 'upgrading',
      },
    },
    harvesting: {
      on: {
        DONE: 'idle',
        FULL: 'transferring',
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
        DONE: 'idle',
        NO_ENERGY: 'harvesting',
      },
    },
  },
});
