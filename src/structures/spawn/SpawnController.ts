import { Spawn } from './Spawn';

export class SpawnController {
  private room: Room;
  private spawns: Spawn[] = [];
  private readonly MAX_CREEPS = 5;

  constructor(room: Room) {
    this.room = room;
    this.initializeSpawns();
  }

  private initializeSpawns(): void {
    const spawns = this.room.find(FIND_MY_SPAWNS);
    this.spawns = spawns.map((spawn) => new Spawn(spawn));
  }

  public shouldSpawnCreep(): boolean {
    const creeps = this.room.find(FIND_MY_CREEPS);
    return creeps.length < this.MAX_CREEPS;
  }

  private getAvailableSpawn(): Spawn | undefined {
    return this.spawns.find((spawn) => spawn.hasEnoughEnergy());
  }

  public run(): void {
    if (this.shouldSpawnCreep()) {
      const spawn = this.getAvailableSpawn();
      if (spawn) {
        spawn.spawnMiner();
      }
    }
  }
}
