import { Activities } from './activities';
import { Actions } from './actions';

// FIXME: Use type State instead
export const harvestComponent = (transitions: Record<string, string>) => ({
    on: transitions,
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
});

export const storeComponent = (transitions: Record<string, string>) => ({
    on: transitions,
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
});
