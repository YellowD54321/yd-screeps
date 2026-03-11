/* eslint-disable no-unused-vars */
declare const enum CreepState {
  HARVESTING = 'harvesting',
  TRANSFERRING = 'transferring',
  UPGRADING = 'upgrading',
  BUILDING = 'building',
}

declare const enum CreepRole {
  MINER = 'miner',
  UPGRADER = 'upgrader',
  BUILDER = 'builder',
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

interface BuilderMemory extends CreepMemory {
  role: CreepRole.BUILDER;
  buildingTargetId?: Id<ConstructionSite>;
}

interface RoomMemory {
  frequentPaths?: Record<string, boolean>;
}

interface Memory {
  creeps: { [name: string]: CreepMemory | MinerMemory | UpgraderMemory | BuilderMemory };
  spawns: { [name: string]: SpawnMemory };
  rooms: { [name: string]: RoomMemory };
}
