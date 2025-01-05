const FIND_MY_SPAWNS = 103 as FindConstant;
const FIND_MY_CREEPS = 102 as FindConstant;
const FIND_SOURCES = 105 as FindConstant;
const WORK = 'work' as BodyPartConstant;
const CARRY = 'carry' as BodyPartConstant;
const MOVE = 'move' as BodyPartConstant;
const RESOURCE_ENERGY = 'energy' as ResourceConstant;

export const mockGame = {
  FIND_MY_SPAWNS,
  FIND_MY_CREEPS,
  FIND_SOURCES,
  WORK,
  CARRY,
  MOVE,
  RESOURCE_ENERGY,
  OK: 0,
  ERR_NOT_ENOUGH_ENERGY: -6,
  ERR_INVALID_TARGET: -7,
  ERR_FULL: -8,
  ERR_NOT_IN_RANGE: -9,

  spawns: {},
  creeps: {},
  rooms: {},
  time: 0,
} as const;

// @ts-ignore
global.Game = mockGame;

export const mockMemory = {
  creeps: {},
  spawns: {},
  rooms: {},
} as const;

// @ts-ignore
global.Memory = mockMemory;
