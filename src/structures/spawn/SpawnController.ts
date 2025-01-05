import { Spawn } from '@/structures/spawn/Spawn';

export class SpawnController {
  private room: Room;
  private spawns: Spawn[] = [];
  private readonly MAX_CREEPS = 5;
  private readonly MAX_MINERS = 2;

  constructor(room: Room) {
    this.room = room;
    this.initializeSpawns();
  }

  private initializeSpawns(): void {
    const spawns = this.room.find(FIND_MY_SPAWNS);
    this.spawns = spawns.map((spawn) => new Spawn(spawn));
  }

  private countCreeps(): number {
    return this.room.find(FIND_MY_CREEPS).length;
  }

  private countMiners(): number {
    const creeps = this.room.find(FIND_MY_CREEPS);
    return creeps.filter((creep) => creep.memory.role === 'miner').length;
  }

  public shouldSpawnCreep(): boolean {
    return this.countCreeps() < this.MAX_CREEPS;
  }

  public shouldSpawnMiner(): boolean {
    return this.countMiners() < this.MAX_MINERS && this.shouldSpawnCreep();
  }

  private getAvailableSpawn(): Spawn | undefined {
    return this.spawns.find((spawn) => spawn.hasEnoughEnergy());
  }

  public run(): void {
    if (this.shouldSpawnMiner()) {
      const spawn = this.getAvailableSpawn();
      if (spawn) {
        spawn.spawnMiner();
      }
    }
  }
}
