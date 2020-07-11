import { ErrorMapper } from 'utils/ErrorMapper';
import { updateHarvester, spawnHarvester, findHarvesters } from 'creeps/roles/harvester';
import { findBuilders, updateBuilder } from 'creeps/roles/builder';
import { findUpgraders, updateUpgrader } from 'creeps/roles/upgrader';
import {
  getRoomFreeCapacity,
  findAllCreeps,
  getSpawnCapacity,
  getFirstRoom,
  spawnCreep
} from 'creeps/utils';
import { monitorStatus, rebalanceCreeps, setRoleStatus } from 'creeps/balancer/balancer';
import { Priority, Role, Size } from 'creeps/roles/types';

// Memory.roles = {};
// Object.values(Role).map((role) => (Memory.roles[role] = Priority.NORMAL));
// Memory.roles[Role.IDLE] = Priority.NONE;
// Memory.roles[Role.HARVESTER] = Priority.HIGH;
// console.log('reset roles');

// Determines what creeps, if any, should be spawned
const spawnCreeps = (spawn: StructureSpawn) => {
  if (getSpawnCapacity(spawn, getFirstRoom()) >= 400)
    spawnCreep(spawn, Role.HARVESTER, Size.MEDIUM);
  else if (findAllCreeps().length < 6 && getSpawnCapacity(spawn, getFirstRoom()) >= 200)
    spawnCreep(spawn, Role.HARVESTER, Size.SMALL);
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

  if (Game.time % 10 === 0) {
    console.log('Rebalancing');

    monitorStatus(Object.values(Game.rooms)[0]);
    rebalanceCreeps();
  }
});
