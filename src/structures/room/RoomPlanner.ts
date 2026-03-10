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
