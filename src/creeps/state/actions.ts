import { countTargeted } from 'creeps/utils';

export enum Actions {
    HARVEST_TARGET = 'harvestTarget',
    UPGRADE_TARGET = 'upgradeTarget',
    BUILD_TARGET = 'buildTarget',
    STORE_TARGET = 'storeTarget'
}

// FIXME: State for when no sources exist
// FIXME: Moron logic here
export const setHarvestTarget = (creep: Creep, state: string[]) => {
    const targets = creep.room.find(FIND_SOURCES);
    let filteredTargets = targets.filter((target) => countTargeted(target.id) <= 3);
    if (filteredTargets.length) creep.memory.target = filteredTargets[0].id;
    else {
        filteredTargets = targets.filter((target) => countTargeted(target.id) <= 5);
        if (filteredTargets.length) creep.memory.target = filteredTargets[0].id;
        else creep.memory.target = targets[0].id;
    }
};

export const setStoreTarget = (creep: Creep, state: string[]) => {
    const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (
                (structure instanceof StructureExtension ||
                    structure instanceof StructureSpawn ||
                    structure instanceof StructureTower) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
        }
    });
    if (targets.length) {
        creep.memory.target = targets[0].id;
        return null;
    }
    return 'NOTARGET';
};

export const setUpgradeTarget = (creep: Creep, state: string[]) => {
    creep.memory.target = creep.room.controller!.id;
};

export const setBuildTarget = (creep: Creep, state: string[]) => {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length) {
        creep.memory.target = targets[0].id;
        return null;
    }
    return 'NOTARGET';
};
