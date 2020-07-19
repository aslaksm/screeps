// memory extension samples
interface CreepMemory {
    role: string;
    state?: any;
    target?: Id<any>;
    queue?: any[];
    size?: number;
    room?: string;
    working?: boolean;
    building?: boolean;
    upgrading?: boolean;
}

interface Memory {
    uuid: number;
    log: any;
    roles: { [role: string]: number };
}

// `global` extension samples
declare namespace NodeJS {
    interface Global {
        log: any;
    }
}

type StorageStructure = StructureExtension | StructureContainer | StructureSpawn | StructureTower;
