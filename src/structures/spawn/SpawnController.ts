import { SPAWN_CONFIG } from '@/config/spawnConfig';
import { Spawn } from '@/structures/spawn/Spawn';

export class SpawnController {
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

  public getSpawnConfig(): { harvester: number; upgrader: number; builder: number } {
    const rcl = this.room.controller?.level ?? 1;
    return SPAWN_CONFIG[Math.min(rcl, 2) as 1 | 2] ?? SPAWN_CONFIG[2];
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

  private countBuilders(): number {
    const creeps = this.room.find(FIND_MY_CREEPS);
    return creeps.filter((creep) => creep.memory.role === CreepRole.BUILDER).length;
  }

  public shouldSpawnBuilder(): boolean {
    const config = this.getSpawnConfig();
    if (config.builder === 0) return false;

    const hasExtension =
      this.room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION },
      }).length > 0;
    const hasExtensionSite =
      this.room.find(FIND_CONSTRUCTION_SITES, {
        filter: { structureType: STRUCTURE_EXTENSION },
      }).length > 0;

    return (hasExtension || hasExtensionSite) && this.countBuilders() < config.builder;
  }

  public run(): void {
    if (!this.shouldSpawnCreep()) {
      return;
    }

    const spawn = this.getAvailableSpawn();
    if (!spawn) {
      return;
    }

    const config = this.getSpawnConfig();
    const minerCount = this.countMiners();
    const upgraderCount = this.countUpgraders();
    const builderCount = this.countBuilders();

    if (minerCount < config.harvester) {
      spawn.spawnMiner();
    } else if (upgraderCount < config.upgrader) {
      spawn.spawnUpgrader();
    } else if (this.shouldSpawnBuilder() && builderCount < config.builder) {
      spawn.spawnBuilder();
    }
  }

  public shouldSpawnCreep(): boolean {
    const config = this.getSpawnConfig();
    const maxCreeps = config.harvester + config.upgrader + config.builder;
    return this.countCreeps() < maxCreeps;
  }

}
