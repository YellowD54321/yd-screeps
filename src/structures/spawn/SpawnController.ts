import { Spawn } from '@/structures/spawn/Spawn';

export class SpawnController {
  private readonly MAX_CREEPS = 5;
  private readonly MAX_MINERS = 2;
  private readonly MAX_UPGRADERS = 2;
  private room: Room;
  private spawns: Spawn[] = [];

  constructor(room: Room) {
    this.room = room;
    this.initializeSpawns();
  }

  private initializeSpawns(): void {
    const spawns = this.room.find(FIND_MY_SPAWNS);
    this.spawns = spawns.map((spawn) => new Spawn(spawn));
  }

  private getAvailableSpawn(): Spawn | undefined {
    return this.spawns.find((spawn) => spawn.hasEnoughEnergy());
  }

  private countCreeps(): number {
    return this.room.find(FIND_MY_CREEPS).length;
  }

  private countMiners(): number {
    const creeps = this.room.find(FIND_MY_CREEPS);
    return creeps.filter((creep) => creep.memory.role === CreepRole.MINER).length;
  }

  private countUpgraders(): number {
    const creeps = this.room.find(FIND_MY_CREEPS);
    return creeps.filter((creep) => creep.memory.role === CreepRole.UPGRADER).length;
  }

  public run(): void {
    if (!this.shouldSpawnCreep()) {
      return;
    }

    const spawn = this.getAvailableSpawn();
    if (!spawn) {
      return;
    }

    const minerCount = this.countMiners();
    const upgraderCount = this.countUpgraders();

    if (minerCount < this.MAX_MINERS) {
      spawn.spawnMiner();
    } else if (upgraderCount < this.MAX_UPGRADERS) {
      spawn.spawnUpgrader();
    }
  }

  public shouldSpawnCreep(): boolean {
    return this.countCreeps() < this.MAX_CREEPS;
  }
}
