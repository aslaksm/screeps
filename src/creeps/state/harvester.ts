import { Machine } from 'creepystate';
import { Role } from 'creeps/roles/types';
import { findCreepsByRole } from 'creeps/utils';
import { setHarvestTarget, setStoreTarget, Actions } from './actions';
import { move, harvest, store, Activities } from './activities';
import { harvestComponent } from './components';

export const findHarvesters = () => findCreepsByRole(Role.HARVESTER);

export const updateHarvester = (creep: Creep) => {
    creep.memory.state = harvesterMachine.update(creep, creep.memory.state);
};

export const harvesterMachine = new Machine({
    id: 'harvester',
    initial: 'harvesting',
    states: {
        harvesting: harvestComponent({ STORE: 'storing' }),
        storing: {
            on: {
                HARVEST: 'harvesting',
                NOTARGET: 'idle'
            },
            initial: 'moving',
            states: {
                moving: {
                    actions: [Actions.STORE_TARGET],
                    activities: [Activities.MOVE_STORE],
                    on: {
                        DONEMOVING: 'storing'
                    }
                },
                storing: {
                    activities: [Activities.STORE],
                    on: {
                        MOVE: 'moving'
                    }
                }
            }
        },
        // Storage is full, just wait for rebalancing
        idle: {}
    },
    actions: {
        [Actions.HARVEST_TARGET]: setHarvestTarget,
        [Actions.STORE_TARGET]: setStoreTarget
    },

    activities: {
        [Activities.MOVE_HARVEST]: (creep, state) => move(1, creep, state),
        [Activities.HARVEST]: (creep, state) => harvest('STORE', creep, state),
        [Activities.MOVE_STORE]: (creep, state) => move(1, creep, state),
        [Activities.STORE]: store,
        [Activities.GOTO_MOVE]: (creep, state) => 'MOVE'
    }
});
