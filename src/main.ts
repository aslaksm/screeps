import { ErrorMapper } from 'utils/ErrorMapper';
import { updateHarvester, spawnHarvester, findHarvesters } from 'creeps/roles/harvester';
import { findBuilders, spawnBuilder, updateBuilder } from 'creeps/roles/builder';
import { findUpgraders, spawnUpgrader, updateUpgrader } from 'creeps/roles/upgrader';
import {
  cullCreeps,
  getRoomFreeCapacity,
  getCurTime,
  findAllCreeps,
  ObjectKeys
} from 'creeps/utils';
import { Role } from 'creeps/roles/types';
import { monitorStatus, rebalanceCreeps } from 'creeps/balancer/balancer';

const maxCreeps = 100;

Object.values(Role).map((role) => (Memory.roles[role] = Priority.NORMAL));
console.log('reset roles');

// Determines what creeps, if any, should be spawned
// I'll fix this tomorrow
const spawnCreeps = (spawn: StructureSpawn) => {
  if (spawn.store[RESOURCE_ENERGY] > 200) spawnHarvester(spawn);
};

const updateSpawn = (spawn: StructureSpawn) => {
  spawnCreeps(spawn);
};

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

  console.log('Available storage: ' + getRoomFreeCapacity(Object.values(Game.rooms)[0]));

  // Update structures
  Object.values(Game.spawns).forEach((spawn) => updateSpawn(spawn));

  // Update creeps
  findHarvesters().forEach((creep) => updateHarvester(creep));
  findBuilders().forEach((creep) => updateBuilder(creep));
  findUpgraders().forEach((creep) => updateUpgrader(creep));

  if (Game.time % 10 === 0) monitorStatus(Object.values(Game.rooms)[0]);
  if (Game.time % 10 === 0) rebalanceCreeps();
});
