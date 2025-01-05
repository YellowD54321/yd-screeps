export const creepActions = {
  harvestEnergy: (creep: Creep) => {
    const sources = creep.room.find(FIND_SOURCES) as Source[];
    if (sources.length > 0) {
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
    }
  },

  transferEnergy: (creep: Creep) => {
    const spawns = creep.room.find(FIND_MY_SPAWNS) as StructureSpawn[];
    if (spawns.length > 0) {
      if (creep.transfer(spawns[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawns[0]);
      }
    }
  },
};
