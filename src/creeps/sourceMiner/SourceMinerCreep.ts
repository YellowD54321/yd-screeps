import { createSourceMinerMachine } from '@/creeps/sourceMiner/sourceMinerMachine';
import { SimpleMachine } from '@/creeps/stateMachine';

export class SourceMinerCreep {
  private creep: Creep;
  private actor: SimpleMachine;

  constructor(creep: Creep) {
    this.creep = creep;
    if (this.creep.memory.role !== CreepRole.SOURCE_MINER) {
      throw new Error(
        `SourceMinerCreep can only handle sourceMiner role, but got ${this.creep.memory.role}`
      );
    }

    this.actor = createSourceMinerMachine(this.creep);
  }

  public run(): void {
    this.actor.send({ type: 'TICK' });
  }
}
