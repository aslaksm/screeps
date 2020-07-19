import { findCreepsByRole, getCurTime } from '../utils';
import { Role } from '../roles/types';
import { harvesterMachine } from 'state/harvester';

export const findHarvesters = () => findCreepsByRole(Role.HARVESTER);

export const updateHarvester = (creep: Creep) => {
    // FIXME: Explicitly assumes update returns same state if no changes
    creep.memory.state = harvesterMachine.update(creep, creep.memory.state);
};
