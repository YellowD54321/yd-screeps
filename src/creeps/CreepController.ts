import { BuilderCreep } from '@/creeps/builder/BuilderCreep';
import { MinerCreep } from '@/creeps/miner/MinerCreep';
import { UpgraderCreep } from '@/creeps/upgrader/UpgraderCreep';
import { log } from '@/utils/logger';

type CreepRole = 'miner' | 'upgrader' | 'builder';

export class CreepController {
  private creeps: { [name: string]: Creep };
  private readonly VALID_ROLES: readonly CreepRole[] = ['miner', 'upgrader', 'builder'];

  constructor() {
    this.creeps = Game.creeps;
  }

  public run(): void {
    for (const name in this.creeps) {
      try {
        const creep = this.creeps[name];
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
