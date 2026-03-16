import { SimpleMachine } from '@/creeps/stateMachine';
import { creepActions } from '@/creeps/creepActions';
import { getNextBuildTarget } from '@/creeps/builder/getNextBuildTarget';

function resolveTarget(creep: Creep): ConstructionSite | null {
  const memory = creep.memory as BuilderMemory;

  if (memory.buildingTargetId) {
    const existing = Game.getObjectById(memory.buildingTargetId);
    if (existing) return existing;
    memory.buildingTargetId = undefined;
  }

  const next = getNextBuildTarget(creep);
  if (next) {
    memory.buildingTargetId = next.id;
  }
  return next;
}

export const createBuilderMachine = (creep: Creep) =>
  new SimpleMachine({
    id: 'builder',
    initial: 'harvesting',
    states: {
      harvesting: {
        entry: () => creepActions.harvestEnergy(creep),
        on: {
          TRANSITION: {
            target: 'building',
            guard: () => creep.store.getFreeCapacity() === 0,
          },
        },
      },
      building: {
        entry: () => {
          const target = resolveTarget(creep);
          if (target) {
            creepActions.build(creep, target);
          }
        },
        on: {
          TRANSITION: {
            target: 'harvesting',
            guard: () => creep.store.getUsedCapacity() === 0,
          },
        },
      },
    },
  });
