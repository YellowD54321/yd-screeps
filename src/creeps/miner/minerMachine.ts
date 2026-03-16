import { SimpleMachine } from '@/creeps/stateMachine';
import { creepActions } from '@/creeps/creepActions';

export const createMinerMachine = (creep: Creep) =>
  new SimpleMachine({
    id: 'miner',
    initial: 'harvesting',
    states: {
      harvesting: {
        entry: () => creepActions.harvestEnergy(creep),
        on: {
          TRANSITION: {
            target: 'transferring',
            guard: () => creep.store.getFreeCapacity() === 0,
          },
        },
      },
      transferring: {
        entry: () => creepActions.transferEnergy(creep),
        on: {
          TRANSITION: {
            target: 'harvesting',
            guard: () => creep.store.getUsedCapacity() === 0,
          },
        },
      },
    },
  });
