import { Machine } from 'creepystate';

// FIXME: State for when no sources exist
const setHarvestTarget = (creep: Creep, state: string[]) => {
    creep.memory.target = creep.room.find(FIND_SOURCES)[0].id;
};

const setStoreTarget = (creep: Creep, state: string[]) => {
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

const harvest = (creep: Creep, state: string[]) => {
    const target = Game.getObjectById(creep.memory.target!);
    if (creep.store.getFreeCapacity() === 0) return 'STORE';
    if (creep.harvest(target) === ERR_NOT_IN_RANGE) return 'MOVE';
    return null;
};

const store = (creep: Creep, state: string[]) => {
    const target = Game.getObjectById(creep.memory.target!);
    // if (creep.store.getFreeCapacity() === 0) return 'STORE';
    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) return 'MOVE';
    return 'HARVEST';
};

const move = (range: number, creep: Creep, state: string[]) => {
    const target = Game.getObjectById(creep.memory.target!);
    if (!creep.pos.inRangeTo(target.pos, range)) {
        creep.moveTo(target);
        return null;
    }
    return 'DONEMOVING';
};

export const harvesterMachine = new Machine({
    id: 'harvester',
    initial: 'harvesting',
    states: {
        harvesting: {
            on: {
                STORE: 'storing'
            },
            initial: 'idle',
            states: {
                idle: {
                    activities: ['gotoMove'],
                    on: {
                        MOVE: 'moving'
                    }
                },
                moving: {
                    actions: ['harvestTarget'],
                    activities: ['moveHarvest'],
                    on: {
                        DONEMOVING: 'harvesting'
                    }
                },
                harvesting: {
                    activities: ['harvest'],
                    on: {
                        MOVE: 'moving'
                    }
                }
            }
        },
        storing: {
            on: {
                HARVEST: 'harvesting'
            },
            initial: 'moving',
            states: {
                moving: {
                    actions: ['storeTarget'],
                    activities: ['moveStore'],
                    on: {
                        DONEMOVING: 'storing'
                    }
                },
                storing: {
                    activities: ['store'],
                    on: {
                        MOVE: 'moving'
                    }
                }
            }
        }
    },
    actions: {
        harvestTarget: setHarvestTarget,
        storeTarget: setStoreTarget
    },

    activities: {
        moveHarvest: (creep, state) => move(1, creep, state),
        harvest: harvest,
        moveStore: (creep, state) => move(1, creep, state),
        store: store,
        gotoMove: (creep, state) => 'MOVE'
    }
});

// const state = harvesterMachine.getInitial();

// then, every tick
// harvesterMachine.getActivities(state);
/* Or maybe runActivities(state)?
 * We're only passing in state here. Is that enough to decide how to transition?
 * Let's say we're in harvesting.harvesting. Each tick, we would run the harvest activity
 * The harvest activity harvests resources. At the end, we check if our storage is full.
 * If it is, we want to transition to the 'storing' state.
 * If a state has multiple activities, we (i think) want to run through each one. Or not?
 * If an early activity issues a transition, should we run the latter activities as well?
 * That could introduce undefined behaviour. If both activities issue events, then we could
 * end up transitioning to an undesired state. In other words, activities/actions are canceling.
 * This means we don't need an event queue. Or do we? If no activities issue a transition, we'd still like
 * to check if other machines have issued transitions to us.
 */
