import { createMinerMachine } from '@/creeps/miner/minerMachine';
import { SimpleMachine } from '@/creeps/stateMachine';

export class MinerCreep {
  private creep: Creep;
  private actor: SimpleMachine;

  constructor(creep: Creep) {
    this.creep = creep;
    if (this.creep.memory.role !== CreepRole.MINER) {
      throw new Error(`MinerCreep can only handle miner role, but got ${this.creep.memory.role}`);
    }

    this.actor = createMinerMachine(this.creep);
  }

  public run(): void {
    this.actor.send({ type: 'TRANSITION' });
  }
}
