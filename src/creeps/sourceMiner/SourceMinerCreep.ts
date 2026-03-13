import { createActor } from 'xstate';
import { createSourceMinerMachine } from '@/creeps/sourceMiner/sourceMinerMachine';

export class SourceMinerCreep {
  private creep: Creep;
  private actor: ReturnType<typeof createActor>;

  constructor(creep: Creep) {
    this.creep = creep;
    if (this.creep.memory.role !== CreepRole.SOURCE_MINER) {
      throw new Error(
        `SourceMinerCreep can only handle sourceMiner role, but got ${this.creep.memory.role}`
      );
    }

    const machine = createSourceMinerMachine(this.creep);
    this.actor = createActor(machine, { systemId: `sourceMiner-${this.creep.name}` });
    this.actor.start();
  }

  public run(): void {
    this.actor.send({ type: 'TICK' });
  }
}
