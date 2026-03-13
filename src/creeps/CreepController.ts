import { BuilderCreep } from '@/creeps/builder/BuilderCreep';
import { MinerCreep } from '@/creeps/miner/MinerCreep';
import { SourceMinerCreep } from '@/creeps/sourceMiner/SourceMinerCreep';
import { UpgraderCreep } from '@/creeps/upgrader/UpgraderCreep';
import { recordFrequentPath } from '@/utils/pathRecord';
import { log } from '@/utils/logger';

type CreepRole = 'miner' | 'sourceMiner' | 'upgrader' | 'builder';

export class CreepController {
  private creeps: { [name: string]: Creep };
  private readonly VALID_ROLES: readonly CreepRole[] = [
    'miner',
    'sourceMiner',
    'upgrader',
    'builder',
  ];

  constructor() {
    this.creeps = Game.creeps;
  }

  public run(): void {
    for (const name in this.creeps) {
      try {
        const creep = this.creeps[name];
        recordFrequentPath(creep);
        const role = creep.memory.role;

        if (!this.isValidRole(role)) {
          log(`Warning: Creep ${name} has invalid role: ${role}`);
          continue;
        }

        this.runCreepByRole(creep, role);
      } catch (error: unknown) {
        if (error instanceof Error) {
          log(`Error processing creep ${name}: ${error.message}`);
        } else {
          log(`Unknown error processing creep ${name}`);
        }
      }
    }
  }

  private runCreepByRole(creep: Creep, role: CreepRole): void {
    switch (role) {
      case 'miner': {
        const minerCreep = new MinerCreep(creep);
        minerCreep.run();
        break;
      }
      case 'sourceMiner': {
        const sourceMinerCreep = new SourceMinerCreep(creep);
        sourceMinerCreep.run();
        break;
      }
      case 'upgrader': {
        const upgraderCreep = new UpgraderCreep(creep);
        upgraderCreep.run();
        break;
      }
      case 'builder': {
        const builderCreep = new BuilderCreep(creep);
        builderCreep.run();
        break;
      }
      default:
        log(`Unhandled role: ${role}`);
        break;
    }
  }

  private isValidRole(role: unknown): role is CreepRole {
    return typeof role === 'string' && this.VALID_ROLES.includes(role as CreepRole);
  }
}
