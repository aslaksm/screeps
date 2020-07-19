import { Role, Size } from './roles/types';
import { harvesterMachine } from 'creeps/state/harvester';
import { Template } from 'utils/spawn';

export const findAllCreeps = () => Object.values(Game.creeps);
export const findCreepsByRole = (role: Role) =>
    Object.values(Game.creeps).filter((creep) => creep.memory.role === role);

export const findCreepsBySize = (size: Size) =>
    Object.values(Game.creeps).filter((creep) => creep.memory.size === size);

export const countTargeted = (target: Id<any>) =>
    Object.values(Game.creeps).filter((creep) => creep.memory.target === target).length;

// Kill some # of creeps if too many were accidentally spawned
export const cullCreeps = (role: Role, kill: number) =>
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

export const ExtensionOrNull = (structure: AnyStructure) => {
    if (structure instanceof StructureExtension) return structure;
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

export const getSpawnEnergy = (spawn: StructureSpawn, room: Room) => {
    const targets: StructureExtension[] = room
        .find(FIND_STRUCTURES)
        .map((struct) => ExtensionOrNull(struct))
        .filter(notEmpty);
    return targets
        .map((extension) => extension.store[RESOURCE_ENERGY])
        .reduce((a, b) => a + b, spawn.store[RESOURCE_ENERGY]);
};

export const getFirstRoom = () => Object.values(Game.rooms)[0];

// Should be able to do this using a reduce/iterate whatever
export const repeatArray = <T>(array: T[], times: number) => {
    let newArray: T[] = [];
    _.times(times, () => (newArray = newArray.concat(array)));
    return newArray;
};

export const getTotalBodyParts = () =>
    _.sum(Object.values(Game.creeps).map((creep) => creep.body.length));

export const getTotalBodyPartsByTemplate = (template: Template) =>
    _.sum(
        Object.values(Game.creeps)
            .filter((creep) => creep.memory.template === template)
            .map((creep) => creep.body.length)
    );
