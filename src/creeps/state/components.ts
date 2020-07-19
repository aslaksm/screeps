// FIXME: Use type State instead
export const harvestComponent = (transitions: Record<string, string>) => ({
    on: transitions,
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
});

export const storeComponent = (transitions: Record<string, string>) => ({
    on: transitions,
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
});
