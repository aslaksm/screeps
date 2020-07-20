import {
    findCreepsByRole,
    getRoomFreeCapacity,
    getRoomCapacity,
    findAllCreeps
} from 'creeps/utils';
import { Role, Priority, RoleNoIdle } from 'creeps/roles/types';
import { roleToMachine } from 'creeps/state/types';

enum Constants {
    HARVEST_THRESHOLD = 0.5
}

const shouldStopHarvest = (room: Room) => getRoomFreeCapacity(room) === 0;
const shouldStopBuild = (room: Room) => room.find(FIND_CONSTRUCTION_SITES).length === 0;
// Should we ever stop upgrading?
const shouldStopUpgrade = (room: Room) => false;

const shouldResumeHarvest = (room: Room) =>
    getRoomFreeCapacity(room) / getRoomCapacity(room) > Constants.HARVEST_THRESHOLD;
const shouldResumeBuild = (room: Room) => room.find(FIND_CONSTRUCTION_SITES).length > 0;
const shouldResumeUpgrade = (room: Room) => true;

export const setRoleStatus = (role: Role, status: Priority) => (Memory.roles[role] = status);

const disableRole = (from: Role, amount: number) =>
    findCreepsByRole(from)
        .slice(0, -amount)
        .forEach((creep) => {
            creep.memory.role = Role.IDLE;
        });

const enableRole = (to: RoleNoIdle, amount: number) =>
    findCreepsByRole(Role.IDLE)
        .slice(0, amount)
        .forEach((creep) => {
            creep.memory.role = to;
            creep.memory.state = roleToMachine[to].getInitial();
        });

// assigns creeps so that the # matches the assigned status
export const rebalanceCreeps = () => {
    const totalCreeps = findAllCreeps().length;

    const [criticalRoles, roles] = _.partition(
        Object.entries(Memory.roles) as [RoleNoIdle, Priority][],
        ([_, status]) => status == Priority.CRITICAL
    );

    if (criticalRoles.length) {
        const creepsPerRole = Math.floor(totalCreeps / criticalRoles.length);
        const buckets = _.chunk(findAllCreeps(), creepsPerRole);
        buckets.forEach((creeps, idx) =>
            creeps.map((creep) => (creep.memory.role = criticalRoles[idx][0]))
        );
        return 0;
    }

    // Probably cringeworthy enum usage
    const totalWeight: number = roles.map(([_, status]) => status).reduce((a, b) => a + b);

    let remainingCreeps = totalCreeps;
    const roleDelta: [RoleNoIdle, number, number][] = (Object.entries(Memory.roles) as [
        RoleNoIdle,
        number
    ][]).map(([role, status]) => {
        const creepsCount = findCreepsByRole(role).length;
        const newCount = totalCreeps * (status / totalWeight);
        const roundedCount = Math.floor(newCount);
        const frac = newCount - roundedCount;
        remainingCreeps -= roundedCount;
        return [role, roundedCount - creepsCount, frac];
    });

    // Assign remaining creeps using largest remainder method
    console.log('Creep count: ', totalCreeps);
    roleDelta.map((a) => console.log('Assigned to', a[0], ':', findCreepsByRole(a[0]).length));

    _.times(remainingCreeps, (_) => {
        roleDelta.sort((a, b) => (a[2] > b[2] ? -1 : 1));
        roleDelta[0][1]++;
        roleDelta[0][2]--;
    });

    roleDelta.map((a) => console.log('Changing', a[0], 'by', a[1]));

    const [negDelta, posDelta] = _.partition(roleDelta, ([_, delta, __]) => delta < 0);

    negDelta.forEach(([role, delta, _]) => disableRole(role, delta));
    posDelta.forEach(([role, delta, _]) => enableRole(role, delta));

    return 0;
};

// FIXME: Roles are not currently room-based
export const monitorRoles = (room: Room) => {
    if (Memory.roles.harvester != Priority.NONE && shouldStopHarvest(room))
        setRoleStatus(Role.HARVESTER, Priority.NONE);
    else if (shouldResumeHarvest(room)) setRoleStatus(Role.HARVESTER, Priority.HIGH);

    if (Memory.roles.builder != Priority.NONE && shouldStopBuild(room))
        setRoleStatus(Role.BUILDER, Priority.NONE);
    else if (shouldResumeBuild(room)) setRoleStatus(Role.BUILDER, Priority.NORMAL);
};
