import { createActor } from 'xstate';
import { createBuilderMachine } from '@/creeps/builder/builderMachine';

export class BuilderCreep {
  private creep: Creep;
  private actor: ReturnType<typeof createActor>;

  constructor(creep: Creep) {
    this.creep = creep;
    if (this.creep.memory.role !== CreepRole.BUILDER) {
      throw new Error(`BuilderCreep can only handle builder role, but got ${this.creep.memory.role}`);
    }

    const machine = createBuilderMachine(this.creep);
    this.actor = createActor(machine, { systemId: `builder-${this.creep.name}` });
    this.actor.start();
  }

  public run(): void {
    this.actor.send({ type: 'TRANSITION' });
  }
}
