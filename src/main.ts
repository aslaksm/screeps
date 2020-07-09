import { ErrorMapper } from "utils/ErrorMapper";
import { updateHarvester, spawnHarvester, findHarvesters } from "creeps/harvester";
import { findBuilders, spawnBuilder, updateBuilder } from "creeps/builder";
import { findUpgraders, spawnUpgrader, updateUpgrader } from "creeps/upgrader";
import { cullCreeps, getRoomFreeCapacity } from "creeps/utils";
import { Role } from "creeps/types";
import { balanceCreeps, Mode } from "utils";

// Determines what creeps, if any, should be spawned
const spawnCreeps = (spawn: StructureSpawn) => {
  if (spawn.store[RESOURCE_ENERGY] > 200) {
    // if (findHarvesters().length < 5) spawnHarvester(spawn);
    // else if (findBuilders().length < 10) spawnBuilder(spawn);
    // else if (findUpgraders().length < 10) spawnUpgrader(spawn);
  }
};

const updateSpawn = (spawn: StructureSpawn) => {
  spawnCreeps(spawn);
};

let mode: Mode = Mode.NORMAL;

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  console.log(`Current game tick is ${Game.time}`);

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  console.log("Available storage: " + getRoomFreeCapacity(Object.values(Game.rooms)[0]));

  // if (!getRoomStorage(Object.values(Game.rooms)[0])) rebalanceHarvesters();

  // Update structures
  Object.values(Game.spawns).forEach((spawn) => updateSpawn(spawn));

  // Update creeps
  findHarvesters().forEach((creep) => updateHarvester(creep));
  findBuilders().forEach((creep) => updateBuilder(creep));
  findUpgraders().forEach((creep) => updateUpgrader(creep));

  if (Game.time % 10 === 0) mode = balanceCreeps(Object.values(Game.rooms)[0], mode);
});
