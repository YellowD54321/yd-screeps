import { Spawn } from './Spawn';

export class SpawnController {
  private room: Room;
  private spawns: Spawn[] = [];
  // Maximum number of creeps to maintain
  private readonly MAX_CREEPS = 5;

  constructor(room: Room) {
    this.room = room;
    this.initializeSpawns();
  }

  /**
   * Initialize all spawns in the room
   */
  private initializeSpawns(): void {
    const spawns = this.room.find(FIND_MY_SPAWNS);
    this.spawns = spawns.map((spawn) => new Spawn(spawn));
  }

  /**
   * Check if we need to spawn more creeps
   * @returns true if current creep count is below MAX_CREEPS
   */
  public shouldSpawnCreep(): boolean {
    const creeps = this.room.find(FIND_MY_CREEPS);
    return creeps.length < this.MAX_CREEPS;
  }

  /**
   * Find a spawn that has enough energy to create a creep
   * @returns Available spawn or undefined if none found
   */
  private getAvailableSpawn(): Spawn | undefined {
    return this.spawns.find((spawn) => spawn.hasEnoughEnergy());
  }

  /**
   * Main run method - handles spawn control logic
   * Spawns a miner if conditions are met:
   * 1. Current creep count is below MAX_CREEPS
   * 2. There is a spawn with sufficient energy
   */
  public run(): void {
    if (this.shouldSpawnCreep()) {
      const spawn = this.getAvailableSpawn();
      if (spawn) {
        spawn.spawnMiner();
      }
    }
  }
}
