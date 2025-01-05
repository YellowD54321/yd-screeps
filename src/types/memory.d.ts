/* eslint-disable no-unused-vars */
declare const enum CreepState {
  HARVESTING = 'harvesting',
  TRANSFERRING = 'transferring',
}

declare const enum CreepRole {
  MINER = 'miner',
}

interface CreepMemory {
  role: CreepRole;
  state: CreepState;
}

interface MinerMemory extends CreepMemory {
  role: CreepRole.MINER;
}

interface Memory {
  creeps: { [name: string]: CreepMemory | MinerMemory };
  spawns: { [name: string]: SpawnMemory };
  rooms: { [name: string]: RoomMemory };
}
