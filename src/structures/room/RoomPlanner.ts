import { TERRAIN_MASK_WALL } from '@/constants';

function chebyshevDistance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}

/**
 * Selects up to `count` positions from candidates such that any two selected
 * positions have Chebyshev distance >= 2 (at least one empty space between).
 * Uses greedy selection in iteration order.
 *
 * @param candidates - Candidate coordinates to choose from
 * @param count - Maximum number of positions to select
 * @returns Selected positions, may be fewer than count if not enough valid candidates
 */
function selectExtensionPositions(
  candidates: { x: number; y: number }[],
  count: number
): { x: number; y: number }[] {
  const selected: { x: number; y: number }[] = [];
  for (const candidate of candidates) {
    if (selected.length >= count) break;
    const isFarEnough = selected.every((s) => chebyshevDistance(candidate, s) >= 2);
    if (isFarEnough) {
      selected.push(candidate);
    }
  }
  return selected;
}

/**
 * Plans Extension positions around a Spawn for RCL 2.
 * Returns up to 5 coordinates at Chebyshev distance 2 from spawn,
 * excluding wall terrain, with at least one empty space between each Extension.
 *
 * @param room - The room to plan in
 * @param spawn - The spawn structure to place extensions around
 * @returns Array of { x, y } coordinates for Extension construction sites
 */
export function planExtensions(room: Room, spawn: StructureSpawn): { x: number; y: number }[] {
  const spawnPos = spawn.pos;
  const candidates: { x: number; y: number }[] = [];
  const distance = 2;

  for (let dx = -distance; dx <= distance; dx++) {
    for (let dy = -distance; dy <= distance; dy++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== distance) continue;
      const x = spawnPos.x + dx;
      const y = spawnPos.y + dy;
      if (room.getTerrain().get(x, y) !== TERRAIN_MASK_WALL) {
        candidates.push({ x, y });
      }
    }
  }

  return selectExtensionPositions(candidates, 5);
}

/**
 * Ensures 5 Extension construction sites exist when RCL >= 2.
 * Skips if already 5 Extensions (Structure + ConstructionSite).
 */
export function ensureExtensionConstructionSites(room: Room): void {
  if (!room.controller || room.controller.level < 2) return;
  const spawn = room.find(FIND_MY_SPAWNS)[0];
  if (!spawn) return;

  let existing =
    room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_EXTENSION },
    }).length +
    room.find(FIND_CONSTRUCTION_SITES, {
      filter: { structureType: STRUCTURE_EXTENSION },
    }).length;
  if (existing >= 5) return;

  const planned = planExtensions(room, spawn);
  for (const { x, y } of planned) {
    if (existing >= 5) break;
    const pos = new RoomPosition(x, y, room.name);
    const hasStructure = pos.lookFor(LOOK_STRUCTURES).length > 0;
    const hasConstructionSite = pos.lookFor(LOOK_CONSTRUCTION_SITES).length > 0;
    if (!hasStructure && !hasConstructionSite) {
      const result = room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
      if (result === OK) existing++;
    }
  }
}

/**
 * Creates road construction sites from frequentPaths in room memory.
 * Skips positions that cannot have a building (already have Structure or ConstructionSite).
 */
export function createRoadConstructionSites(room: Room): void {
  const paths = room.memory.frequentPaths;
  if (!paths || Object.keys(paths).length === 0) return;

  for (const key of Object.keys(paths)) {
    const [x, y] = key.split(',').map(Number);
    const pos = new RoomPosition(x, y, room.name);
    const hasStructure = pos.lookFor(LOOK_STRUCTURES).length > 0;
    const hasConstructionSite = pos.lookFor(LOOK_CONSTRUCTION_SITES).length > 0;
    if (hasStructure || hasConstructionSite) continue;

    room.createConstructionSite(x, y, STRUCTURE_ROAD);
  }
}

/**
 * Ensures road construction sites exist when Extension count >= 5.
 * Calls createRoadConstructionSites when condition is met.
 */
export function ensureRoadConstructionSites(room: Room): void {
  const extensionCount = room.find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_EXTENSION },
  }).length;
  if (extensionCount < 5) return;

  createRoadConstructionSites(room);
}
