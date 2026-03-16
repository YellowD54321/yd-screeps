import { SimpleMachine } from '@/creeps/stateMachine';
import { creepActions } from '@/creeps/creepActions';

export const createSourceMinerMachine = (creep: Creep) =>
  new SimpleMachine({
    id: 'sourceMiner',
    initial: 'harvesting',
    states: {
      harvesting: {
        actions: {
          TICK: () => creepActions.harvestEnergy(creep),
        },
      },
    },
  });
