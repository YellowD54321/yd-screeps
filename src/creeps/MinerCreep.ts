import { creepActions } from '@/creeps/creepActions';

export class MinerCreep {
  private creep: Creep;

  constructor(creep: Creep) {
    this.creep = creep;
    if (this.creep.memory.role !== CreepRole.MINER) {
      throw new Error(`MinerCreep can only handle miner role, but got ${this.creep.memory.role}`);
    }
    if (!this.creep.memory.state) {
      this.creep.memory.state = CreepState.HARVESTING;
    }
  }

  public run(): void {
    this.updateState();
    this.performAction();
  }

  private updateState(): void {
    if (this.isHarvesting && this.creep.store.getFreeCapacity() === 0) {
      this.creep.memory.state = CreepState.TRANSFERRING;
    }
    if (this.isTransferring && this.creep.store.getUsedCapacity() === 0) {
      this.creep.memory.state = CreepState.HARVESTING;
    }
  }

  private performAction(): void {
    if (this.isHarvesting) {
      creepActions.harvestEnergy(this.creep);
    } else {
      creepActions.transferEnergy(this.creep);
    }
  }

  private get isHarvesting(): boolean {
    return this.creep.memory.state === CreepState.HARVESTING;
  }

  private get isTransferring(): boolean {
    return this.creep.memory.state === CreepState.TRANSFERRING;
  }
}
