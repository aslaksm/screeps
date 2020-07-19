import { ErrorMapper } from 'utils/ErrorMapper';
import { findAllCreeps } from 'creeps/utils';
import { monitorStatus, rebalanceCreeps } from 'creeps/balancer/balancer';
import { spawnCreeps } from 'utils/spawn';
import { Role, Priority } from 'creeps/roles/types';
import { roleToMachine } from 'creeps/state/types';

Memory.roles = {};
Object.values(Role).map((role) => (Memory.roles[role] = Priority.NORMAL));
Memory.roles[Role.IDLE] = Priority.NONE;
Memory.roles[Role.HARVESTER] = Priority.HIGH;
console.log('reset roles');

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

    // Update structures
    Object.values(Game.spawns).forEach((spawn) => updateSpawn(spawn));

    // Update creeps
    findAllCreeps().forEach(
        (creep) =>
            (creep.memory.state = roleToMachine[
                creep.memory.role as Exclude<Role, Role.IDLE>
            ].update(creep, creep.memory.state))
    );

    if (Game.time % 10 === 0) {
        console.log('Rebalancing');

        monitorStatus(Object.values(Game.rooms)[0]);
        rebalanceCreeps();
    }
});
