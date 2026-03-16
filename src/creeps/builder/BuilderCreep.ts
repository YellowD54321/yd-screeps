import { createBuilderMachine } from '@/creeps/builder/builderMachine';
import { SimpleMachine } from '@/creeps/stateMachine';

export class BuilderCreep {
  private creep: Creep;
  private actor: SimpleMachine;

  constructor(creep: Creep) {
    this.creep = creep;
    if (this.creep.memory.role !== CreepRole.BUILDER) {
      throw new Error(`BuilderCreep can only handle builder role, but got ${this.creep.memory.role}`);
    }

    this.actor = createBuilderMachine(this.creep);
  }

  public run(): void {
    this.actor.send({ type: 'TRANSITION' });
  }
}
