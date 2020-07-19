import { Machine } from 'creepystate';
import { Role } from 'creeps/roles/types';
import { findCreepsByRole } from 'creeps/utils';
import { harvestComponent } from './components';
import { setHarvestTarget, setUpgradeTarget, Actions } from './actions';
import { move, harvest, upgrade, Activities } from './activities';

export const findUpgraders = () => findCreepsByRole(Role.UPGRADER);

export const updateUpgrader = (creep: Creep) => {
    creep.memory.state = upgraderMachine.update(creep, creep.memory.state);
};

export const upgraderMachine = new Machine({
    id: 'upgrader',
    initial: 'harvesting',
    states: {
        harvesting: {
            on: { UPGRADE: 'upgrading' },
            initial: 'idle',
            states: {
                idle: {
                    activities: [Activities.GOTO_MOVE],
                    on: {
                        MOVE: 'moving'
                    }
                },
                moving: {
                    actions: [Actions.HARVEST_TARGET],
                    activities: [Activities.MOVE_HARVEST],
                    on: {
                        DONEMOVING: 'harvesting'
                    }
                },
                harvesting: {
                    activities: [Activities.HARVEST],
                    on: {
                        MOVE: 'moving'
                    }
                }
            }
        },
        upgrading: {
            on: {
                HARVEST: 'harvesting'
            },
            initial: 'moving',
            states: {
                moving: {
                    actions: [Actions.UPGRADE_TARGET],
                    activities: [Activities.MOVE_UPGRADE],
                    on: {
                        DONEMOVING: 'upgrading'
                    }
                },
                upgrading: {
                    activities: [Activities.UPGRADE],
                    on: {
                        MOVE: 'moving'
                    }
                }
            }
        }
    },
    actions: {
        [Actions.HARVEST_TARGET]: setHarvestTarget,
        [Actions.UPGRADE_TARGET]: setUpgradeTarget
    },

    activities: {
        [Activities.MOVE_HARVEST]: (creep, state) => move(1, creep, state),
        [Activities.HARVEST]: (creep, state) => harvest('UPGRADE', creep, state),
        [Activities.MOVE_UPGRADE]: (creep, state) => move(3, creep, state),
        [Activities.UPGRADE]: upgrade,
        [Activities.GOTO_MOVE]: (creep, state) => 'MOVE'
    }
});
