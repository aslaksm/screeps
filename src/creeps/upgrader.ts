import { findCreepsByRole, getCurTime } from "./utils";
import { Role } from "./types";

export const findUpgraders = () => findCreepsByRole(Role.UPGRADER);

export const spawnUpgrader = (spawn: StructureSpawn) => {
  const name = getCurTime();
  const status = spawn.spawnCreep([WORK, MOVE, CARRY], name, {
    memory: {
      role: Role.UPGRADER,
      upgrading: false
    }
  });
  return status;
};

export const updateUpgrader = (creep: Creep) => {
  if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
    creep.memory.upgrading = false;
    creep.say("harvesting");
  }
  if (!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
    creep.memory.upgrading = true;
    creep.say("upgrading");
  }

  if (creep.memory.upgrading && creep.room.controller) {
    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: "#ffffff" } });
    }
  } else {
    const sources = creep.room.find(FIND_SOURCES);
    if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[0], { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
};
