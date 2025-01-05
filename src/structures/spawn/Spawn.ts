import { BaseStructure } from '../base/BaseStructure';

export class Spawn extends BaseStructure {
  private spawn: StructureSpawn;
  private readonly MINER_BODY = [WORK, CARRY, MOVE];
  private readonly MINIMUM_ENERGY = 200; // Energy cost: WORK(100) + CARRY(50) + MOVE(50)

  constructor(spawn: StructureSpawn) {
    super(spawn);
    this.spawn = spawn;
  }

  public run(): void {
    // TODO: finish run method
  }

  public hasEnoughEnergy(): boolean {
    return this.spawn.store.getUsedCapacity(RESOURCE_ENERGY) >= this.MINIMUM_ENERGY;
  }

  public spawnMiner(): ScreepsReturnCode {
    return this.spawn.spawnCreep(this.MINER_BODY, `Miner_${Game.time}`, {
      memory: {
        role: 'miner',
      },
    });
  }
}
