import { setStoreTarget } from './actions';

export enum Activities {
    HARVEST = 'harvest',
    STORE = 'store',
    UPGRADE = 'upgrade',
    BUILD = 'build',
    CHECK_BUILDSITES = 'checkForBuildsites',
    MOVE_BUILD = 'moveBuild',
    MOVE_HARVEST = 'moveHarvest',
    MOVE_STORE = 'moveStore',
    MOVE_UPGRADE = 'moveStore',
    GOTO_MOVE = 'gotoMove'
}

export const harvest = (next: string, creep: Creep, state: string[]) => {
    const target = Game.getObjectById(creep.memory.target!);
    if (creep.store.getFreeCapacity() === 0) return next;
    if (creep.harvest(target) === ERR_NOT_IN_RANGE) return 'MOVE';
    return null;
};

export const store = (creep: Creep, state: string[]) => {
    const target = Game.getObjectById(creep.memory.target!);
    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) return 'MOVE';
    // If we have any energy left, try to find a new storage target.
    if (!creep.store[RESOURCE_ENERGY] || setStoreTarget(creep, state) == 'NOTARGET')
        return 'HARVEST';
    return null;
};

export const move = (range: number, creep: Creep, state: string[]) => {
    const target = Game.getObjectById(creep.memory.target!);
    // target gone (currently only interesting for builder)
    if (!target) return 'NOTARGET';
    if (!creep.pos.inRangeTo(target.pos, range)) {
        creep.moveTo(target);
        return null;
    }
    return 'DONEMOVING';
};

export const upgrade = (creep: Creep, state: string[]) => {
    const target = Game.getObjectById(creep.memory.target!);
    if (creep.store[RESOURCE_ENERGY] === 0) return 'HARVEST';
    if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) return 'MOVE';
    return null;
};

export const build = (creep: Creep, state: string[]) => {
    const target = Game.getObjectById(creep.memory.target!);
    // build is done/cancelled
    if (!target) return 'NOTARGET';
    if (creep.store[RESOURCE_ENERGY] === 0) return 'HARVEST';
    if (creep.build(target) === ERR_NOT_IN_RANGE) return 'MOVE';
    return null;
};

export const checkForBuildsites = (creep: Creep, state: string[]) => {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length) {
        creep.memory.target = targets[0].id;
        return 'MOVE';
    }
    return null;
};
