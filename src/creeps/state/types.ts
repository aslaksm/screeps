import { Role } from 'creeps/roles/types';
import { harvesterMachine } from './harvester';
import { builderMachine } from './builder';
import { upgraderMachine } from './upgrader';

export const roleToMachine = {
    [Role.HARVESTER]: harvesterMachine,
    [Role.BUILDER]: builderMachine,
    [Role.UPGRADER]: upgraderMachine
};
