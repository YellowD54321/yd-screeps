export function recordFrequentPath(creep: Creep): void {
  const room = creep.room;
  const controller = room.controller;
  if (!controller || controller.level > 2) return;

  if (!room.memory.frequentPaths) {
    room.memory.frequentPaths = {};
  }

  const key = `${creep.pos.x},${creep.pos.y}`;
  if (room.memory.frequentPaths[key] === undefined) {
    room.memory.frequentPaths[key] = true;
  }
}
