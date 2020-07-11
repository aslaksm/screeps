import { findCreepsByRole, getCurTime } from "../utils";
import { Role } from "./types";

export const findBuilders = () => findCreepsByRole(Role.BUILDER);

export const spawnBuilder = (spawn: StructureSpawn) => {
  const name = getCurTime();
  const status = spawn.spawnCreep([WORK, MOVE, CARRY], name, {
    memory: {
      role: Role.BUILDER,
      building: false
    }
  });
  return status;
};

/*
 * If capacity is not full, move to source and harvest
 * Otherwise, start building
 * When resources run out, return to harvest
 */
export const updateBuilder = (creep: Creep) => {
  if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.building = false;
    creep.say("harvesting");
  }
  if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
    creep.memory.building = true;
    creep.say("building");
  }

  if (creep.memory.building) {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length) {
      if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  } else {
    const sources = creep.room.find(FIND_SOURCES);
    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
};
