// FIXME: State for when no sources exist
export const setHarvestTarget = (creep: Creep, state: string[]) => {
    creep.memory.target = creep.room.find(FIND_SOURCES)[0].id;
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
    creep.memory.target = targets[0].id;
};

export const setUpgradeTarget = (creep: Creep, state: string[]) => {
    creep.memory.target = creep.room.controller!.id;
};

export const setBuildTarget = (creep: Creep, state: string[]) => {
    const targets = creep.room.find(FIND_CONSTRUCTION_SITES)[0].id;
};
