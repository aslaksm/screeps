import {
  findCreepsByRole,
  getRoomFreeCapacity,
  getRoomCapacity,
  findAllCreeps
} from 'creeps/utils';

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

const setRoleStatus = (role: Role, status: Priority) => (Memory.roles[role] = status);

const swapRole = (from: Role, to: Role, amount: number) =>
  findCreepsByRole(from)
    .slice(0, amount)
    .forEach((creep) => (creep.memory.role = to));

// assigns creeps so that the # matches the assigned status
export const rebalanceCreeps = () => {
  const totalCreeps = findAllCreeps().length;

  const [criticalRoles, roles] = _.partition(
    Object.entries(Memory.roles) as [Role, Priority][],
    ([_, status]) => status == Priority.CRITICAL
  );

  if (criticalRoles.length) {
    // assign all creeps to critical roles
    // return
  }

  // Probably cringeworthy enum usage
  const totalWeight: number = roles.map(([_, status]) => status).reduce((a, b) => a + b);

  // Might want to implement largest remainder method
  // https://en.wikipedia.org/wiki/Largest_remainder_method
  const roleDelta: [Role, number][] = (Object.entries(Memory.roles) as [Role, number][]).map(
    ([role, status]) => {
      const creepsCount = findCreepsByRole(role).length;
      const newCreepsCount = Math.floor(totalCreeps * (status / totalWeight));
      return [role, newCreepsCount - creepsCount];
    }
  );

  const [negDelta, posDelta] = _.partition(roleDelta, ([role, delta]) => delta < 0);

  negDelta.forEach(([role, delta]) => swapRole(role, Role.IDLE, delta));
  posDelta.forEach(([role, delta]) => swapRole(Role.IDLE, role, delta));
};

// FIXME: Roles are not currently room-based
export const monitorStatus = (room: Room) => {
  if (Memory.roles.harvester != Priority.NONE && shouldStopHarvest(room))
    setRoleStatus(Role.HARVESTER, Priority.NONE);
  else if (shouldResumeHarvest(room)) setRoleStatus(Role.HARVESTER, Priority.HIGH);

  if (Memory.roles.builder != Priority.NONE && shouldStopBuild(room))
    setRoleStatus(Role.BUILDER, Priority.NONE);
  else if (shouldResumeBuild(room)) setRoleStatus(Role.BUILDER, Priority.NORMAL);
};
