export function getNextBuildTarget(creep: Creep): ConstructionSite | null {
  const sites = creep.room.find(FIND_CONSTRUCTION_SITES) as ConstructionSite[];
  if (sites.length === 0) return null;

  const extensions = sites.filter((s) => s.structureType === STRUCTURE_EXTENSION);
  const roads = sites.filter((s) => s.structureType === STRUCTURE_ROAD);
  const ordered = [...extensions, ...roads];
  return ordered[0] ?? null;
}
