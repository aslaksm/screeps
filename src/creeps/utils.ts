import { Roles } from "./types";

export const findCreepsByRole = (role: string) =>
  Object.values(Game.creeps).filter((creep) => creep.memory.role === role);

// Kill some # of creeps if too many were accidentally spawned
export const cullCreeps = (role: string, kill: number) =>
  findCreepsByRole(role)
    .slice(-kill)
    .map((creep) => creep.suicide());

export const StorableOrNull = (structure: AnyStructure) => {
  if (
    structure instanceof StructureExtension ||
    structure instanceof StructureSpawn ||
    structure instanceof StructureTower ||
    structure instanceof StructureContainer
  )
    return structure;
  return null;
};

export const notEmpty = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

export const getRoomStorage = (room: Room) => {
  const targets: any[] = room
    .find(FIND_STRUCTURES)
    .map((struct) => StorableOrNull(struct))
    .filter(notEmpty);
  return targets.map((storage) => storage.store.getFreeCapacity(RESOURCE_ENERGY)).reduce((a, b) => a + b);
};

export const rebalanceHarvesters = () => {
  const harvesters = findCreepsByRole(Roles.HARVESTER);
  const builderCount = findCreepsByRole(Roles.BUILDER).length;
  const upgraderCount = findCreepsByRole(Roles.UPGRADER).length;
  const ratio = Math.floor(harvesters.length * (builderCount / upgraderCount));

  harvesters.slice(0, ratio).forEach((creep) => (creep.memory.role = Roles.BUILDER));
  harvesters.slice(ratio).forEach((creep) => (creep.memory.role = Roles.UPGRADER));
};

export const getCurTime = () => Game.time.toString();
