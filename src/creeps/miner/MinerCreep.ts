import { createActor } from 'xstate';
import { createMinerMachine } from '@/creeps/miner/minerMachine';

export class MinerCreep {
  private creep: Creep;
  private actor: ReturnType<typeof createActor>;

  constructor(creep: Creep) {
    this.creep = creep;
    if (this.creep.memory.role !== CreepRole.MINER) {
      throw new Error(`MinerCreep can only handle miner role, but got ${this.creep.memory.role}`);
    }

    const machine = createMinerMachine(this.creep);
    this.actor = createActor(machine, { systemId: `miner-${this.creep.name}` });
    this.actor.start();
  }

  public run(): void {
    this.actor.send({ type: 'TRANSITION' });
  }
}
