import { Machine } from 'creepystate';
import { Role } from 'creeps/roles/types';
import { findCreepsByRole } from 'creeps/utils';
import { harvestComponent } from './components';
import { setHarvestTarget, setBuildTarget, Actions } from './actions';
import { move, harvest, build, checkForBuildsites, Activities } from './activities';

export const findBuilders = () => findCreepsByRole(Role.BUILDER);

export const updateBuilder = (creep: Creep) => {
    creep.memory.state = builderMachine.update(creep, creep.memory.state);
};

export const builderMachine = new Machine({
    id: 'builder',
    initial: 'harvesting',
    states: {
        harvesting: harvestComponent({ BUILD: 'building' }),
        building: {
            on: {
                HARVEST: 'harvesting'
            },
            initial: 'moving',
            states: {
                moving: {
                    actions: [Actions.BUILD_TARGET],
                    activities: [Activities.MOVE_BUILD],
                    on: {
                        DONEMOVING: 'building'
                    }
                },
                building: {
                    activities: [Activities.BUILD],
                    on: {
                        MOVE: 'moving',
                        NOTARGET: 'idle'
                    }
                },
                idle: {
                    activities: [Activities.CHECK_BUILDSITES],
                    on: { MOVE: 'moving' }
                }
            }
        }
    },
    actions: {
        [Actions.HARVEST_TARGET]: setHarvestTarget,
        [Actions.BUILD_TARGET]: setBuildTarget
    },

    activities: {
        [Activities.MOVE_HARVEST]: (creep, state) => move(1, creep, state),
        [Activities.HARVEST]: harvest,
        [Activities.MOVE_BUILD]: (creep, state) => move(3, creep, state),
        [Activities.BUILD]: build,
        [Activities.GOTO_MOVE]: (creep, state) => 'MOVE',
        [Activities.CHECK_BUILDSITES]: checkForBuildsites
    }
});
