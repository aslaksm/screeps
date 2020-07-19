export const harvest = (creep: Creep, state: string[]) => {
    const target = Game.getObjectById(creep.memory.target!);
    if (creep.store.getFreeCapacity() === 0) return 'STORE';
    if (creep.harvest(target) === ERR_NOT_IN_RANGE) return 'MOVE';
    return null;
};

export const store = (creep: Creep, state: string[]) => {
    const target = Game.getObjectById(creep.memory.target!);
    if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) return 'MOVE';
    return 'HARVEST';
};

export const move = (range: number, creep: Creep, state: string[]) => {
    const target = Game.getObjectById(creep.memory.target!);
    if (!creep.pos.inRangeTo(target.pos, range)) {
        creep.moveTo(target);
        return null;
    }
    return 'DONEMOVING';
};

export const upgrade = (creep: Creep, state: string[]) => {
    const target = Game.getObjectById(creep.memory.target!);
    if (creep.store[RESOURCE_ENERGY] === 0) return 'HARVEST';
    if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) return 'MOVE';
    return null;
};

export const build = (creep: Creep, state: string[]) => {
    const target = Game.getObjectById(creep.memory.target!);
    if (creep.store[RESOURCE_ENERGY] === 0) return 'HARVEST';
    if (creep.build(target) === ERR_NOT_IN_RANGE) return 'MOVE';
    return null;
};
