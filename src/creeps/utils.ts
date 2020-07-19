import { Role, Size } from './roles/types';
import { harvesterMachine } from 'state/harvester';

export const findAllCreeps = () => Object.values(Game.creeps);
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

export const SpawnableOrNull = (structure: AnyStructure) => {
    if (structure instanceof StructureExtension || structure instanceof StructureSpawn)
        return structure;
    return null;
};

export const notEmpty = <T>(value: T | null | undefined): value is T => {
    return value !== null && value !== undefined;
};

export const getRoomFreeCapacity = (room: Room) => {
    const targets: any[] = room
        .find(FIND_STRUCTURES)
        .map((struct) => StorableOrNull(struct))
        .filter(notEmpty);
    return targets
        .map((storage) => storage.store.getFreeCapacity(RESOURCE_ENERGY))
        .reduce((a, b) => a + b);
};

export const getRoomCapacity = (room: Room) => {
    const targets: any[] = room
        .find(FIND_STRUCTURES)
        .map((struct) => StorableOrNull(struct))
        .filter(notEmpty);
    return targets
        .map((storage) => storage.store.getCapacity(RESOURCE_ENERGY))
        .reduce((a, b) => a + b);
};

export const getCurTime = () => Game.time.toString();

// Object keys with correct type
export const ObjectKeys = <O>(object: O) => Object.keys(object) as (keyof O)[];

export const getSpawnCapacity = (spawn: StructureSpawn, room: Room) => {
    const targets: any[] = room
        .find(FIND_STRUCTURES)
        .map((struct) => SpawnableOrNull(struct))
        .filter(notEmpty);
    return targets.map((storage) => storage.store[RESOURCE_ENERGY]).reduce((a, b) => a + b);
};

export const getFirstRoom = () => Object.values(Game.rooms)[0];

// Should be able to do this using a reduce/iterate whatever
export const repeatArray = <T>(array: T[], times: number) => {
    let newArray: T[] = [];
    _.times(times, () => (newArray = newArray.concat(array)));
    return newArray;
};

export const spawnCreep = (spawn: StructureSpawn, role: Role, size: Size) => {
    const name = getCurTime();
    return spawn.spawnCreep(repeatArray([WORK, MOVE, CARRY], size), name, {
        memory: {
            size,
            role,
            state: harvesterMachine.getInitial()
        }
    });
};
