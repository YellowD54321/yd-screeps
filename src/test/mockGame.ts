const FIND_MY_SPAWNS = 103 as FindConstant;
const FIND_MY_CREEPS = 102 as FindConstant;
const FIND_SOURCES = 105 as FindConstant;
const FIND_MY_STRUCTURES = 109 as FindConstant;
const FIND_CONSTRUCTION_SITES = 111 as FindConstant;
const LOOK_STRUCTURES = 'structure' as LookConstant;
const LOOK_CONSTRUCTION_SITES = 'constructionSite' as LookConstant;
const STRUCTURE_EXTENSION = 'extension' as StructureConstant;
const STRUCTURE_ROAD = 'road' as StructureConstant;
const WORK = 'work' as BodyPartConstant;
const CARRY = 'carry' as BodyPartConstant;
const MOVE = 'move' as BodyPartConstant;
const RESOURCE_ENERGY = 'energy' as ResourceConstant;

export const mockGame = {
  FIND_MY_SPAWNS,
  FIND_MY_CREEPS,
  FIND_SOURCES,
  FIND_MY_STRUCTURES,
  FIND_CONSTRUCTION_SITES,
  LOOK_STRUCTURES,
  LOOK_CONSTRUCTION_SITES,
  STRUCTURE_EXTENSION,
  STRUCTURE_ROAD,
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

/**
 * Mock RoomPosition for tests (Screeps global not available in Node).
 * Uses __lookForGetter on global for per-test configuration.
 */
export class MockRoomPosition {
  x: number;
  y: number;
  roomName: string;
  constructor(x: number, y: number, roomName: string) {
    this.x = x;
    this.y = y;
    this.roomName = roomName;
  }
  lookFor(type: string): unknown[] {
    const getter = (
      global as { __lookForGetter?: (x: number, y: number, type: string) => unknown[] }
    ).__lookForGetter;
    if (getter) return getter(this.x, this.y, type);
    return [];
  }
}
