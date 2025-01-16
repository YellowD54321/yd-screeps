/* eslint-disable no-unused-vars */
declare const enum CreepState {
  HARVESTING = 'harvesting',
  TRANSFERRING = 'transferring',
  UPGRADING = 'upgrading',
}

declare const enum CreepRole {
  MINER = 'miner',
  UPGRADER = 'upgrader',
}

interface CreepMemory {
  role: CreepRole;
  state: CreepState;
}

interface MinerMemory extends CreepMemory {
  role: CreepRole.MINER;
}

interface UpgraderMemory extends CreepMemory {
  role: CreepRole.UPGRADER;
}

interface Memory {
  creeps: { [name: string]: CreepMemory | MinerMemory | UpgraderMemory };
  spawns: { [name: string]: SpawnMemory };
  rooms: { [name: string]: RoomMemory };
}
