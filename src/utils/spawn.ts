import {
    getSpawnEnergy,
    getFirstRoom,
    getCurTime,
    repeatArray,
    getTotalBodyPartsByTemplate,
    findAllCreeps
} from 'creeps/utils';
import { Size, Role } from 'creeps/roles/types';
import { harvesterMachine } from 'creeps/state/harvester';

export enum Template {
    WORKER = 'worker',
    FIGHTER = 'fighter'
}

const partToCost: Record<BodyPartConstant, number> = {
    [MOVE]: 50,
    [WORK]: 100,
    [CARRY]: 50,
    [ATTACK]: 80,
    [RANGED_ATTACK]: 150,
    [HEAL]: 250,
    [CLAIM]: 600,
    [TOUGH]: 10
};
export const getCost = (parts: BodyPartConstant[]) => _.sum(parts.map((part) => partToCost[part]));

type TemplateType = { base: BodyPartConstant[]; extend: BodyPartConstant[] };

export const templates: Record<Template, TemplateType> = {
    [Template.WORKER]: {
        base: [WORK, CARRY, MOVE],
        extend: [WORK, CARRY, MOVE]
    },
    [Template.FIGHTER]: {
        base: [ATTACK, TOUGH, MOVE, MOVE],
        extend: [WORK, CARRY, MOVE, MOVE]
    }
};

// FIXME: Spawn creeps should depend on Memory.creeps, not Game.creeps
export const spawnCreeps = (spawn: StructureSpawn) => {
    const currentEnergy = getSpawnEnergy(spawn, getFirstRoom());
    if (
        getTotalBodyPartsByTemplate(Template.WORKER) < 90 &&
        findAllCreeps().length < 15 &&
        currentEnergy >= getCost(templates[Template.WORKER].base)
    ) {
        const size = maxSpawnableSize(currentEnergy, Template.WORKER);
        console.log('Spawning worker of size ' + size);
        spawnCreep(spawn, Template.WORKER, Role.HARVESTER, size);
    }
};

export const spawnCreep = (spawn: StructureSpawn, template: Template, role: Role, size: Size) => {
    const name = template + getCurTime();
    const temp = templates[template];
    return spawn.spawnCreep(temp.base.concat(repeatArray(temp.extend, size)), name, {
        memory: {
            size,
            role,
            template,
            state: harvesterMachine.getInitial()
        }
    });
};

export const maxSpawnableSize = (resources: number, template: Template) => {
    const temp = templates[template];
    return Math.floor((resources - getCost(temp.base)) / getCost(temp.extend));
};
