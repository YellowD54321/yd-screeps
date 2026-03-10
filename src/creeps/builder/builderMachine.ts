import { createMachine } from 'xstate';
import { creepActions } from '@/creeps/creepActions';
import { getNextBuildTarget } from '@/creeps/builder/getNextBuildTarget';

interface BuilderContext {
  creep: Creep;
}

type BuilderEvent = {
  type: 'TRANSITION';
};

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
  createMachine(
    {
      id: 'builder',
      initial: 'harvesting',
      context: { creep },
      schemas: {
        context: {} as BuilderContext,
        events: {} as BuilderEvent,
      },
      states: {
        harvesting: {
          entry: ['harvest'],
          on: {
            TRANSITION: {
              target: 'building',
              guard: ({ context }: { context: BuilderContext }) =>
                context.creep.store.getFreeCapacity() === 0,
            },
          },
        },
        building: {
          entry: ['build'],
          on: {
            TRANSITION: {
              target: 'harvesting',
              guard: ({ context }: { context: BuilderContext }) =>
                context.creep.store.getUsedCapacity() === 0,
            },
          },
        },
      },
    },
    {
      actions: {
        harvest: ({ context }: { context: BuilderContext }) => {
          creepActions.harvestEnergy(context.creep);
        },
        build: ({ context }: { context: BuilderContext }) => {
          const target = resolveTarget(context.creep);
          if (target) {
            creepActions.build(context.creep, target);
          }
        },
      },
    }
  );
