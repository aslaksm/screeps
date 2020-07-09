import { findCreepsByRole, getCurTime } from "./utils";
import { Role } from "./types";

export const findHarvesters = () => findCreepsByRole(Role.HARVESTER);

export const spawnHarvester = (spawn: StructureSpawn) => {
  const name = getCurTime();
  const status = spawn.spawnCreep([WORK, MOVE, CARRY], name, { memory: { role: Role.HARVESTER } });
  console.log(status);
};

// If capacity is not full, move to source and harvest
// Otherwise, move to storage and store
export const updateHarvester = (creep: Creep) => {
  if (creep.store.getFreeCapacity() > 0) {
    const sources = creep.room.find(FIND_SOURCES);
    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  } else {
    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          (structure instanceof StructureExtension ||
            structure instanceof StructureSpawn ||
            structure instanceof StructureTower) &&
          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      }
    });
    if (targets.length > 0) {
      if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
    // Only check containers if other storage is full
    else {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return structure instanceof StructureContainer && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
        }
      }
    }
  }
};
