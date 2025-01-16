import { createActor } from 'xstate';
import { createUpgraderMachine } from './upgraderMachine';

export class UpgraderCreep {
  private actor;

  constructor(creep: Creep) {
    if (creep.memory.role !== CreepRole.UPGRADER) {
      throw new Error(`UpgraderCreep can only handle upgrader role, but got ${creep.memory.role}`);
    }

    this.actor = createActor(createUpgraderMachine(creep));
    this.actor.start();
  }

  public run(): void {
    this.actor.send({ type: 'TRANSITION' });
  }
}
