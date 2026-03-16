import { createUpgraderMachine } from './upgraderMachine';
import { SimpleMachine } from '@/creeps/stateMachine';

export class UpgraderCreep {
  private actor: SimpleMachine;

  constructor(creep: Creep) {
    if (creep.memory.role !== CreepRole.UPGRADER) {
      throw new Error(`UpgraderCreep can only handle upgrader role, but got ${creep.memory.role}`);
    }

    this.actor = createUpgraderMachine(creep);
  }

  public run(): void {
    this.actor.send({ type: 'TRANSITION' });
  }
}
