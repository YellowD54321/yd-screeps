// Define constants
const FIND_MY_SPAWNS = 103 as FindConstant;
const FIND_MY_CREEPS = 102 as FindConstant;
const WORK = 'work' as BodyPartConstant;
const CARRY = 'carry' as BodyPartConstant;
const MOVE = 'move' as BodyPartConstant;
const RESOURCE_ENERGY = 'energy' as ResourceConstant;

// Mock Screeps game environment
export const mockGame = {
  // Constants
  FIND_MY_SPAWNS,
  FIND_MY_CREEPS,
  WORK,
  CARRY,
  MOVE,
  RESOURCE_ENERGY,
  OK: 0,
  ERR_NOT_ENOUGH_ENERGY: -6,
  ERR_INVALID_TARGET: -7,
  ERR_FULL: -8,

  // Game object
  spawns: {},
  creeps: {},
  rooms: {},
  time: 0,
} as const;

// Mock Memory object
export const mockMemory = {
  creeps: {},
  spawns: {},
  rooms: {},
} as const;
