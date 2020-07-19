import { Machine } from 'creepystate';
import { Role } from 'creeps/roles/types';
import { findCreepsByRole } from 'creeps/utils';
import { setHarvestTarget, setStoreTarget } from './actions';
import { move, harvest, store } from './activities';

export const findHarvesters = () => findCreepsByRole(Role.HARVESTER);

export const updateHarvester = (creep: Creep) => {
    // FIXME: Explicitly assumes update returns same state if no changes
    creep.memory.state = harvesterMachine.update(creep, creep.memory.state);
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
