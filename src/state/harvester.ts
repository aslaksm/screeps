import { Machine } from 'xstate';

const harvest = (context: any, event: any) => {};

const harvesterMachine = (creepId: string) => {
    Machine(
        {
            context: { creepId },
            id: 'harvester',
            initial: 'harvesting',
            states: {
                harvesting: {
                    on: {
                        STORE: 'storing'
                    },
                    initial: 'moving',
                    states: {
                        moving: {
                            activities: ['moveHarvest'],
                            on: {
                                HARVEST: 'harvesting'
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
                            activities: ['moveStore'],
                            on: {
                                STORE: 'storing'
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
            }
        },
        {
            activities: {
                moveHarvest: identity,
                harvest: identity,
                moveStore: identity,
                store: identity
            }
        }
    );
};
