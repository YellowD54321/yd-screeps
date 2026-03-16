import { SimpleMachine } from '@/creeps/stateMachine';
import { creepActions } from '@/creeps/creepActions';

export const createUpgraderMachine = (creep: Creep) =>
  new SimpleMachine({
    id: 'upgrader',
    initial: 'harvesting',
    states: {
      harvesting: {
        entry: () => creepActions.harvestEnergy(creep),
        on: {
          TRANSITION: {
            target: 'upgrading',
            guard: () => creep.store.getFreeCapacity() === 0,
          },
        },
      },
      upgrading: {
        entry: () => creepActions.upgradeController(creep),
        on: {
          TRANSITION: {
            target: 'harvesting',
            guard: () => creep.store.getUsedCapacity() === 0,
          },
        },
      },
    },
  });
